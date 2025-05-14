from fastapi import FastAPI
from fastapi_pagination import add_pagination

from .routers import crystals, fdmnes, molecules, orca, simulations

app = FastAPI()

app.include_router(orca.router)
app.include_router(fdmnes.router)
app.include_router(molecules.router)
app.include_router(crystals.router)
app.include_router(simulations.router)

add_pagination(app)
