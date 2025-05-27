import datetime
import os
from typing import List

import numpy as np
from fastapi import HTTPException
from fastapi_pagination.cursor import CursorPage
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlmodel import Session, and_, select

from .jobfilebuilders import build_fdmnes_inputfile, build_orca_input_file
from .models.models import (
    CrystalStructure,
    CrystalStructureInput,
    FdmnesSimulation,
    FdmnesSimulationInput,
    MolecularStructure,
    MolecularStructureInput,
    OrcaSimulation,
    OrcaSimulationInput,
    Person,
    PersonInput,
    Simulation,
)


def get_crystal_structures(session, user_id) -> List[CrystalStructure]:
    statement = (
        select(CrystalStructure).join(Person).where(Person.identifier == user_id)
    )

    results = session.exec(statement)

    return results.all()


def get_crystal_structure(session, id, user_id) -> CrystalStructure:
    statement = (
        select(CrystalStructure)
        .join(Person)
        .where(and_(Person.identifier == user_id, CrystalStructure.id == id))
    )

    structure = session.exec(statement).first()
    if structure:
        return structure
    else:
        raise HTTPException(status_code=404, detail=f"No structure with id={id}")


def get_or_create_person(session: Session, user_id: str):
    statement = select(Person).where(Person.identifier == user_id)

    person = session.exec(statement).first()

    if person is None:
        p = PersonInput(identifier=user_id)
        person = Person.model_validate(p)

        session.add(person)
        session.commit()
        session.refresh(person)

    return person


def upload_crystal_structure(
    structure: CrystalStructureInput, session, user_id
) -> CrystalStructure:
    person = get_or_create_person(session, user_id)

    crystal = CrystalStructure.model_validate(structure)
    crystal.person_id = person.id

    session.add(crystal)
    session.commit()
    session.refresh(crystal)

    return crystal


def get_molecular_structures(session, user_id) -> List[MolecularStructure]:
    statement = (
        select(MolecularStructure).join(Person).where(Person.identifier == user_id)
    )

    results = session.exec(statement)

    return results.all()


def get_molecular_structure(session, id, user_id) -> MolecularStructure:
    statement = (
        select(MolecularStructure)
        .join(Person)
        .where(and_(Person.identifier == user_id, MolecularStructure.id == id))
    )

    structure = session.exec(statement).first()

    if structure:
        return structure
    else:
        raise HTTPException(status_code=404, detail=f"No structure with id={id}")


def upload_molecular_structure(
    structure: MolecularStructureInput, session, user_id
) -> MolecularStructure:
    person = get_or_create_person(session, user_id)

    molecule = MolecularStructure.model_validate(structure)
    molecule.person_id = person.id

    session.add(molecule)
    session.commit()
    session.refresh(molecule)

    return molecule


def get_simulations(session, user_id) -> List[Simulation]:
    statement = select(Simulation).join(Person).where(Person.identifier == user_id)

    results = session.exec(statement)

    return results.all()


def get_simulations_page(session, user_id) -> CursorPage[Simulation]:
    statement = select(Simulation).join(Person).where(Person.identifier == user_id)

    return paginate(session, statement.order_by(Simulation.id.desc()))


def get_simulation(session, id, user_id):
    statement = select(Simulation).join(Person).where(Simulation.id == id)

    simulation = session.exec(statement).first()

    if simulation:
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def get_orca_simulation(session, id, user_id) -> OrcaSimulation:
    statement = (
        select(OrcaSimulation)
        .join(Simulation)
        .join(Person)
        .where(and_(Person.identifier == user_id, OrcaSimulation.simulation_id == id))
    )

    simulation = session.exec(statement).first()

    if simulation:
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def submit_orca_simulation(
    orca_input: OrcaSimulationInput, session: Session, user_id
) -> OrcaSimulation:
    person = get_or_create_person(session, user_id)

    smodel = {
        "person_id": person.id,
        "simulation_type_id": 1,
        "request_date": datetime.datetime.now(),
    }

    simulation = Simulation.model_validate(smodel)
    orca = OrcaSimulation.model_validate(orca_input)
    orca.simulation = simulation

    session.add(orca)
    session.commit()
    session.refresh(orca)

    return orca


