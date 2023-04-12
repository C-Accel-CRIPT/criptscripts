"""
Run script for to initialize a system.
"""
import os
import shutil
import sys

from elwood.execute.run_util import set_job_error, set_job_finished, set_job_running
from elwood.json_handle import StatusHandle
from elwood.system import ElwoodSystem
from elwood.util import get_file_hash


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 1:
        print("Usage: python prepare.py uid")
        raise RuntimeError("Invalid cli args for prepare.py")

    set_job_running("prepare")

    def prepare_initial_condition():  # pylint: disable=too-many-locals
        """
        Use the SMILES string to generate a pdb file and a forcefield.
        These are the basic input parameter for the simulation.
        """

        with StatusHandle(".", True) as status:
            smiles_string = status["smiles_string"]
            target_atom_number = status["target_atom_number"]
            global_seed = status["seed"]

        path = ""
        elsystem = ElwoodSystem(smiles_string, global_seed)
        elsystem.make_initial_coordinates(path, target_atom_number)
        shutil.copy(
            os.path.join(path, "packmol_init_pbc.pdb"),
            os.path.join(path, "init_bulk.pdb"),
        )
        elsystem.make_initial_coordinates(path, 1)
        shutil.copy(
            os.path.join(path, "packmol_init_pbc.pdb"),
            os.path.join(path, "init_gas.pdb"),
        )

    def cleanup_preparation():
        """
        Take the prepared files and clean up the intermediately generated files.
        """
        path = ""
        # Move all intermediate files to backup directory
        with StatusHandle(path, False) as status:
            status["files_to_keep"]["status.json"] = None
            keep_debug = status["keep_debug"]
            tmp_files = [
                "init_bulk.pdb",
                "forcefield.xml",
                "residues.xml",
                "analysis.json",
                "init_gas.pdb",
            ]
            tmp_files.append("molecules.smi")
            for filename in tmp_files:
                status["files_to_keep"][filename] = get_file_hash(
                    os.path.join(path, filename)
                )
            for filename in os.listdir():
                if filename.startswith("prepare"):
                    status["files_to_keep"][filename] = None

            files_to_keep = status["files_to_keep"]

        path_contents = os.listdir("")
        intermediate_files = []
        for filename in path_contents:
            if not os.path.isdir(filename) and filename not in files_to_keep:
                intermediate_files.append(filename)

        try:
            os.mkdir(os.path.join(path, "debug"))
        except FileExistsError:
            pass

        for filename in intermediate_files:
            os.rename(
                os.path.join(path, filename), os.path.join(path, "debug", filename)
            )

        if not keep_debug:
            shutil.rmtree(os.path.join(path, "debug"))

    prepare_initial_condition()
    cleanup_preparation()
    set_job_finished("prepare")


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("prepare")
        raise exception
