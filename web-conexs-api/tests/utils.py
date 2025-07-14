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


def build_test_database(session: Session):
    session.add(SimulationType(id=1, type="ORCA"))
    session.add(SimulationType(id=2, type="FDMNES"))
    session.add(SimulationType(id=3, type="Quantum ESPRESSO"))

    session.add(Person(identifier="test_user"))

    molecule = ChemicalStructure(
        person_id=1,
        label="Water",
        sites=[
            ChemicalSite(element_z=1, x=0.7493682, y=0.0000000, z=0.4424329, index=0),
            ChemicalSite(element_z=8, x=0.0000000, y=0.0000000, z=-0.1653507, index=0),
            ChemicalSite(element_z=1, x=-0.7493682, y=0.0000000, z=0.4424329, index=0),
        ],
        id=1,
    )

    session.add(molecule)

    simulation_model = {
        "person_id": 1,
        "working_directory": "/test",
        "completion_date": datetime.min,
        "memory": 1,
        "message": "test_message",
        "n_cores": 4,
        "simulation_type_id": 1,
        "status": SimulationStatus.completed,
        "request_date": datetime.min,
    }

    simulation = Simulation.model_validate(simulation_model)

    # session.add(simulation)

    orca_input = OrcaSimulationInput(
        molecular_structure_id=1,
        basis_set="test",
        calculation_type="xas",
        charge=0,
        functional="test",
        memory_per_core=4,
        multiplicity=1,
        simulation=simulation,
    )

    orca_sim = OrcaSimulation.model_validate(orca_input)
    orca_sim.simulation = simulation
    session.add(orca_sim)

    session.commit()
    session.refresh(orca_sim)
