import { AFRLtoJSON } from "../src/scripts/python-converted-script";
import { data } from "./data/data";

// Instantiate AFRL to JSON serializer
const serializer = new AFRLtoJSON(/* use default options */);

// Serialize data
const obj = serializer.to_JSON(data);

// Log result
console.log(JSON.stringify(obj));

// TODO: write to output file