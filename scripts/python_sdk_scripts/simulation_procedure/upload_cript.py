#!/usr/bin/env python

import os
import sys
import json

import cript

GET_LEVEL=1
UPDATE_EXISTING=False

from rdkit import Chem
import rdkit.Chem.Descriptors
import numpy as np

from collections import namedtuple

def get_auto_runtime(uid, opt):
    steps = 0
    for filename in os.listdir(uid):
        if filename.startswith("auto_equilibrate") and filename.endswith(".out"):
            with open(os.path.join(uid, filename), "r") as file_handle:
                for line in file_handle:
                    if line[0].isnumeric():
                        steps += 1
    return steps*opt["run"]["auto_equilibrate"]["time-per-step"]


def get_molweights(uid):

    weights = []
    with open(os.path.join(uid, "molecules.smi"), "r") as file_handle:
        for line in file_handle:
            line = line.strip()
            mol = Chem.MolFromSmiles(line)
            mol = Chem.AddHs(mol)
            weights.append(Chem.Descriptors.ExactMolWt(mol))
        # Last line is without bonds
        weights = np.asarray(weights)[:-1]
    Mn = weights.mean()
    Mw = np.average(weights, weights=weights)
    return Mn, Mw

def get_big_smiles(elwood_smi):
    if "<" not in elwood_smi:
        return elwood_smi
    assert ">" in elwood_smi
    strip_smi = elwood_smi[elwood_smi.find("<")+1:elwood_smi.find(">")]
    split_smi = strip_smi.split("|")
    for i in range(len(split_smi)):
        if split_smi[i].find("%") > 0:
            split_smi[i] = split_smi[i][:split_smi[i].find("%")]
        split_smi[i] = split_smi[i].replace("C=C", "(C[$])C([$])",1)

    big_smiles = "{[] "
    for mono in split_smi:
        big_smiles += mono+", "
    big_smiles = big_smiles[:-2]
    big_smiles += " []}"
    return big_smiles


