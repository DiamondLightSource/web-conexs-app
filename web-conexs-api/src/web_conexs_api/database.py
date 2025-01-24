import os

from sqlmodel import Session, create_engine

url = os.environ.get("POSTGRESURL")

engine = None

if url:
    engine = create_engine(url)
else:
    print("URL not set - unit tests only")


def get_session():
    if engine is None:
        raise Exception("Database engine is None, has url been set?")

    with Session(engine) as session:
        yield session
