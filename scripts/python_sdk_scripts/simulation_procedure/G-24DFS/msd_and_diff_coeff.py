"""
Run script for analysis of mean squared displacement and diffusion coefficient
"""
import sys

import matplotlib.pyplot as plt  # pylint: disable=import-error
import numpy as np  # pylint: disable=import-error
from elwood.execute.analyze_util import (
    AnalysisHandle,
    get_ana_value,
    plot_data_to_str,
    read_mol_com,
    savefig,
    store_json,
)
from elwood.execute.run_util import (
    get_advanced_option,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from scipy.optimize import curve_fit  # pylint: disable=import-error
from scipy.stats import pearsonr  # pylint: disable=import-error

import elwood  # pylint: disable=unused-import # noqa: F401


class DiffusionParameter:
    """
    Helper class to store the relevant parameter of the diffusion fitting.
    """

    def __init__(self, diffusion_const, diffusion_err, offset, r_value, p_value):
        """
        Initialize all important parameter.
        """
        self.diff_coeff = diffusion_const
        self.diff_coeff_err = diffusion_err
        self.offset = offset
        self.r_value = r_value
        self.p_value = p_value


def fitting(msd):
    """
    Fit the msd curve to get diffusion coeff.
    """
    from_frac = get_advanced_option("analysis")["msd_and_diff_coeff"]["from-fraction"]
    to_frac = get_advanced_option("analysis")["msd_and_diff_coeff"]["to-fraction"]
    n_frame = len(msd)
    n_start = int(n_frame * from_frac)
    n_end = int(n_frame * to_frac)
    popt, pcov = curve_fit(
        lambda x, D, offset: 6 * D * x + offset,
        msd[n_start:n_end, 0],
        msd[n_start:n_end, 1],
    )  # pylint: disable=unbalanced-tuple-unpacking
    perr = np.sqrt(np.diag(pcov))
    diff_coeff = popt[0]  # angstrom^2 / ps
    diff_coeff_err = perr[0]

    r_value, p_value = pearsonr(msd[n_start:n_end, 0], msd[n_start:n_end, 1])
    result = DiffusionParameter(diff_coeff, diff_coeff_err, popt[1], r_value, p_value)
    return result


def plot(msd, diff_param, temp):
    """
    Plot the fitting result.
    """
    from_frac = get_advanced_option("analysis")["msd_and_diff_coeff"]["from-fraction"]
    to_frac = get_advanced_option("analysis")["msd_and_diff_coeff"]["to-fraction"]
    n_frame = len(msd)
    n_start = int(n_frame * from_frac)
    n_end = int(n_frame * to_frac)

    fig, axes = plt.subplots(1)
    attachment_string = ""
    axes.plot(msd[:, 0], msd[:, 1], "b.", label="data")
    axes.plot(
        msd[n_start:n_end, 0], msd[n_start:n_end, 1], "g.", label="data for fitting"
    )
    attachment_string += "# diffusion coeficient = {0} angstrom^2/ps\n".format(
        diff_param.diff_coeff
    )
    attachment_string += "# fit R-value = {0}\n".format(diff_param.r_value)
    attachment_string += "# fit P-value = {0}\n".format(diff_param.p_value)
    attachment_string += plot_data_to_str(
        (msd[:, 0], msd[:, 1]), "t [ps]\t msd [angstrom^2]"
    )
    fit_data = msd[:, 0] * 6 * diff_param.diff_coeff + diff_param.offset
    axes.plot(msd[:, 0], fit_data, "r--", label="fit")
    axes.legend(loc="best")

    axes.set_xlabel(r"$\mathrm{time \/ [ps]}$")
    axes.set_ylabel(r"$\mathrm{msd \/ [\AA^{2}]}$")
    axes.set_xlim(left=0)
    axes.set_ylim(bottom=0)
    savefig(fig, attachment_string, "msd-{0}.pdf".format(temp))
    plt.close(fig)


def write_msd_results(diff_param, temp, msd):
    """
    Function to store MSD results.
    """

    angstrom2ps_to_m2s = 1e-8
    extra_vals = {"fit-r-value": diff_param.r_value, "fit-p-value": diff_param.p_value}
    warnings = validate_result(msd, temp, diff_param)
    store_json(
        "diffusion coefficient",
        [angstrom2ps_to_m2s * diff_param.diff_coeff],
        [angstrom2ps_to_m2s * diff_param.diff_coeff_err],
        "m^2 s^-1",
        temp,
        get_advanced_option("run")["equilibrate"]["pressure"],
        warnings=warnings,
        extra_val=extra_vals,
    )


def validate_result(msd, temp, diff_param):
    """
    Validate the MSD result and issue warning otherwise.
    """
    r_threshold = get_advanced_option("analysis")["msd_and_diff_coeff"]["r-threshold"]
    warnings = []
    if diff_param.r_value < r_threshold:
        warn_msg = "The r-value {0} of MSD fit is ".format(diff_param.r_value)
        warn_msg += "below the threshold {0}. ".format(r_threshold)
        warn_msg += "The diffusion coefficient "
        warn_msg += "is most likely not accurate."
        sys.stderr.write(warn_msg + "\n")
        warnings.append(warn_msg)

    with AnalysisHandle(".", False) as ana:
        try:
            for warn_msg in ana["WARNINGS"]:
                if warn_msg.find("unwrap coords with HDF5 isn't") >= 0:
                    warnings.append(warn_msg)
        except KeyError:
            pass

        sq_rg = get_ana_value(
            "square radius of gyration",
            temp,
            get_advanced_option("run")["npt"]["pressure"],
            ana,
        )[0]

    sq_rg *= 1e20  # convert m^2 -> angstrom^2
    rg_warn_factor = get_advanced_option("analysis")["msd_and_diff_coeff"][
        "rg-warn-factor"
    ]
    msd_max = np.max(msd[:, 1])
    if msd_max < sq_rg * rg_warn_factor:
        warn_msg = "The max value {0} angstrom^2 of the MSD is ".format(msd_max)
        warn_msg += "smaller than threshold {0} x Rg^2 {1} angstrom^2. ".format(
            rg_warn_factor, sq_rg
        )
        warn_msg += "The diffusion coefficient "
        warn_msg += "might not be accurate."
        sys.stderr.write(warn_msg + "\n")
        warnings.append(warn_msg)

    return warnings


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 2:
        print("Usage: python msd_and_diff_coeff.py temperature [K]")
        raise RuntimeError("Invalid cli args for msd_and_diff_coeff.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    set_job_running("msd_and_diff_coeff-{0}".format(temp))
    run_options = get_advanced_option("run")
    time_frame = run_options["dt"] * run_options["nvt"]["traj-frequency"]

    mol_com = read_mol_com("bulk_nvt-{0}.h5".format(temp))
    n_frame = len(mol_com)
    report = 0
    msd = []
    for dframe in range(1, n_frame):
        # calculate dr**2 for each (frame, frame + dframe) pairs of frames
        dr2 = np.sum((mol_com[dframe:] - mol_com[:-dframe]) ** 2, axis=2)

        # average among all (frame, frame + dframe) pairs
        dr2 = np.mean(dr2, axis=0)

        # average among all molecules
        dr2 = np.mean(dr2)

        msd.append([dframe * time_frame, dr2])

        if dframe * 100 / (n_frame - 1) >= report:
            print("Analyzing {0}%".format(report))
            report += 10

    msd = np.array(msd)
    diff_param = fitting(msd)
    plot(msd, diff_param, temp)

    write_msd_results(diff_param, temp, msd)
    set_job_finished("msd_and_diff_coeff-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("msd_and_diff_coeff-{0}".format(float(sys.argv[1])))
        raise exception
