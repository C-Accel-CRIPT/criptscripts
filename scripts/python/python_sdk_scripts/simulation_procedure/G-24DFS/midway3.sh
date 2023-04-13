#!/bin/bash
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --gres=gpu:1
#SBATCH --account=pi-depablo
#SBATCH --partition=depablo-gpu

# load needed modules
source midway3_modules.sh