def submit_fdmnes_simulation(
    fdmnes_input: FdmnesSimulationInput, session: Session, user_id: str
) -> FdmnesSimulation:
    person = get_or_create_person(session, user_id)

    smodel = {
        "person_id": person.id,
        "simulation_type_id": 2,
        "request_date": datetime.datetime.now(),
    }

    simulation = Simulation.model_validate(smodel)
    fdmnes = FdmnesSimulation.model_validate(fdmnes_input)
    fdmnes.simulation = simulation

    session.add(fdmnes)
    session.commit()
    session.refresh(fdmnes)

    return fdmnes


def get_fdmnes_simulation(session, id, user_id) -> FdmnesSimulation:
    statement = (
        select(FdmnesSimulation)
        .join(Simulation)
        .join(Person)
        .where(and_(Person.identifier == user_id, FdmnesSimulation.simulation_id == id))
    )

    simulation = session.exec(statement).first()

    if simulation:
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def get_orca_jobfile(session, id, user_id):
    orca_simulation = get_orca_simulation(session, id, user_id)
    structure = get_molecular_structure(
        session, orca_simulation.crystal_structure_id, user_id
    )

    return build_orca_input_file(orca_simulation, structure)


def get_fdmnes_jobfile(session, id, user_id):
    fdmnes_simulation = get_fdmnes_simulation(session, id, user_id)
    structure = get_crystal_structure(
        session, fdmnes_simulation.crystal_structure_id, user_id
    )

    return build_fdmnes_inputfile(fdmnes_simulation, structure)


def get_fdmnes_output(session, id, user_id):
    fdmnes_simulation = get_fdmnes_simulation(session, id, user_id)

    wd = fdmnes_simulation.simulation.working_directory

    result_file = wd + "/fdmnes_result.txt"

    with open(result_file) as fh:
        file = fh.read()

        return file


def get_orca_output(session, id, user_id):
    orca_simulation = get_orca_simulation(session, id, user_id)

    wd = orca_simulation.simulation.working_directory

    result_file = wd + "/orca_result.txt"

    with open(result_file) as fh:
        file = fh.read()

        return file


def get_orca_xyz(session, id, user_id):
    orca_simulation = get_orca_simulation(session, id, user_id)

    wd = orca_simulation.simulation.working_directory

    result_file = wd + "/job.xyz"

    with open(result_file) as fh:
        file = fh.read()

        return file


def get_fdmnes_xas(session, id, user_id):
    fdmnes_simulation = get_fdmnes_simulation(session, id, user_id)

    wd = fdmnes_simulation.simulation.working_directory

    result_file = wd + "/result_conv.txt"

    if not os.path.isfile(result_file):
        raise HTTPException(status_code=404, detail="Item not found")

    out = np.loadtxt(result_file, skiprows=1)

    output = {"energy": out[:, 0].tolist(), "xas": out[:, 1].tolist()}

    return output


def get_orca_xas(session, id, user_id):
    orca_simulation = get_orca_simulation(session, id, user_id)

    wd = orca_simulation.simulation.working_directory

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

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

    stk_xas = np.zeros_like(out_stk[:, 0], shape=[out_stk[:, 0].shape[0] * 3])
    stk_xas[1::3] = out_stk[:, 1]

    output = {
        "energy": out[:, 0].tolist(),
        "xas": out[:, 1].tolist(),
        "stk_energy": stk_energy.tolist(),
        "stk_xas": stk_xas.tolist(),
    }

    return output


def get_user(session, user_id):
    statement = select(Person).where(Person.identifier == user_id)
    person = session.exec(statement).first()

    return person
