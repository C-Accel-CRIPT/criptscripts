#!/bin/sh
#
# Simple bash to run some script at once.
# This script is run triggered by npm test
#

# exit when a command does not return 0
set -e

# clean the output folder
echo "Test will start in a second...";
echo "WARNING: the ./out folder will be deleted recursively (cancel with Ctrl+C)";
sleep 3
rm -rf ./out

# Increase node memory to handle conversions
export NODE_OPTIONS=--max-old-space-size=16000

npm run afrl || (echo "Unable to run AFRL"; exit 1);
npm run bcdb || (echo "Unable to run BCDB (the issue is well known, see comments in ./src/utilities/cript-json.ts)"; exit 1);
npm run rcbc || (echo "Unable to run RCBC"; exit 1);