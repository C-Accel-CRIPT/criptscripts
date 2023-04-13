"""
Run script for OpenMM to execute simulations of bulk material under NVT conditions.
"""

import sys

from elwood.execute.run_util import (
    correct_pdb_reader,
    get_advanced_option,
    opls_lj,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from elwood.json_handle import AnalysisHandle
from elwood.util import remove_monte_carlo_from_state
from mdtraj.reporters import HDF5Reporter  # pylint: disable=import-error
from simtk.openmm import LangevinIntegrator  # pylint: disable=import-error
from simtk.openmm.app import (  # pylint: disable=import-error
    PME,
    ForceField,
    HBonds,
    PDBFile,
    Simulation,
    StateDataReporter,
)
from simtk.unit import (  # pylint: disable=no-name-in-module,import-error
    kelvin,
    nanometer,
    picosecond,
)


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 2:
        print("Usage: python bulk_nvt.py temperature [K]")
        raise RuntimeError("Invalid cli args for bulk_nvt.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    seed = set_job_running("bulk_nvt-{0}".format(temp))
    # some parameters
    run_options = get_advanced_option("run")
    delta_t = run_options["dt"]
    log_freq = int(run_options["nvt"]["log-frequency"] / delta_t)
    state_freq = int(run_options["nvt"]["state-frequency"] / delta_t)
    traj_freq = int(run_options["nvt"]["traj-frequency"] / delta_t)

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
    integrator.setRandomNumberSeed(seed)

    simulation = Simulation(pdb.topology, system, integrator)

    remove_monte_carlo_from_state("eq_bulk-{0}.xml".format(temp))
    simulation.loadState("eq_bulk-{0}.xml".format(temp))

    # logging
    simulation.reporters.append(
        StateDataReporter(
            sys.stdout,
            log_freq,
            step=True,
            remainingTime=True,
            totalSteps=int(run_options["nvt"]["production-time"] / delta_t),
        )
    )

    # set desired output for NVT simulations
    simulation.reporters.append(
        StateDataReporter(
            "bulk_nvt-{0}.dat".format(temp),
            state_freq,
            step=True,
            potentialEnergy=True,
            kineticEnergy=True,
            temperature=True,
        )
    )

    # store traj.
    try:
        simulation.reporters.append(
            HDF5Reporter(
                "bulk_nvt-{0}.h5".format(temp), traj_freq, enforcePeriodicBox=False
            )
        )
    except TypeError:
        warn_msg = "Storing unwrap coords with HDF5 isn't available yet."
        warn_msg += " MSD and diffusion will be wrong."
        with AnalysisHandle(".", False) as ana:
            ana.add_warning(warn_msg)
        simulation.reporters.append(
            HDF5Reporter("bulk_nvt-{0}.h5".format(temp), traj_freq)
        )

    # production run
    simulation.step(int(run_options["nvt"]["production-time"] / delta_t))
    set_job_finished("bulk_nvt-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("bulk_nvt-{0}".format(float(sys.argv[1])))
        raise exception
