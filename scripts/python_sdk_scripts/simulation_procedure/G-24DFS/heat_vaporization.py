"""
Run script for analysis of heat of vaporization.
"""
import sys

import numpy as np  # pylint: disable=import-error
from elwood.execute.analyze_util import (
    block_avg,
    get_nmols,
    read_state_file,
    store_json,
)
from elwood.execute.run_util import (
    get_advanced_option,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from simtk.unit import (  # pylint: disable=no-name-in-module,import-error
    kelvin,
    kilojoule,
    mole,
)
from simtk.unit.constants import MOLAR_GAS_CONSTANT_R  # pylint: disable=import-error

R_CONST = MOLAR_GAS_CONSTANT_R.value_in_unit(kilojoule / mole / kelvin)


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 2:
        print("Usage: python heat_vaporization.py temperature [K]")
        raise RuntimeError("Invalid cli args for heat_vaporization.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    set_job_running("heat_vaporization-{0}".format(temp))

    blocks = get_advanced_option("analysis")["heat_vaporization"]["blocks"]

    # bulk
    n_mols = get_nmols("bulk_npt-{0}.h5".format(temp))
    pe_liq = read_state_file(
        "bulk_npt-{0}.dat".format(temp), "Potential Energy (kJ/mole)"
    )
    pe_liq_b = block_avg(pe_liq, blocks)

    # gas
    pe_gas = read_state_file("gas-{0}.dat".format(temp), "Potential Energy (kJ/mole)")
    pe_gas_b = block_avg(pe_gas, blocks)

    heat_vap_b = (pe_gas_b - pe_liq_b / n_mols) + R_CONST * temp  # kJ/mole
    heat_vap_avg = np.mean(heat_vap_b)
    heat_vap_std = np.std(heat_vap_b)

    kJmol_to_Jmol = 1e3  # kJ/mol to J/mol pylint: disable=invalid-name
    store_json(
        "heat of vaporization",
        [heat_vap_avg * kJmol_to_Jmol],
        [heat_vap_std * kJmol_to_Jmol],
        "kg m^2 s^-2 mol^-1",
        temp,
        get_advanced_option("run")["npt"]["pressure"],
    )
    set_job_finished("heat_vaporization-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("heat_vaporization-{0}".format(float(sys.argv[1])))
        raise exception
