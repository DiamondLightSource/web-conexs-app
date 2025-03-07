from contextlib import contextmanager

from web_conexs_api.crud import get_orca_jobfile, get_submitted_simulations
from web_conexs_api.database import get_session
from web_conexs_api.models.models import SimulationResponse

ROOT_DIR = "/scratch/conexs/"


def run_update():
    with contextmanager(get_session)() as session:
        # sessions = get_session()
        # session = next(sessions)
        sims = get_submitted_simulations(session)

        for sim in sims:
            sr = SimulationResponse.model_validate(sim)
            # val = update_simulation(session, sim)
            if sr.simulation_type_id == 1:
                application_name = "orca"
                user = sr.person.identifier

                print(ROOT_DIR + user + "/" + application_name)
                orca = get_orca_jobfile(session, sim.id)
                # determine workspace
                # write jobfile(s)
                # submit job to slurm (with appropriate resources)
                # update database with jobid, workspace path, status to submitted
                # - might want to add jobname to db
                print(orca)

    # try:
    #     next(sessions)
    # except StopIteration:
    #     pass

    # print(sims)


def main():
    # while True:
    run_update()
    # time.sleep(1)


if __name__ == "__main__":
    main()
