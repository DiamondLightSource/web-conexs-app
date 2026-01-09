import glob
import logging
import os
import shutil
from pathlib import Path

logger = logging.getLogger(__name__)


def check_filesystem(path):
    logger.info(f"Attempting to stat {path}")
    Path(path).stat()


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


def transfer_inputs(file_map: dict[str, str], destination):
    dest = Path(destination)
    parent = dest.parent

    if not parent.exists:
        parent.mkdir()

    dest.mkdir()

    for k, v in file_map.items():
        input_file = dest / k
        with open(input_file, "w+") as f:
            f.write(v)


def transfer_results(simulation_type_id, result_dir, storage_dir):
    logger.info(f"Attempting to transfer {result_dir} to {storage_dir}")

    ignore_pattern = None

    if simulation_type_id == 1:
        # orca
        ignore_files = [
            "*.tmp*",
            "*.gbw",
            "*.prop",
            "*.cis",
            "*.cube",
            "*.full_log",
            "*.scfp",
            "*.scfr",
        ]
        ignore_pattern = shutil.ignore_patterns(*ignore_files)
    elif simulation_type_id == 3:
        # qe
        ignore_files = ["*.UPF", "*.wfc", "xanes.sav"]
        ignore_pattern = shutil.ignore_patterns(*ignore_files)

    store_path = Path(storage_dir)
    parent = store_path.parent

    if not parent.exists:
        parent.mkdir()

    if not store_path.exists:
        store_path.mkdir()

    shutil.copytree(
        result_dir,
        storage_dir,
        ignore=ignore_pattern,
        dirs_exist_ok=True,
    )


def clean_up(directory):
    remove = [
        "*.tmp",
        "*.cube",
        "*.UPF",
        "*.wfc",
        "job.gbw",
        "job.scfp",
        "result_bav.txt",
        "job.opt",
        "orca_result.full_log",
    ]

    p = Path(directory)

    for r in remove:
        for filepath in glob.glob(str(p / r)):
            try:
                # Attempt to delete the file
                os.remove(filepath)
            except Exception as e:
                # Handle any errors that occur during deletion
                logger.exception(f"Not unlinked {filepath}: {e}")
