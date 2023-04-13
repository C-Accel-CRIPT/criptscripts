"""
Run script for analysis of glass transition temperature
"""
import sys

import matplotlib.pyplot as plt  # pylint: disable=import-error, wrong-import-order
import numpy as np  # pylint: disable=import-error, wrong-import-order
from elwood.execute.analyze_util import (
    plot_data_to_str,
    read_state_file,
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
from scipy.optimize import curve_fit  # pylint: disable=import-error, wrong-import-order

import elwood  # pylint: disable=unused-import # noqa: F401


class GlassTransition:
    """
    Fit the glass transition temperature from a quench run.
    """

    def __init__(self, start_temp, end_temp, name):
        self.name = name

        ana_options = get_advanced_option("analysis")["glass_transition"]
        state_file = "quench-{0}-{1}.dat".format(start_temp, end_temp)
        self.rho = read_state_file(state_file, "Density (g/mL)")
        self.temp = read_state_file(state_file, "Temperature (K)")

        low_temp = min(start_temp, end_temp)
        high_temp = max(start_temp, end_temp)
        init_tgs = np.linspace(
            low_temp + ana_options["init_low"],
            high_temp - ana_options["init_high"],
            ana_options["init_num"],
        )

        p0_low = (ana_options["p0_slope_low"], ana_options["p0_intercept_low"])
        p0_high = (ana_options["p0_slope_high"], ana_options["p0_intercept_high"])
        self._fitting(init_tgs, p0_low, p0_high)

    def _fitting(self, init_tgs, p0_low, p0_high):
        """
        Fit the rho-temp curve to get glass transition temperature
        """
        error = []
        fits = []
        for init_tg in init_tgs:
            mask = self.temp <= init_tg
            popt1, _ = curve_fit(
                fit_func, self.temp[mask], self.rho[mask], p0=p0_low
            )  # pylint: disable=unbalanced-tuple-unpacking
            y_hat = fit_func(self.temp[mask], *popt1)
            yerr = np.sum((self.rho[mask] - y_hat) ** 2)

            mask = self.temp >= init_tg
            popt2, _ = curve_fit(
                fit_func, self.temp[mask], self.rho[mask], p0=p0_high
            )  # pylint: disable=unbalanced-tuple-unpacking
            y_hat = fit_func(self.temp[mask], *popt2)
            yerr += np.sum((self.rho[mask] - y_hat) ** 2)

            error.append(yerr)
            fits.append(
                {
                    "popt1": popt1,
                    "popt2": popt2,
                    "Tg": (popt2[1] - popt1[1]) / (popt1[0] - popt2[0]),
                }
            )

        min_i = np.argmin(error)

        self.best = fits[min_i]["Tg"]
        self.popt1 = fits[min_i]["popt1"]
        self.popt2 = fits[min_i]["popt2"]


def fit_func(x_var, a_var, b_var):
    """
    Linear fitting function
    """
    return a_var * x_var + b_var


def plot(tgs, plot_range):
    """
    Plot the fitting result.
    """

    fig, axes = plt.subplots(1)
    attachment_string = ""
    for glass_temp in tgs:
        axes.plot(glass_temp.temp, glass_temp.rho, ".", label=glass_temp.name + " data")

        mask1 = glass_temp.temp <= glass_temp.best + plot_range[0]
        y_hat1 = glass_temp.popt1[0] * glass_temp.temp[mask1] + glass_temp.popt1[1]
        mask2 = glass_temp.temp >= glass_temp.best - plot_range[1]
        y_hat2 = glass_temp.popt2[0] * glass_temp.temp[mask2] + glass_temp.popt2[1]
        (line,) = axes.plot(
            glass_temp.temp[mask1], y_hat1, "--", label=glass_temp.name + " fit"
        )
        axes.plot(glass_temp.temp[mask2], y_hat2, "--", color=line.get_color())
        ymin = axes.get_ylim()[0]

        axes.vlines(
            glass_temp.best,
            ymin=ymin,
            ymax=fit_func(glass_temp.best, *glass_temp.popt1),
            linestyle="--",
            color="k",
            zorder=100,
        )
        axes.text(
            glass_temp.best + 5,
            glass_temp.popt1[0] * glass_temp.best + glass_temp.popt1[1] + 0.01,
            r"$\mathrm{T_{g} = %.2f K}$" % glass_temp.best,
        )

        attachment_string += "# {0} Glass_Temp = {1} K\n".format(
            glass_temp.name, glass_temp.best
        )
        attachment_string += plot_data_to_str(
            (glass_temp.temp, glass_temp.rho),
            glass_temp.name + " temperature [K]\t density [g/cm^{3}]",
        )

    axes.legend(loc="best")

    axes.set_xlabel(r"$\mathrm{Temperature \/ [K]}$")
    axes.set_ylabel(r"$\mathrm{Density \/ [g/cm^{3}]}$")
    axes.set_ylim(bottom=ymin)
    savefig(fig, attachment_string, "Tg.pdf")
    plt.close(fig)


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 1:
        print("Usage: python glass_transition.py")
        raise RuntimeError("Invalid cli args for glass_transition.py")

    set_job_running("glass_transition")

    with StatusHandle(".", True) as status:
        high_temp = status["max_temperature"]
        low_temp = status["min_temperature"]

    tg_cool = GlassTransition(high_temp, low_temp, "cooling")
    tg_heat = GlassTransition(low_temp, high_temp, "heating")

    ana_options = get_advanced_option("analysis")["glass_transition"]
    plot_range = (ana_options["plot_low"], ana_options["plot_high"])
    plot((tg_cool, tg_heat), plot_range)

    best_tg = []
    best_tg.append(tg_cool.best)
    best_tg.append(tg_heat.best)
    best_tg = np.asarray(best_tg)

    store_json(
        "glass transition temperature",
        [best_tg.mean()],
        [best_tg.std()],
        "K",
        None,
        get_advanced_option("run")["quench"]["pressure"],
    )
    set_job_finished("glass_transition")


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("glass_transition")
        raise exception
