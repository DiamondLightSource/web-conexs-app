from datetime import datetime

from sqlmodel import Session

from web_conexs_api.models.models import (
    MolecularStructure,
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

    molecule = MolecularStructure(
        person_id=1,
        label="Water",
        structure=(
            "H    0.7493682    0.0000000    0.4424329\n"
            + "O    0.0000000    0.0000000   -0.1653507\n"
            + "H   -0.7493682    0.0000000    0.4424329"
        ),
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
    # orca_sim.simulation_type_id = 1
    orca_sim.simulation = simulation
    session.add(orca_sim)

    session.commit()
    session.refresh(orca_sim)
