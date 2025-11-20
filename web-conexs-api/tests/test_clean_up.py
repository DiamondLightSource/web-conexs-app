import os
from datetime import datetime, timedelta
from pathlib import Path

# import web_conexs_api.database as database
from sqlmodel import Session, SQLModel, create_engine, select
from sqlmodel.pool import StaticPool

from data_clean_up.clean_up_storage import clean_up
from utils import build_test_database
from web_conexs_api.models.models import (
    Simulation,
    SimulationStatus,
)


def create_working_dirs(tmp_path: Path):
    s1 = tmp_path / "user1" / "sim1"
    s1.mkdir(parents=True)
    s2 = tmp_path / "user2" / "sim2"
    s2.mkdir(parents=True)
    s3 = tmp_path / "user2" / "sim3"
    s3.mkdir(parents=True)

    old = (datetime.now() - timedelta(days=40)).timestamp()

    os.utime(s3, (old, old))

    assert os.path.exists(s1)
    assert os.path.exists(s2)
    assert os.path.exists(s3)

    return s1, s2, s3


def test_clean_up_dry_run(tmp_path: Path):
    s1, s2, s3 = create_working_dirs(tmp_path)

    del_date = datetime.now() - timedelta(days=30)
    del_stamp = del_date.timestamp()

    deleted = clean_up(tmp_path, del_stamp, dry_run=True)

    assert os.path.exists(s1)
    assert os.path.exists(s2)
    assert os.path.exists(s3)

    assert len(deleted) == 1
    assert deleted[0] == s3


def test_clean_up_database(tmp_path: Path, monkeypatch):
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    s1, s2, s3 = create_working_dirs(tmp_path)

    with Session(engine) as session:

        def get_session():
            yield session

        # database.engine = engine
        monkeypatch.setattr("data_clean_up.clean_up_storage.get_session", get_session)

        build_test_database(session, working_dir_list=[str(s1), str(s2), str(s3)])

        del_date = datetime.now() - timedelta(days=30)
        del_stamp = del_date.timestamp()

        statement = select(Simulation).where(Simulation.working_directory == str(s3))
        sim = session.exec(statement).first()

        assert sim.status == SimulationStatus.completed
        assert sim.working_directory == str(s3)

        deleted = clean_up(tmp_path, del_stamp, dry_run=False)

        assert len(deleted) == 1

        assert os.path.exists(s1)
        assert os.path.exists(s2)
        assert not os.path.exists(s3)

        statement = select(Simulation).where(Simulation.id == sim.id)
        sim = session.exec(statement).all()

        assert len(sim) == 1
        s = sim[0]

        assert s.status == SimulationStatus.deleted
        assert s.working_directory is None

        statement = select(Simulation).where(Simulation.working_directory == str(s1))
        sim = session.exec(statement).first()

        assert sim is not None
        assert sim.status == SimulationStatus.completed
        assert sim.working_directory == str(s1)
