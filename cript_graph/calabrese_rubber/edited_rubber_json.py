{
    "node": "Project",
    "name": "CRIPT End-To-End Test Papers",
    "collection": [
        {
            "node": "Collection",
            "name": "Calabrese et al. Rubber Recycling",
            "experiment": [
                {
                    "node": "Experiment",
                    "name": "Composition Analysis",
                    "processes": [
                        {
                            "node": "Process",
                            "name": "Lyophilization",
                            "uid": "_:Lyophilization",
                            "ingredients": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Vulcanizing fluid 760 (cement)",
                                        "uid": "_:Vulcanizing fluid 760 (cement)",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "uid": "_:CHNS of Vulcanizing fluid 760 (cement)",
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Liquid Nitrogen",
                                        "uid": "_:Liquid Nitrogen",
                                    },
                                },
                            ],
                            "products": [
                                {
                                    "node": "Material",
                                    "name": "Vulcanizing Fluid 760 solids fraction",
                                    "uid": "_:Vulcanizing Fluid 760 solids fraction",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "uid": "_:GPC of Vulcanizing Fluid 760 solids fraction",
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                        }
                    ],
                    "data": [
                        {
                            "node": "Data",
                            "name": "GPC of Vulcanizing Fluid 760 solids fraction",
                            "uid": "_:GPC of Vulcanizing Fluid 760 solids fraction",
                        },
                        {
                            "node": "Data",
                            "name": "CHNS of Vulcanizing fluid 760 (cement)",
                            "uid": "_:CHNS of Vulcanizing fluid 760 (cement)",
                        },
                        {
                            "node": "Data",
                            "name": "TGA of Cushion Gum",
                            "uid": "_:TGA of Cushion Gum",
                        },
                    ],
                },
                {
                    "node": "Experiment",
                    "name": "SCA Preparation",
                    "process": [
                        {
                            "node": "Process",
                            "name": "SCA wet blend toluene",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Vulcanizing fluid 760 (cement)",
                                        "uid": "_:Vulcanizing fluid 760 (cement)",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Cushion Gum",
                                        "uid": "_:Cushion Gum",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "toluene",
                                        "uid": "_:toluene",
                                    },
                                },
                            ],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "SCA wet toluene",
                                    "uid": "_:SCA wet toluene",
                                }
                            ],
                            "uid": "_:SCA wet blend toluene",
                        },
                        {
                            "node": "Process",
                            "name": "SCA dry blend",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Vulcanizing fluid 760 (cement)",
                                        "uid": "_:Vulcanizing fluid 760 (cement)",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Cushion Gum",
                                        "uid": "_:Cushion Gum",
                                    },
                                },
                            ],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "SCA dry",
                                    "uid": "_:SCA dry",
                                }
                            ],
                            "uid": "_:SCA dry blend",
                        },
                        {
                            "node": "Process",
                            "name": "SCA dry blend low cement",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Vulcanizing fluid 760 (cement)",
                                        "uid": "_:Vulcanizing fluid 760 (cement)",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Cushion Gum",
                                        "uid": "_:Cushion Gum",
                                    },
                                },
                            ],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "SCA dry low cement",
                                    "uid": "_:SCA dry low cement",
                                }
                            ],
                            "uid": "_:SCA dry blend low cement",
                        },
                    ],
                },
            ],
            "inventory": [
                {
                    "node": "Inventory",
                    "name": "Rubber Formulation Ingredients",
                    "material": [
                        {
                            "node": "Material",
                            "name": "High-cis polybutadiene",
                            "uid": "_:High-cis polybutadiene",
                        },
                        {
                            "node": "Material",
                            "name": "Vulcanizing fluid 760 (cement)",
                            "uid": "_:Vulcanizing fluid 760 (cement)",
                        },
                        {
                            "node": "Material",
                            "name": "Carbon Black N330",
                            "uid": "_:Carbon Black N330",
                        },
                        {
                            "node": "Material",
                            "name": "Cushion Gum",
                            "uid": "_:Cushion Gum",
                        },
                        {
                            "node": "Material",
                            "name": "Stearic Acid",
                            "uid": "_:Stearic Acid",
                        },
                        {"node": "Material", "name": "toluene", "uid": "_:toluene"},
                        {
                            "node": "Material",
                            "name": "Zinc Oxide",
                            "uid": "_:Zinc Oxide",
                        },
                        {"node": "Material", "name": "BHT", "uid": "_:BHT"},
                        {"node": "Material", "name": "TBBS", "uid": "_:TBBS"},
                        {"node": "Material", "name": "sulfur", "uid": "_:sulfur"},
                        {
                            "node": "Material",
                            "name": "F3 uncured",
                            "uid": "_:F3 uncured",
                        },
                        {"node": "Material", "name": "F3 cured", "uid": "_:F3 cured"},
                        {"node": "Material", "name": "F3 GRP", "uid": "_:F3 GRP"},
                        {
                            "node": "Material",
                            "name": "F3 masterbatch",
                            "uid": "_:F3 masterbatch",
                        },
                    ],
                },
                {
                    "node": "Inventory",
                    "name": "Recycled Rubbers",
                    "material": [
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 00000",
                            "uid": "_:Recycled Rubber 00000",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 00001",
                            "uid": "_:Recycled Rubber 00001",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 00010",
                            "uid": "_:Recycled Rubber 00010",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 00011",
                            "uid": "_:Recycled Rubber 00011",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 00100",
                            "uid": "_:Recycled Rubber 00100",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 00101",
                            "uid": "_:Recycled Rubber 00101",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 00110",
                            "uid": "_:Recycled Rubber 00110",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 00111",
                            "uid": "_:Recycled Rubber 00111",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 01000",
                            "uid": "_:Recycled Rubber 01000",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 01001",
                            "uid": "_:Recycled Rubber 01001",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 01010",
                            "uid": "_:Recycled Rubber 01010",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 01011",
                            "uid": "_:Recycled Rubber 01011",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 01100",
                            "uid": "_:Recycled Rubber 01100",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 01101",
                            "uid": "_:Recycled Rubber 01101",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 01110",
                            "uid": "_:Recycled Rubber 01110",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 01111",
                            "uid": "_:Recycled Rubber 01111",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 10000",
                            "uid": "_:Recycled Rubber 10000",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 10001",
                            "uid": "_:Recycled Rubber 10001",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 10010",
                            "uid": "_:Recycled Rubber 10010",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 10011",
                            "uid": "_:Recycled Rubber 10011",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 10100",
                            "uid": "_:Recycled Rubber 10100",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 10101",
                            "uid": "_:Recycled Rubber 10101",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 10110",
                            "uid": "_:Recycled Rubber 10110",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 10111",
                            "uid": "_:Recycled Rubber 10111",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 11000",
                            "uid": "_:Recycled Rubber 11000",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 11001",
                            "uid": "_:Recycled Rubber 11001",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 11010",
                            "uid": "_:Recycled Rubber 11010",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 11011",
                            "uid": "_:Recycled Rubber 11011",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 11100",
                            "uid": "_:Recycled Rubber 11100",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 11101",
                            "uid": "_:Recycled Rubber 11101",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 11110",
                            "uid": "_:Recycled Rubber 11110",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber 11111",
                            "uid": "_:Recycled Rubber 11111",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber trial control",
                            "uid": "_:Recycled Rubber trial control",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber base control",
                            "uid": "_:Recycled Rubber base control",
                        },
                        {
                            "node": "Material",
                            "name": "Recycled Rubber negative control",
                            "uid": "_:Recycled Rubber negative control",
                        },
                    ],
                },
                {
                    "node": "Experiment",
                    "name": "Model Rubber Preparation",
                    "process": [
                        {
                            "node": "Process",
                            "name": "F3 compounding",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "High-cis polybutadiene",
                                        "uid": "_:High-cis polybutadiene",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "uid": "_:GPC of High-cis polybutadiene",
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Carbon Black N330",
                                        "uid": "_:Carbon Black N330",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Stearic Acid",
                                        "uid": "_:Stearic Acid",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Zinc Oxide",
                                        "uid": "_:Zinc Oxide",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "BHT",
                                        "uid": "_:BHT",
                                    },
                                },
                            ],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "F3 masterbatch",
                                    "uid": "_:F3 masterbatch",
                                }
                            ],
                            "uid": "_:F3 compounding",
                        },
                        {
                            "node": "Process",
                            "name": "F3 compounding with cure pkg",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "TBBS",
                                        "uid": "_:TBBS",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "sulfur",
                                        "uid": "_:sulfur",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 masterbatch",
                                        "uid": "_:F3 masterbatch",
                                    },
                                },
                            ],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "F3 uncured",
                                    "uid": "_:F3 uncured",
                                }
                            ],
                            "uid": "_:F3 compounding with cure pkg",
                        },
                        {
                            "node": "Process",
                            "name": "F3 vulcanization",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "F3 cured",
                                    "uid": "_:F3 cured",
                                }
                            ],
                            "uid": "_:F3 vulcanization",
                        },
                        {
                            "node": "Process",
                            "name": "F3 grinding",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                }
                            ],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "F3 GRP",
                                    "uid": "_:F3 GRP",
                                }
                            ],
                            "uid": "_:F3 grinding",
                        },
                    ],
                    "data": [
                        {
                            "node": "Data",
                            "name": "GPC of High-cis polybutadiene",
                            "uid": "_:GPC of High-cis polybutadiene",
                        }
                    ],
                },
                {
                    "node": "Experiment",
                    "name": "Laminate Adhesion strength",
                    "process": [
                        {
                            "node": "Process",
                            "name": "TCA laminate prep 2 kg solids/m2",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Vulcanizing fluid 760 (cement)",
                                        "uid": "_:Vulcanizing fluid 760 (cement)",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Cushion Gum",
                                        "uid": "_:Cushion Gum",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:TCA laminate prep 2 kg solids/m2",
                        },
                        {
                            "node": "Process",
                            "name": "CG only laminate prep",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Cushion Gum",
                                        "uid": "_:Cushion Gum",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:CG only laminate prep",
                        },
                        {
                            "node": "Process",
                            "name": "Cement only laminate prep",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Vulcanizing fluid 760 (cement)",
                                        "uid": "_:Vulcanizing fluid 760 (cement)",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:Cement only laminate prep",
                        },
                        {
                            "node": "Process",
                            "name": "No adhesive laminate prep",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                }
                            ],
                            "product": [],
                            "uid": "_:No adhesive laminate prep",
                        },
                        {
                            "node": "Process",
                            "name": "SCA wet lam prep 0.33 kg solids/m2",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA wet toluene",
                                        "uid": "_:SCA wet toluene",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:SCA wet lam prep 0.33 kg solids/m2",
                        },
                        {
                            "node": "Process",
                            "name": "SCA wet lam prep 0.67 kg solids/m2",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA wet toluene",
                                        "uid": "_:SCA wet toluene",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:SCA wet lam prep 0.67 kg solids/m2",
                        },
                        {
                            "node": "Process",
                            "name": "SCA wet lam prep 1 kg solids/m2",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA wet toluene",
                                        "uid": "_:SCA wet toluene",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:SCA wet lam prep 1 kg solids/m2",
                        },
                        {
                            "node": "Process",
                            "name": "SCA wet lam prep 2 kg solids/m2",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA wet toluene",
                                        "uid": "_:SCA wet toluene",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:SCA wet lam prep 2 kg solids/m2",
                        },
                        {
                            "node": "Process",
                            "name": "SCA dry lam prep 0.89 kg solids/m2",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:SCA dry lam prep 0.89 kg solids/m2",
                        },
                        {
                            "node": "Process",
                            "name": "SCA dry lam prep 13.6 kg solids/m2",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:SCA dry lam prep 13.6 kg solids/m2",
                        },
                        {
                            "node": "Process",
                            "name": "SCA dry lam prep 14.6 kg solids/m2",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:SCA dry lam prep 14.6 kg solids/m2",
                        },
                        {
                            "node": "Process",
                            "name": "SCA dry lam prep 15.5 kg solids/m2",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:SCA dry lam prep 15.5 kg solids/m2",
                        },
                        {
                            "node": "Process",
                            "name": "SCA dry lam prep 19.8 kg solids/m2",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 cured",
                                        "uid": "_:F3 cured",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                            ],
                            "product": [],
                            "uid": "_:SCA dry lam prep 19.8 kg solids/m2",
                        },
                    ],
                    "data": [
                        [
                            {
                                "node": "Data",
                                "name": "Laminate image",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "TCA laminate prep 2 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Vulcanizing fluid 760 (cement)",
                                                "uid": "_:Vulcanizing fluid 760 (cement)",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Cushion Gum",
                                                "uid": "_:Cushion Gum",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:TCA laminate prep 2 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "TCA lam peel test",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "TCA laminate prep 2 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Vulcanizing fluid 760 (cement)",
                                                "uid": "_:Vulcanizing fluid 760 (cement)",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Cushion Gum",
                                                "uid": "_:Cushion Gum",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:TCA laminate prep 2 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "CG only lam peel test",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "CG only laminate prep",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Cushion Gum",
                                                "uid": "_:Cushion Gum",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:CG only laminate prep",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "Cement only lam peel test",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Cement only laminate prep",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Vulcanizing fluid 760 (cement)",
                                                "uid": "_:Vulcanizing fluid 760 (cement)",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:Cement only laminate prep",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "No adhesive lam peel test",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "No adhesive laminate prep",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        }
                                    ],
                                    "product": [],
                                    "uid": "_:No adhesive laminate prep",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "SCA wet lam peel test 0.33 kg solids/m2",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "SCA wet lam prep 0.33 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "SCA wet toluene",
                                                "uid": "_:SCA wet toluene",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:SCA wet lam prep 0.33 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "SCA wet lam peel test 0.67 kg solids/m2",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "SCA wet lam prep 0.67 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "SCA wet toluene",
                                                "uid": "_:SCA wet toluene",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:SCA wet lam prep 0.67 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "SCA wet lam peel test 1 kg solids/m2",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "SCA wet lam prep 1 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "SCA wet toluene",
                                                "uid": "_:SCA wet toluene",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:SCA wet lam prep 1 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "SCA wet lam peel test 2 kg solids/m2",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "SCA wet lam prep 2 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "SCA wet toluene",
                                                "uid": "_:SCA wet toluene",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:SCA wet lam prep 2 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "SCA evap lam peel test 2 kg solids/m2",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "SCA evap lam prep 2 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "SCA wet toluene",
                                                "uid": "_:SCA wet toluene",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:SCA evap lam prep 2 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "SCA dry lam peel test 0.89 kg solids/m2",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "SCA dry lam prep 0.89 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "SCA dry",
                                                "uid": "_:SCA dry",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:SCA dry lam prep 0.89 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "SCA dry lam peel test 13.6 kg solids/m2",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "SCA dry lam prep 13.6 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "SCA dry",
                                                "uid": "_:SCA dry",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:SCA dry lam prep 13.6 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "SCA dry lam peel test 14.6 kg solids/m2",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "SCA dry lam prep 14.6 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "SCA dry",
                                                "uid": "_:SCA dry",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:SCA dry lam prep 14.6 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "SCA dry lam peel test 15.5 kg solids/m2",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "SCA dry lam prep 15.5 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "SCA dry",
                                                "uid": "_:SCA dry",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:SCA dry lam prep 15.5 kg solids/m2",
                                },
                            },
                            {
                                "node": "Data",
                                "name": "SCA dry lam peel test 19.8 kg solids/m2",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "SCA dry lam prep 19.8 kg solids/m2",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "F3 cured",
                                                "uid": "_:F3 cured",
                                            },
                                        },
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "SCA dry",
                                                "uid": "_:SCA dry",
                                            },
                                        },
                                    ],
                                    "product": [],
                                    "uid": "_:SCA dry lam prep 19.8 kg solids/m2",
                                },
                            },
                        ]
                    ],
                },
                {
                    "node": "Experiment",
                    "name": "Factorial Design with Controls",
                    "process": [
                        {
                            "node": "Process",
                            "name": "Coating of GRP 00000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 00000",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 00000",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 00000"}],
                            "uid": "_:Pretreatment of cGRP 00000",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 00000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 00000"}
                            ],
                            "uid": "_:Reblending of cGRP 00000",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 00000",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 00000",
                                    "uid": "_:Recycled Rubber 00000",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 00000",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 00000",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 00000",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 00000"}
                            ],
                            "uid": "_:Curing of cGRP 00000",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 00000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 00000",
                                        "uid": "_:Recycled Rubber 00000",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 00000",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 00000",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 00001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 00001",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 00001",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 00001"}],
                            "uid": "_:Pretreatment of cGRP 00001",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 00001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 00001"}
                            ],
                            "uid": "_:Reblending of cGRP 00001",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 00001",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 00001",
                                    "uid": "_:Recycled Rubber 00001",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 00001",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 00001",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 00001",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 00001"}
                            ],
                            "uid": "_:Curing of cGRP 00001",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 00001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 00001",
                                        "uid": "_:Recycled Rubber 00001",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 00001",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 00001",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 00010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 00010",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 00010",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 00010"}],
                            "uid": "_:Pretreatment of cGRP 00010",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 00010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 00010"}
                            ],
                            "uid": "_:Reblending of cGRP 00010",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 00010",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 00010",
                                    "uid": "_:Recycled Rubber 00010",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 00010",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 00010",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 00010",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 00010"}
                            ],
                            "uid": "_:Curing of cGRP 00010",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 00010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 00010",
                                        "uid": "_:Recycled Rubber 00010",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 00010",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 00010",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 00011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 00011",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 00011",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 00011"}],
                            "uid": "_:Pretreatment of cGRP 00011",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 00011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 00011"}
                            ],
                            "uid": "_:Reblending of cGRP 00011",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 00011",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 00011",
                                    "uid": "_:Recycled Rubber 00011",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 00011",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 00011",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 00011",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 00011"}
                            ],
                            "uid": "_:Curing of cGRP 00011",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 00011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 00011",
                                        "uid": "_:Recycled Rubber 00011",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 00011",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 00011",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 00100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 00100",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 00100",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 00100"}],
                            "uid": "_:Pretreatment of cGRP 00100",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 00100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 00100"}
                            ],
                            "uid": "_:Reblending of cGRP 00100",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 00100",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 00100",
                                    "uid": "_:Recycled Rubber 00100",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 00100",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 00100",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 00100",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 00100"}
                            ],
                            "uid": "_:Curing of cGRP 00100",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 00100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 00100",
                                        "uid": "_:Recycled Rubber 00100",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 00100",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 00100",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 00101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 00101",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 00101",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 00101"}],
                            "uid": "_:Pretreatment of cGRP 00101",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 00101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 00101"}
                            ],
                            "uid": "_:Reblending of cGRP 00101",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 00101",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 00101",
                                    "uid": "_:Recycled Rubber 00101",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 00101",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 00101",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 00101",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 00101"}
                            ],
                            "uid": "_:Curing of cGRP 00101",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 00101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 00101",
                                        "uid": "_:Recycled Rubber 00101",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 00101",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 00101",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 00110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 00110",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 00110",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 00110"}],
                            "uid": "_:Pretreatment of cGRP 00110",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 00110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 00110"}
                            ],
                            "uid": "_:Reblending of cGRP 00110",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 00110",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 00110",
                                    "uid": "_:Recycled Rubber 00110",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 00110",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 00110",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 00110",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 00110"}
                            ],
                            "uid": "_:Curing of cGRP 00110",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 00110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 00110",
                                        "uid": "_:Recycled Rubber 00110",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 00110",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 00110",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 00111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 00111",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 00111",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 00111"}],
                            "uid": "_:Pretreatment of cGRP 00111",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 00111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 00111"}
                            ],
                            "uid": "_:Reblending of cGRP 00111",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 00111",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 00111",
                                    "uid": "_:Recycled Rubber 00111",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 00111",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 00111",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 00111",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 00111"}
                            ],
                            "uid": "_:Curing of cGRP 00111",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 00111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 00111",
                                        "uid": "_:Recycled Rubber 00111",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 00111",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 00111",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 01000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 01000",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 01000",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 01000"}],
                            "uid": "_:Pretreatment of cGRP 01000",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 01000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 01000"}
                            ],
                            "uid": "_:Reblending of cGRP 01000",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 01000",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 01000",
                                    "uid": "_:Recycled Rubber 01000",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 01000",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 01000",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 01000",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 01000"}
                            ],
                            "uid": "_:Curing of cGRP 01000",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 01000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 01000",
                                        "uid": "_:Recycled Rubber 01000",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 01000",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 01000",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 01001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 01001",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 01001",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 01001"}],
                            "uid": "_:Pretreatment of cGRP 01001",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 01001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 01001"}
                            ],
                            "uid": "_:Reblending of cGRP 01001",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 01001",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 01001",
                                    "uid": "_:Recycled Rubber 01001",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 01001",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 01001",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 01001",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 01001"}
                            ],
                            "uid": "_:Curing of cGRP 01001",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 01001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 01001",
                                        "uid": "_:Recycled Rubber 01001",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 01001",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 01001",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 01010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 01010",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 01010",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 01010"}],
                            "uid": "_:Pretreatment of cGRP 01010",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 01010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 01010"}
                            ],
                            "uid": "_:Reblending of cGRP 01010",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 01010",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 01010",
                                    "uid": "_:Recycled Rubber 01010",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 01010",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 01010",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 01010",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 01010"}
                            ],
                            "uid": "_:Curing of cGRP 01010",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 01010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 01010",
                                        "uid": "_:Recycled Rubber 01010",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 01010",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 01010",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 01011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 01011",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 01011",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 01011"}],
                            "uid": "_:Pretreatment of cGRP 01011",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 01011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 01011"}
                            ],
                            "uid": "_:Reblending of cGRP 01011",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 01011",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 01011",
                                    "uid": "_:Recycled Rubber 01011",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 01011",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 01011",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 01011",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 01011"}
                            ],
                            "uid": "_:Curing of cGRP 01011",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 01011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 01011",
                                        "uid": "_:Recycled Rubber 01011",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 01011",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 01011",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 01100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 01100",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 01100",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 01100"}],
                            "uid": "_:Pretreatment of cGRP 01100",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 01100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 01100"}
                            ],
                            "uid": "_:Reblending of cGRP 01100",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 01100",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 01100",
                                    "uid": "_:Recycled Rubber 01100",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 01100",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 01100",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 01100",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 01100"}
                            ],
                            "uid": "_:Curing of cGRP 01100",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 01100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 01100",
                                        "uid": "_:Recycled Rubber 01100",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 01100",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 01100",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 01101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 01101",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 01101",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 01101"}],
                            "uid": "_:Pretreatment of cGRP 01101",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 01101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 01101"}
                            ],
                            "uid": "_:Reblending of cGRP 01101",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 01101",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 01101",
                                    "uid": "_:Recycled Rubber 01101",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 01101",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 01101",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 01101",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 01101"}
                            ],
                            "uid": "_:Curing of cGRP 01101",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 01101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 01101",
                                        "uid": "_:Recycled Rubber 01101",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 01101",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 01101",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 01110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 01110",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 01110",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 01110"}],
                            "uid": "_:Pretreatment of cGRP 01110",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 01110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 01110"}
                            ],
                            "uid": "_:Reblending of cGRP 01110",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 01110",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 01110",
                                    "uid": "_:Recycled Rubber 01110",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 01110",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 01110",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 01110",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 01110"}
                            ],
                            "uid": "_:Curing of cGRP 01110",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 01110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 01110",
                                        "uid": "_:Recycled Rubber 01110",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 01110",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 01110",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 01111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 01111",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 01111",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 01111"}],
                            "uid": "_:Pretreatment of cGRP 01111",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 01111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 01111"}
                            ],
                            "uid": "_:Reblending of cGRP 01111",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 01111",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 01111",
                                    "uid": "_:Recycled Rubber 01111",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 01111",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 01111",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 01111",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 01111"}
                            ],
                            "uid": "_:Curing of cGRP 01111",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 01111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 01111",
                                        "uid": "_:Recycled Rubber 01111",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 01111",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 01111",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 10000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 10000",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 10000",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 10000"}],
                            "uid": "_:Pretreatment of cGRP 10000",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 10000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 10000"}
                            ],
                            "uid": "_:Reblending of cGRP 10000",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 10000",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 10000",
                                    "uid": "_:Recycled Rubber 10000",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 10000",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 10000",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 10000",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 10000"}
                            ],
                            "uid": "_:Curing of cGRP 10000",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 10000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 10000",
                                        "uid": "_:Recycled Rubber 10000",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 10000",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 10000",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 10001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 10001",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 10001",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 10001"}],
                            "uid": "_:Pretreatment of cGRP 10001",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 10001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 10001"}
                            ],
                            "uid": "_:Reblending of cGRP 10001",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 10001",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 10001",
                                    "uid": "_:Recycled Rubber 10001",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 10001",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 10001",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 10001",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 10001"}
                            ],
                            "uid": "_:Curing of cGRP 10001",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 10001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 10001",
                                        "uid": "_:Recycled Rubber 10001",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 10001",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 10001",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 10010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 10010",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 10010",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 10010"}],
                            "uid": "_:Pretreatment of cGRP 10010",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 10010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 10010"}
                            ],
                            "uid": "_:Reblending of cGRP 10010",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 10010",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 10010",
                                    "uid": "_:Recycled Rubber 10010",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 10010",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 10010",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 10010",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 10010"}
                            ],
                            "uid": "_:Curing of cGRP 10010",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 10010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 10010",
                                        "uid": "_:Recycled Rubber 10010",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 10010",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 10010",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 10011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 10011",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 10011",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 10011"}],
                            "uid": "_:Pretreatment of cGRP 10011",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 10011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 10011"}
                            ],
                            "uid": "_:Reblending of cGRP 10011",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 10011",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 10011",
                                    "uid": "_:Recycled Rubber 10011",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 10011",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 10011",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 10011",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 10011"}
                            ],
                            "uid": "_:Curing of cGRP 10011",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 10011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 10011",
                                        "uid": "_:Recycled Rubber 10011",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 10011",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 10011",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 10100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 10100",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 10100",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 10100"}],
                            "uid": "_:Pretreatment of cGRP 10100",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 10100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 10100"}
                            ],
                            "uid": "_:Reblending of cGRP 10100",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 10100",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 10100",
                                    "uid": "_:Recycled Rubber 10100",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 10100",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 10100",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 10100",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 10100"}
                            ],
                            "uid": "_:Curing of cGRP 10100",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 10100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 10100",
                                        "uid": "_:Recycled Rubber 10100",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 10100",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 10100",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 10101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 10101",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 10101",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 10101"}],
                            "uid": "_:Pretreatment of cGRP 10101",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 10101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 10101"}
                            ],
                            "uid": "_:Reblending of cGRP 10101",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 10101",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 10101",
                                    "uid": "_:Recycled Rubber 10101",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 10101",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 10101",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 10101",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 10101"}
                            ],
                            "uid": "_:Curing of cGRP 10101",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 10101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 10101",
                                        "uid": "_:Recycled Rubber 10101",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 10101",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 10101",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 10110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 10110",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 10110",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 10110"}],
                            "uid": "_:Pretreatment of cGRP 10110",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 10110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 10110"}
                            ],
                            "uid": "_:Reblending of cGRP 10110",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 10110",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 10110",
                                    "uid": "_:Recycled Rubber 10110",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 10110",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 10110",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 10110",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 10110"}
                            ],
                            "uid": "_:Curing of cGRP 10110",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 10110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 10110",
                                        "uid": "_:Recycled Rubber 10110",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 10110",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 10110",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 10111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 10111",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 10111",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 10111"}],
                            "uid": "_:Pretreatment of cGRP 10111",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 10111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 10111"}
                            ],
                            "uid": "_:Reblending of cGRP 10111",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 10111",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 10111",
                                    "uid": "_:Recycled Rubber 10111",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 10111",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 10111",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 10111",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 10111"}
                            ],
                            "uid": "_:Curing of cGRP 10111",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 10111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 10111",
                                        "uid": "_:Recycled Rubber 10111",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 10111",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 10111",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 11000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 11000",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 11000",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 11000"}],
                            "uid": "_:Pretreatment of cGRP 11000",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 11000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 11000"}
                            ],
                            "uid": "_:Reblending of cGRP 11000",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 11000",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 11000",
                                    "uid": "_:Recycled Rubber 11000",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 11000",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 11000",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 11000",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 11000"}
                            ],
                            "uid": "_:Curing of cGRP 11000",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 11000",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 11000",
                                        "uid": "_:Recycled Rubber 11000",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 11000",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 11000",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 11001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 11001",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 11001",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 11001"}],
                            "uid": "_:Pretreatment of cGRP 11001",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 11001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 11001"}
                            ],
                            "uid": "_:Reblending of cGRP 11001",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 11001",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 11001",
                                    "uid": "_:Recycled Rubber 11001",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 11001",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 11001",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 11001",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 11001"}
                            ],
                            "uid": "_:Curing of cGRP 11001",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 11001",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 11001",
                                        "uid": "_:Recycled Rubber 11001",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 11001",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 11001",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 11010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 11010",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 11010",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 11010"}],
                            "uid": "_:Pretreatment of cGRP 11010",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 11010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 11010"}
                            ],
                            "uid": "_:Reblending of cGRP 11010",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 11010",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 11010",
                                    "uid": "_:Recycled Rubber 11010",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 11010",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 11010",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 11010",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 11010"}
                            ],
                            "uid": "_:Curing of cGRP 11010",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 11010",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 11010",
                                        "uid": "_:Recycled Rubber 11010",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 11010",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 11010",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 11011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 11011",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 11011",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 11011"}],
                            "uid": "_:Pretreatment of cGRP 11011",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 11011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 11011"}
                            ],
                            "uid": "_:Reblending of cGRP 11011",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 11011",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 11011",
                                    "uid": "_:Recycled Rubber 11011",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 11011",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 11011",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 11011",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 11011"}
                            ],
                            "uid": "_:Curing of cGRP 11011",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 11011",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 11011",
                                        "uid": "_:Recycled Rubber 11011",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 11011",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 11011",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 11100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 11100",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 11100",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 11100"}],
                            "uid": "_:Pretreatment of cGRP 11100",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 11100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 11100"}
                            ],
                            "uid": "_:Reblending of cGRP 11100",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 11100",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 11100",
                                    "uid": "_:Recycled Rubber 11100",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 11100",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 11100",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 11100",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 11100"}
                            ],
                            "uid": "_:Curing of cGRP 11100",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 11100",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 11100",
                                        "uid": "_:Recycled Rubber 11100",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 11100",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 11100",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 11101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 11101",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 11101",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 11101"}],
                            "uid": "_:Pretreatment of cGRP 11101",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 11101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 11101"}
                            ],
                            "uid": "_:Reblending of cGRP 11101",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 11101",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 11101",
                                    "uid": "_:Recycled Rubber 11101",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 11101",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 11101",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 11101",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 11101"}
                            ],
                            "uid": "_:Curing of cGRP 11101",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 11101",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 11101",
                                        "uid": "_:Recycled Rubber 11101",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 11101",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 11101",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 11110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 11110",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 11110",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 11110"}],
                            "uid": "_:Pretreatment of cGRP 11110",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 11110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 11110"}
                            ],
                            "uid": "_:Reblending of cGRP 11110",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 11110",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 11110",
                                    "uid": "_:Recycled Rubber 11110",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 11110",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 11110",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 11110",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 11110"}
                            ],
                            "uid": "_:Curing of cGRP 11110",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 11110",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 11110",
                                        "uid": "_:Recycled Rubber 11110",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 11110",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 11110",
                        },
                        {
                            "node": "Process",
                            "name": "Coating of GRP 11111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 GRP",
                                        "uid": "_:F3 GRP",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry",
                                        "uid": "_:SCA dry",
                                    },
                                },
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "SCA dry low cement",
                                        "uid": "_:SCA dry low cement",
                                    },
                                },
                            ],
                            "product": [[]],
                            "uid": "_:Coating of GRP 11111",
                        },
                        {
                            "node": "Process",
                            "name": "Pretreatment of cGRP 11111",
                            "ingredient": [],
                            "product": [[]],
                            "prerequisite_process": [{"uid": "_:Coating of GRP 11111"}],
                            "uid": "_:Pretreatment of cGRP 11111",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP 11111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [
                                {"uid": "_:Pretreatment of cGRP 11111"}
                            ],
                            "uid": "_:Reblending of cGRP 11111",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP 11111",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber 11111",
                                    "uid": "_:Recycled Rubber 11111",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile Test 11111",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting 11111",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting 11111",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP 11111"}
                            ],
                            "uid": "_:Curing of cGRP 11111",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting 11111",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber 11111",
                                        "uid": "_:Recycled Rubber 11111",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile Test 11111",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting 11111",
                        },
                    ],
                    "data": [
                        {
                            "Tensile Test 00000": {
                                "node": "Data",
                                "name": "Tensile Test 00000",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 00000",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 00000",
                                                "uid": "_:Recycled Rubber 00000",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 00000",
                                },
                            },
                            "Tensile Test 00001": {
                                "node": "Data",
                                "name": "Tensile Test 00001",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 00001",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 00001",
                                                "uid": "_:Recycled Rubber 00001",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 00001",
                                },
                            },
                            "Tensile Test 00010": {
                                "node": "Data",
                                "name": "Tensile Test 00010",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 00010",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 00010",
                                                "uid": "_:Recycled Rubber 00010",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 00010",
                                },
                            },
                            "Tensile Test 00011": {
                                "node": "Data",
                                "name": "Tensile Test 00011",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 00011",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 00011",
                                                "uid": "_:Recycled Rubber 00011",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 00011",
                                },
                            },
                            "Tensile Test 00100": {
                                "node": "Data",
                                "name": "Tensile Test 00100",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 00100",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 00100",
                                                "uid": "_:Recycled Rubber 00100",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 00100",
                                },
                            },
                            "Tensile Test 00101": {
                                "node": "Data",
                                "name": "Tensile Test 00101",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 00101",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 00101",
                                                "uid": "_:Recycled Rubber 00101",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 00101",
                                },
                            },
                            "Tensile Test 00110": {
                                "node": "Data",
                                "name": "Tensile Test 00110",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 00110",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 00110",
                                                "uid": "_:Recycled Rubber 00110",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 00110",
                                },
                            },
                            "Tensile Test 00111": {
                                "node": "Data",
                                "name": "Tensile Test 00111",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 00111",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 00111",
                                                "uid": "_:Recycled Rubber 00111",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 00111",
                                },
                            },
                            "Tensile Test 01000": {
                                "node": "Data",
                                "name": "Tensile Test 01000",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 01000",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 01000",
                                                "uid": "_:Recycled Rubber 01000",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 01000",
                                },
                            },
                            "Tensile Test 01001": {
                                "node": "Data",
                                "name": "Tensile Test 01001",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 01001",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 01001",
                                                "uid": "_:Recycled Rubber 01001",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 01001",
                                },
                            },
                            "Tensile Test 01010": {
                                "node": "Data",
                                "name": "Tensile Test 01010",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 01010",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 01010",
                                                "uid": "_:Recycled Rubber 01010",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 01010",
                                },
                            },
                            "Tensile Test 01011": {
                                "node": "Data",
                                "name": "Tensile Test 01011",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 01011",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 01011",
                                                "uid": "_:Recycled Rubber 01011",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 01011",
                                },
                            },
                            "Tensile Test 01100": {
                                "node": "Data",
                                "name": "Tensile Test 01100",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 01100",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 01100",
                                                "uid": "_:Recycled Rubber 01100",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 01100",
                                },
                            },
                            "Tensile Test 01101": {
                                "node": "Data",
                                "name": "Tensile Test 01101",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 01101",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 01101",
                                                "uid": "_:Recycled Rubber 01101",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 01101",
                                },
                            },
                            "Tensile Test 01110": {
                                "node": "Data",
                                "name": "Tensile Test 01110",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 01110",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 01110",
                                                "uid": "_:Recycled Rubber 01110",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 01110",
                                },
                            },
                            "Tensile Test 01111": {
                                "node": "Data",
                                "name": "Tensile Test 01111",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 01111",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 01111",
                                                "uid": "_:Recycled Rubber 01111",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 01111",
                                },
                            },
                            "Tensile Test 10000": {
                                "node": "Data",
                                "name": "Tensile Test 10000",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 10000",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 10000",
                                                "uid": "_:Recycled Rubber 10000",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 10000",
                                },
                            },
                            "Tensile Test 10001": {
                                "node": "Data",
                                "name": "Tensile Test 10001",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 10001",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 10001",
                                                "uid": "_:Recycled Rubber 10001",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 10001",
                                },
                            },
                            "Tensile Test 10010": {
                                "node": "Data",
                                "name": "Tensile Test 10010",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 10010",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 10010",
                                                "uid": "_:Recycled Rubber 10010",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 10010",
                                },
                            },
                            "Tensile Test 10011": {
                                "node": "Data",
                                "name": "Tensile Test 10011",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 10011",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 10011",
                                                "uid": "_:Recycled Rubber 10011",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 10011",
                                },
                            },
                            "Tensile Test 10100": {
                                "node": "Data",
                                "name": "Tensile Test 10100",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 10100",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 10100",
                                                "uid": "_:Recycled Rubber 10100",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 10100",
                                },
                            },
                            "Tensile Test 10101": {
                                "node": "Data",
                                "name": "Tensile Test 10101",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 10101",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 10101",
                                                "uid": "_:Recycled Rubber 10101",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 10101",
                                },
                            },
                            "Tensile Test 10110": {
                                "node": "Data",
                                "name": "Tensile Test 10110",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 10110",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 10110",
                                                "uid": "_:Recycled Rubber 10110",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 10110",
                                },
                            },
                            "Tensile Test 10111": {
                                "node": "Data",
                                "name": "Tensile Test 10111",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 10111",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 10111",
                                                "uid": "_:Recycled Rubber 10111",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 10111",
                                },
                            },
                            "Tensile Test 11000": {
                                "node": "Data",
                                "name": "Tensile Test 11000",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 11000",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 11000",
                                                "uid": "_:Recycled Rubber 11000",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 11000",
                                },
                            },
                            "Tensile Test 11001": {
                                "node": "Data",
                                "name": "Tensile Test 11001",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 11001",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 11001",
                                                "uid": "_:Recycled Rubber 11001",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 11001",
                                },
                            },
                            "Tensile Test 11010": {
                                "node": "Data",
                                "name": "Tensile Test 11010",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 11010",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 11010",
                                                "uid": "_:Recycled Rubber 11010",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 11010",
                                },
                            },
                            "Tensile Test 11011": {
                                "node": "Data",
                                "name": "Tensile Test 11011",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 11011",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 11011",
                                                "uid": "_:Recycled Rubber 11011",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 11011",
                                },
                            },
                            "Tensile Test 11100": {
                                "node": "Data",
                                "name": "Tensile Test 11100",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 11100",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 11100",
                                                "uid": "_:Recycled Rubber 11100",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 11100",
                                },
                            },
                            "Tensile Test 11101": {
                                "node": "Data",
                                "name": "Tensile Test 11101",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 11101",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 11101",
                                                "uid": "_:Recycled Rubber 11101",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 11101",
                                },
                            },
                            "Tensile Test 11110": {
                                "node": "Data",
                                "name": "Tensile Test 11110",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 11110",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 11110",
                                                "uid": "_:Recycled Rubber 11110",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 11110",
                                },
                            },
                            "Tensile Test 11111": {
                                "node": "Data",
                                "name": "Tensile Test 11111",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting 11111",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber 11111",
                                                "uid": "_:Recycled Rubber 11111",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting 11111",
                                },
                            },
                        }
                    ],
                },
                {
                    "node": "Experiment",
                    "name": "Factorial Design with Controls",
                    "collection": "Calabrese et al. Rubber Recycling",
                    "processes": [
                        "Reblending of cGRP base control",
                        "Curing of cGRP base control",
                        "Die cutting base control",
                        "Reblending of cGRP trial control",
                        "Curing of cGRP trial contorl",
                        "Die cutting trial control",
                        "Reblending of cGRP negative control",
                        "Curing of cGRP negative control",
                        "Die cutting negative control",
                    ],
                    "process": [
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP base control",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Reblending of cGRP base control",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP base control",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber base control",
                                    "uid": "_:Recycled Rubber base control",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile test base control",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting base control",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting base control",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP base control"}
                            ],
                            "uid": "_:Curing of cGRP base control",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting base control",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber base control",
                                        "uid": "_:Recycled Rubber base control",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile test base control",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting base control",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP trial control",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Reblending of cGRP trial control",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP trial control",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber trial control",
                                    "uid": "_:Recycled Rubber trial control",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile test trial control",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting trial control",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting trial control",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP trial control"}
                            ],
                            "uid": "_:Curing of cGRP trial control",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting trial control",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber trial control",
                                        "uid": "_:Recycled Rubber trial control",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile test trial control",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting trial control",
                        },
                        {
                            "node": "Process",
                            "name": "Reblending of cGRP negative control",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "F3 uncured",
                                        "uid": "_:F3 uncured",
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Reblending of cGRP negative control",
                        },
                        {
                            "node": "Process",
                            "name": "Curing of cGRP negative control",
                            "ingredient": [],
                            "product": [
                                {
                                    "node": "Material",
                                    "name": "Recycled Rubber negative control",
                                    "uid": "_:Recycled Rubber negative control",
                                    "property": [
                                        {
                                            "node": "Property",
                                            "type": "none",
                                            "key": "mw_d",
                                            "value": "1",
                                            "method": "sec",
                                            "data": [
                                                {
                                                    "node": "Data",
                                                    "name": "Tensile test negative control",
                                                    "sample_preparation": {
                                                        "node": "Process",
                                                        "name": "Die cutting negative control",
                                                        "ingredient": [
                                                            {
                                                                "node": "Ingredient",
                                                                "material": {...},
                                                            }
                                                        ],
                                                        "product": [[]],
                                                        "prerequisite_process": [],
                                                        "uid": "_:Die cutting negative control",
                                                    },
                                                }
                                            ],
                                        }
                                    ],
                                }
                            ],
                            "prerequisite_process": [
                                {"uid": "_:Reblending of cGRP negative control"}
                            ],
                            "uid": "_:Curing of cGRP negative control",
                        },
                        {
                            "node": "Process",
                            "name": "Die cutting negative control",
                            "ingredient": [
                                {
                                    "node": "Ingredient",
                                    "material": {
                                        "node": "Material",
                                        "name": "Recycled Rubber negative control",
                                        "uid": "_:Recycled Rubber negative control",
                                        "property": [
                                            {
                                                "node": "Property",
                                                "type": "none",
                                                "key": "mw_d",
                                                "value": "1",
                                                "method": "sec",
                                                "data": [
                                                    {
                                                        "node": "Data",
                                                        "name": "Tensile test negative control",
                                                        "sample_preparation": {...},
                                                    }
                                                ],
                                            }
                                        ],
                                    },
                                }
                            ],
                            "product": [[]],
                            "prerequisite_process": [],
                            "uid": "_:Die cutting negative control",
                        },
                    ],
                    "data": [
                        {
                            "Tensile test base control": {
                                "node": "Data",
                                "name": "Tensile test base control",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting base control",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber base control",
                                                "uid": "_:Recycled Rubber base control",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting base control",
                                },
                            },
                            "Tensile test trial control": {
                                "node": "Data",
                                "name": "Tensile test trial control",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting trial control",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber trial control",
                                                "uid": "_:Recycled Rubber trial control",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting trial control",
                                },
                            },
                            "Tensile test negative control": {
                                "node": "Data",
                                "name": "Tensile test negative control",
                                "sample_preparation": {
                                    "node": "Process",
                                    "name": "Die cutting negative control",
                                    "ingredient": [
                                        {
                                            "node": "Ingredient",
                                            "material": {
                                                "node": "Material",
                                                "name": "Recycled Rubber negative control",
                                                "uid": "_:Recycled Rubber negative control",
                                                "property": [
                                                    {
                                                        "node": "Property",
                                                        "type": "none",
                                                        "key": "mw_d",
                                                        "value": "1",
                                                        "method": "sec",
                                                        "data": [{...}],
                                                    }
                                                ],
                                            },
                                        }
                                    ],
                                    "product": [[]],
                                    "prerequisite_process": [],
                                    "uid": "_:Die cutting negative control",
                                },
                            },
                        }
                    ],
                },
                {
                    "node": "Experiment",
                    "name": "Analysis of Factorial Design",
                    "process": [],
                    "data": [
                        {
                            "node": "Data",
                            "name": "Effect factors",
                        }
                    ],
                    "computation": [
                        {
                            "node": "Computaton",
                            "name": "Analysis of Factorial Design",
                            "uid": "_:Analysis of Factorial Design",
                        }
                    ],
                },
            ],
            "citation": [
                {
                    "node": "Citation",
                    "reference": {
                        "node": "Reference",
                        "name": "10.1021/acsapm.0c01343",
                        "type": "journal_article",
                        "title": "Development of a Rubber Recycling Process Based on a Single-Component Interfacial Adhesive",
                        "authors": [
                            "Michelle A. Calabrese",
                            "Wui Yarn Chan",
                            "Sarah H.M. Av-Ron" "Bradley D. Olsen",
                        ],
                        "journal": "Applied Polymer Materials",
                        "publisher": "American Chemical Society",
                        "year": "2021",
                        "volume": "3",
                        "pages": "4849-4860",
                        "doi": "10.1021/acsapm.0c01343",
                    },
                }
            ],
        }
    ],
    "material": [
        {
            "node": "Material",
            "name": "High-cis polybutadiene",
            "uid": "_:High-cis polybutadiene",
        },
        {
            "node": "Material",
            "name": "Vulcanizing fluid 760 (cement)",
            "uid": "_:Vulcanizing fluid 760 (cement)",
        },
        {"node": "Material", "name": "Carbon Black N330", "uid": "_:Carbon Black N330"},
        {"node": "Material", "name": "Cushion Gum", "uid": "_:Cushion Gum"},
        {"node": "Material", "name": "Stearic Acid", "uid": "_:Stearic Acid"},
        {"node": "Material", "name": "toluene", "uid": "_:toluene"},
        {"node": "Material", "name": "Zinc Oxide", "uid": "_:Zinc Oxide"},
        {"node": "Material", "name": "BHT", "uid": "_:BHT"},
        {"node": "Material", "name": "TBBS", "uid": "_:TBBS"},
        {"node": "Material", "name": "sulfur", "uid": "_:sulfur"},
        {"node": "Material", "name": "F3 uncured", "uid": "_:F3 uncured"},
        {"node": "Material", "name": "F3 cured", "uid": "_:F3 cured"},
        {"node": "Material", "name": "F3 GRP", "uid": "_:F3 GRP"},
        {"node": "Material", "name": "F3 masterbatch", "uid": "_:F3 masterbatch"},
        {
            "node": "Material",
            "name": "Recycled Rubber 00000",
            "uid": "_:Recycled Rubber 00000",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 00001",
            "uid": "_:Recycled Rubber 00001",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 00010",
            "uid": "_:Recycled Rubber 00010",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 00011",
            "uid": "_:Recycled Rubber 00011",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 00100",
            "uid": "_:Recycled Rubber 00100",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 00101",
            "uid": "_:Recycled Rubber 00101",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 00110",
            "uid": "_:Recycled Rubber 00110",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 00111",
            "uid": "_:Recycled Rubber 00111",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 01000",
            "uid": "_:Recycled Rubber 01000",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 01001",
            "uid": "_:Recycled Rubber 01001",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 01010",
            "uid": "_:Recycled Rubber 01010",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 01011",
            "uid": "_:Recycled Rubber 01011",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 01100",
            "uid": "_:Recycled Rubber 01100",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 01101",
            "uid": "_:Recycled Rubber 01101",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 01110",
            "uid": "_:Recycled Rubber 01110",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 01111",
            "uid": "_:Recycled Rubber 01111",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 10000",
            "uid": "_:Recycled Rubber 10000",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 10001",
            "uid": "_:Recycled Rubber 10001",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 10010",
            "uid": "_:Recycled Rubber 10010",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 10011",
            "uid": "_:Recycled Rubber 10011",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 10100",
            "uid": "_:Recycled Rubber 10100",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 10101",
            "uid": "_:Recycled Rubber 10101",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 10110",
            "uid": "_:Recycled Rubber 10110",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 10111",
            "uid": "_:Recycled Rubber 10111",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 11000",
            "uid": "_:Recycled Rubber 11000",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 11001",
            "uid": "_:Recycled Rubber 11001",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 11010",
            "uid": "_:Recycled Rubber 11010",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 11011",
            "uid": "_:Recycled Rubber 11011",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 11100",
            "uid": "_:Recycled Rubber 11100",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 11101",
            "uid": "_:Recycled Rubber 11101",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 11110",
            "uid": "_:Recycled Rubber 11110",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber 11111",
            "uid": "_:Recycled Rubber 11111",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber trial control",
            "uid": "_:Recycled Rubber trial control",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber base control",
            "uid": "_:Recycled Rubber base control",
        },
        {
            "node": "Material",
            "name": "Recycled Rubber negative control",
            "uid": "_:Recycled Rubber negative control",
        },
        {"node": "Material", "name": "Liquid Nitrogen", "uid": "_:Liquid Nitrogen"},
        {
            "node": "Material",
            "name": "Vulcanizing Fluid 760 solids fraction",
            "uid": "_:Vulcanizing Fluid 760 solids fraction",
        },
        {"node": "Material", "name": "SCA wet toluene", "uid": "_:SCA wet toluene"},
        {"node": "Material", "name": "SCA dry", "uid": "_:SCA dry"},
        {
            "node": "Material",
            "name": "SCA dry low cement",
            "uid": "_:SCA dry low cement",
        },
    ],
}