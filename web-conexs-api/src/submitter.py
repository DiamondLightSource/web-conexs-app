import time

from web_conexs_api.crud import get_submitted_simulations, update_simulation
from web_conexs_api.database import get_session


def run_update():
    sessions = get_session()
    session = next(sessions)
    sims = get_submitted_simulations(session)

    for sim in sims:
        val = update_simulation(session, sim)
        print(val.status)

    try:
        next(sessions)
    except StopIteration:
        pass

    print(sims)


def main():
    while True:
        run_update()
        time.sleep(1)


if __name__ == "__main__":
    main()
