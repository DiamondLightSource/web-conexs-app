from typing import List

from fastapi import Depends, FastAPI
from fastapi.responses import PlainTextResponse
from fastapi_pagination import add_pagination
from fastapi_pagination.cursor import CursorPage
from sqlmodel import Session

from .crud import (
    get_crystal_structure,
    get_crystal_structures,
    get_fdmnes_jobfile,
    get_fdmnes_output,
    get_fdmnes_simulation,
    get_fdmnes_xas,
    get_molecular_structure,
    get_molecular_structures,
    get_orca_jobfile,
    get_orca_output,
    get_orca_simulation,
    get_orca_xas,
    get_simulation,
    get_simulations_page,
    submit_fdmnes_simulation,
    submit_orca_simulation,
    upload_crystal_structure,
    upload_molecular_structure,
)
from .database import get_session
from .models.models import (
    CrystalStructure,
    CrystalStructureInput,
    FdmnesSimulation,
    FdmnesSimulationInput,
    FdmnesSimulationResponse,
    MolecularStructure,
    MolecularStructureInput,
    OrcaSimulation,
    OrcaSimulationInput,
    OrcaSimulationResponse,
    SimulationResponse,
)

app = FastAPI()

add_pagination(app)

@app.get("/api/simulations")
def get_simulations_pagination_endpoint(
    session: Session = Depends(get_session),
) -> CursorPage[SimulationResponse]:
    return get_simulations_page(session)


@app.get("/api/simulations/{id}")
def get_simulation_endpoint(
    id: int, session: Session = Depends(get_session)
) -> SimulationResponse:
    return get_simulation(session, id)


@app.post("/api/submit/orca")
def submit_orca(
    orca_input: OrcaSimulationInput,
    session: Session = Depends(get_session),
) -> OrcaSimulation:
    return submit_orca_simulation(orca_input, session)


@app.get("/api/orca/{id}")
def get_orca_simulation_endpoint(
    id: int, session: Session = Depends(get_session)
) -> OrcaSimulationResponse:
    return get_orca_simulation(session, id)


# TODO actually implement
@app.get("/api/orca/{id}/output")
def get_orca_output_endpoint(id: int, session: Session = Depends(get_session)) -> str:
    return PlainTextResponse(get_orca_output(session, id))


# TODO replace with an actual implementation
@app.get("/api/orca/{id}/jobfile")
def get_orca_jobfile_endpoint(id: int, session: Session = Depends(get_session)) -> str:
    return PlainTextResponse(get_orca_jobfile(session, id))


# TODO further orca endpoint
# mapspc
# @app.get("/api/orca/{id}/spectra")
# @app.get("/api/orca/{id}/spectra/{spectrum_id}")
# request new mapspc call
# @app.post("/api/orca/{id}/spectra/")
# orbital cube files
# @app.get("/api/orca/{id}/orbitals")
# @app.get("/api/orca/{id}/orbitals/{orbital_calculation_id}")
# request new mapspc call
# @app.post("/api/orca/{id}/orbitals/")


@app.get("/api/molecules/{id}")
def get_molecular_endpoint(
    id: int, session: Session = Depends(get_session)
) -> MolecularStructure:
    return get_molecular_structure(session, id)


@app.post("/api/molecules")
def upload_molecular_endpoint(
    structure: MolecularStructureInput, session: Session = Depends(get_session)
) -> MolecularStructure:
    return upload_molecular_structure(structure, session)


@app.get("/api/molecules")
def get_molecular_list_endpoint(
    session: Session = Depends(get_session),
) -> List[MolecularStructure]:
    return get_molecular_structures(session)


@app.get("/api/crystals/{id}")
def get_crystal_endpoint(
    id: int, session: Session = Depends(get_session)
) -> CrystalStructure:
    return get_crystal_structure(session, id)


@app.post("/api/crystals")
def upload_crystal_endpoint(
    structure: CrystalStructureInput, session: Session = Depends(get_session)
) -> CrystalStructure:
    return upload_crystal_structure(structure, session)


@app.get("/api/crystals")
def get_crystal_list_endpoint(
    session: Session = Depends(get_session),
) -> List[CrystalStructure]:
    return get_crystal_structures(session)


@app.post("/api/submit/fdmnes")
def submit_fdmnes(
    fdmnes_input: FdmnesSimulationInput,
    session: Session = Depends(get_session),
) -> FdmnesSimulation:
    return submit_fdmnes_simulation(fdmnes_input, session)


@app.get("/api/fdmnes/{id}")
def get_fdmnes_simulation_endpoint(
    id: int, session: Session = Depends(get_session)
) -> FdmnesSimulationResponse:
    return get_fdmnes_simulation(session, id)


@app.get("/api/fdmnes/{id}/jobfile")
def get_fdmnes_jobfile_endpoint(
    id: int, session: Session = Depends(get_session)
) -> str:
    return PlainTextResponse(get_fdmnes_jobfile(session, id))


@app.get("/api/fdmnes/{id}/output")
def get_fdmnes_output_endpoint(id: int, session: Session = Depends(get_session)) -> str:
    return PlainTextResponse(get_fdmnes_output(session, id))


@app.get("/api/fdmnes/{id}/xas")
def get_fdmnes_xas_endpoint(id: int, session: Session = Depends(get_session)):
    return get_fdmnes_xas(session, id)


@app.get("/api/orca/{id}/xas")
def get_orca_xas_endpoint(id: int, session: Session = Depends(get_session)):
    return get_orca_xas(session, id)
