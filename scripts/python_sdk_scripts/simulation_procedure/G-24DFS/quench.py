"""
Run script for OpenMM to execute simulations that quench the simulation by cooling to measure Tg.o
"""
# pylint: disable=too-many-locals

import sys

from elwood.execute.run_util import (
    correct_pdb_reader,
    get_advanced_option,
    opls_lj,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from elwood.json_handle import StatusHandle
from elwood.util import seed_shuffle
from mdtraj.reporters import HDF5Reporter  # pylint: disable=import-error
from simtk.openmm import (  # pylint: disable=import-error
    LangevinIntegrator,
    MonteCarloBarostat,
)
from simtk.openmm.app import (  # pylint: disable=import-error
    PME,
    ForceField,
    HBonds,
    PDBFile,
    Simulation,
    StateDataReporter,
)
from simtk.unit import (  # pylint: disable=no-name-in-module,import-error
    bar,
    kelvin,
    nanometer,
    picosecond,
)


def run_quench(start_temp, end_temp, load_file, write_temperatures, seed):
    """
    Run a quench simulations (can be both directions).
    """
    # some parameters
    run_options = get_advanced_option("run")
    delta_t = run_options["dt"]
    # cooling rate in K/ps
    cooling_rate = run_options["quench"]["cooling-rate"]
    steps_per_temp = int(run_options["quench"]["time-per-temp"] / delta_t)

    # read in the input and force field files
    pdb = PDBFile("init_bulk.pdb")
    pdb = correct_pdb_reader(pdb)
    forcefield = ForceField("forcefield.xml")

    system = forcefield.createSystem(
        pdb.topology,
        nonbondedMethod=PME,
        nonbondedCutoff=run_options["nb-cutoff"] * nanometer,
        constraints=HBonds,
    )
    system = opls_lj(system)

    # set the integrator
    integrator = LangevinIntegrator(
        start_temp * kelvin,
        run_options["quench"]["langevin-friction"] / picosecond,
        delta_t * picosecond,
    )
    integrator.setRandomNumberSeed(seed_shuffle(seed, "langevin"))

    # add pressure coupling
    barostat = MonteCarloBarostat(
        run_options["quench"]["pressure"] * bar, start_temp * kelvin
    )
    barostat.setRandomNumberSeed(seed_shuffle(seed, "barostat"))
    barostat_id = system.addForce(barostat)

    simulation = Simulation(pdb.topology, system, integrator)
    simulation.loadState(load_file)

    # set desired output for the quench
    simulation.reporters.append(
        StateDataReporter(
            "quench-{0}-{1}.dat".format(start_temp, end_temp),
            int(run_options["quench"]["state-frequency"] / delta_t),
            step=True,
            potentialEnergy=True,
            temperature=True,
            volume=True,
            density=True,
        )
    )

    # store traj.
    try:
        simulation.reporters.append(
            HDF5Reporter(
                "quench-{0}-{1}.h5".format(start_temp, end_temp),
                int(run_options["quench"]["traj-frequency"] / delta_t),
                enforcePeriodicBox=False,
            )
        )
    except TypeError:
        simulation.reporters.append(
            HDF5Reporter(
                "quench-{0}-{1}.h5".format(start_temp, end_temp),
                int(run_options["quench"]["traj-frequency"] / delta_t),
            )
        )

    # determine quench parameters
    time_per_chunk = steps_per_temp * delta_t
    delta_temp_chunk = cooling_rate * time_per_chunk
    if start_temp < end_temp:
        delta_temp_chunk *= -1
    n_chunks = int((start_temp - end_temp) / delta_temp_chunk) + 1
    prod_steps = steps_per_temp * n_chunks
    # Be aware this simulations starts with small time without a temperature ramp.
    temp = start_temp + delta_temp_chunk

    # logging
    simulation.reporters.append(
        StateDataReporter(
            sys.stdout,
            int(run_options["quench"]["log-frequency"] / delta_t),
            step=True,
            remainingTime=True,
            totalSteps=prod_steps,
        )
    )

    # run the quench
    for i in range(n_chunks):  # pylint: disable=unused-variable
        temp -= delta_temp_chunk
        integrator.setTemperature(temp * kelvin)
        simulation.system.getForce(barostat_id).setDefaultTemperature(temp * kelvin)
        simulation.step(steps_per_temp)

        try:
            next_write_temp = max(write_temperatures)
        except ValueError:  # Pass this section if the sequence is empty.
            pass
        else:
            if temp < next_write_temp:
                # save the simulation state
                simulation.saveState("pre_equi-{0}.xml".format(next_write_temp))
                del write_temperatures[write_temperatures.index(next_write_temp)]
    # Save the final simulation state
    simulation.saveState("quench_end-{0}.xml".format(end_temp))


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 1:
        print("Usage: python quench.py")
        raise RuntimeError("Invalid cli args for quench.py")

    seed = set_job_running("quench")

    with StatusHandle(".", True) as status:
        high_temp = status["max_temperature"]
        low_temp = status["min_temperature"]
        write_temperatures = status["temperature"]
        assert high_temp > max(write_temperatures)
        assert low_temp < min(write_temperatures)

    run_quench(
        high_temp,
        low_temp,
        "auto_quench-{0}.xml".format(high_temp),
        write_temperatures,
        seed,
    )

    set_job_finished("quench")


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("quench")
        raise exception
