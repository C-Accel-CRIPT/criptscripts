"""
Run script for OpenMM equilibrate after the initial heat-up for bulk materials.
"""
import os
import sys
import time
from types import SimpleNamespace

import mdtraj as md  # pylint: disable=import-error
import numpy as np
from elwood.configure import _RUN_SCRIPT, create_jobs
from elwood.execute import execute_uid
from elwood.execute.analyze_util import get_mol_sq_rg
from elwood.execute.run_util import (
    correct_pdb_reader,
    get_advanced_option,
    opls_lj,
    seed_shuffle,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from elwood.json_handle import StatusHandle
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


def get_msd(initial_file, end_file):
    """
    Calcualte the MSD between two files first frames in Angstrom.
    """
    traj_init = md.load(initial_file)
    traj_end = md.load(end_file)
    msd = np.average(
        np.sum((traj_init.xyz[0] * 10 - traj_end.xyz[0] * 10) ** 2, axis=1)
    )
    return msd


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 1:
        print("Usage: python auto_equilibrate.py")
        raise RuntimeError("Invalid cli args for auto_equilibrate.py")

    seed = set_job_running("auto_equilibrate")

    run_options = get_advanced_option("run")
    delta_t = run_options["dt"]
    steps_per_step = int(run_options["auto_equilibrate"]["time-per-step"] / delta_t)
    rg_msd_ratio = run_options["auto_equilibrate"]["rg-msd-ratio"]
    log_freq = int(run_options["auto_equilibrate"]["log-frequency"] / delta_t)

    start_sec = time.time()

    with StatusHandle(".", True) as status:
        temp = status["max_temperature"]
        auto_equi_step = status["auto-equi-step"]

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
        temp * kelvin,
        run_options["auto_equilibrate"]["langevin-friction"] / picosecond,
        delta_t * picosecond,
    )
    integrator.setRandomNumberSeed(seed_shuffle(seed, "langevin"))

    simulation = Simulation(pdb.topology, system, integrator)
    simulation.reporters.append(
        StateDataReporter(
            "auto_eq-{0}.dat".format(temp),
            log_freq,
            potentialEnergy=True,
            temperature=True,
            volume=True,
            density=True,
        )
    )

    remove_monte_carlo_from_state("eq_quench-{0}.xml".format(temp))
    simulation.loadState("eq_quench-{0}.xml".format(temp))

    state = simulation.context.getState(getPositions=True)
    if auto_equi_step == 0:
        initial_frame = HDF5Reporter(
            "eq_init.h5",
            1,
            enforcePeriodicBox=False,
            time=False,
            cell=False,
            potentialEnergy=False,
            kineticEnergy=False,
            temperature=False,
        )
        initial_frame.report(simulation, state)
        initial_frame.close()

    sq_rg = np.mean(get_mol_sq_rg("eq_init.h5"))
    msd = 0
    sys.stdout.write("# Rg^2 [A^2]\t Rg^2 * factor [A^2]\t MSD [A^2]\n")
    while sq_rg * rg_msd_ratio > msd:
        simulation.step(steps_per_step)
        state = simulation.context.getState(getPositions=True)
        end_frame = HDF5Reporter(
            "eq_end.h5",
            1,
            enforcePeriodicBox=False,
            time=False,
            cell=False,
            potentialEnergy=False,
            kineticEnergy=False,
            temperature=False,
        )
        end_frame.report(simulation, state)
        end_frame.close()
        sq_rg = np.mean(get_mol_sq_rg("eq_end.h5"))
        msd = get_msd("eq_init.h5", "eq_end.h5")
        sys.stdout.write("{0}\t{1}\t{2}\n".format(sq_rg, sq_rg * rg_msd_ratio, msd))
        sys.stdout.flush()

        if (
            time.time() - start_sec
            > run_options["auto_equilibrate"]["max-walltime-sec"]
        ):
            print("Max. walltime limit reached: early equilibration abort.")
            break

    set_job_finished("auto_equilibrate")

    path = os.getcwd()
    uid = os.path.split(path)[1]
    if sq_rg * rg_msd_ratio <= msd:
        # save the simulation state
        simulation.saveState("auto_quench-{0}.xml".format(temp))
        os.chdir("..")
        create_jobs(uid, _RUN_SCRIPT["auto_equilibrate"])
    else:
        # Prepare to rerun auto_equilibrate
        simulation.saveState("eq_quench-{0}.xml".format(temp))
        os.chdir("..")
        create_jobs(uid, ["auto_equilibrate"])

    with StatusHandle(uid, False) as status:
        status["auto-equi-step"] = auto_equi_step + 1
        args = SimpleNamespace(**status)
    try:
        execute_uid(args, uid)
    except Exception as e:
        raise e
    finally:
        os.chdir(path)


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("auto_equilibrate")
        raise exception
