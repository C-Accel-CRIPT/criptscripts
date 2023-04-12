"""
Run script for analysis of isothermal compressibility.
"""
import sys

import numpy as np
from elwood.execute.analyze_util import block_avg, read_state_file, store_json
from elwood.execute.run_util import (
    get_advanced_option,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from simtk.unit import joule, kelvin  # pylint: disable=no-name-in-module,import-error
from simtk.unit.constants import BOLTZMANN_CONSTANT_kB  # pylint: disable=import-error

KB_CONST = BOLTZMANN_CONSTANT_kB.value_in_unit(joule / kelvin)


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 2:
        print("Usage: python isothermal_compressibility.py temperature [K]")
        raise RuntimeError("Invalid cli args for isothermal_compressibility.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception
    set_job_running("isothermal_compressibility-{0}".format(temp))

    blocks = get_advanced_option("analysis")["isothermal_compressibility"]["blocks"]

    # bulk
    vol_liq = read_state_file("bulk_npt-{0}.dat".format(temp), "Box Volume (nm^3)")
    vol_liq_b = block_avg(vol_liq, blocks)

    # fluactuation
    vol_liq_fluc_b = block_avg(vol_liq**2, blocks) - block_avg(vol_liq, blocks) ** 2

    compress_b = vol_liq_fluc_b / vol_liq_b / KB_CONST / temp * 1e-27  # 1/Pa
    compress_avg = np.mean(compress_b)
    compress_std = np.std(compress_b)

    store_json(
        "isothermal compressibility",
        [compress_avg],
        [compress_std],
        "kg^-1 m s^2",
        temp,
        get_advanced_option("run")["npt"]["pressure"],
    )
    set_job_finished("isothermal_compressibility-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("isothermal_compressibility-{0}".format(float(sys.argv[1])))
        raise exception
