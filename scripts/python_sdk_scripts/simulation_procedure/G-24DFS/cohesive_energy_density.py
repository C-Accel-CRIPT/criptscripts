"""
Run script for analysis of cohesive energy density.
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
from simtk.unit import mole  # pylint: disable=no-name-in-module,import-error
from simtk.unit.constants import AVOGADRO_CONSTANT_NA  # pylint: disable=import-error

NA_CONST = AVOGADRO_CONSTANT_NA.value_in_unit(mole ** (-1))


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 2:
        print("Usage: python cohesive_energy_density.py temperature [K]")
        raise RuntimeError("Invalid cli args for cohesive_energy_density.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    set_job_running("cohesive_energy_density-{0}".format(temp))
    blocks = get_advanced_option("analysis")["cohesive_energy_density"]["blocks"]

    # bulk
    n_mols = get_nmols("bulk_npt-{0}.h5".format(temp))
    vol_liq = read_state_file("bulk_npt-{0}.dat".format(temp), "Box Volume (nm^3)")
    vol_liq_b = block_avg(vol_liq, blocks)
    u_liq = read_state_file(
        "bulk_npt-{0}.dat".format(temp), "Potential Energy (kJ/mole)"
    )
    u_liq_b = block_avg(u_liq, blocks)

    # gas
    u_gas = read_state_file("gas-{0}.dat".format(temp), "Potential Energy (kJ/mole)")
    u_gas_b = block_avg(u_gas, blocks)

    ecoh_b = (u_gas_b * n_mols - u_liq_b) / vol_liq_b
    ecoh_b *= 10**24 / NA_CONST  # MPa
    ecoh_avg = np.mean(ecoh_b)
    ecoh_std = np.std(ecoh_b)

    # Hildebrand solubility parameter (delta)
    delta_b = np.sqrt(ecoh_b)
    delta_avg = np.mean(delta_b)
    delta_std = np.std(ecoh_b)

    mpa_to_si = 1e6
    sqrtmpa_to_si = 1e3
    store_json(
        "cohesive energy density",
        [mpa_to_si * ecoh_avg],
        [mpa_to_si * ecoh_std],
        "kg m^-1 s^-2",
        temp,
        get_advanced_option("run")["npt"]["pressure"],
    )
    store_json(
        "Hildebrand solubility parameter",
        [sqrtmpa_to_si * delta_avg],
        [sqrtmpa_to_si * delta_std],
        "kg^0.5 m^-0.5 s^-1",
        temp,
        get_advanced_option("run")["npt"]["pressure"],
    )
    set_job_finished("cohesive_energy_density-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("cohesive_energy_density-{0}".format(float(sys.argv[1])))
        raise exception
