# AFRL transformation script

The purpose of this node script is to convert AFRL dataset to a CRIPT compatible JSON.
Related to: https://trello.com/c/4eTnhJrp/29-transform-the-afrl-dataset

# `npm i`

Will install this npm package and dependencies.

# `npm start`

Will run the AFRL to JSON script.

# How it works?

Step by step of what the script does on a macro level (for more details look at the source code).

- Load the data (`./src/data/data.ts`) as an `Array<AFRLData>` (statically type-checked).
- For each data, we create 3 `Material`s (mixture, solvent, polymer) with some `Property`, `Condition` and `Citation` (`doi` store in a `Reference`) on it.
- Each type of material is registered in a dedicated `Inventory`.
- Inventories are store in a single `Collection` which is in a single `Project`.
- The `Project` is serialized as a single JSON (in two version, one minified and an other human-readable).
- If some data cannot be transformed, a log is produced and transoformation stops before to save the JSON.


# History

This script was using Python originaly, last commit was from December 2022. I figured out the python version was existing **after** starting this task, that's why I used typescript.

However, I couldn't us Python (no experience) and the PythonSDK (in development), so I decided to continue this way.

Berenger.
