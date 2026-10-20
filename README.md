# Web-CONEXS Platform

Simulation-as-a-Service platform for X-ray Absorption Spectroscopy developed by the Diamond Light Source Ltd supporting the use of FDMNES, Orca and Quantum Espresso, developed as part of the CONEXS consortium.

https://www.diamond.ac.uk/Science/Collaborations/CONEXS.html

https://research.ncl.ac.uk/conexs/


## Platform Architecture

The Web-CONEXS platform consists of 4 main components designed to be deployed into a Kubernetes cluster using Helm:

- **Web-CONEXS database**: A PostgreSQL schema for storing structures and simulation jobs
- **Web-CONEXS api**: A python FastAPI server for adding new structures and simulations to the database and exposing simulation results
- **Web-CONEXS slurm submission service**: Part of the python api, pulls submission requests from the database, submits them to HPC using Slurm, updates the database with progress and results.

- **Web-CONEXS client**: React Single Page Application build with MUI, Mol* and H5web. Allows users to create structures, run simulations and view results by making authenticated calls to the Web-CONEXS API.

Additionally, Web-CONEXS requires an authentication system (Oauth2, for example Keycloak), and uses a selection of small applications/scripts to administer the platform (usually executed as Kubernetes CronJobs).

## Supported Applications

Web-CONEXS contains simplified forms for FDMNES, Orca and Quantum Espresso. The Slurm submitter expects these applications to be available in Apptainer/Singularity containers.

ORCA has a End-User-Licence-Agreement (EULA) that must be agreed to before it can be used. It is the platform adminstrators job to confirm users have agreed to the EULA using the approach for HPC adminstrators described in the EULA. The Web-CONEXS database has a **accepted_orca_eula** field in the **person** table to identify users who have agreed to the EULA.


## Developing



### web-conexs-client React Application

The React application contains a .devcontainer definition file and there is a basic implementation of some API endpoints in Mock Service Worker. Opening the project in a devcontainer, running:

```
pnpm install
pnpm run dev
```

Vitest and React testing library are used for unit testing.

### web-conexs-api FastAPI with SQLModel

The REST API can be developed with unit tests running in pytest using an SQLite database (when queries don't use postgres specific syntax).

For a fuller developement environment there is a Docker Compose yaml file which can be used to bring up an instance of the Web-CONEXS PostreSQL database. The API can then be connected to this database by setting the appropriate environment variables.

In the client adding an early return to the **enableMocking** in **main.tsx** will allow the developement client to connect to the development api.

Example API environment variables:
```
FASTAPI_APP_ENV=development
POSTGRESURL="postgresql+psycopg2://webconexsadmin:password@localhost/webconexsdb"
CONEXS_STORAGE_DIR="/path/to/test/directory"
````

### web-conexs-api Slurm-submission-service

This service interacts with the database and Slurm and is best developed using unit tests against mock services.
