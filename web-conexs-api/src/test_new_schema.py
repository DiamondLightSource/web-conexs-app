from contextlib import contextmanager

from sqlmodel import select

from web_conexs_api.database import get_session
from web_conexs_api.models.models import (
    ChemicalStructure,
)


def main():
    with contextmanager(get_session)() as session:
        statement = select(ChemicalStructure).where(
            ChemicalStructure.lattice_id.is_(None)
            # and_(ChemicalStructure.lattice_id is None, ChemicalStructure.id == 2),
        )

        structure = session.exec(statement).first()

        print(structure)

        # statement = select(ChemicalStructure).where(ChemicalStructure.id == 1)
        # print(session.exec(statement).first())

    # statement = (
    #     select(func.count(ChemicalSite.id))
    #     .join(ChemicalStructure)
    #     .where(ChemicalStructure.id == 1)
    # )
    # structure = session.exec(statement).first()
    # print(structure)
    # ms = MolecularStructure.model_validate(structure)

    # statement = (
    #     select(Element.symbol)
    #     .join(ChemicalSite)
    #     .join(ChemicalStructure)
    #     .where(ChemicalStructure.id == 1)
    # )
    # structure = session.exec(statement).unique().all()
    # print(structure)

    # el = session.get(Element, 1)
    # print(el)


if __name__ == "__main__":
    main()
