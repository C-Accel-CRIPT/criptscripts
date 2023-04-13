"""
Script the calculate the dipole moment during NPT runs for each of the individual residues.

Each residue determines its centroid and the dipole from this centroid is calculated with the partial charges of the force field.
Since the residues have no rotational correlation, we use the square of the dipole moment.
"""

import sys
import copy
import xml.etree.ElementTree as ET

import numpy as np
import mdtraj as md

from elwood.execute.analyze_util import block_avg, store_json
from elwood.execute.run_util import get_advanced_option, set_job_running, set_job_finished, set_job_error

from internal_distance import get_backbones

def get_charges(filename):
    """
    Parse the OpenMM forcefield XML to obtain the partial charges for all residues (including patches).
    """
    all_charges = {}
    tree = ET.parse(filename)
    for res in tree.getroot().find("Residues").findall("Residue"):
        charges = {}
        for atom in res.findall("Atom"):
            charges[atom.attrib["name"]] = atom.attrib["charge"]
        all_charges[res.attrib["name"]] = charges
        for patch in res.findall("AllowPatch"):
            patch_charges = copy.deepcopy(charges)
            for mod in tree.getroot().find("Patches").findall("Patch"):
                if mod.attrib["name"] == patch.attrib["name"]:
                    for add in mod.findall("AddAtom"):
                        patch_charges[add.attrib["name"]] = add.attrib["charge"]
                    for change in mod.findall("ChangeAtom"):
                        patch_charges[change.attrib["name"]] = change.attrib["charge"]
                all_charges[patch.attrib["name"]] = patch_charges
    return all_charges


def get_residue_atom_info(traj, all_charges, backbone_atom_idx=None):
    """
    Collect atom ids for the snapshots and charges in numpy array for faster computation.
    """
    res_atom_ids = []
    res_atom_q = []
    res_atom_bb = []
    for res in traj.topology.residues:
        ids = []
        charges = []
        bb =[]
        for atom in res.atoms:
            ids.append(atom.index)
            charges.append(all_charges[res.name][atom.name])
            if backbone_atom_idx and atom.index in backbone_atom_idx:
                bb.append(atom.index)
        res_atom_ids.append(np.asarray(ids))
        res_atom_q.append(np.asarray(charges))
        res_atom_bb.append(bb)

    return res_atom_ids, res_atom_q, res_atom_bb


def get_dipole_moment(positions, charges, bb_pos):
    """
    Utilize position and charges to calculcate the dipole moment.
    """
    positions = positions.astype(float)
    charges = charges.astype(float)
    centroid = np.mean(positions, axis=0)
    dipole = []
    for i in range(3):
        dipole.append(np.sum((positions-centroid)[:, i] * charges))
    dipole = np.asarray(dipole)
    dipole_norm = np.sqrt(np.sum(dipole**2))
    side_chain_vec = None
    bb_inner_product = None
    side_inner_product = None
    bb_theta = None
    side_phi = None
    if bb_pos is not None and len(bb_pos) == 2:
        bb_center = np.mean(bb_pos, axis=0)
        bb_vector = bb_pos[0] - bb_pos[1]
        bb_norm = np.sqrt(np.sum(bb_vector**2))
        bb_inner_product = np.dot(dipole, bb_vector)
        bb_theta = np.arccos(bb_inner_product/(dipole_norm * bb_norm))

        side_chain_vec = centroid - bb_center
        side_chain_vec_norm = np.sqrt(np.dot(side_chain_vec, side_chain_vec))
        side_inner_product = np.dot(dipole, side_chain_vec)
        side_phi = np.arccos(side_inner_product/(dipole_norm * side_chain_vec_norm))
    return dipole_norm**2, side_chain_vec_norm**2 , bb_inner_product, side_inner_product, bb_theta, side_phi


def main(argv):  # pylint: disable=too-many-locals
    """
    Main function to execute the analysis.
    """
    if len(argv) != 2:
        print("Usage: python bb_dipole.py temperature [K]")
        raise RuntimeError("Invalid cli args for bb_dipole.py")
    try:
        temp = float(argv[1])
    except ValueError as exception:
        print("Expected is a float convertible string for the temperature.")
        raise exception

    # set_job_running("squared_dipole_moment-{0}".format(temp))

    all_charges = get_charges("forcefield.xml")
    traj = md.load("bulk_npt-{0}.h5".format(temp))
    backbones = get_backbones(traj.topology)

    backbone_atom_idx = []
    for backb in backbones:
        for atom in backb:
            backbone_atom_idx.append(int(atom.index))

    res_atom_ids, res_atom_charges, res_atom_bb = get_residue_atom_info(traj, all_charges, backbone_atom_idx)

    dipole_norm = {}
    side_chain_norm = {}
    bb_inner_product = {}
    side_inner_product = {}
    bb_theta = {}
    side_phi = {}
    properties = [dipole_norm, side_chain_norm, bb_inner_product, side_inner_product, bb_theta, side_phi]
    names = ["squared dipole moment", "squared side chain length", "dot(BBvec, dipole)", "dot(BB-sideRcm, dipole)", "angle(BBvec, dipole)", "angle(BB-sideRcm, dipole)"]
    elementary_charge_times_nano_meter = 1.602176634e-19 * 1e-9  # C m
    unit_transfer = [elementary_charge_times_nano_meter**2, 1e-9**2, elementary_charge_times_nano_meter*1e-9, elementary_charge_times_nano_meter*1e-9, 1, 1]
    unit_name = ["m^2 C^2", "m^2", "m^2 C", "m^2 C", "Rad", "Rad"]
    for frame in traj:
        for res in traj.topology.residues:
            bb_pos = frame.xyz[0, res_atom_bb[res.index], :]
            value_bundle = get_dipole_moment(frame.xyz[0, res_atom_ids[res.index], :], res_atom_charges[res.index], bb_pos)

            for i in range(len(value_bundle)):
                if value_bundle[i]:
                    try:
                        properties[i][res.name].append(value_bundle[i])
                    except KeyError:
                        properties[i][res.name] = [value_bundle[i]]

    values = [[] for prop in properties]
    errors = [[] for prop in properties]

    res_names = []

    for res_name in sorted(properties[0].keys()):
        res_names.append(res_name)
        for i in range(len(properties)):
            if properties[i][res_name]:
                value_b = block_avg(properties[i][res_name],
                                    get_advanced_option("analysis")["squared dipole moment"]["blocks"],
                                    get_advanced_option("analysis")["squared dipole moment"]["block check"])
                values[i].append(np.mean(value_b) * unit_transfer[i])
                errors[i].append(np.std(value_b) * unit_transfer[i])
    for i in range(len(properties)):
        if len(values[i]) > 0:
            store_json(names[i], values[i], errors[i],
                       unit=unit_name[i], temperature=temp,
                       pressure=get_advanced_option("run")["npt"]["pressure"],
                       extra_val={"residue names": res_names})

    # set_job_finished("squared_dipole_moment-{0}".format(temp))


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("squared_dipole_moment-{0}".format(float(sys.argv[1])))
        raise exception
