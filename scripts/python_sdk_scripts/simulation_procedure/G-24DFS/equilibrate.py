"""
Run script for OpenMM to execute simulations of bulk material under NVT conditions.
"""

import sys

from elwood.execute.run_util import (
    correct_pdb_reader,
    get_advanced_option,
    get_periodic_box_length,
    opls_lj,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from elwood.util import seed_shuffle
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
from simtk.openmm.vec3 import Vec3  # pylint: disable=import-error
from simtk.unit import (  # pylint: disable=no-name-in-module,import-error
    bar,
    kelvin,
    nanometer,
    picosecond,
)


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 2:
        print("Usage: python equilibrate.py temperature [K]")
        raise RuntimeError("Invalid cli args for equilibrate.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    seed = set_job_running("equilibrate-{0}".format(temp))
    # some parameters
    run_options = get_advanced_option("run")
    delta_t = run_options["dt"]
    state_freq = int(run_options["equilibrate"]["state-frequency"] / delta_t)
    equi_steps = int(run_options["equilibrate"]["equi-time"] / delta_t)

    # read in the input and force field files
    pdb = PDBFile("init_bulk.pdb")
    pdb = correct_pdb_reader(pdb)
    forcefield = ForceField("forcefield.xml")

    # generate the system
    system = forcefield.createSystem(
        pdb.topology,
        nonbondedMethod=PME,
        constraints=HBonds,
        nonbondedCutoff=run_options["nb-cutoff"] * nanometer,
    )
    system = opls_lj(system)

    # set the integrator
    integrator = LangevinIntegrator(temp * kelvin, 1 / picosecond, delta_t * picosecond)
    integrator.setRandomNumberSeed(seed_shuffle(seed, "langevin"))

    # add pressure coupling
    barostat = MonteCarloBarostat(
        run_options["equilibrate"]["pressure"] * bar, temp * kelvin
    )
    barostat.setRandomNumberSeed(seed_shuffle(seed, "barostat"))
    barostat_id = system.addForce(barostat)

    simulation = Simulation(pdb.topology, system, integrator)
    simulation.loadState("pre_equi-{0}.xml".format(temp))
    simulation.minimizeEnergy()

    # logging
    simulation.reporters.append(
        StateDataReporter(
            sys.stdout,
            int(run_options["equilibrate"]["log-frequency"] / delta_t),
            step=True,
            remainingTime=True,
            totalSteps=equi_steps,
        )
    )

    # set desired output for NPT simulations
    simulation.reporters.append(
        StateDataReporter(
            "equilibrate-{0}.dat".format(temp),
            state_freq,
            step=True,
            potentialEnergy=True,
            temperature=True,
            volume=True,
            density=True,
        )
    )

    # equilibration run
    simulation.step(equi_steps // 2)

    state = simulation.context.getState(getPositions=True, getVelocities=True)
    system.removeForce(barostat_id)
    length = get_periodic_box_length("equilibrate-{0}.dat".format(temp))
    integrator = LangevinIntegrator(temp * kelvin, 1 / picosecond, delta_t * picosecond)
    integrator.setRandomNumberSeed(seed_shuffle(seed, "langevin2"))

    simulation = Simulation(pdb.topology, system, integrator)
    simulation.context.setState(state)
    simulation.context.setPeriodicBoxVectors(
        Vec3(length, 0.0, 0.0), Vec3(0.0, length, 0.0), Vec3(0.0, 0.0, length)
    )

    # logging
    simulation.reporters.append(
        StateDataReporter(
            sys.stdout,
            int(run_options["equilibrate"]["log-frequency"] / delta_t),
            step=True,
            remainingTime=True,
            totalSteps=equi_steps // 2,
        )
    )

    simulation.step(equi_steps // 2)
    simulation.saveState("eq_bulk-{0}.xml".format(temp))
    set_job_finished("equilibrate-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("equilibrate-{0}".format(float(sys.argv[1])))
        raise exception
