from datetime import datetime

from sqlmodel import Session

from web_conexs_api.models.models import (
    ChemicalSite,
    ChemicalStructure,
    OrcaSimulation,
    OrcaSimulationInput,
    Person,
    Simulation,
    SimulationStatus,
    SimulationType,
)


def create_molecule(id: int):
    return ChemicalStructure(
        person_id=1,
        label="Water",
        sites=[
            ChemicalSite(element_z=1, x=0.7493682, y=0.0000000, z=0.4424329, index=0),
            ChemicalSite(element_z=8, x=0.0000000, y=0.0000000, z=-0.1653507, index=0),
            ChemicalSite(element_z=1, x=-0.7493682, y=0.0000000, z=0.4424329, index=0),
        ],
        id=id,
    )


def create_sim(person_id: int, structure_id: int, working_dir: str):
    simulation_model = {
        "person_id": person_id,
        "chemical_structure_id": structure_id,
        "working_directory": working_dir,
        "completion_date": datetime.min,
        "memory": 1,
        "message": "test_message",
        "n_cores": 4,
        "simulation_type_id": 1,
        "status": SimulationStatus.completed,
        "request_date": datetime.min,
    }

    simulation = Simulation.model_validate(simulation_model)

    orca_input = OrcaSimulationInput(
        basis_set="test",
        calculation_type="xas",
        charge=0,
        functional="test",
        multiplicity=1,
        simulation=simulation,
    )

    orca_sim = OrcaSimulation.model_validate(orca_input)
    orca_sim.simulation = simulation

    return orca_sim


def build_test_database(session: Session, working_dir_list=[]):
    session.add(SimulationType(id=1, type="ORCA"))

    session.add(Person(identifier="test_user"))

    molecule = create_molecule(1)
    session.add(molecule)

    if len(working_dir_list) == 0:
        working_dir_list.append("/test")

    for w in working_dir_list:
        orca_sim = create_sim(1, 1, w)
        session.add(orca_sim)

    session.commit()
    session.refresh(orca_sim)
