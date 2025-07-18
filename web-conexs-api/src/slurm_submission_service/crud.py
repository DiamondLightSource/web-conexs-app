import datetime
import logging
from datetime import timezone
from typing import List

from sqlmodel import and_, or_, select

from web_conexs_api.jobfilebuilders import (
    build_fdmnes_inputfile,
    build_orca_input_file,
    build_qe_inputfile,
    fdmnes_molecule_to_crystal,
)
from web_conexs_api.models.models import (
    ChemicalStructure,
    Cluster,
    FdmnesSimulation,
    OrcaSimulation,
    QESimulation,
    Simulation,
    SimulationStatus,
)

logger = logging.getLogger(__name__)


def get_orca_jobfile(session, id):
    return get_orca_jobfile[0]


def get_molecular_structure(session, id):
    statement = select(ChemicalStructure).where(
        and_(ChemicalStructure.lattice_id.is_(None), ChemicalStructure.id == id),
    )

    structure = session.exec(statement).first()

    if structure:
        return structure
    else:
        raise RuntimeError("Molecular structure not found")


def get_orca_simulation(session, id) -> OrcaSimulation:
    simulation = session.get(OrcaSimulation, id)

    if simulation:
        return simulation
    else:
        raise RuntimeError("Orca simulation not found")


def get_orca_jobfile_with_technique(session, id):
    orca_simulation = get_orca_simulation(session, id)
    structure = get_molecular_structure(
        session, orca_simulation.simulation.chemical_structure_id
    )

    jobfile = build_orca_input_file(orca_simulation, structure)

    return jobfile, orca_simulation.calculation_type


def get_active_simulations(session) -> List[Simulation]:
    statement = select(Simulation).where(
        or_(
            Simulation.status == SimulationStatus.submitted,
            Simulation.status == SimulationStatus.running,
        )
    )
    return session.exec(statement).all()


def get_fdmnes_simulation(session, id) -> FdmnesSimulation:
    simulation = session.get(FdmnesSimulation, id)

    if simulation:
        return simulation
    else:
        raise RuntimeError("FDMNES simulation not found")


def get_crystal_structure(session, id):
    statement = select(ChemicalStructure).where(
        and_(ChemicalStructure.lattice_id.is_not(None), ChemicalStructure.id == id),
    )

    structure = session.exec(statement).first()

    if structure:
        return structure
    else:
        raise RuntimeError("Crystal Structure not found")


def get_chemical_structure(session, id) -> ChemicalStructure:
    statement = select(ChemicalStructure).where(ChemicalStructure.id == id)

    structure = session.exec(statement).first()

    if structure:
        return structure
    else:
        raise RuntimeError("Chemical Structure not found")


def get_fdmnes_jobfile(session, id):
    fdmnes_simulation = get_fdmnes_simulation(session, id)

    structure = get_chemical_structure(
        session, fdmnes_simulation.simulation.chemical_structure_id
    )

    if structure.lattice is not None:
        crystalIsMolecule = False
    else:
        structure = fdmnes_molecule_to_crystal(structure)
        crystalIsMolecule = True

    return build_fdmnes_inputfile(fdmnes_simulation, structure, crystalIsMolecule)


def get_submitted_simulations(session) -> List[Simulation]:
    statement = select(Simulation).where(
        Simulation.status == SimulationStatus.requested
    )
    return session.exec(statement).all()


def get_request_cancelled_simulations(session) -> List[Simulation]:
    statement = select(Simulation).where(
        Simulation.status == SimulationStatus.request_cancel
    )
    return session.exec(statement).all()


def update_simulation(session, simulation: Simulation):
    session.add(simulation)
    session.commit()
    session.refresh(simulation)
    return simulation


def get_qe_simulation(session, id) -> QESimulation:
    simulation = session.get(QESimulation, id)

    if simulation:
        return simulation
    else:
        raise RuntimeError("FDMNES simulation not found")


def get_qe_jobfile(session, id):
    qe_simulation = get_qe_simulation(session, id)
    structure = get_crystal_structure(
        session, qe_simulation.simulation.chemical_structure_id
    )

    return build_qe_inputfile(qe_simulation, structure)


def update_cluster(session):
    statement = select(Cluster)
    results = session.exec(statement)

    cluster = results.first()

    if cluster is None:
        logger.error("Cluster not found in database!")
        return

    cluster.updated = datetime.datetime.now(timezone.utc).isoformat()

    session.add(cluster)
    session.commit()
    session.refresh(cluster)
