import datetime
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
    id: int = Field(primary_key=True)
    type: str


class SimulationStatus(enum.Enum):
    requested = "requested"
    submitted = "submitted"
    running = "running"
    completed = "completed"
    failed = "failed"


class MolecularStructureInput(SQLModel):
    label: str
    structure: str


class CrystalStructureInput(MolecularStructureInput):
    a: float
    b: float
    c: float
    alpha: float
    beta: float
    gamma: float


class CrystalStructure(CrystalStructureInput, table=True):
    __tablename__: str = "crystal_structure"
    id: int | None = Field(primary_key=True, default=None)


class MolecularStructure(MolecularStructureInput, table=True):
    __tablename__: str = "molecular_structure"
    id: int | None = Field(primary_key=True, default=None)


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
    request_date: Optional[datetime.datetime]
    submission_date: Optional[datetime.datetime] = None
    completion_date: Optional[datetime.datetime] = None


class Simulation(SimulationBase, table=True):
    __tablename__: str = "simulation"
    id: int | None = Field(primary_key=True, default=None)
    simulation_type: SimulationType = Relationship(
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[Simulation.simulation_type_id]",
        }
    )

    person: Person = Relationship(
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[Simulation.person_id]",
        }
    )

    status: SimulationStatus = SimulationStatus.requested


class OrcaCalcuation(enum.Enum):
    xas = "xas"
    xes = "xes"
    opt = "opt"


class OrcaSolvent(enum.Enum):
    Water = "Water"
    Acetone = "Acetone"
    Acetonitrile = "Acetonitrile"
    Ammonia = "Ammonia"
    Benzene = "Benzene"
    CCl4 = "CCl4"
    CH2Cl2 = "CH2Cl2"
    Chloroform = "Chloroform"
    Cyclohexane = "Cyclohexane"
    DMF = "DMF"
    DMSO = "DMSO"
    Ethanol = "Ethanol"
    Hexane = "Hexane"
    Methanol = "Methanol"
    Octanol = "Octanol"
    Pyridine = "Pyridine"
    THF = "THF"
    Toluene = "Toluene"


class OrcaSimulationInput(SQLModel):
    molecular_structure_id: int
    memory_per_core: int
    functional: str
    basis_set: str
    charge: int
    multiplicity: int
    solvent: Optional[OrcaSolvent] = None
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


class OrcaSpectrum(enum.Enum):
    abs = "abs"
    absq = "absq"
    xes = "xes"
    xesq = "xesq"


class OrcaSpectrumInput(SQLModel):
    simulation_id: int
    spectrum_type: OrcaSpectrum
    start: int
    stop: int
    broadening: float


class OrcaSpectrum(OrcaSpectrumInput, table=True):
    __tablename__: str = "orca_simulation_spectrum"
    id: int | None = Field(primary_key=True, default=None)


class OrcaSimulationResponse(OrcaSimulationInput):
    simulation: Simulation


class SimulationResponse(SimulationBase):
    id: int
    simulation_type: SimulationType
    status: SimulationStatus
    request_date: Optional[datetime.datetime]
    person: Person


class StructureType(enum.Enum):
    crystal = "crystal"
    molecule = "molecule"


class Edge(enum.Enum):
    k = "k"
    l1 = "l1"
    l2 = "l2"
    l3 = "l3"
    m1 = "m1"
    m2 = "m2"
    m3 = "m3"
    m4 = "m4"
    m5 = "m5"


class FdmnesSimulationInput(SQLModel):
    crystal_structure_id: int
    element: int
    structure_type: StructureType
    edge: Edge
    greens_approach: bool


class FdmnesSimulation(FdmnesSimulationInput, table=True):
    __tablename__: str = "fdmnes_simulation"
    simulation_id: int = Field(
        foreign_key="simulation.id",
        default=None,
        primary_key=True,
    )

    simulation: Simulation = Relationship(
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[FdmnesSimulation.simulation_id]",
        }
    )


class FdmnesSimulationResponse(FdmnesSimulationInput):
    simulation: Simulation
