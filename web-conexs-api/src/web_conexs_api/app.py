from fastapi import FastAPI
from fastapi_pagination import add_pagination

from .routers import (
    archive,
    cluster,
    fdmnes,
    matproject,
    orca,
    qe,
    simulations,
    structures,
    user,
)

app = FastAPI()

app.include_router(orca.router, prefix="/api/orca")
app.include_router(fdmnes.router, prefix="/api/fdmnes")
app.include_router(qe.router, prefix="/api/qe")
app.include_router(simulations.router, prefix="/api/simulations")
app.include_router(user.router, prefix="/api/user")
app.include_router(matproject.router, prefix="/api/matproj")
app.include_router(structures.router, prefix="/api/structures")
app.include_router(cluster.router, prefix="/api/cluster")
app.include_router(archive.router, prefix="/api/archive")

add_pagination(app)
