import logging
import shutil
import tempfile
from pathlib import Path

logger = logging.getLogger(__name__)


def check_filesystem(path):
    logger.info(f"Attempting to stat {path}")
    Path(path).stat()


def make_directory(path):
    logger.info(f"Attempting to make directory {path}")
    Path(path).mkdir(parents=True)


def copy_directory(source, destination):
    logger.info(f"Attempting to make copy {source} to {destination}")

    parent = Path(destination).parent

    if not parent.exists:
        parent.mkdir()

    shutil.copytree(source, destination)


def copy_multiple_files(abs_paths: list[str], destination):
    logger.info(f"Attempting to make copy multiple files to {destination}")
    for p in abs_paths:
        shutil.copy(p, destination)


def transfer_inputs(file_map: dict[str, str], final_dir):
    with tempfile.TemporaryDirectory() as tmpdirname:
        for k, v in file_map.items():
            input_file = tmpdirname + "/" + k
            with open(input_file, "w+") as f:
                f.write(v)

        return copy_directory(tmpdirname, final_dir)


def transfer_results(simulation_type_id, result_dir, storage_dir):
    logger.info(f"Attempting to transfer {result_dir} to {storage_dir}")

    ignore_pattern = None

    if simulation_type_id == 1:
        # orca
        ignore_files = ["*.tmp", "*.gbw", "*.prop", "*.cis"]
        ignore_pattern = shutil.ignore_patterns(*ignore_files)
    elif simulation_type_id == 3:
        # qe
        ignore_files = ["*.UPF", "*.wfc", "xanes.sav"]
        ignore_pattern = shutil.ignore_patterns(*ignore_files)

    parent = Path("/cake")

    if not parent.exists:
        parent.mkdir()

    shutil.copytree(result_dir, storage_dir, ignore=ignore_pattern, dirs_exist_ok=True)
