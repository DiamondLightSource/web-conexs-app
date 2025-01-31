from typing import List

from fastapi import HTTPException
from sqlmodel import Session, select

from .models.models import (
    MolecularStructure,
    MolecularStructureInput,
    OrcaSimulation,
    OrcaSimulationInput,
    Simulation,
    SimulationStatus,
)


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

    session.add(molecule)
    session.commit()
    session.refresh(molecule)

    return molecule


def get_simulations(session) -> List[Simulation]:
    statement = select(Simulation)

    results = session.exec(statement)

    return results.all()


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
    orca_simulation = get_orca_simulation(session, id)
    structure = get_molecular_structure(session, orca_simulation.molecular_structure_id)

    jobfile = (
        "! "
        + orca_simulation.functional
        + " DHK2 "
        + orca_simulation.basis_set
        + " SARC/J"
    )

    # TODO solvent

    jobfile += "\n"

    jobfile += "%maxcore " + str(orca_simulation.memory_per_core) + "\n\n"
    jobfile += "%pal nprocs " + str(orca_simulation.simulation.n_cores) + "\n"
    jobfile += "end" + "\n\n"

    jobfile += "%tddft" + "\n"

    jobfile += (
        "orbWin[0] = "
        + str(orca_simulation.orb_win_0_start)
        + ","
        + str(orca_simulation.orb_win_0_stop)
        + ",-1,-1\n"
    )
    jobfile += (
        "orbWin[1] = "
        + str(orca_simulation.orb_win_1_start)
        + ","
        + str(orca_simulation.orb_win_1_stop)
        + ",-1,-1\n"
    )

    jobfile += "doquad true" + "\n"
    jobfile += "nroots 20" + "\n"
    jobfile += "maxdim 10" + "\n"
    jobfile += "end" + "\n\n"

    jobfile += (
        "*xyz "
        + str(orca_simulation.charge)
        + " "
        + str(orca_simulation.multiplicity)
        + "\n"
    )
    jobfile += structure.structure
    jobfile += "\nend"

    return jobfile


def submit_orca_simulation(orca_input: OrcaSimulationInput, session: Session):
    smodel = {
        "person_id": 1,
        "working_directory": "/working_directory_orca",
        "simulation_type_id": 1,
        "status": SimulationStatus.requested,
    }

    simulation = Simulation.model_validate(smodel)
    orca = OrcaSimulation.model_validate(orca_input)
    orca.simulation = simulation

    session.add(orca)
    session.commit()
    session.refresh(orca)

    return orca
