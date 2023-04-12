"""
Run script for analysis of diffusion activation energy
"""
import sys

import matplotlib.pyplot as plt  # pylint: disable=import-error
import numpy as np  # pylint: disable=import-error
from elwood.execute.analyze_util import (
    AnalysisHandle,
    get_ana_value,
    plot_data_to_str,
    savefig,
    store_json,
)
from elwood.execute.run_util import (
    get_advanced_option,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from elwood.json_handle import StatusHandle
from scipy.optimize import curve_fit  # pylint: disable=import-error
from scipy.stats import pearsonr  # pylint: disable=import-error
from simtk.unit import (  # pylint: disable=no-name-in-module,import-error
    joule,
    kelvin,
    mole,
)
from simtk.unit.constants import MOLAR_GAS_CONSTANT_R  # pylint: disable=import-error

import elwood  # pylint: disable=unused-import # noqa: F401

R_CONST = MOLAR_GAS_CONSTANT_R.value_in_unit(joule / mole / kelvin)


class FittingResults:
    """
    Helper class to store the fitting results.
    """

    def __init__(
        self,
        activation_energy,
        activation_energy_err,
        diff_0,
        diff_0_err,
        r_value,
        p_value,
    ):
        """
        Initialize all important parameter.
        """
        self.activation_energy = activation_energy
        self.activation_energy_err = activation_energy_err
        self.diff_0 = diff_0
        self.diff_0_err = diff_0_err
        self.r_value = r_value
        self.p_value = p_value


def fitting(data):
    """
    Fit the diffusion coefficient data to obtain the activation energy
    """
    popt, pcov = curve_fit(
        lambda x, a, b: x * a + b, data[:, 0], data[:, 1], sigma=data[:, 2]
    )  # pylint: disable=unbalanced-tuple-unpacking
    perr = np.sqrt(np.diag(pcov))
    r_value, p_value = pearsonr(data[:, 0], data[:, 1])

    activation_energy = -popt[0] * R_CONST / np.log10(np.e)
    activation_energy_err = perr[0] * R_CONST / np.log10(np.e)
    diff_0 = 10 ** popt[1]
    diff_0_err = diff_0 * np.log(10) * perr[1]
    return FittingResults(
        activation_energy, activation_energy_err, diff_0, diff_0_err, r_value, p_value
    )


def validate_result(fitting_result):
    """
    Validate the fitting results
    """
    r_threshold = get_advanced_option("analysis")["diffusion_activation_energy"][
        "r-threshold"
    ]
    if fitting_result.r_value > r_threshold:
        warn_msg = "The r-value {0} of diffusion activation energy fit is ".format(
            fitting_result.r_value
        )
        warn_msg += "above the threshold {0}. ".format(r_threshold)
        sys.stderr.write(warn_msg + "\n")
        return [warn_msg]
    return None


def plot(data, fitting_result):
    """
    plot the results
    """
    fig, axes = plt.subplots(1)
    axes.errorbar(
        data[:, 0],
        data[:, 1],
        yerr=data[:, 2],
        marker="o",
        color="r",
        ls="none",
        label="data",
    )
    xfit = np.linspace(np.min(data[:, 0]) * 0.98, np.max(data[:, 0]) * 1.02, 10)
    yfit = (
        np.log10(fitting_result.diff_0)
        - fitting_result.activation_energy * np.log10(np.e) / R_CONST * xfit
    )
    axes.plot(xfit, yfit, ls="--", color="r", label="fit")

    attachment_string = "# diffusion activation energy = {0} J/mol\n".format(
        fitting_result.activation_energy
    )
    attachment_string += "# fit R-value = {0}\n".format(fitting_result.r_value)
    attachment_string += "# fit P-value = {0}\n".format(fitting_result.p_value)
    attachment_string += plot_data_to_str(
        data, "1/T [1/K]\tlgD [lg(m^2/s)]\tlgD_err [lg(m^2/s)]"
    )

    axes.legend(loc="best")
    axes.set_xlabel(r"$\mathrm{1/T \/ [1/K]}$")
    axes.set_ylabel(r"$\mathrm{lg(D)}$")
    savefig(fig, attachment_string, "diffusion_activation_energy.pdf")
    plt.close(fig)


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 1:
        print("Usage: python diffusion_activation_energy.py")
        raise RuntimeError("Invalid cli args for diffusion_activation_energy.py")

    set_job_running("diffusion_activation_energy")

    temps = []
    with StatusHandle(".", True) as stat:
        temps = stat["temperature"]

    data = []
    if len(temps) < 3:
        warn_msg = "At least three bulk simulations at different temperatures are required to obtain "
        warn_msg += "the diffusion activation energy."
        sys.stderr.write(warn_msg + "\n")
        with AnalysisHandle(".", False) as ana:
            ana.add_warning(warn_msg)
    else:
        with AnalysisHandle(".", True) as ana:
            for temp in temps:
                val = get_ana_value(
                    "diffusion coefficient",
                    temp,
                    get_advanced_option("run")["equilibrate"]["pressure"],
                    ana,
                )
                if val:
                    diff = val[0]
                    diff_err = val[1]
                    data.append(
                        [1.0 / temp, np.log10(diff), diff_err / diff / np.log(10)]
                    )

    if len(data) > 0:
        data = np.array(data)
        fitting_result = fitting(data)
        warnings = validate_result(fitting_result)
        plot(data, fitting_result)

        extra_vals = {
            "fit-r-value": fitting_result.r_value,
            "fit-p-value": fitting_result.p_value,
            "temperature range": [np.min(temps), np.max(temps)],
        }
        store_json(
            "diffusion activation energy",
            [fitting_result.activation_energy],
            [fitting_result.activation_energy_err],
            "J mol^-1",
            None,
            get_advanced_option("run")["equilibrate"]["pressure"],
            warnings=warnings,
            extra_val=extra_vals,
        )
    set_job_finished("diffusion_activation_energy")


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("diffusion_activation_energy")
        raise exception
