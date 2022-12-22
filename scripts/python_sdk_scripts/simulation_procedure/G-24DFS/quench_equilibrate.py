"""
Run script for OpenMM equilibrate simulations of bulk material.
"""

import json
import sys

import numpy as np
from elwood.execute.run_util import (
    correct_pdb_reader,
    get_advanced_option,
    get_periodic_box_length,
    opls_lj,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from elwood.json_handle import StatusHandle
from elwood.util import seed_shuffle
from simtk.openmm import (  # pylint: disable=import-error
    LangevinIntegrator,
    MonteCarloBarostat,
    OpenMMException,
)
from simtk.openmm.app import (  # pylint: disable=import-error
    PME,
    ForceField,
    HBonds,
    PDBFile,
    Simulation,
    StateDataReporter,
)
from simtk.openmm.vec3 import Vec3  # pylint: disable=import-error
from simtk.unit import (  # pylint: disable=no-name-in-module,import-error
    bar,
    kelvin,
    nanometer,
    picosecond,
)


def npt_equilibration(system, pdb, temp, seed, state=None):
    """
    Short simulation at NPT at fixed temperature to equilibrate.
    """
    run_options = get_advanced_option("run")
    # set the integrator
    delta_t = run_options["dt"]
    integrator = LangevinIntegrator(temp * kelvin, 1 / picosecond, delta_t * picosecond)
    integrator.setRandomNumberSeed(seed_shuffle(seed, "langevin"))

    simulation = Simulation(pdb.topology, system, integrator)
    if not state:
        simulation.context.setPositions(pdb.positions)
        # minimize energy
        simulation.minimizeEnergy()

        # equilibrate without pressure coupling for 100 ps
        simulation.reporters.append(
            StateDataReporter(
                sys.stdout,
                int(run_options["quench_equilibrate"]["log-frequency"] / delta_t),
                step=True,
                remainingTime=True,
                totalSteps=int(
                    run_options["quench_equilibrate"]["first-eq-time"] / delta_t
                ),
            )
        )
        simulation.step(
            int(run_options["quench_equilibrate"]["first-eq-time"] / delta_t)
        )
        # store the simulation state
        state = simulation.context.getState(getPositions=True, getVelocities=True)

    # add pressure coupling
    barostat = MonteCarloBarostat(
        run_options["quench_equilibrate"]["pressure"] * bar, temp * kelvin
    )
    barostat.setRandomNumberSeed(seed_shuffle(seed, "barostat"))
    barostat_id = system.addForce(barostat)

    # reset integrator and simulation
    integrator = LangevinIntegrator(temp * kelvin, 1 / picosecond, delta_t * picosecond)
    integrator.setRandomNumberSeed(seed_shuffle(seed, "langevin 2"))
    simulation = Simulation(pdb.topology, system, integrator)
    simulation.context.setState(state)

    # logging
    total_npt_steps = int(run_options["quench_equilibrate"]["eq-npt-time"] / delta_t)
    total_npt_steps += int(run_options["quench_equilibrate"]["npt-time"] / delta_t)
    simulation.reporters.append(
        StateDataReporter(
            sys.stdout,
            int(run_options["quench_equilibrate"]["log-frequency"] / delta_t),
            step=True,
            remainingTime=True,
            totalSteps=total_npt_steps,
        )
    )

    # equilibrate NPT
    simulation.step(int(run_options["quench_equilibrate"]["eq-npt-time"] * delta_t))

    # set desired output for NPT simulations
    with open("eq_quench-{0}.dat".format(temp), "w") as report_file:
        simulation.reporters.append(
            StateDataReporter(
                report_file,
                int(run_options["quench_equilibrate"]["state-frequency"] / delta_t),
                step=True,
                potentialEnergy=True,
                temperature=True,
                volume=True,
                density=True,
            )
        )

        # production run for NPT to get good average density
        simulation.step(int(run_options["quench_equilibrate"]["npt-time"] / delta_t))

    system.removeForce(barostat_id)
    # store the simulation state
    state = simulation.context.getState(getPositions=True, getVelocities=True)
    return state


def safely_heat_up(system, pdb, state, temp, seed):  # pylint: disable=too-many-locals
    """
    Raise the temperature after first equilibration.
    If we reach the boiling point, stop heating and limit max temperature.
    """

    def early_exit(box_volumes, safety_factor):
        current_volume = box_volumes[-1]
        mean_volume = np.mean(box_volumes)
        if current_volume > safety_factor * mean_volume:
            return True
        return False

    # some parameters
    run_options = get_advanced_option("run")
    delta_t = run_options["dt"]
    # cooling rate in K/ps
    cooling_rate = run_options["quench_equilibrate"]["cooling-rate"]
    steps_per_temp = int(run_options["quench_equilibrate"]["time-per-temp"] / delta_t)

    start_temp = temp
    with StatusHandle(".", True) as status:
        end_temp = status["max_temperature"]

    # set the integrator
    integrator = LangevinIntegrator(
        start_temp * kelvin,
        run_options["quench_equilibrate"]["langevin-friction"] / picosecond,
        delta_t * picosecond,
    )
    integrator.setRandomNumberSeed(seed_shuffle(seed, "langevin"))

    # add pressure coupling
    barostat = MonteCarloBarostat(
        run_options["quench_equilibrate"]["pressure"] * bar, start_temp * kelvin
    )
    barostat.setRandomNumberSeed(seed_shuffle(seed, "barostat"))
    barostat_id = system.addForce(barostat)

    simulation = Simulation(pdb.topology, system, integrator)
    simulation.context.setState(state)

    # set desired output for the quench
    simulation.reporters.append(
        StateDataReporter(
            "eq_heat.dat",
            int(run_options["quench_equilibrate"]["state-frequency"] / delta_t),
            step=True,
            potentialEnergy=True,
            temperature=True,
            volume=True,
            density=True,
        )
    )

    # determine quench parameters
    time_per_chunk = steps_per_temp * delta_t
    delta_temp_chunk = -cooling_rate * time_per_chunk
    n_chunks = int((start_temp - end_temp) / delta_temp_chunk) + 1
    prod_steps = steps_per_temp * n_chunks
    # Be aware this simulations starts with small time without a temperature ramp.
    temp = start_temp + delta_temp_chunk

    # logging
    simulation.reporters.append(
        StateDataReporter(
            sys.stdout,
            int(run_options["quench_equilibrate"]["log-frequency"] / delta_t),
            step=True,
            remainingTime=True,
            totalSteps=prod_steps,
        )
    )

    box_volumes = []
    # run the quench
    for i in range(n_chunks):  # pylint: disable=unused-variable
        temp -= delta_temp_chunk
        integrator.setTemperature(temp * kelvin)
        simulation.system.getForce(barostat_id).setDefaultTemperature(temp * kelvin)
        simulation.step(steps_per_temp)

        state = simulation.context.getState()
        vec_a, vec_b, vec_c = state.getPeriodicBoxVectors(True)
        volume = np.dot(np.cross(vec_a, vec_b), vec_c)
        box_volumes.append(volume)

        if early_exit(
            box_volumes, run_options["quench_equilibrate"]["safe-volume-factor"]
        ):
            break

    if abs(temp - end_temp) > abs(delta_temp_chunk):
        temp = int(temp) - run_options["quench_equilibrate"]["safe-temp-reduction"]
        end_temp = temp
        with StatusHandle(".", False) as status:
            status["max_temperature"] = end_temp
            all_temps = status["temperature"]
        if max(all_temps) > end_temp:
            err_msg = "Warning cannot heat the system above all desired temperatures without boiling. "
            err_msg += "These jobs are going to fail."
            print(err_msg)
    else:
        temp = end_temp

    system.removeForce(barostat_id)
    # store the simulation state
    state = simulation.context.getState(getPositions=True, getVelocities=True)
    return state, temp


def nvt_equilibration(system, pdb, state, temp, seed):
    """
    Short NVT simulation to equilibrate.
    """
    run_options = get_advanced_option("run")
    # set the integrator
    delta_t = run_options["dt"]

    # now set up NVT simulation for diffusion/dynamics
    length = get_periodic_box_length("eq_quench-{0}.dat".format(temp))
    integrator = LangevinIntegrator(temp * kelvin, 1 / picosecond, delta_t * picosecond)
    integrator.setRandomNumberSeed(seed_shuffle(seed, "langevin"))

    simulation = Simulation(pdb.topology, system, integrator)
    simulation.context.setState(state)
    simulation.context.setPeriodicBoxVectors(
        Vec3(length, 0.0, 0.0), Vec3(0.0, length, 0.0), Vec3(0.0, 0.0, length)
    )

    # logging
    simulation.reporters.append(
        StateDataReporter(
            sys.stdout,
            int(run_options["quench_equilibrate"]["log-frequency"] / delta_t),
            step=True,
            remainingTime=True,
            totalSteps=int(run_options["quench_equilibrate"]["nvt-time"] / delta_t),
        )
    )

    # re equilibrate for 1ns
    simulation.minimizeEnergy()
    simulation.step(int(run_options["quench_equilibrate"]["nvt-time"] / delta_t))

    return simulation


def reduce_dt(factor=0.5):
    """
    Helper function to manipulate dt for this and all subsequent runs.
    """
    print("Multiply global timstep with factor {0}.".format(factor))
    with open("advanced_options.json", "r") as file_handle:
        ana = json.load(file_handle)
    ana["run"]["dt"] *= factor
    if ana["run"]["dt"] < ana["run"]["min-dt"]:
        raise RuntimeError(
            "Simulation caused too many exceptions, the time step cannot be further reduced. Check for problems with initial conditions / force-fields."
        )
    ana["change-expected"] = True
    with open("advanced_options.json", "w") as file_handle:
        json.dump(ana, file_handle, indent=2, sort_keys=True)


def handle_nan_exception(exc):
    """
    Helper to handle NaN exceptions from OpenMM.
    """
    if "NaN" in str(exc) or "nan" in str(exc):
        reduce_dt()
        sys.stdout.write(str(exc))
        sys.stdout.flush()
        return False
    raise exc


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 1:
        print("Usage: python quench_equilibrate.py")
        raise RuntimeError("Invalid cli args for quench_equilibrate.py")

    seed = set_job_running("quench_equilibrate")

    run_options = get_advanced_option("run")
    temp = run_options["quench_equilibrate"]["safe-temp"]
    # read in the input and force field files
    pdb = PDBFile("init_bulk.pdb")
    pdb = correct_pdb_reader(pdb)

    # generate the system
    forcefield = ForceField("forcefield.xml")
    system = forcefield.createSystem(
        pdb.topology,
        nonbondedMethod=PME,
        nonbondedCutoff=run_options["nb-cutoff"] * nanometer,
        constraints=HBonds,
    )
    system = opls_lj(system)

    step_success = False
    while not step_success:
        step_success = True
        try:
            state = npt_equilibration(system, pdb, temp, seed_shuffle(seed, "NPT1"))
        except OpenMMException as exception:
            step_success = handle_nan_exception(exception)

    # Step trough the known quench procedure, but catch errors and reduce dt as required.
    step_success = False
    while not step_success:
        step_success = True
        try:
            state, temp = safely_heat_up(
                system, pdb, state, temp, seed_shuffle(seed, "heat up")
            )
        except OpenMMException as exception:
            step_success = handle_nan_exception(exception)

    step_success = False
    while not step_success:
        step_success = True
        try:
            state = npt_equilibration(
                system, pdb, temp, seed_shuffle(seed, "NPT2"), state
            )
        except OpenMMException as exception:
            step_success = handle_nan_exception(exception)

    step_success = False
    while not step_success:
        step_success = True
        try:
            simulation = nvt_equilibration(
                system, pdb, state, temp, seed_shuffle(seed, "NVT")
            )
        except OpenMMException as exception:
            step_success = handle_nan_exception(exception)

    # save the simulation state
    simulation.saveState("eq_quench-{0}.xml".format(temp))
    set_job_finished("quench_equilibrate")


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("quench_equilibrate")
        raise exception
