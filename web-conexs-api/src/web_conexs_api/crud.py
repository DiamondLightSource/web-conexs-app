import datetime
import json
import os
from pathlib import Path
from typing import List

import numpy as np
from fastapi import HTTPException
from fastapi_pagination.cursor import CursorPage
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlmodel import Session, and_, func, select

from .jobfilebuilders import (
    build_fdmnes_inputfile,
    build_orca_input_file,
    build_qe_inputfile,
    fdmnes_molecule_to_crystal,
)
from .models.models import (
    ChemicalSite,
    ChemicalStructure,
    Cluster,
    CrystalStructure,
    CrystalStructureInput,
    FdmnesSimulation,
    FDMNESSimulationSubmission,
    MolecularStructure,
    MolecularStructureInput,
    OrcaCalculation,
    OrcaSimulation,
    OrcaSimulationSubmission,
    Person,
    PersonInput,
    QESimulation,
    QESimulationSubmission,
    Simulation,
    SimulationStatus,
    StructureType,
    StructureWithMetadata,
)
from .utils import create_results_zip

STORAGE_DIR = os.environ.get("CONEXS_STORAGE_DIR")


def get_crystal_structures(session, user_id) -> List[StructureWithMetadata]:
    statement = (
        select(
            ChemicalStructure,
            func.count(ChemicalSite.id),
            func.array_agg(func.distinct(ChemicalSite.element_z)),
        )
        .join(ChemicalSite)
        .join(Person)
        .where(
            and_(
                Person.identifier == user_id, ChemicalStructure.lattice_id.is_not(None)
            ),
        )
        .group_by(ChemicalStructure.id)
    )

    structure = session.exec(statement).all()

    output = [
        {"structure": s[0], "atom_count": s[1], "elements": s[2]} for s in structure
    ]
    return output


