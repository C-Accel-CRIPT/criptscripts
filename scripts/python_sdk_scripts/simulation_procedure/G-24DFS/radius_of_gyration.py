"""
Run script for analysis of molecular square radius of gyration
"""
import sys

import numpy as np  # pylint: disable=import-error
from elwood.execute.analyze_util import get_mol_sq_rg, store_json
from elwood.execute.run_util import (
    get_advanced_option,
    set_job_error,
    set_job_finished,
    set_job_running,
)


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 2:
        print("Usage: python radius_of_gyration.py temperature [K]")
        raise RuntimeError("Invalid cli args for radius_of_gyration.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    set_job_running("radius_of_gyration-{0}".format(temp))

    mol_sq_rg = get_mol_sq_rg("bulk_npt-{0}.h5".format(temp))
    sq_rg_ave = np.mean(mol_sq_rg)
    sq_rg_std = np.std(mol_sq_rg)

    si_conv = 1e-20  # angstrom^2 -> meter^2
    store_json(
        "square radius of gyration",
        [si_conv * sq_rg_ave],
        [si_conv * sq_rg_std],
        "m^2",
        temp,
        get_advanced_option("run")["npt"]["pressure"],
    )
    set_job_finished("radius_of_gyration-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("radius_of_gyration-{0}".format(float(sys.argv[1])))
        raise exception
