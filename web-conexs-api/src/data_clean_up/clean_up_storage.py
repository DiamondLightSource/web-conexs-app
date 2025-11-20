import argparse
import logging
import os
import shutil
import sys
from contextlib import contextmanager
from datetime import datetime, timedelta
from pathlib import Path
from typing import List

from web_conexs_api.database import get_session

from .crud import set_simulation_deleted

logger = logging.getLogger(__name__)

STORAGE_DIR = os.environ.get("CONEXS_STORAGE_DIR")
STORAGE_DAYS = os.environ.get("CONEXS_STORAGE_DAYS", "30")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--dry-run", action="store_true")

    args = parser.parse_args()
    dry_run = args.dry_run

    rootlogger = logging.getLogger()
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(formatter)
    rootlogger.addHandler(sh)
    rootlogger.setLevel(logging.DEBUG)
    rootlogger.debug("Logging Configured")

    if STORAGE_DIR is None:
        logger.error("Storage dir environment not configured!")
        return

    try:
        days = int(STORAGE_DAYS)
    except ValueError:
        logger.error("Could not parse days to store")
        return

    message = "dry run " if dry_run else ""

    logger.info(f"Running {message}clean-up on {STORAGE_DIR}")

    del_date = datetime.now() - timedelta(days=days)
    del_stamp = del_date.timestamp()
    deleted = clean_up(Path(STORAGE_DIR), del_stamp, dry_run)

    if len(deleted) != 0:
        logger.debug(
            f"Flagged for deletion: {len(deleted)}," + f" {deleted[0]} to {deleted[-1]}"
        )
    else:
        logger.debug("No files flagged for deletion")


def clean_up(storage_dir: Path, del_date: int, dry_run: bool = False):
    deleted = []

    for x in storage_dir.iterdir():
        if x.is_dir():
            for y in x.iterdir():
                if y.is_dir():
                    check_dir(y, del_date, dry_run, deleted)

    return deleted


def check_dir(sim_dir: Path, del_date: int, dry_run: bool, deleted: List):
    dir_time = sim_dir.stat().st_mtime
    if dir_time < del_date:
        deleted.append(sim_dir)
        if not dry_run:
            remove_dir(sim_dir)


def remove_dir(directory: Path):
    logger.debug(f"Removing directory: {directory}")
    shutil.rmtree(directory)
    with contextmanager(get_session)() as session:
        set_simulation_deleted(session, str(directory))
