#!/usr/bin/bash
module purge
module load rcc
module load slurm
module load python

env_path="$(dirname "$(realpath "${BASH_SOURCE[0]}")")/environment.yml"
if [[ -f ${env_path} ]]; then
	conda env create --force -f "${env_path}"
fi
conda activate elwood