def get_cript(uid):
    try:
        proj = cript.Project.create(name="Monomeric sidechain dipole orientation and its effect on microphase separation: experiment and simulation via structural isomer variation")
    except cript.data_model.exceptions.UniqueNodeError:
        proj = cript.Project.get(name="Monomeric sidechain dipole orientation and its effect on microphase separation: experiment and simulation via structural isomer variation", get_level=GET_LEVEL)
    try:
        coll = cript.Collection.create(name="3-mer simulations", project=proj, update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError:
        coll = cript.Collection.get(name="3-mer simulations", get_level=GET_LEVEL)
    try:
        # expt = cript.Experiment.get(name=uid)
        expt = cript.Experiment.get(collection=coll.uid, name="testasdf", get_level=GET_LEVEL)
    except ValueError:
        # expt = cript.Experiment.get(collection=coll, name=uid)
        expt = cript.Experiment.create(collection=coll, name="testasdf")
        expt.save(GET_LEVEL, update_existing=UPDATE_EXISTING)

    return proj, expt

def get_prepare(proj, expt, uid, ana):
    python = cript.Software.get(name = "python", version = "3.9", get_level=GET_LEVEL)
    try:
        elwood = cript.Software.get(name = "elwood", version = ana["elwood-version"], get_level=GET_LEVEL)
    except ValueError:
        elwood = cript.Software(name = "elwood", version = ana["elwood-version"], group=proj.group)
        elwood.save(GET_LEVEL, update_existing=UPDATE_EXISTING)
    try:
        rdkit_soft = cript.Software.get(name = "rdkit", version = "2021.9", get_level=GET_LEVEL)
    except ValueError:
        rdkit_soft = cript.Software(name = "rdkit", version = "2021.9", group=proj.group)
        rdkit_soft.save(GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        packmol = cript.Software.get(name = "Packmol", source = "http://m3g.iqm.unicamp.br/packmol", version = None, get_level=GET_LEVEL)
    except ValueError:
        packmol = cript.Software(name = "Packmol", source = "http://m3g.iqm.unicamp.br/packmol", version = None, group=proj.group)
        packmol.save(GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        openmm = cript.Software.get(name = "openmm", version = "7.5", get_level=GET_LEVEL)
    except ValueError:
        openmm = cript.Software.get(name = "openmm", version = "7.5", group=proj.group, get_level=GET_LEVEL)
        openmm.save(GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        ligpargen = cript.Software.get(name="ligpargen", version="2.3", get_level=GET_LEVEL)
    except ValueError:
        ligpargen = cript.Software(name="ligpargen", version="2.3", source = "https://github.com/leelasd/LigParGen_2.3", group=proj.group)
        ligpargen.save(GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        boss = cript.Software.get(name="BOSS", version="4.9", get_level=GET_LEVEL)
    except ValueError:
        boss = cript.Software(name="BOSS", version="4.9", group=proj.group)
        boss.save(GET_LEVEL, update_existing=UPDATE_EXISTING)

    python_config = cript.SoftwareConfiguration(software=python)
    rdkit_config = cript.SoftwareConfiguration(software=rdkit_soft)
    ligpargen_config = cript.SoftwareConfiguration(software=ligpargen)
    boss_config = cript.SoftwareConfiguration(software=boss)
    #openmm_config = cript.SoftwareConfiguration(software = openmm, algorithms = [cript.Algorithm(key="energy_minimization", type="initialization")])
    openmm_config = cript.SoftwareConfiguration(software = openmm, algorithms = [cript.Algorithm(key="ris", type="initialization")])
    # alg = cript.Algorithm(key="molecule_packing", type="initialization",parameters = [
    #     cript.Parameter(key="maxit", value=50),
    #     cript.Parameter(key="nloop", value=10),
    #     cript.Parameter(key="tolerance", value=4.0, unit="angstrom"),
    # ])
    alg = cript.Algorithm(key="ris", type="initialization",parameters = [
        cript.Parameter(key="damping_time", value=50, unit="second"),
        cript.Parameter(key="damping_time", value=10, unit="second"),
        cript.Parameter(key="cutoff_distance", value=4.0, unit="angstrom"),
    ])


    packmol_config = cript.SoftwareConfiguration(software = packmol )
    packmol_config.add_algorithm(alg)

    elwood_reference = cript.Reference.get(doi="10.1039/D2ME00137C", get_level=GET_LEVEL)
    elwood_citation = cript.Citation(elwood_reference)


    elwood_config = cript.SoftwareConfiguration(software=elwood,
                                                algorithms= [
                                                    # cript.Algorithm(key="+forcefield_assignment",type="initialization",
                                                    cript.Algorithm(key="ris",type="initialization",
                                                                    parameters = [
                                                                        #cript.Parameter(key="+global-seed", value=ana["global-seed"]),
                                                                        cript.Parameter(key="damping_time", value=GET_LEVEL, unit="second"),
                                                                        #cript.Parameter(key="+cm1a_charges", value=status["cm1a_charges"]),
                                                                        cript.Parameter(key="damping_time", value=GET_LEVEL, unit="second"),
                                                                        #cript.Parameter(key="+charge_opt_lvl", value=status["charge_opt_lvl"]),
                                                                        cript.Parameter(key="damping_time", value=GET_LEVEL, unit="second"),
                                                                        #cript.Parameter(key="+lbcc", value=status["lbcc"])
                                                                        cript.Parameter(key="damping_time", value=GET_LEVEL, unit="second"),
                                                                    ],
                                                                    ),
                                                ],
                                                citations = [elwood_citation]
                                                )
    try:
        prepare = cript.Computation.create(
            experiment = expt,
            name = "Initial snapshot and force-field generation",
            type = "initialization",
            citations = [elwood_citation],
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
        prepare.add_software_configuration(python_config)
        prepare.add_software_configuration(rdkit_config)
        prepare.add_software_configuration(ligpargen_config)
        prepare.add_software_configuration(packmol_config)
        prepare.add_software_configuration(openmm_config)
        prepare.add_software_configuration(elwood_config)
        prepare.add_software_configuration(boss_config)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        print("asdf", exc.existing_url)
        prepare = cript.Computation.get(url=exc.existing_url, get_level=0)
        print(prepare)
    prepare.save(1, update_existing=UPDATE_EXISTING)

    try:
        packing_file = cript.File.create(project=proj, source=os.path.join(uid, "init_bulk.pdb"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        packing_file = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)
    try:
        packing_data = cript.Data.create(experiment=expt, name=f"Loosely packed chains for {uid}",
                                         type="computation_config", files=[packing_file],
                                         computations = [prepare],
                                         notes= "PDB file without topology describing an initial system.", update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        packing_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)

    try:
        forcefield_file = cript.File.create(project=proj, source=os.path.join(uid, "forcefield.xml"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        forcefield_file = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)
    try:
        forcefield_data = cript.Data.create(
            experiment = expt,
            name = "OpenMM forcefield",
            type = "computation_forcefield",
            files = [forcefield_file],
            computations = [prepare],
            notes = "Full forcefield definition and topology.",
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        forcefield_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)

    prepare.update(output_data=[packing_data, forcefield_data])
    prepare.save(GET_LEVEL, update_existing=UPDATE_EXISTING)


    return openmm, python_config, elwood_config, elwood_citation, packing_data, forcefield_data, prepare

def get_quench_equilibrate(proj, uid, expt, prepare, opt, status, elwood_citation, elwood_config, python_config, openmm, packing_data):
    openmm_quench_equilibrate = cript.SoftwareConfiguration(
        software = openmm,
        algorithms = [cript.Algorithm(key="velocity_verlet", type="integration",
                                      parameters = [
                                          cript.Parameter(key="integration_timestep",
                                                          value=opt["run"]["dt"],
                                                          unit=opt["unit"]["time"]),]
                                      ),
                      cript.Algorithm(key="langevin", type="thermostat",
                                      parameters = [
                                          cript.Parameter(key="damping_time",
                                                          value=opt["run"]["quench_equilibrate"]["langevin-friction"],
                                                          unit=opt["unit"]["time"])
                                      ]
                                      ),
                      cript.Algorithm(key="mc_barostat", type="barostat"),
                      cript.Algorithm(key="particle_mesh_ewald_sum", type="integration"),
                      cript.Algorithm(key="cell_neighborlist", type="integration",
                                      parameters = [
                                          cript.Parameter(key="cutoff_distance",
                                                          value=opt["run"]["nb-cutoff"],
                                                          unit=opt["unit"]["length"]
                                                          )
                                      ]
                                      )
                      ]
        )

    quench_equilibrate_conditions = [ cript.Condition(key="pressure", value=opt["run"]["quench_equilibrate"]["pressure"], unit=opt["unit"]["pressure"]),
                                      # cript.Condition(key="temperature", value=opt["run"]["quench_equilibrate"]["safe-temp"], type="min", unit=opt["unit"]["temperature"]),
                                      # cript.Condition(key="temperature", value=status["max_temperature"], type="max", unit=opt["unit"]["temperature"]),
                                      # cript.Condition(key="temperature_rate", value=opt["run"]["quench_equilibrate"]["cooling-rate"], unit=opt["unit"]["temperature"]+"/"+opt["unit"]["time"])
                                     ]

    try:
        quench_equilibrate = cript.Computation.create(
            experiment = expt,
            name = "Densification",
            type = "MD",
            prerequisite_computation = prepare,
            input_data = [packing_data],
            citations = [elwood_citation],
            conditions = quench_equilibrate_conditions,
            software_configurations = [python_config, openmm_quench_equilibrate, elwood_config],
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_equilibrate = cript.Computation.get(url=exc.existing_url, get_level=GET_LEVEL)
    quench_equilibrate.save(get_level=GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        quench_eq_file = cript.File.create(project=proj, source=os.path.join(uid, f"eq_quench-{status['max_temperature']}.xml"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_eq_file = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)
    try:
        quench_eq_data = cript.Data.create(
            experiment = expt,
            name = "OpenMM state configuration",
            type = "computation_config",
            files = [quench_eq_file],
            computations = [quench_equilibrate],
            notes = "Full OpenMM snapshot to be loaded for continuing simulations.",
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_eq_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)

    quench_equilibrate.update(output_data=[quench_eq_data])
    quench_equilibrate.save(GET_LEVEL, update_existing=UPDATE_EXISTING)

    return quench_equilibrate, quench_eq_data

def get_auto_equilibrate(proj, uid, expt, quench_equilibrate, opt, status, elwood_citation, elwood_config, python_config, openmm, quench_eq_data):
    openmm_auto_equilibrate = cript.SoftwareConfiguration(
        software = openmm,
        algorithms = [cript.Algorithm(key="velocity_verlet", type="integration",
                                      parameters = [
                                          cript.Parameter(key="integration_timestep",
                                                          value=opt["run"]["dt"],
                                                          unit=opt["unit"]["time"]),]
                                      ),
                      cript.Algorithm(key="langevin", type="thermostat",
                                      parameters = [
                                          cript.Parameter(key="damping_time",
                                                          value=opt["run"]["auto_equilibrate"]["langevin-friction"],
                                                          unit=opt["unit"]["time"])
                                      ]
                                      ),
                      cript.Algorithm(key="mc_barostat", type="barostat"),
                      cript.Algorithm(key="particle_mesh_ewald_sum", type="integration"),
                      cript.Algorithm(key="cell_neighborlist", type="integration",
                                      parameters = [
                                          cript.Parameter(key="cutoff_distance",
                                                          value=opt["run"]["nb-cutoff"],
                                                          unit=opt["unit"]["length"]
                                                          )
                                      ]
                                      )
                      ]
        )

    auto_equilibrate_conditions = [ cript.Condition(key="time_duration", value=get_auto_runtime(uid, opt), unit=opt["unit"]["time"]),
                                    # cript.Condition(key="temperature", value=status["max_temperature"], unit=opt["unit"]["temperature"]),
                                     ]

    try:
        auto_equilibrate = cript.Computation.create(
            experiment = expt,
            name = f"Equilibration until MSD is larger than {opt['run']['auto_equilibrate']['rg-msd-ratio']}xRg.",
            type = "MD",
            prerequisite_computation = quench_equilibrate,
            input_data = [quench_eq_data],
            citations = [elwood_citation],
            conditions = auto_equilibrate_conditions,
            software_configurations = [python_config, openmm_auto_equilibrate, elwood_config],
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        auto_equilibrate = cript.Computation.get(url=exc.existing_url, get_level=GET_LEVEL)
    auto_equilibrate.save(get_level=GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        auto_eq_file = cript.File.create(project=proj, source=os.path.join(uid, f"auto_quench-{status['max_temperature']}.xml"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        auto_eq_file = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)
    try:
        auto_eq_data = cript.Data.create(
            experiment = expt,
            name = "OpenMM state configuration",
            type = "computation_config",
            files = [auto_eq_file],
            computations = [auto_equilibrate],
            notes = "Full OpenMM snapshot to be loaded for continuing simulations.",
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        auto_eq_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)

    auto_equilibrate.update(output_data=[auto_eq_data])
    auto_equilibrate.save(GET_LEVEL, update_existing=UPDATE_EXISTING)
    return auto_equilibrate, auto_eq_data

def get_quench(proj, uid, expt, auto_equilibrate, opt, status, ana, elwood_citation, elwood_config, python_config, openmm, auto_eq_data):
    openmm_auto_equilibrate = cript.SoftwareConfiguration(
        software = openmm,
        algorithms = [cript.Algorithm(key="velocity_verlet", type="integration",
                                      parameters = [
                                          cript.Parameter(key="integration_timestep",
                                                          value=opt["run"]["dt"],
                                                          unit=opt["unit"]["time"]),]
                                      ),
                      cript.Algorithm(key="langevin", type="thermostat",
                                      parameters = [
                                          cript.Parameter(key="damping_time",
                                                          value=opt["run"]["quench"]["langevin-friction"],
                                                          unit=opt["unit"]["time"])
                                      ]
                                      ),
                      cript.Algorithm(key="mc_barostat", type="barostat"),
                      cript.Algorithm(key="particle_mesh_ewald_sum", type="integration"),
                      cript.Algorithm(key="cell_neighborlist", type="integration",
                                      parameters = [
                                          cript.Parameter(key="cutoff_distance",
                                                          value=opt["run"]["nb-cutoff"],
                                                          unit=opt["unit"]["length"]
                                                          )
                                      ]
                                      )
                      ]
        )

    quench_conditions = [ cript.Condition(key="pressure", value=opt["run"]["quench"]["pressure"], unit=opt["unit"]["pressure"]),
                                      # cript.Condition(key="temperature", value=status["min_temperature"], type="min", unit=opt["unit"]["temperature"]),
                                      # cript.Condition(key="temperature", value=status["max_temperature"], type="max", unit=opt["unit"]["temperature"]),
                                      # cript.Condition(key="temperature_rate", value=opt["run"]["quench"]["cooling-rate"], unit=opt["unit"]["temperature"]+"/"+opt["unit"]["time"])
                                     ]


    try:
        quench = cript.Computation.create(
            experiment = expt,
            name = "Quench temperature from hight to low.",
            type = "MD",
            prerequisite_computation = auto_equilibrate,
            input_data = [auto_eq_data],
            citations = [elwood_citation],
            conditions = quench_conditions,
            software_configurations = [python_config, openmm_auto_equilibrate, elwood_config],
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench = cript.Computation.get(url=exc.existing_url, get_level=GET_LEVEL)
    quench.save(get_level=GET_LEVEL, update_existing=UPDATE_EXISTING)

    quench_output = []
    try:
        quench_end_file = cript.File.create(project=proj, source=os.path.join(uid, f"quench_end-{status['min_temperature']}.xml"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_end_file = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)

    try:
        quench_end_data = cript.Data.create(
            experiment = expt,
            name = "OpenMM state configuration",
            type = "computation_config",
            files = [quench_end_file],
            computations = [quench],
            notes = "Full OpenMM snapshot to be loaded for continuing simulations.",
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_end_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)

    quench_output.append(quench_end_data)
    pre_equi = {}
    for temp in status["temperature"]:
        try:
            pre_equi_file = cript.File.create(project=proj, source=os.path.join(uid, f"pre_equi-{temp}.xml"), update_existing=UPDATE_EXISTING)
        except cript.data_model.exceptions.UniqueNodeError as exc:
            pre_equi_file = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)

        try:
            pre_equi_data = cript.Data.create(
                experiment = expt,
                name = "OpenMM state configuration",
                type = "computation_config",
                files = [pre_equi_file],
                computations = [quench],
                notes = "Full OpenMM snapshot to be loaded for continuing simulations.",
                get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
            )
        except cript.data_model.exceptions.UniqueNodeError as exc:
            pre_equi_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)
        pre_equi[temp] = pre_equi_data
        quench_output.append(pre_equi_data)

    try:
        quench_up = cript.Computation.create(
            experiment = expt,
            name = "Quench temperature from low to high.",
            type = "MD",
            prerequisite_computation = quench,
            input_data = [quench_end_data],
            citations = [elwood_citation],
            conditions = quench_conditions,
            software_configurations = [python_config, openmm_auto_equilibrate, elwood_config],
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_up = cript.Computation.get(url=exc.existing_url, get_level=GET_LEVEL)
    quench_up.save(get_level=GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        quench_file = cript.File.create(project=proj, type="data", source=os.path.join(uid, f"quench-{status['max_temperature']}-{status['min_temperature']}.dat"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_file = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)

    try:
        quench_up_file = cript.File.create(project=proj, type="data", source=os.path.join(uid, f"quench-{status['min_temperature']}-{status['max_temperature']}.dat"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_up_file = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)

    try:
        quench_data = cript.Data.create(
            experiment = expt,
            name = "Density as a function of temperature",
            type = "comp_scalar_evolve",
            files = [quench_file, quench_up_file],
            computations = [quench, quench_up],
            notes = "Plain text table.",
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)

    quench_output.append(quench_data)
    quench.update(output_data=quench_output)
    quench.save(GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        quench_end_file = cript.File.create(project=proj, source=os.path.join(uid, f"quench_end-{status['max_temperature']}.xml"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_end_file = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)
    try:
        quench_end_data = cript.Data.create(
            experiment = expt,
            name = "OpenMM state configuration",
            type = "computation_config",
            files = [quench_end_file],
            computations = [quench_up],
            notes = "Full OpenMM snapshot to be loaded for continuing simulations.",
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        quench_end_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)

    quench_up.update(output_data=[quench_end_data, quench_data])
    quench_up.save(GET_LEVEL, update_existing=UPDATE_EXISTING)


    for mea in ana["measurements"]:
        if mea["name"] == "glass transition temperature":
            tg_val = mea["value"]
            tg_err = mea["error"]
            tg_unit = mea["unit"]
            break
    tg_prop = cript.Property("temp_glass",
                             value = tg_val,
                             unit = tg_unit,
                             type = "value",
                             uncertainty = tg_err,
                             uncertainty_type = "stderr",
                             conditions = quench_conditions,
                             data = quench_data,
                             computations = [quench, quench_up],
                             )

    return quench, pre_equi, tg_prop


def get_run(proj, uid, expt, quench, opt, elwood_citation, elwood_config, python_config, openmm, temp, pre_equi_data):
    openmm_equi = cript.SoftwareConfiguration(
        software = openmm,
        algorithms = [cript.Algorithm(key="velocity_verlet", type="integration",
                                      parameters = [
                                          cript.Parameter(key="integration_timestep",
                                                          value=opt["run"]["dt"],
                                                          unit=opt["unit"]["time"]),]
                                      ),
                      # cript.Algorithm(key="langevin", type="thermostat",
                      #                 parameters = [
                      #                     cript.Parameter(key="damping_time",
                      #                                     value=1,
                      #                                     unit="1/picosecond")
                      #                 ]
                      #                 ),
                      cript.Algorithm(key="mc_barostat", type="barostat"),
                      cript.Algorithm(key="particle_mesh_ewald_sum", type="integration"),
                      cript.Algorithm(key="cell_neighborlist", type="integration",
                                      parameters = [
                                          cript.Parameter(key="cutoff_distance",
                                                          value=opt["run"]["nb-cutoff"],
                                                          unit=opt["unit"]["length"]
                                                          )
                                      ]
                                      )
                      ]
        )
    openmm_npt = cript.SoftwareConfiguration(
        software = openmm,
        algorithms = [cript.Algorithm(key="velocity_verlet", type="integration",
                                      parameters = [
                                          cript.Parameter(key="integration_timestep",
                                                          value=opt["run"]["dt"],
                                                          unit=opt["unit"]["time"]),]
                                      ),
                      cript.Algorithm(key="langevin", type="thermostat",
                                      parameters = [
                                        # cript.Parameter(key="damping_time",
                                        #                 value=1,
                                        #                   unit="1/picosecond")
                                      ]
                                      ),
                      cript.Algorithm(key="mc_barostat", type="barostat"),
                      cript.Algorithm(key="particle_mesh_ewald_sum", type="integration"),
                      cript.Algorithm(key="cell_neighborlist", type="integration",
                                      parameters = [
                                          cript.Parameter(key="cutoff_distance",
                                                          value=opt["run"]["nb-cutoff"],
                                                          unit=opt["unit"]["length"]
                                                          )
                                      ]
                                      )
                      ]
    )
    openmm_nvt = cript.SoftwareConfiguration(
        software = openmm,
        algorithms = [cript.Algorithm(key="velocity_verlet", type="integration",
                                      parameters = [
                                          cript.Parameter(key="integration_timestep",
                                                          value=opt["run"]["dt"],
                                                          unit=opt["unit"]["time"]),]
                                      ),
                      cript.Algorithm(key="langevin", type="thermostat",
                                      parameters = [
                                          # cript.Parameter(key="damping_time",
                                          #                 value=1,
                                          #                 unit="1/picosecond")
                                      ]
                                      ),
                      cript.Algorithm(key="particle_mesh_ewald_sum", type="integration"),
                      cript.Algorithm(key="cell_neighborlist", type="integration",
                                      parameters = [
                                          cript.Parameter(key="cutoff_distance",
                                                          value=opt["run"]["nb-cutoff"],
                                                          unit=opt["unit"]["length"]
                                                          )
                                      ]
                                      )
                      ]
        )

    equi_conditions = [ cript.Condition(key="pressure", value=opt["run"]["equilibrate"]["pressure"], unit=opt["unit"]["pressure"]),
                        # cript.Condition(key="temperature", value=temp, unit=opt["unit"]["temperature"]),
                       ]
    npt_conditions = [ cript.Condition(key="pressure", value=opt["run"]["npt"]["pressure"], unit=opt["unit"]["pressure"]),
                        # cript.Condition(key="temperature", value=temp, unit=opt["unit"]["temperature"]),
                       ]
    nvt_conditions = [ #cript.Condition(key="temperature", value=temp, unit=opt["unit"]["temperature"]),
                       ]

    try:
        equi = cript.Computation.create(
            experiment = expt,
            name = f"Equilibrate at {temp}K.",
            type = "MD",
            prerequisite_computation = quench,
            input_data = [pre_equi_data],
            citations = [elwood_citation],
            conditions = equi_conditions,
            software_configurations = [python_config, openmm_equi, elwood_config],
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        equi = cript.Computation.get(url=exc.existing_url, get_level=GET_LEVEL)
    equi.save(get_level=GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        equi_end_file = cript.File.create(project=proj, source=os.path.join(uid, f"eq_bulk-{temp}.xml"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        equi_file = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)
    try:
        equi_end_data = cript.Data.create(
            experiment = expt,
            name = "OpenMM state configuration",
            type = "computation_config",
            files = [equi_end_file],
            computations = [equi],
            notes = "Full OpenMM snapshot to be loaded for continuing simulations.",
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        equi_end_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)

    try:
        bulk_npt = cript.Computation.create(
            experiment = expt,
            name = f"Bulk NPT simulation for Measurements at {temp}K.",
            type = "MD",
            prerequisite_computation = equi,
            input_data = [equi_end_data],
            citations = [elwood_citation],
            conditions = npt_conditions,
            software_configurations = [python_config, openmm_npt, elwood_config],
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        bulk_npt = cript.Computation.get(url=exc.existing_url, get_level=GET_LEVEL)
    bulk_npt.save(get_level=GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        npt_traj = cript.File.create(project=proj, type="data", source=os.path.join(uid, f"bulk_npt-{temp}.h5"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        npt_traj = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)
    try:
        npt_dat = cript.File.create(project=proj, type="data", source=os.path.join(uid, f"bulk_npt-{temp}.dat"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        npt_dat = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)

    try:
        npt_data = cript.Data.create(
            experiment = expt,
            name = "Trajectory for measurements",
            type = "computation_trajectory",
            files = [npt_traj, npt_dat],
            computations = [bulk_npt],
            notes = "Also includes logged observables as data table.",
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        npt_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)

    bulk_npt.update(output_data=[npt_data])
    bulk_npt.save(GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        bulk_nvt = cript.Computation.create(
            experiment = expt,
            name = f"Bulk NVT simulation for measurements at {temp}K.",
            type = "MD",
            prerequisite_computation = equi,
            input_data = [equi_end_data],
            citations = [elwood_citation],
            conditions = nvt_conditions,
            software_configurations = [python_config, openmm_nvt, elwood_config],
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        bulk_nvt = cript.Computation.get(url=exc.existing_url, get_level=GET_LEVEL)
    bulk_nvt.save(get_level=GET_LEVEL, update_existing=UPDATE_EXISTING)

    try:
        nvt_traj = cript.File.create(project=proj, type="data", source=os.path.join(uid, f"bulk_nvt-{temp}.h5"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        nvt_traj = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)
    try:
        nvt_dat = cript.File.create(project=proj, type="data", source=os.path.join(uid, f"bulk_nvt-{temp}.dat"), update_existing=UPDATE_EXISTING)
    except cript.data_model.exceptions.UniqueNodeError as exc:
        nvt_dat = cript.File.get(url=exc.existing_url, get_level=GET_LEVEL)

    try:
        nvt_data = cript.Data.create(
            experiment = expt,
            name = "Trajectory for measurements",
            type = "computation_trajectory",
            files = [nvt_traj, nvt_dat],
            computations = [bulk_nvt],
            notes = "Also includes logged observables as data table.",
            get_level=GET_LEVEL, update_existing=UPDATE_EXISTING
        )
    except cript.data_model.exceptions.UniqueNodeError as exc:
        nvt_data = cript.Data.get(url=exc.existing_url, get_level=GET_LEVEL)

    bulk_nvt.update(output_data=[nvt_data])
    bulk_nvt.save(GET_LEVEL, update_existing=UPDATE_EXISTING)

    return bulk_npt, npt_data, npt_conditions, bulk_nvt, nvt_data, nvt_conditions


def get_temp_properties(ana, data):
    names = {}
    elwood_transform = namedtuple("Transform", ["cript_name", "value_transform", "unit_transform", "tuple_offset"])
    names["thermal expansion coefficient"] = elwood_transform("thermal_expand_volume",
                                                              lambda x: x, lambda x: x, 0)
    names["square radius of gyration"] = elwood_transform("radius_gyration",
                                                          lambda x: np.sqrt(x),
                                                          lambda x: "("+x+")^(1/2)", 0)
    names["cohesive energy density"] = elwood_transform("cohesive_energy_density",
                                                        lambda x: x, lambda x: x, 0)
    names["Hildebrand solubility parameter"] = elwood_transform("hildebrand_solubility",
                                                                lambda x: x, lambda x: x, 0)
    names["heat of vaporization"] = elwood_transform("heat_vaporization_molar",
                                                     lambda x: x, lambda x: x, 0)
    # names["squared dipole moment"] = elwood_transform("monomeric_dipole_moment",
    #                                                       lambda x: np.sqrt(x[0]),
    #                                                       lambda x: "("+x+")^(1/2)", 0)
    # names["squared side chain length"] = elwood_transform("side_chain_length",
    #                                                       lambda x: np.sqrt(x[0]),
    #                                                       lambda x: "("+x+")^(1/2)", 0)
    # names["dot(BB-sideRcm, dipole)"] = elwood_transform("dot_side_dipole",
    # lambda x: x[0], lambda x: x, 0)
    # names["dot(BBvec, dipole)"] = elwood_transform("dot_back_dipole",
    # lambda x: x[0], lambda x: x, 0)
    # names["angle(BB-sideRcm, dipole)"] = elwood_transform("angle_side_dipole",
    # lambda x: x[0], lambda x: x, 0)
    # names["angle(BBvec, dipole)"] = elwood_transform("angle_back_dipole",
    # lambda x: x[0], lambda x: x, 0)
    names["isothermal compressibility"] = elwood_transform("isothermal_compressibility",
                                                           lambda x: x, lambda x: x, 0)
    names["density"] = elwood_transform("density", lambda x: x, lambda x: x, 0)
    names["diffusion coefficient"] = elwood_transform("diffusivity", lambda x: x, lambda x: x, 1)
    names["kuhn length"] = elwood_transform("length_kuhn", lambda x: x, lambda x: x, 0)
    names["monomers per kuhn segment"] = elwood_transform("monomer_per_kuhn", lambda x: x, lambda x: x, 0)
    names["c infinity"] = elwood_transform("c infinity", lambda x: x, lambda x: x, 0)

    properties = []
    for mea in ana["measurements"]:
        if mea["name"] in names:
            trans = names[mea["name"]]
            temp = float(mea["temperature"])
            prop = cript.Property(key = trans[0],
                                  value = trans[1](mea["value"]),
                                  unit = trans[2](mea["unit"]),
                                  type = "value",
                                  uncertainty = trans[1](mea["error"]),
                                  uncertainty_type = "stderr",
                                  conditions = data[temp][trans[3]*3 + 2],
                                  data = data[temp][trans[3]*3+1],
                                  computations = [data[temp][trans[3]*3]],
                                  notes = str(mea)
                                  )
            properties.append(prop)
    return properties


def main(argv):
    if len(argv) != 2:
        print("Usage: ./upload_cript.py uid token")
        return
    uid = argv[1].strip("/")
    with open(os.path.join(uid, "analysis.json"), "r") as json_handle:
        ana = json.load(json_handle)
    with open(os.path.join(uid, "status.json"), "r") as json_handle:
        status = json.load(json_handle)
    with open(os.path.join(uid, "advanced_options.json"), "r") as json_handle:
        opt = json.load(json_handle)

    host = "criptapp.org"
    token = argv[0]
    cript.API(host, token)

    proj, expt = get_cript(uid)

    openmm, python_config, elwood_config, elwood_citation, packing_data, forcefield_data, prepare = get_prepare(proj, expt, uid, ana)
    quench_equilibrate, quench_eq_data = get_quench_equilibrate(proj, uid, expt, prepare, opt, status, elwood_citation, elwood_config, python_config, openmm, packing_data)
    auto_equilibrate, auto_eq_data = get_auto_equilibrate(proj, uid, expt, quench_equilibrate, opt, status, elwood_citation, elwood_config, python_config, openmm, quench_eq_data)
    quench, pre_equi, tg_prop = get_quench(proj, uid, expt, auto_equilibrate, opt, status, ana, elwood_citation, elwood_config, python_config, openmm, auto_eq_data)
    material_properties = [tg_prop]

    Data = namedtuple("Data", ["npt", "npt_data", "npt_cond", "nvt", "nvt_data", "nvt_cond"])
    data = {}
    for temp in pre_equi:
        npt, npt_data, npt_cond, nvt, nvt_data, nvt_cond = get_run(proj, uid, expt, quench, opt, elwood_citation, elwood_config, python_config, openmm, temp, pre_equi[temp])
        data[temp] = Data(npt, npt_data, npt_cond, nvt, nvt_data, nvt_cond)

    temp_properties = get_temp_properties(ana, data)
    material_properties += temp_properties

    try:
        material = cript.Material(project=proj, name=uid)
        bigsmiles = cript.Identifier(key="bigsmiles", value=get_big_smiles(ana["smiles-string"]))
        material.add_identifier(bigsmiles)
        Mn, Mw = get_molweights(uid)
        material.add_property(cript.Property(key="mw_n", value=Mn, unit='g/mol'))
        material.add_property(cript.Property(key="mw_w", value=Mw, unit='g/mol'))
        for prop in material_properties:
            material.add_property(prop)
        forcefield = cript.ComputationalForcefield(
            key = "opls_aa",
            building_block = "atom",
            source = "Custom determination via LigParGen",
            data = forcefield_data
        )
        material.computation_forcefield = forcefield
    except cript.data_model.exceptions.UniqueNodeError as exc:
        material = cript.Material.get(url=exc.existing_url, get_level=GET_LEVEL)

    material.save(GET_LEVEL,update_existing=UPDATE_EXISTING)



if __name__ == "__main__":
    main(sys.argv[1:])
