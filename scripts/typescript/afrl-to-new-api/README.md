# AFRL transformation script

The purpose of this node script is to convert AFRL dataset to a CRIPT compatible JSON.
Related to: https://trello.com/c/4eTnhJrp/29-transform-the-afrl-dataset

# `npm i`

Will install this npm package and dependencies.

# `npm start`

Will run the AFRL CSV to JSON script and produce multiple JSON in the [./out](./out) folder from the CSV file present in [./src/data](./src/data) folder.

After a run, check the *.errors.json file to be sure you do not skip important data.
Then, you can upload the data to CRIPT using curl:

```
curl -X POST -H "Content-Type: application/json" -d "@./out/afrl-transformed.min.json" <host>/project/ --header "authorization: Bearer <token>"
```

# How it works?

Step by step of what the script does on a macro level (for more details look at the source code).

- Load the data (`./src/data/*.csv`) as an `Array<AFRLData>`.
- For each CSV line (or object), we create 3 `Material`s (a mixture, a solvent, and a polymer) with some `Property`, `Condition` and `Citation` (`doi` is stored in a `Reference`) on it.
- Each type of material is registered in a dedicated `Inventory`.
- Inventories are store in a single `Collection` which is in a single `Project`.
- The `Project` is serialized as a single JSON (in two version, one minified and an other human-readable).
- If some data cannot be transformed, logs are added to the *.errors.json file.

# History

This script was using Python originaly, last commit was from December 2022. I figured out the python version was existing **after** starting this task, that's why I used typescript.

However, I couldn't use Python (no experience and culture) and the PythonSDK (still in development), so I decided to continue this way.

Berenger.
