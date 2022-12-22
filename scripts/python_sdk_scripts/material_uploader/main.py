import cript
from getpass import getpass
import pandas as pd
import yaml
import math


def load_config():
    """Loads a config file customized by a user. If any fields are not filled, the user is prompted for the
    information.
    @params:
    None
    @return
    config-dictionary of configuration information"""
    try:
        with open("config.yaml", "r") as f:
            config = yaml.safe_load(f)
    except FileNotFoundError:
        config = {}

    if config.get("host") is None:
        config["host"] = input("Host (e.g., criptapp.org): ")
    if config.get("token") is None:
        config["token"] = getpass("API Token: ")
    if config.get("group") is None:
        config["group"] = input("Group name: ")
    if config.get("collection") is None:
        config["collection"] = input("Collection name: ")
    if config.get("inventory") is None:
        config["inventory"] = input("Inventory name: ")
    if config.get("experiment") is None:
        config["experiment"] = input("Experiment name: ")
    if config.get("public") is None:
        # Prompt user for privacy setting
        config["public"] = (
            input("Do you want your data visible to the public? (y/N): ").lower() == "y"
        )
    if config.get("source") is None:
        config["source"] = input("source to CSV file: ").strip('"')

    return config


def get_inventory(inventory_name, group, collection, api, public):
    """Either creates or retrieves an inventory object from CRIPT.
    @params:
    inventory_name:string
    group:cript group object
    collection:cript collection object
    api:cript api object
    public:boolean

    @return:cript inventory object
    """

    inventory = cript.Inventory(
        group=group,
        collection=collection,
        name=inventory_name,
        materials=[],
        public=public,
    )

    # Save inventory
    api.save(inventory, update_existing=True, max_level=0)

    return inventory


def get_experiment(experiment_name, group, col, api):
    """Either creates or retrieves an inventory object from CRIPT.
    @params:
    experiment_name:string
    group:cript group object
    collection:cript collection object
    api:cript api object

    @return:cript experiment object
    """

    experiment = cript.Experiment(collection=col, name=experiment_name)

    # Save inventory
    api.save(experiment, update_existing=True, max_level=0)

    return experiment


def create_data(value, project, api, exp):
    """Takes a file and associates it with a dataset. Both the file and the data are uploaded.
    @params:
    value:str, file type and source separated by a ; ex: nmr; C:User\file.txt
    group: cript group object
    api: cript api object
    exp: cript experiment object
    @return:
    [data]:cript data node in a list
    """

    val_list = value.split(";")
    data_type = val_list[0].strip()
    source = val_list[1].strip()
    data = cript.Data(
        **{
            "name": f"{data_type}_data",
            "group": group,
            "public": True,
            "type": data_type,
            "experiment": exp,
        }
    )
    api.save(data, update_existing=True, max_level=0)

    file = cript.File(
        **{
            "name": f"{data_type}_file",
            "source": source,
            "type": "data",
            "data": [data],
            "group": group,
            "project": project,
        }
    )

    api.save(file, update_existing=True, max_level=0)
    return data


def add_identifiers(material, row):
    """Adds identifiers to a cript material object.
    @params:
    material:cript material object
    row:pandas DataSeries
    @return:
    None"""

    # Goes through identifiers in example template
    for header in ["bigsmiles", "cas", "chem_repeat"]:
        val = row[header][0]
        # Creates identifier and adds it to material if value is a string as expected
        if isinstance(val, str):
            identifier = cript.Identifier(key=header, value=val)
            material.add_identifier(identifier)


def add_properties(material, row, group, api, exp):
    """Adds properties to a material object.
    @params:
    material:cript material object
    row:pandas DataSeries
    group:cript group object
    api:cript api object
    exp:cript experiment object
    @return:
    None
    """
    # Goes through headers from template
    for header in [
        "phase",
        "color",
        "mw_n",
        "density",
        "temp_boiling",
        "heat_combustion_mass:max",
    ]:

        # Gets relevant information, and sets variables for later checks
        val = row[header][0]
        units = row[header].index[0]
        property = False
        property_dict = {}

        # In template all properties that are str, can be created with a simple dictionary of key and value
        if isinstance(val, str):
            property_dict = {"key": header, "value": val}
        # Tries to create other properties if they have a value entered in the template
        elif not math.isnan(val):

            # An example of creating a property with data associated with it, as well as
            # a property that has a method linked to it
            if header == "mw_n":
                # Presets if these fields aren't filled out in template
                data = None
                method = None
                if isinstance(row["mw_n:data"][0], str):
                    data = create_data(row["mw_n:data"][0], project, api, exp)
                if isinstance(row["mw_n:method"][0], str):
                    method = row["mw_n:method"][0]
                property_dict = {
                    "key": "mw_n",
                    "value": val,
                    "data": data,
                    "method": method,
                    "unit": units,
                }

            # An example of a property with a condition for its measurement
            elif header == "density":

                condition = []
                cond_val = row["density:temperature"][0]
                cond_units = row["density:temperature"].index[0]

                # Creates condition object if value exists

                if not math.isnan(cond_val):
                    # A property object can have multiple conditions, so the condition objects are
                    # in a list
                    condition = [
                        cript.Condition(
                            **{
                                "key": "temperature",
                                "type": "value",
                                "value": cond_val,
                                "unit": cond_units,
                            }
                        )
                    ]

                property_dict = {
                    "key": "density",
                    "value": val,
                    "unit": units,
                    "conditions": condition,
                }

            # Example of a property with an uncertainty
            elif header == "temp_boiling":

                uncert_val = row["temp_boiling:stdev"][0]
                uncert_type = "stdev"
                property_dict = {
                    "key": "temp_boiling",
                    "value": val,
                    "uncertainty": uncert_val,
                    "uncertainty_type": uncert_type,
                    "unit": units,
                }

            # Example of a property that is relative i.e. max, median, mode, etc.
            elif "heat_combustion_mass:max":
                property_dict = {
                    "key": "heat_combustion_mass",
                    "value": val,
                    "type": "max",
                    "unit": units,
                }

        # Creates property object and adds it to the material if there is a populated property_dict
        if property_dict:
            property = cript.Property(**property_dict)
            material.add_property(property)


def parseFile(source, inventory, project, api, experiment):
    """Iterates through rows of an excel sheet and calls upon get_polymer to make material objects.
    Adds materials to specified inventory.
    @params:
    source: str, file source
    inventory:cript inventory object
    project: cript project object
    api:cript api object
    experiment: experiment object
    @return: None
    """

    # Uses the 0th and 1st row for the header to have access to units
    file = pd.read_excel(source, header=[0, 1])

    # Material objects are created for each row and added to inventory
    for index, row in file.iterrows():
        Material = cript.Material(project, row["Material_name"][0])
        add_identifiers(Material, row)
        add_properties(Material, row, project, api, experiment)
        api.save(Material, update_existing=True, max_level=0)
        inventory.materials.append(Material)
    # All materials are saved to inventory at the end
    api.save(inventory, max_level=0)


if __name__ == "__main__":

    config = load_config()
    # Establish connection with the API
    api = cript.API(config["host"], config["token"])

    # Fetch objects
    group = api.get(cript.Group, {"name": config["group"]}, max_level=0)

    collection = api.get(
        cript.Collection,
        {"name": config["collection"], "group": group.uid},
        max_level=0,
    )

    inventory = get_inventory(
        config["inventory"], group, collection, api, config["public"]
    )

    experiment = get_experiment(config["experiment"], group, collection, api)

    project = api.get(cript.Project, {"name": config["project"], "group": group.uid})

    parseFile(config["source"], inventory, project, api, experiment)
