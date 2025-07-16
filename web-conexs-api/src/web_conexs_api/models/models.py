import datetime
import enum
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class Element(SQLModel, table=True):
    __tablename__: str = "element"

    z: int = Field(primary_key=True, unique=True)
    symbol: str = Field(unique=True)
    name: str = Field(unique=True)


class LatticeBase(SQLModel):
    a: float
    b: float
    c: float
    alpha: float
    beta: float
    gamma: float


class Lattice(LatticeBase, table=True):
    __tablename__: str = "lattice"
    id: int | None = Field(primary_key=True, unique=True, default=None)


class StructureBase(SQLModel):
    label: str
    person_id: int = Field(foreign_key="person.id", default=None)


class ChemicalStructure(StructureBase, table=True):
    __tablename__: str = "chemical_structure"
    id: int | None = Field(primary_key=True, unique=True, default=None)
    lattice_id: int | None = Field(foreign_key="lattice.id", default=None)
    sites: list["ChemicalSite"] = Relationship(back_populates="chemical_structure")
    lattice: Lattice = Relationship(
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[ChemicalStructure.lattice_id]",
        }
    )


class StructureWithMetadata(SQLModel):
    structure: ChemicalStructure
    atom_count: int
    elements: List[int]


class CrystalStructure(StructureBase):
    sites: list["ChemicalSite"]
    id: int
    lattice_id: int
    lattice: Lattice


class MolecularStructure(StructureBase):
    sites: list["SiteBase"]
    id: int | None


class SiteBase(SQLModel):
    element_z: int = Field(foreign_key="element.z", default=None)
    x: float
    y: float
    z: float
    index: int


class ChemicalSite(SiteBase, table=True):
    __tablename__: str = "chemical_site"
    id: int | None = Field(primary_key=True, unique=True, default=None)
    chemical_structure_id: int = Field(
        foreign_key="chemical_structure.id", default=None
    )

    chemical_structure: ChemicalStructure | None = Relationship(back_populates="sites")


class PersonInput(SQLModel):
    identifier: str = Field(index=True, unique=True)
    accepted_orca_eula: bool = False


class Person(PersonInput, table=True):
    __tablename__: str = "person"
    id: int | None = Field(primary_key=True, default=None)


class SimulationType(SQLModel, table=True):
    __tablename__: str = "simulation_type"
    id: int = Field(primary_key=True)
    type: str


class StructureType(enum.Enum):
    crystal = "crystal"
    molecule = "molecule"


class SimulationStatus(enum.Enum):
    requested = "requested"
    submitted = "submitted"
    running = "running"
    completed = "completed"
    failed = "failed"
    error = "error"
    request_cancel = "request_cancel"
    cancelled = "cancelled"


class MolecularStructureInput(SQLModel):
    label: str
    sites: List[ChemicalSite]


class CrystalStructureInput(MolecularStructureInput):
    lattice: Lattice


# class CrystalStructure(CrystalStructureInput, table=True):
#     __tablename__: str = "crystal_structure"
#     id: int | None = Field(primary_key=True, default=None)
#     person_id: int = Field(foreign_key="person.id", default=None)


# class MolecularStructure(MolecularStructureInput, table=True):
#     __tablename__: str = "molecular_structure"
#     id: int | None = Field(primary_key=True, default=None)
#     person_id: int = Field(foreign_key="person.id", default=None)


class SimulationInputBase(SQLModel):
    n_cores: int = 4
    memory: int = 32
    chemical_structure_id: int


class SimulationBase(SQLModel):
    person_id: Optional[int] = Field(foreign_key="person.id", default=None)
    working_directory: Optional[str] = None
    simulation_type_id: Optional[int] = Field(
        foreign_key="simulation_type.id", default=None
    )
    chemical_structure_id: Optional[int] = Field(
        foreign_key="chemical_structure.id", default=None
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


class OrcaCalculation(enum.Enum):
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
    functional: str
    basis_set: str
    charge: int
    multiplicity: int
    calculation_type: OrcaCalculation
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
    element: int
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


class ConductivityType(enum.Enum):
    metallic = "metallic"
    semiconductor = "semiconductor"
    insulator = "insulator"


class QEEdge(enum.Enum):
    k = "k"
    l1 = "l1"
    l2 = "l2"
    l23 = "l23"


class QESimulationInput(SQLModel):
    absorbing_atom: int
    edge: Edge
    conductivity: ConductivityType


class QESimulation(QESimulationInput, table=True):
    __tablename__: str = "qe_simulation"
    simulation_id: int = Field(
        foreign_key="simulation.id",
        default=None,
        primary_key=True,
    )

    simulation: Simulation = Relationship(
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[QESimulation.simulation_id]",
        }
    )


class QESimulationResponse(QESimulationInput):
    simulation: Simulation


class ORCASimulationSubmission(SQLModel):
    orca_input: OrcaSimulationInput
    simulation_input: SimulationInputBase


class QESimulationSubmission(QESimulationInput, SimulationInputBase):
    pass


class FDMNESSimulationSubmission(FdmnesSimulationInput, SimulationInputBase):
    pass


class OrcaSimulationSubmission(OrcaSimulationInput, SimulationInputBase):
    pass


class Cluster(SQLModel, table=True):
    __tablename__: str = "cluster"
    id: int = Field(
        primary_key=True,
    )
    updated: Optional[datetime.datetime]
