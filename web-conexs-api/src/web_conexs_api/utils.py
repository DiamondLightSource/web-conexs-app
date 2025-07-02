import fnmatch
import os
import zipfile
from io import BytesIO

# not gbw
# orca_result .inp .out .xyz
# everything but xanes.sav for qe
smtp_files = "*.out, *.txt, job*, orca_result*, *_conv.txt, xanes.*, result.*"


def create_results_zip(working_directory: str, simulation_type_id: int):
    if not os.path.isdir(working_directory):
        raise RuntimeError(f"Working directory {working_directory} does not exist")

    if simulation_type_id == 1:
        # orca
        include_files = ["orca_result*", "job.inp", "*.out", "*.xyz"]
    elif simulation_type_id == 2:
        # fdmnes
        include_files = ["*.txt", "*.out"]
    elif simulation_type_id == 3:
        # qe
        include_files = ["*.UPF", "*.wfc", "*.inp", "*.pwo", "*.dat"]
    else:
        raise RuntimeError("Simulation type id not recognised")

    zip_buffer = BytesIO()
    with zipfile.ZipFile(
        file=zip_buffer,
        mode="w",
        compression=zipfile.ZIP_DEFLATED,
    ) as zip_archive:
        for file in os.listdir(working_directory):
            for wildcard in include_files:
                if fnmatch.fnmatch(file, wildcard):
                    zip_archive.write(
                        os.path.join(working_directory, file), arcname=file
                    )
                    continue

    zip_buffer.seek(0)

    return zip_buffer
