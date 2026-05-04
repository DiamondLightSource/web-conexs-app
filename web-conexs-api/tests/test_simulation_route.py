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

        jsonr = response.json()

        assert jsonr["items"][0]["person_id"] == 1

        response = client.get("/api/simulations/1", headers=headers)

        jsonr = response.json()

        assert jsonr["person_id"] == 1

        response = client.patch("/api/simulations/1.status", headers=headers)

        jsonr = response.json()

        assert jsonr["person_id"] == 1


def test_structures_route():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    SQLModel.metadata.create_all(engine)

    headers = {"Authorization": "Bearer test_user"}

    with Session(engine) as session:
        build_test_database(session)
        client = TestClient(app)

        response = client.get("/api/structures/1")

        assert response.status_code == 401

        headers = headers
        response = client.get("/api/structures/1", headers=headers)

        jsonr = response.json()

        assert jsonr["label"] == "Water"

        structure_dict = {
            "label": "WaterPost",
            "sites": [
                {
                    "element_z": 1,
                    "x": 0.7493682,
                    "y": 0.0000000,
                    "z": 0.4424329,
                    "index": 0,
                },
                {
                    "element_z": 8,
                    "x": 0.0000000,
                    "y": 0.0000000,
                    "z": -0.1653507,
                    "index": 0,
                },
                {
                    "element_z": 1,
                    "x": -0.7493682,
                    "y": 0.0000000,
                    "z": 0.4424329,
                    "index": 0,
                },
            ],
        }

        response = client.post(
            "/api/structures/",
            headers=headers,
            json=structure_dict,
        )

        jsonr = response.json()

        print(jsonr)

        assert jsonr["label"] == "WaterPost"

        response = client.get(f"/api/structures/{jsonr['id']}", headers=headers)

        jsonr = response.json()

        assert jsonr["label"] == "WaterPost"

        structure_dict2 = {
            "label": "WaterCryst",
            "sites": [
                {
                    "element_z": 1,
                    "x": 0.7493682,
                    "y": 0.0000000,
                    "z": 0.4424329,
                    "index": 0,
                },
                {
                    "element_z": 8,
                    "x": 0.0000000,
                    "y": 0.0000000,
                    "z": -0.1653507,
                    "index": 0,
                },
                {
                    "element_z": 1,
                    "x": -0.7493682,
                    "y": 0.0000000,
                    "z": 0.4424329,
                    "index": 0,
                },
            ],
            "lattice": {
                "a": 1,
                "b": 1,
                "c": 1,
                "alpha": 90,
                "beta": 90,
                "gamma": 90,
            },
        }

        response = client.post(
            "/api/structures/",
            headers=headers,
            json=structure_dict2,
        )

        jsonr = response.json()

        print(jsonr)

        assert jsonr["label"] == "WaterCryst"

        response = client.get(f"/api/structures/{jsonr['id']}", headers=headers)

        jsonr = response.json()

        assert jsonr["label"] == "WaterCryst"
