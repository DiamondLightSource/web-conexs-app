import datetime
import os
import re
import uuid
from pathlib import Path
from typing import List, TypeVar

import numpy as np
from fastapi import HTTPException
from fastapi_pagination.cursor import CursorPage
from fastapi_pagination.customization import (
    CustomizedPage,
    UseQuotedCursor,
)
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlmodel import Session, or_, select

from .jobfilebuilders import build_orca_input_file
from .models.models import (
    CrystalStructure,
    CrystalStructureInput,
    FdmnesSimulation,
    FdmnesSimulationInput,
    MolecularStructure,
    MolecularStructureInput,
    OrcaSimulation,
    OrcaSimulationInput,
    Simulation,
    SimulationStatus,
    StructureType,
)
from .periodictable import periodic_table

# T = TypeVar("T")

# CustomPage = CustomizedPage[
#     Page[T],
#     UseParamsFields(
#         # change default size to be 5, increase upper limit to 1 000
#         size=Query(5, ge=1, le=1_000),
#     ),
# ]

root_working_location = os.environ.get("ROOT_WORKING_DIRECTORY", "/iris")
T = TypeVar("T")

CursorPageNotQuotedCursor = CustomizedPage[
    CursorPage[T],
    UseQuotedCursor(False),
]


def get_working_directory(user, application):
    p = Path(root_working_location) / Path(user) / Path(f"{application}_{uuid.uuid4()}")

    p.mkdir(parents=True)

    return str(p)


def get_crystal_structures(session):
    statement = select(CrystalStructure)

    results = session.exec(statement)

    return results.all()


def get_crystal_structure(session, id):
    structure = session.get(CrystalStructure, id)

    if structure:
        return structure
    else:
        raise HTTPException(status_code=404, detail=f"No structure with id={id}")


def upload_crystal_structure(structure: CrystalStructureInput, session):
    crystal = CrystalStructure.model_validate(structure)

    session.add(crystal)
    session.commit()
    session.refresh(crystal)

    return crystal


def get_molecular_structures(session):
    statement = select(MolecularStructure)

    results = session.exec(statement)

    return results.all()


def get_molecular_structure(session, id):
    structure = session.get(MolecularStructure, id)

    if structure:
        return structure
    else:
        raise HTTPException(status_code=404, detail=f"No structure with id={id}")


def upload_molecular_structure(structure: MolecularStructureInput, session):
    molecule = MolecularStructure.model_validate(structure)
    molecule.person_id = 1

    session.add(molecule)
    session.commit()
    session.refresh(molecule)

    return molecule


def get_simulations(session) -> List[Simulation]:
    statement = select(Simulation)

    results = session.exec(statement)

    return results.all()


def get_simulations_page(session) -> CursorPage[Simulation]:
    # set_page(CursorPage[Simulation])
    # set_params(CursorParams(size=10))
    # set_page(CursorPageNotQuotedCursor[Simulation])

    statement = select(Simulation)

    return paginate(session, statement.order_by(Simulation.id.desc()))


def get_submitted_simulations(session) -> List[Simulation]:
    statement = select(Simulation).where(
        Simulation.status == SimulationStatus.requested
    )
    return session.exec(statement).all()


def get_active_simulations(session) -> List[Simulation]:
    statement = select(Simulation).where(
        or_(
            Simulation.status == SimulationStatus.submitted,
            Simulation.status == SimulationStatus.running,
        )
    )
    return session.exec(statement).all()


def update_simulation(session, simulation: Simulation):
    session.add(simulation)
    session.commit()
    session.refresh(simulation)
    return simulation


def get_simulation(session, id):
    simulation = session.get(Simulation, id)

    if simulation:
        print(simulation)
        print(simulation.simulation_type)
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def get_orca_simulation(session, id) -> OrcaSimulation:
    simulation = session.get(OrcaSimulation, id)

    if simulation:
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def get_orca_jobfile(session, id):
    return get_orca_jobfile[0]


def get_orca_jobfile_with_technique(session, id):
    orca_simulation = get_orca_simulation(session, id)
    structure = get_molecular_structure(session, orca_simulation.molecular_structure_id)

    print(orca_simulation)
    jobfile = build_orca_input_file(orca_simulation, structure)
    print(jobfile)

    return jobfile, orca_simulation.calculation_type


def submit_orca_simulation(orca_input: OrcaSimulationInput, session: Session):
    wd = get_working_directory("test_user", "Orca")

    smodel = {
        "person_id": 1,
        "simulation_type_id": 1,
        "request_date": datetime.datetime.now(),
        "working_directory": wd,
    }

    simulation = Simulation.model_validate(smodel)
    orca = OrcaSimulation.model_validate(orca_input)
    orca.simulation = simulation

    session.add(orca)
    session.commit()
    session.refresh(orca)

    return orca


