"""
Run script for OpenMM to execute simulations that quench the simulation by heating to measure Tg.
"""
import sys

from elwood.execute.run_util import set_job_error, set_job_finished, set_job_running
from elwood.json_handle import StatusHandle
from quench import run_quench


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 1:
        print("Usage: python quench_up.py")
        raise RuntimeError("Invalid cli args for quench_up.py")

    seed = set_job_running("quench_up")

    with StatusHandle(".", True) as status:
        high_temp = status["max_temperature"]
        low_temp = status["min_temperature"]

    run_quench(low_temp, high_temp, "quench_end-{0}.xml".format(low_temp), [], seed)

    set_job_finished("quench_up")


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("quench_up")
        raise exception
