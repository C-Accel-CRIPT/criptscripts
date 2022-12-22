"""
Run script to initlize liquid measurement runs
"""
import os
import sys
from types import SimpleNamespace

from elwood.configure import _RUN_SCRIPT, create_jobs
from elwood.execute import execute_uid
from elwood.execute.analyze_util import AnalysisHandle
from elwood.execute.run_util import set_job_error, set_job_finished, set_job_running
from elwood.json_handle import StatusHandle


def main(argv):
    """
    Main function executing the script.
    """
    if len(argv) != 1:
        print("Usage: python prepare.py uid")
        raise RuntimeError("Invalid cli args for prepare.py")

    set_job_running("set_liquid_runs")

    with AnalysisHandle(".", True) as ana:
        for mes in ana["measurements"]:
            if mes["name"] == "glass transition temperature":
                tglass = mes["value"]
                tg_err = mes["error"]

    with StatusHandle(".", False) as status:
        safe_tg_distance = status["safe_tg_distance"]
        new_temperatures = []
        for temp in status["temperature"]:
            if temp > tglass + tg_err + safe_tg_distance:
                new_temperatures.append(temp)
        status["temperature"] = new_temperatures

    set_job_finished("set_liquid_runs")
    path = os.getcwd()
    uid = os.path.split(path)[1]
    os.chdir("..")

    create_jobs(uid, _RUN_SCRIPT["set_liquid_runs"])

    with StatusHandle(uid, True) as status:
        args = SimpleNamespace(**status)
    execute_uid(args, uid)
    os.chdir(path)


if __name__ == "__main__":
    try:
        main(sys.argv)
    except Exception as exception:
        set_job_error("set_liquid_runs")
        raise exception
