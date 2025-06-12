from typing import List

from sqlmodel import or_, select

from web_conexs_api.jobfilebuilders import (
    build_fdmnes_inputfile,
    build_orca_input_file,
    build_qe_inputfile,
)
from web_conexs_api.models.models import (
    CrystalStructure,
    FdmnesSimulation,
    MolecularStructure,
    OrcaSimulation,
    QESimulation,
    Simulation,
    SimulationStatus,
)


def get_orca_jobfile(session, id):
    return get_orca_jobfile[0]


def get_molecular_structure(session, id):
    structure = session.get(MolecularStructure, id)

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
    structure = get_molecular_structure(session, orca_simulation.molecular_structure_id)

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
    structure = session.get(CrystalStructure, id)

    if structure:
        return structure
    else:
        raise RuntimeError("Crystal Structure not found")


def get_fdmnes_jobfile(session, id):
    fdmnes_simulation = get_fdmnes_simulation(session, id)
    structure = get_crystal_structure(session, fdmnes_simulation.crystal_structure_id)

    return build_fdmnes_inputfile(fdmnes_simulation, structure)


def get_submitted_simulations(session) -> List[Simulation]:
    statement = select(Simulation).where(
        Simulation.status == SimulationStatus.requested
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
    structure = get_crystal_structure(session, qe_simulation.crystal_structure_id)

    return build_qe_inputfile(qe_simulation, structure)
