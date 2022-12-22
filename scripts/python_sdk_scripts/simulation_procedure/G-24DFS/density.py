"""
Run script for analysis of density
"""
import sys

import numpy as np  # pylint: disable=import-error
from elwood.execute.analyze_util import block_avg, read_state_file, store_json
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
        print("Usage: python density.py temperature [K]")
        raise RuntimeError("Invalid cli args for density.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    set_job_running("density-{0}".format(temp))
    blocks = get_advanced_option("analysis")["density"]["blocks"]

    rho = read_state_file("bulk_npt-{0}.dat".format(temp), "Density (g/mL)")
    rho_b = block_avg(rho, blocks)
    rho_avg = np.mean(rho_b)
    rho_std = np.std(rho_b)

    si_conv = 1e3
    store_json(
        "density",
        [si_conv * rho_avg],
        [si_conv * rho_std],
        "kg m^-3",
        temp,
        get_advanced_option("run")["npt"]["pressure"],
    )
    set_job_finished("density-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("density-{0}".format(float(sys.argv[1])))
        raise exception
