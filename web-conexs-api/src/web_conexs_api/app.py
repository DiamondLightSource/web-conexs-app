from fastapi import FastAPI
from fastapi_pagination import add_pagination

from .routers import (
    crystals,
    fdmnes,
    matproject,
    molecules,
    orca,
    qe,
    simulations,
    user,
)

app = FastAPI()

app.include_router(orca.router)
app.include_router(fdmnes.router)
app.include_router(qe.router)
app.include_router(molecules.router)
app.include_router(crystals.router)
app.include_router(simulations.router)
app.include_router(user.router)
app.include_router(matproject.router)

add_pagination(app)