def submit_fdmnes_simulation(fdmnes_input: FdmnesSimulationInput, session: Session):
    smodel = {
        "person_id": 1,
        "simulation_type_id": 2,
        "request_date": datetime.datetime.now(),
        "working_directory": get_working_directory("test_user", "Fdmnes"),
    }

    #     "status": SimulationStatus.requested,
    # "request_date":None,
    # "submission_date":None,
    # "completion_date":None,

    simulation = Simulation.model_validate(smodel)
    fdmnes = FdmnesSimulation.model_validate(fdmnes_input)
    fdmnes.simulation = simulation

    session.add(fdmnes)
    session.commit()
    session.refresh(fdmnes)

    return fdmnes


def get_fdmnes_simulation(session, id) -> FdmnesSimulation:
    simulation = session.get(FdmnesSimulation, id)

    if simulation:
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def get_fdmnes_jobfile(session, id):
    fdmnes_simulation = get_fdmnes_simulation(session, id)
    structure = get_crystal_structure(session, fdmnes_simulation.crystal_structure_id)
    jobfile = "Filout\nresult\n\nRange\n"
    jobfile += "-10. 0.25 50 !E_min, step, E_intermediate, step ...\n\n"

    jobfile += "Edge\n"
    jobfile += str(fdmnes_simulation.edge.value).capitalize() + "\n\n"

    jobfile += "Z_absorber\n"
    jobfile += str(fdmnes_simulation.element) + "\n\n"

    jobfile += "SCF         !Performs self-consistent calculation\n"
    jobfile += (
        "Energpho    !Output energy relative to the photon energy of absorbing atom\n\n"
    )

    if fdmnes_simulation.greens_approach:
        jobfile += "Green\n"

    jobfile += "Quadrupole\n"

    if fdmnes_simulation.edge.value.startswith("l"):
        jobfile += "Spinorbit\n"

    jobfile += "\n"
    jobfile += "Radius"
    jobfile += " ! Radius of the cluster where final state calculation is performed\n"
    jobfile += "6" + "\n\n"

    if fdmnes_simulation.structure_type == StructureType.crystal:
        jobfile += "Crystal        ! Periodic material description (unit cell)\n"
    else:
        jobfile += "Molecule       ! Periodic or cylindrical or spherical coordinates\n"

    jobfile += f"{structure.a} {structure.b} {structure.c}"
    jobfile += f"{structure.alpha} {structure.beta} {structure.gamma}\n"

    keys = (re.escape(k) for k in periodic_table.keys())
    pattern = re.compile(r"\b(" + "|".join(keys) + r")\b")

    result = pattern.sub(lambda x: str(periodic_table[x.group()]), structure.structure)
    jobfile += result

    jobfile += "\n\nConvolution\n\nEnd"

    return jobfile


def get_fdmnes_output(session, id):
    fdmnes_simulation = get_fdmnes_simulation(session, id)

    wd = fdmnes_simulation.simulation.working_directory

    result_file = wd + "/fdmnes_result.txt"

    with open(result_file) as fh:
        file = fh.read()

        return file


def get_orca_output(session, id):
    orca_simulation = get_orca_simulation(session, id)

    wd = orca_simulation.simulation.working_directory

    result_file = wd + "/orca_result.txt"

    with open(result_file) as fh:
        file = fh.read()

        return file


def get_orca_xyz(session, id):
    orca_simulation = get_orca_simulation(session, id)

    wd = orca_simulation.simulation.working_directory

    result_file = wd + "/job.xyz"

    with open(result_file) as fh:
        file = fh.read()

        return file


def get_fdmnes_xas(session, id):
    fdmnes_simulation = get_fdmnes_simulation(session, id)

    wd = fdmnes_simulation.simulation.working_directory

    result_file = wd + "/result_conv.txt"

    if not os.path.isfile(result_file):
        raise HTTPException(status_code=404, detail="Item not found")

    out = np.loadtxt(result_file, skiprows=1)

    output = {"energy": out[:, 0].tolist(), "xas": out[:, 1].tolist()}

    return output


def get_orca_xas(session, id):
    orca_simulation = get_orca_simulation(session, id)

    wd = orca_simulation.simulation.working_directory

    result_file = wd + "/orca_result.txt.absq.dat"

    result_stk = wd + "/orca_result.txt.absq.stk"

    if not os.path.isfile(result_file):
        raise HTTPException(status_code=404, detail="Item not found")

    out = np.loadtxt(result_file)
    out_stk = np.loadtxt(result_stk)

    stk_energy = np.zeros_like(out_stk[:, 0], shape=[out_stk[:, 0].shape[0] * 3])
    stk_energy[0::3] = out_stk[:, 0]
    stk_energy[1::3] = out_stk[:, 0]
    stk_energy[2::3] = out_stk[:, 0]

    print(out_stk.shape)
    print(out_stk)

    stk_xas = np.zeros_like(out_stk[:, 0], shape=[out_stk[:, 0].shape[0] * 3])
    stk_xas[1::3] = out_stk[:, 1]

    output = {
        "energy": out[:, 0].tolist(),
        "xas": out[:, 1].tolist(),
        "stk_energy": stk_energy.tolist(),
        "stk_xas": stk_xas.tolist(),
    }

    return output
