import datetime
import re
from typing import List

from fastapi import HTTPException
from sqlmodel import Session, select

from .models.models import (
    CrystalStructure,
    CrystalStructureInput,
    FdmnesSimulation,
    FdmnesSimulationInput,
    MolecularStructure,
    MolecularStructureInput,
    OrcaSimulation,
    OrcaSimulationInput,
    Simulation,
    SimulationStatus,
    StructureType,
)
from .periodictable import periodic_table


def get_crystal_structures(session):
    statement = select(CrystalStructure)

    results = session.exec(statement)

    return results.all()


def get_crystal_structure(session, id):
    structure = session.get(CrystalStructure, id)

    if structure:
        return structure
    else:
        raise HTTPException(status_code=404, detail=f"No structure with id={id}")


def upload_crystal_structure(structure: CrystalStructureInput, session):
    crystal = CrystalStructure.model_validate(structure)

    session.add(crystal)
    session.commit()
    session.refresh(crystal)

    return crystal


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


def get_submitted_simulations(session) -> List[Simulation]:
    statement = select(Simulation).where(
        Simulation.status == SimulationStatus.requested
    )
    return session.exec(statement).all()


def update_simulation(session, simulation: Simulation):
    simulation.status = SimulationStatus.submitted
    session.add(simulation)
    session.commit()
    session.refresh(simulation)
    return simulation


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
        "simulation_type_id": 1,
        "request_date": datetime.datetime.now(),
    }

    #     "status": SimulationStatus.requested,
    # "request_date":None,
    # "submission_date":None,
    # "completion_date":None,

    simulation = Simulation.model_validate(smodel)
    orca = OrcaSimulation.model_validate(orca_input)
    orca.simulation = simulation

    session.add(orca)
    session.commit()
    session.refresh(orca)

    return orca


def submit_fdmnes_simulation(fdmnes_input: FdmnesSimulationInput, session: Session):
    smodel = {
        "person_id": 1,
        "simulation_type_id": 2,
        "request_date": datetime.datetime.now(),
    }

    #     "status": SimulationStatus.requested,
    # "request_date":None,
    # "submission_date":None,
    # "completion_date":None,

    simulation = Simulation.model_validate(smodel)
    fdmnes = FdmnesSimulation.model_validate(fdmnes_input)
    fdmnes.simulation = simulation

    session.add(fdmnes)
    session.commit()
    session.refresh(fdmnes)

    return fdmnes


def get_fdmnes_simulation(session, id) -> FdmnesSimulation:
    simulation = session.get(FdmnesSimulation, id)

    if simulation:
        return simulation
    else:
        raise HTTPException(status_code=404, detail=f"No simulation with id={id}")


def get_fdmnes_jobfile(session, id):
    fdmnes_simulation = get_fdmnes_simulation(session, id)
    structure = get_crystal_structure(session, fdmnes_simulation.crystal_structure_id)
    jobfile = "Filout\nresult\n\nRange\n"
    jobfile += "-10. 0.25 50 !E_min, step, E_intermediate, step ...\n\n"

    jobfile += "Edge\n"
    jobfile += str(fdmnes_simulation.edge.value).capitalize() + "\n\n"

    jobfile += "Z_absorber\n"
    jobfile += str(fdmnes_simulation.element) + "\n\n"

    jobfile += "SCF         !Performs self-consistent calculation\n"
    jobfile += (
        "Energpho    !Output energy relative to the photon energy of absorbing atom\n\n"
    )

    if fdmnes_simulation.greens_approach:
        jobfile += "Green\n"

    jobfile += "Quadrupole\n"

    if fdmnes_simulation.edge.value.startswith("l"):
        jobfile += "Spinorbit\n"

    jobfile += "\n"
    jobfile += "Radius"
    jobfile += "! Radius of the cluster where final state calculation is performed\n"
    jobfile += "6" + "\n\n"

    if fdmnes_simulation.structure_type == StructureType.crystal:
        jobfile += "Crystal        ! Periodic material description (unit cell)\n"
    else:
        jobfile += "Molecule       ! Periodic or cylindrical or spherical coordinates\n"

    jobfile += f"{structure.a} {structure.b} {structure.c}"
    jobfile += f"{structure.alpha} {structure.beta} {structure.gamma}\n"

    keys = (re.escape(k) for k in periodic_table.keys())
    pattern = re.compile(r"\b(" + "|".join(keys) + r")\b")

    result = pattern.sub(lambda x: str(periodic_table[x.group()]), structure.structure)
    jobfile += result

    jobfile += "\n\nConvolution\n\nEnd"

    return jobfile