def get_crystal_structure(session, id, user_id) -> CrystalStructure:
    statement = (
        select(ChemicalStructure)
        .join(Person)
        .where(
            and_(
                ChemicalStructure.lattice_id.is_not(None),
                and_(Person.identifier == user_id, ChemicalStructure.id == id),
            )
        )
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

    chem_struct = ChemicalStructure.model_validate(structure)

    chem_struct.person_id = person.id

    session.add(chem_struct)
    session.commit()
    session.refresh(chem_struct)

    return chem_struct


def get_molecular_structures(session, user_id) -> List[StructureWithMetadata]:
    statement = (
        select(
            ChemicalStructure,
            func.count(ChemicalSite.id),
            func.array_agg(func.distinct(ChemicalSite.element_z)),
        )
        .join(ChemicalSite)
        .join(Person)
        .where(
            and_(Person.identifier == user_id, ChemicalStructure.lattice_id.is_(None)),
        )
        .group_by(ChemicalStructure.id)
    )

    structure = session.exec(statement).all()

    output = [
        {"structure": s[0], "atom_count": s[1], "elements": s[2]} for s in structure
    ]
    return output


def get_structures(
    session, user_id, structure_type: StructureType
) -> List[StructureWithMetadata]:
    statement = (
        select(
            ChemicalStructure,
            func.count(ChemicalSite.id),
            func.array_agg(func.distinct(ChemicalSite.element_z)),
        )
        .join(ChemicalSite)
        .join(Person)
    )

    if structure_type is None:
        statement = statement.where(
            Person.identifier == user_id,
        )
    elif structure_type is StructureType.molecule:
        statement = statement.where(
            and_(Person.identifier == user_id, ChemicalStructure.lattice_id.is_(None)),
        )
    elif structure_type is StructureType.crystal:
        statement = statement.where(
            and_(
                Person.identifier == user_id, ChemicalStructure.lattice_id.is_not(None)
            ),
        )

    statement = statement.group_by(ChemicalStructure.id)

    structure = session.exec(statement).all()

    output = [
        {"structure": s[0], "atom_count": s[1], "elements": s[2]} for s in structure
    ]
    return output


def get_molecular_structure(session, id, user_id) -> MolecularStructure:
    statement = (
        select(ChemicalStructure)
        .join(Person)
        .where(
            and_(
                ChemicalStructure.lattice_id.is_(None),
                and_(Person.identifier == user_id, ChemicalStructure.id == id),
            )
        )
    )

    structure = session.exec(statement).first()

    if structure:
        return structure
    else:
        raise HTTPException(status_code=404, detail=f"No structure with id={id}")


def get_structure(session, id, user_id) -> CrystalStructure:
    statement = (
        select(ChemicalStructure)
        .join(Person)
        .where(
            and_(Person.identifier == user_id, ChemicalStructure.id == id),
        )
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

    chem_struct = ChemicalStructure.model_validate(structure)

    chem_struct.person_id = person.id

    session.add(chem_struct)
    session.commit()
    session.refresh(chem_struct)

    return chem_struct


def upload_structure(
    structure: MolecularStructureInput | CrystalStructureInput, session, user_id
) -> MolecularStructure | CrystalStructure:
    person = get_or_create_person(session, user_id)

    print(structure)

    chem_struct = ChemicalStructure.model_validate(structure)

    chem_struct.person_id = person.id

    session.add(chem_struct)
    session.commit()
    session.refresh(chem_struct)

    return chem_struct


def get_simulations(session, user_id) -> List[Simulation]:
    statement = select(Simulation).join(Person).where(Person.identifier == user_id)

    results = session.exec(statement)

    return results.all()


def get_simulations_page(session, user_id) -> CursorPage[Simulation]:
    statement = select(Simulation).join(Person).where(Person.identifier == user_id)

    return paginate(session, statement.order_by(Simulation.id.desc()))


def get_simulation(session, id, user_id) -> Simulation:
    statement = (
        select(Simulation)
        .join(Person)
        .where(and_(Person.identifier == user_id, Simulation.id == id))
    )

    simulation = session.exec(statement).first()

    if simulation:
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def get_simulation_zipped(session, id, user_id) -> Simulation:
    statement = (
        select(Simulation)
        .join(Person)
        .where(and_(Person.identifier == user_id, Simulation.id == id))
    )

    simulation = session.exec(statement).first()

    if not simulation:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")

    wd = get_working_directory(simulation)

    return create_results_zip(wd, simulation.simulation_type_id)


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
    orca_input: OrcaSimulationSubmission, session: Session, user_id
) -> OrcaSimulation:
    person = get_or_create_person(session, user_id)

    if not person.accepted_orca_eula:
        raise HTTPException(
            status_code=403, detail="User has not accepted the Orca EULA"
        )

    smodel = {
        "person_id": person.id,
        "simulation_type_id": 1,
        "request_date": datetime.datetime.now(),
        "chemical_structure_id": orca_input.chemical_structure_id,
        "n_cores": 16,
        "memory": 49152,
    }

    simulation = Simulation.model_validate(smodel)
    orca = OrcaSimulation.model_validate(orca_input)
    orca.simulation = simulation

    session.add(orca)
    session.commit()
    session.refresh(orca)

    return orca


def submit_fdmnes_simulation(
    fdmnes_input: FDMNESSimulationSubmission, session: Session, user_id: str
) -> FdmnesSimulation:
    person = get_or_create_person(session, user_id)

    smodel = {
        "person_id": person.id,
        "simulation_type_id": 2,
        "request_date": datetime.datetime.now(),
        "chemical_structure_id": fdmnes_input.chemical_structure_id,
        "n_cores": 16,
        "memory": 49152,
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
        session, orca_simulation.simulation.chemical_structure_id, user_id
    )

    return build_orca_input_file(orca_simulation, structure)


def get_fdmnes_jobfile(session, id, user_id):
    fdmnes_simulation = get_fdmnes_simulation(session, id, user_id)

    structure = get_structure(
        session, fdmnes_simulation.simulation.chemical_structure_id, user_id
    )

    if structure.lattice is not None:
        crystalIsMolecule = False
    else:
        structure = fdmnes_molecule_to_crystal(structure)
        crystalIsMolecule = True

    return build_fdmnes_inputfile(fdmnes_simulation, structure, crystalIsMolecule)


def get_fdmnes_output(session, id, user_id):
    fdmnes_simulation = get_fdmnes_simulation(session, id, user_id)

    wd = get_working_directory(fdmnes_simulation.simulation)

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

    result_file = wd + "/fdmnes_result.txt"

    with open(result_file) as fh:
        file = fh.read()

        return file


def get_orca_output(session, id, user_id):
    orca_simulation = get_orca_simulation(session, id, user_id)

    wd = get_working_directory(orca_simulation.simulation)

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

    result_file = wd + "/orca_result.txt"

    with open(result_file) as fh:
        file = fh.read()

        return file


def get_orca_cube_info(session, id, user_id):
    orca_simulation = get_orca_simulation(session, id, user_id)

    wd = get_working_directory(orca_simulation.simulation)

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

    result_file = wd + "/cube.json"

    if not os.path.isfile(result_file):
        raise HTTPException(status_code=404, detail="Item not found")

    with open(result_file) as fh:
        info = json.load(fh)

        return info


def get_orca_population_info(session, id, user_id):
    orca_simulation = get_orca_simulation(session, id, user_id)

    wd = get_working_directory(orca_simulation.simulation)

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

    result_file = wd + "/orbitals.json"

    if not os.path.isfile(result_file):
        raise HTTPException(status_code=404, detail="Item not found")

    with open(result_file) as fh:
        info = json.load(fh)

        return info


def get_orca_cube_file(session, id, cube_id, user_id):
    orca_simulation = get_orca_simulation(session, id, user_id)

    wd = get_working_directory(orca_simulation.simulation)

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

    result_file = wd + f"/job.cisdp{cube_id:02}.cube.gz"

    if not os.path.isfile(result_file):
        raise HTTPException(status_code=404, detail="Item not found")

    with open(result_file, "rb") as fh:
        file = fh.read()

        return file


def get_orca_xyz(session, id, user_id):
    orca_simulation = get_orca_simulation(session, id, user_id)

    wd = get_working_directory(orca_simulation.simulation)

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

    result_file = wd + "/job.xyz"

    with open(result_file) as fh:
        file = fh.read()

        return file


def get_fdmnes_xas(session, id, user_id):
    fdmnes_simulation = get_fdmnes_simulation(session, id, user_id)

    wd = get_working_directory(fdmnes_simulation.simulation)

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

    result_file = wd + "/result_conv.txt"

    if not os.path.isfile(result_file):
        raise HTTPException(status_code=404, detail="Item not found")

    out = np.loadtxt(result_file, skiprows=1)

    output = {"energy": out[:, 0].tolist(), "xas": out[:, 1].tolist()}

    return output


def get_orca_xas(session, id, user_id):
    orca_simulation = get_orca_simulation(session, id, user_id)

    wd = get_working_directory(orca_simulation.simulation)

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

    keywd = "absq" if orca_simulation.calculation_type == OrcaCalculation.xas else "xes"

    result_file = wd + f"/orca_result.txt.{keywd}.dat"

    result_stk = wd + f"/orca_result.txt.{keywd}.stk"

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


def accept_orca_eula(session, user_id):
    person = get_user(session, user_id)

    person.accepted_orca_eula = True

    session.add(person)
    session.commit()
    session.refresh(person)

    return person


def get_user(session, user_id):
    statement = select(Person).where(Person.identifier == user_id)
    person = session.exec(statement).first()

    if person is None:
        # auth successful but not in db yet
        person = Person(id=None, identifier=user_id, admin=False)

    return person


def submit_qe_simulation(
    qe_input: QESimulationSubmission, session: Session, user_id: str
) -> QESimulation:
    person = get_or_create_person(session, user_id)

    smodel = {
        "person_id": person.id,
        "simulation_type_id": 3,
        "request_date": datetime.datetime.now(),
        "chemical_structure_id": qe_input.chemical_structure_id,
        "n_cores": 16,
        "memory": 49152,
    }

    simulation = Simulation.model_validate(smodel)
    qe = QESimulation.model_validate(qe_input)
    qe.simulation = simulation

    session.add(qe)
    session.commit()
    session.refresh(qe)

    return qe

    # get_qe_xas,


def get_qe_simulation(session, id, user_id) -> QESimulation:
    statement = (
        select(QESimulation)
        .join(Simulation)
        .join(Person)
        .where(and_(Person.identifier == user_id, QESimulation.simulation_id == id))
    )

    simulation = session.exec(statement).first()

    if simulation:
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def get_qe_jobfile(session, id, user_id):
    qe_simulation = get_qe_simulation(session, id, user_id)
    structure = get_crystal_structure(
        session, qe_simulation.simulation.chemical_structure_id, user_id
    )

    return build_qe_inputfile(qe_simulation, structure)


def get_qe_output(session, id, user_id):
    qe_simulation = get_qe_simulation(session, id, user_id)

    wd = get_working_directory(qe_simulation.simulation)

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

    result_file = wd + "/result.pwo"

    with open(result_file) as fh:
        file = fh.read()

        return file


def get_qe_xas(session, id, user_id):
    qe_simulation = get_qe_simulation(session, id, user_id)

    wd = get_working_directory(qe_simulation.simulation)

    if wd is None:
        raise HTTPException(status_code=404, detail="Item not found")

    result_file = wd + "/xanes.dat"

    if not os.path.isfile(result_file):
        raise HTTPException(status_code=404, detail="Item not found")

    out = np.loadtxt(result_file)

    output = {"energy": out[:, 0].tolist(), "xas": out[:, 1].tolist()}

    return output


def request_cancel_simulation(session, id, user_id):
    sim = get_simulation(session, id, user_id)

    if (
        sim.status == SimulationStatus.running
        or sim.status == SimulationStatus.requested
        or sim.status == SimulationStatus.submitted
    ):
        sim.status = SimulationStatus.request_cancel
        session.add(sim)
        session.commit()
        session.refresh(sim)

    return sim


def get_working_directory(simulation: Simulation):
    if simulation.working_directory is None:
        return None

    return str(
        Path(STORAGE_DIR)
        / Path(simulation.person.identifier)
        / Path(simulation.working_directory)
    )


def get_cluster(session):
    statement = select(Cluster)
    results = session.exec(statement)

    return results.first()
