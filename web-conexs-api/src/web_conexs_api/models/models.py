import enum
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class PersonInput(SQLModel):
    identifier: str = Field(index=True, unique=True)


class Person(PersonInput, table=True):
    __tablename__: str = "person"
    id: int | None = Field(primary_key=True, default=None)
    admin: bool = False


class SimulationType(SQLModel, table=True):
    __tablename__: str = "simulation_type"
    id: str = Field(primary_key=True)
    type: str


class SimulationStatus(enum.Enum):
    requested = "requested"
    submitted = "submitted"
    running = "running"
    completed = "completed"
    failed = "failed"


class SimulationBase(SQLModel):
    person_id: Optional[int] = Field(foreign_key="person.id", default=None)
    working_directory: Optional[str] = None
    simulation_type_id: Optional[int] = Field(
        foreign_key="simulation_type.id", default=None
    )
    n_cores: Optional[int] = 4
    memory: Optional[int] = 32
    message: Optional[str] = None
    job_id: Optional[int] = None


class Simulation(SimulationBase, table=True):
    __tablename__: str = "simulation"
    id: int | None = Field(primary_key=True, default=None)
    simulation_type: SimulationType = Relationship(
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[Simulation.simulation_type_id]",
        }
    )

    status: SimulationStatus


class OrcaCalcuation(enum.Enum):
    xas = "xas"
    xes = "xes"
    opt = "opt"


class OrcaSimulationInput(SQLModel):
    molecular_structure_id: int
    memory_per_core: int
    functional: str
    basis_set: str
    charge: int
    multiplicity: int
    solvent: Optional[str] = None
    orb_win_0_start: Optional[int] = None
    orb_win_0_stop: Optional[int] = None
    orb_win_1_start: Optional[int] = None
    orb_win_1_stop: Optional[int] = None


class OrcaSimulation(OrcaSimulationInput, table=True):
    __tablename__: str = "orca_simulation"
    simulation_id: int = Field(
        foreign_key="simulation.id",
        default=None,
        primary_key=True,
    )

    simulation: Simulation = Relationship(
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[OrcaSimulation.simulation_id]",
        }
    )


class OrcaSimulationResponse(OrcaSimulationInput):
    simulation: Simulation


class SimulationResponse(SimulationBase):
    id: int
    simulation_type: SimulationType
