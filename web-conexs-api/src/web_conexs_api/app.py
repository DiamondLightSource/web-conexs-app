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

app = FastAPI(root_path="/api")

app.include_router(orca.router, prefix="/orca")
app.include_router(fdmnes.router, prefix="/fdmnes")
app.include_router(qe.router, prefix="/qe")
app.include_router(simulations.router, prefix="/simulations")
app.include_router(user.router, prefix="/user")
app.include_router(matproject.router, prefix="/matproj")
app.include_router(structures.router, prefix="/structures")
app.include_router(cluster.router, prefix="/cluster")
app.include_router(archive.router, prefix="/archive")

add_pagination(app)
