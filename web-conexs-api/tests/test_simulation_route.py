from fastapi.testclient import TestClient
from fastapi_pagination import add_pagination
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from utils import build_test_database
from web_conexs_api.app import app
from web_conexs_api.database import get_session

add_pagination(app)


def test_router():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    headers = {"Authorization": "Bearer test_user"}

    with Session(engine) as session:
        build_test_database(session)

        def get_session_override():
            return session

        client = TestClient(app)
        app.dependency_overrides[get_session] = get_session_override

        response = client.get("/api/simulations/")

        assert response.status_code == 401

        headers = headers
        response = client.get("/api/simulations/", headers=headers)

        json = response.json()

        assert json["items"][0]["person_id"] == 1
