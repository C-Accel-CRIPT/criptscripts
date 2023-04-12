"""
Run script for OpenMM to execute the simulation of gas molecules with NVT conditions.
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
from mdtraj.reporters import HDF5Reporter  # pylint: disable=import-error
from simtk.openmm import LangevinIntegrator  # pylint: disable=import-error
from simtk.openmm.app import (  # pylint: disable=import-error
    ForceField,
    HBonds,
    NoCutoff,
    PDBFile,
    Simulation,
    StateDataReporter,
)
from simtk.unit import (  # pylint: disable=no-name-in-module,import-error
    kelvin,
    picosecond,
)


def main(argv):  # pylint: disable=too-many-locals
    """
    Main function executing the script.
    """
    if len(argv) != 2:
        print("Usage: python gas_nvt.py temperature [K]")
        raise RuntimeError("Invalid cli args for gas_nvt.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    seed = set_job_running("gas_nvt-{0}".format(temp))
    # some parameters
    run_options = get_advanced_option("run")
    delta_t = run_options["dt"]
    log_freq = int(run_options["gas"]["log-frequency"] / delta_t)
    state_freq = int(run_options["gas"]["state-frequency"] / delta_t)
    traj_freq = int(run_options["gas"]["traj-frequency"] / delta_t)
    equil_steps = int(run_options["gas"]["equilibration-time"] / delta_t)
    prod_steps = int(run_options["gas"]["production-time"] / delta_t)

    # read in the input and force field files
    pdb = PDBFile("init_gas.pdb")
    pdb = correct_pdb_reader(pdb)
    forcefield = ForceField("forcefield.xml")

    # generate the system
    system = forcefield.createSystem(
        pdb.topology, nonbondedMethod=NoCutoff, constraints=HBonds
    )
    system = opls_lj(system, gas=True)

    # set the integrator
    integrator = LangevinIntegrator(temp * kelvin, 1 / picosecond, delta_t * picosecond)
    integrator.setRandomNumberSeed(seed)

    simulation = Simulation(pdb.topology, system, integrator)
    simulation.context.setPositions(pdb.positions)
    simulation.minimizeEnergy()
    simulation.reporters.append(
        StateDataReporter(
            sys.stdout,
            log_freq,
            step=True,
            remainingTime=True,
            totalSteps=equil_steps + prod_steps,
        )
    )

    # equilibrate
    simulation.step(equil_steps)

    # set desired output for gas simulations
    simulation.reporters.append(
        StateDataReporter(
            "gas-{0}.dat".format(temp),
            state_freq,
            step=True,
            potentialEnergy=True,
            temperature=True,
        )
    )

    # record simulation traj.
    try:
        simulation.reporters.append(
            HDF5Reporter("gas-{0}.h5".format(temp), traj_freq, enforcePeriodicBox=False)
        )
    except TypeError:
        simulation.reporters.append(HDF5Reporter("gas-{0}.h5".format(temp), traj_freq))

    # production run
    simulation.step(prod_steps)
    set_job_finished("gas_nvt-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("gas_nvt-{0}".format(float(sys.argv[1])))
        raise exception
