"""
Run script for analysis of thermal expansion coefficient.
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
from simtk.unit import (  # pylint: disable=no-name-in-module,import-error
    bar,
    kelvin,
    kilojoule,
    mole,
    pascal,
)
from simtk.unit.constants import (  # pylint: disable=import-error
    AVOGADRO_CONSTANT_NA,
    MOLAR_GAS_CONSTANT_R,
)

R_CONST = MOLAR_GAS_CONSTANT_R.value_in_unit(kilojoule / mole / kelvin)
NA_CONST = AVOGADRO_CONSTANT_NA.value_in_unit(mole ** (-1))


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 2:
        print("Usage: python thermal_expansion_coeff.py temperature [K]")
        raise RuntimeError("Invalid cli args for thermal_expansion_coeff.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    set_job_running("thermal_expansion_coeff-{0}".format(temp))

    press = get_advanced_option("run")["npt"]["pressure"]
    blocks = get_advanced_option("analysis")["thermal_expansion_coeff"]["blocks"]

    # bulk
    vol = read_state_file("bulk_npt-{0}.dat".format(temp), "Box Volume (nm^3)")
    pe_liq = read_state_file(
        "bulk_npt-{0}.dat".format(temp), "Potential Energy (kJ/mole)"
    )
    ke_liq = read_state_file(
        "bulk_npt-{0}.dat".format(temp), "Kinetic Energy (kJ/mole)"
    )
    enthalpy = (
        pe_liq
        + ke_liq
        + vol * press * bar.conversion_factor_to(pascal) * NA_CONST * 1e-30
    )  # kJ/mol

    # cross correlation of enthalpy and volume fluctuation
    fluc_b = block_avg(enthalpy * vol, blocks) - block_avg(
        enthalpy, blocks
    ) * block_avg(vol, blocks)

    coeff_b = fluc_b / block_avg(vol, blocks) / R_CONST / temp**2  # 1/K
    coeff_avg = np.mean(coeff_b)
    coeff_std = np.std(coeff_b)

    store_json(
        "thermal expansion coefficient", [coeff_avg], [coeff_std], "T^-1", temp, press
    )
    set_job_finished("thermal_expansion_coeff-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("thermal_expansion_coeff-{0}".format(float(sys.argv[1])))
        raise exception
