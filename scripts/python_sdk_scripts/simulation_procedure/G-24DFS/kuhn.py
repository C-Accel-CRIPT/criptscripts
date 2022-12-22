"""
Run script for analysis of Kuhn segments of polymers.
"""
# pylint: disable=invalid-name
# flake8: noqa=E741
import sys

import numpy as np  # pylint: disable=import-error
from elwood.execute.analyze_util import AnalysisHandle, get_ana_value, store_json
from elwood.execute.run_util import (
    get_advanced_option,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from internal_distance import plot_rn
from scipy.optimize import curve_fit  # pylint: disable=import-error


class KuhnLength:
    """
    Class to fit and store kuhn length measurements
    """

    def __init__(self, rn, rn_err, cut_points):
        def rn_theo(n, l, cinfty):
            rn = (n - 1) * l**2 * cinfty
            return rn / n

        n = np.asarray(range(1, len(rn) + 1))
        l = np.sqrt(rn[0])
        l_err = np.sqrt(rn_err[0] / len(rn))
        popt, pcov, = curve_fit(
            lambda n, cinfty: rn_theo(
                n, l, cinfty
            ),  # pylint: disable=unbalanced-tuple-unpacking
            n[cut_points:],
            rn[cut_points:] / n[cut_points:],
        )
        self.cinfty = popt[0]
        self.cinfty_err = np.sqrt(pcov[0, 0])

        self.b_kuhn = l * self.cinfty
        self.b_kuhn_err = np.sqrt(
            (l * self.cinfty_err) ** 2 + (self.cinfty * l_err) ** 2
        )

        Re2 = self.cinfty * (n[-1] - 1) * l**2
        Re2_err = np.sqrt(
            (Re2 / self.cinfty * self.cinfty_err) ** 2 + (2 * Re2 / l * l_err) ** 2
        )

        N_kuhn = Re2 / self.b_kuhn**2 + 1
        N_kuhn_err = np.sqrt(
            (N_kuhn / Re2 * Re2_err) ** 2
            + (0.5 * Re2 / self.b_kuhn * self.b_kuhn_err) ** 2
        )

        self.N_monomers = n[-1] / N_kuhn
        self.N_monomers_err = self.N_monomers / N_kuhn * N_kuhn_err

    def store_json(self, temperature, pressure):
        """
        Store the measured results in elwood analysis.
        """
        store_json(
            "kuhn length", [self.b_kuhn], [self.b_kuhn_err], "m", temperature, pressure
        )
        store_json(
            "c infinity", [self.cinfty], [self.cinfty_err], "1", temperature, pressure
        )
        store_json(
            "monomers per kuhn segment",
            [self.N_monomers],
            [self.N_monomers_err],
            "1",
            temperature,
            pressure,
        )


def main(argv):
    """
    Main function handling execution of the scirpt.
    """
    if len(argv) != 2:
        print("Usage: python kuhn.py temperature [K]")
        raise RuntimeError("Invalid cli args for kuhn.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    set_job_running("kuhn-{0}".format(temp))
    run_options = get_advanced_option("run")
    ana_options = get_advanced_option("analysis")["kuhn"]

    with AnalysisHandle(".", True) as ana:
        measurement = get_ana_value(
            "squared internal distances",
            temp,
            run_options["equilibrate"]["pressure"],
            ana,
        )

        # Tolerate old misspelled name
        if not measurement:
            measurement = get_ana_value(
                "spuared internal distances",
                temp,
                run_options["equilibrate"]["pressure"],
                ana,
            )
    if not measurement:
        raise RuntimeError("Unable to extract internal distances from analysis file")
    rn = measurement[0]
    rn_err = measurement[1]
    # prepare to only use every second as to use monomers instead of C-backbone atoms
    rn_mono = rn[::2]
    rn_mono_err = rn_err[::2]

    if len(rn_mono) - ana_options["cut-data-points"] < ana_options["min-fit-points"]:
        print(
            "Unable to fit Kuhn length, since not sufficient data points are available from the internal distance analysis."
        )
        return

    kuhn = KuhnLength(rn_mono, rn_mono_err, ana_options["cut-data-points"])
    kuhn.store_json(temp, run_options["equilibrate"]["pressure"])
    # The cinfty of this fit is for monomers, the internal distance plot expects a BB atom distance cinfty.
    # 2 C-C atoms form a monomer, so we divide cinfty by 2.
    plot_rn(temp, rn, rn_err, kuhn.cinfty / 2)

    set_job_finished("kuhn-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("kuhn-{0}".format(float(sys.argv[1])))
        raise exception
