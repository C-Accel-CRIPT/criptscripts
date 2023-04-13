"""
Run script for analysis of the internal distances
"""
import sys

import matplotlib.pyplot as plt  # pylint: disable=import-error
import mdtraj as md  # pylint: disable=import-error
import networkx as nx
import numpy as np  # pylint: disable=import-error
from elwood.execute.analyze_util import plot_data_to_str, savefig, store_json
from elwood.execute.run_util import (
    get_advanced_option,
    set_job_error,
    set_job_finished,
    set_job_running,
)
from elwood.system.rdkit_utils import GLOB_NAMES
from scipy.spatial.distance import pdist  # pylint: disable=import-error

import elwood  # pylint: disable=unused-import # noqa: F401


def get_backbones(topo):
    """
    Do some graph magic to obtain the backbone of the molecule (if there is any).
    """
    h_atoms = []
    for atom in topo.atoms:
        if str(atom.element) == "hydrogen":
            h_atoms.append(atom)

    graph = topo.to_bondgraph()
    graph.remove_nodes_from(h_atoms)
    components = nx.connected_components(graph)

    backbones = []

    for component in list(components):
        subgraph = graph.subgraph(component)
        start = None
        end = None
        for node in subgraph.nodes():
            name = str(node).split("-")[1]
            if name.strip() == GLOB_NAMES["Alpha Carbon Name"].strip():
                if start is None or node.index > start.index:
                    start = node
            if name.strip() == GLOB_NAMES["Beta Carbon Name"].strip():
                if end is None or node.index < end.index:
                    end = node
        if start is not None and end is not None:
            backbones.append(
                nx.shortest_path(subgraph, end, start)
            )  # pylint: disable=too-many-function-args
        else:
            print("cannot find backbone")

    return backbones


def add_internal_distance(frame, backbones, rn_list):
    """
    Calculate internal distances for within a frame and add result to rn_list.
    """

    def get_dist_indices(length):
        """
        Helper function to obtain index distance for scipy.pdist.
        """
        indices = np.triu_indices(length, 1)
        n_first = indices[0]
        del indices
        n_first = n_first.astype(np.uint16)
        indices = np.triu_indices(length, 1)
        n_second = indices[1]
        del indices
        n_second = n_second.astype(np.uint16)

        dist_idx = n_second - n_first
        del n_first
        del n_second
        return dist_idx

    for backb in backbones:
        idxs = []
        for atom in backb:
            idxs.append(atom.index)
        distance = pdist(frame.xyz[0, idxs, :], "euclidean")
        distance = distance.astype(np.float32)
        distance = distance**2

        dist_idx = get_dist_indices(len(backb))
        for i in range(len(backb)):
            current_n = i + 1
            current_distance = distance[dist_idx == current_n]
            for dist in current_distance:
                rn_list[i].append(dist)

    return rn_list


def initial_distances(backbones):
    """
    Initialize the array of arrays for the backbones.
    """
    list_list = []
    for backb in backbones:
        while len(list_list) < len(backb):
            list_list.append([])
    list_list.pop(0)
    return list_list


def plot_rn(temp, rn_mean, rn_std, cinfty=None):
    """
    Plot the results.
    """

    def frc_rn(x_n, lmono, cinfty):
        return (x_n - 1) * lmono**2 * cinfty

    fig, axes = plt.subplots()
    axes.set_xlabel("$n$ #C-BB-atoms")
    axes.set_ylabel("$R(n)^2/n$  [nm$^2$]")

    x_n = np.asarray(range(1, len(rn_mean) + 1))
    axes.errorbar(x_n, rn_mean / x_n, yerr=rn_std / x_n, capsize=3, label="data")

    attachment_string = ""
    if cinfty:
        attachment_string += "# cinfty {0}\n".format(cinfty)
        lmono = np.sqrt(rn_mean[0])
        axes.plot(x_n, frc_rn(x_n, lmono, cinfty) / x_n, "--", label="FRC fit")
        axes.legend(loc="best")

    attachment_string += plot_data_to_str(
        (rn_mean, rn_std), "R(n)^2 nm^2\t std of R(n)^2 nm^2"
    )

    savefig(fig, attachment_string, "internal_distance-{0}.pdf".format(temp))
    plt.close(fig)


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

    set_job_running("internal_distance-{0}".format(temp))
    traj = md.load("bulk_npt-{0}.h5".format(temp))
    backbones = get_backbones(traj.topology)
    if len(backbones) == 0:
        return
    rn_list = initial_distances(backbones)

    for frame in traj:
        rn_list = add_internal_distance(frame, backbones, rn_list)

    rn_mean = np.zeros(len(rn_list))
    rn_std = np.zeros(len(rn_list))
    for i in range(len(rn_list)):  # pylint: disable=consider-using-enumerate
        if len(rn_list[i]) > 0:
            rn_mean[i] = np.mean(rn_list[i])
            rn_std[i] = np.std(rn_list[i])

    nm2tom2 = 1e-18
    store_json(
        "squared internal distances",
        list(rn_mean * nm2tom2),
        list(rn_std * nm2tom2),
        "m^2",
        temp,
        get_advanced_option("run")["equilibrate"]["pressure"],
    )
    plot_rn(temp, rn_mean, rn_std, None)
    set_job_finished("internal_distance-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("internal_distance-{0}".format(float(sys.argv[1])))
        raise exception
