"""
Run script for OpenMM to execute simulations of bulk material under NVT conditions.
"""

import sys

from elwood.execute.run_util import (
    correct_pdb_reader,
    get_advanced_option,
    opls_lj,
    seed_shuffle,
    set_job_error,
    set_job_finished,
    set_job_running,
)
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


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 2:
        print("Usage: python bulk_npt.py temperature [K]")
        raise RuntimeError("Invalid cli args for bulk_npt.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    seed = set_job_running("bulk_npt-{0}".format(temp))
    # some parameters
    run_options = get_advanced_option("run")
    delta_t = run_options["dt"]
    log_freq = int(run_options["npt"]["log-frequency"] / delta_t)
    state_freq = int(run_options["npt"]["state-frequency"] / delta_t)
    traj_freq = int(run_options["npt"]["traj-frequency"] / delta_t)
    prod_steps = int(run_options["npt"]["production-time"] / delta_t)

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
    barostat = MonteCarloBarostat(run_options["npt"]["pressure"] * bar, temp * kelvin)
    barostat.setRandomNumberSeed(seed_shuffle(seed, "barostat"))
    system.addForce(barostat)

    simulation = Simulation(pdb.topology, system, integrator)
    simulation.loadState("eq_bulk-{0}.xml".format(temp))

    # logging
    simulation.reporters.append(
        StateDataReporter(
            sys.stdout, log_freq, step=True, remainingTime=True, totalSteps=prod_steps
        )
    )

    # set desired output for NPT simulations
    simulation.reporters.append(
        StateDataReporter(
            "bulk_npt-{0}.dat".format(temp),
            state_freq,
            step=True,
            potentialEnergy=True,
            kineticEnergy=True,
            temperature=True,
            volume=True,
            density=True,
        )
    )

    # store traj.
    try:
        simulation.reporters.append(
            HDF5Reporter(
                "bulk_npt-{0}.h5".format(temp), traj_freq, enforcePeriodicBox=False
            )
        )
    except TypeError:
        simulation.reporters.append(
            HDF5Reporter("bulk_npt-{0}.h5".format(temp), traj_freq)
        )

    # production run
    simulation.step(prod_steps)
    set_job_finished("bulk_npt-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("bulk_npt-{0}".format(float(sys.argv[1])))
        raise exception
