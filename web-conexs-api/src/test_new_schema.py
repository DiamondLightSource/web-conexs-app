from contextlib import contextmanager
from typing import List

from pydantic.type_adapter import TypeAdapter
from sqlmodel import and_, func, select

from web_conexs_api.database import get_session
from web_conexs_api.models.models import (
    ChemicalSite,
    ChemicalStructure,
    Person,
    StructureWithMetadata,
)


def atom_count(session):
    statement = (
        select(
            ChemicalStructure.label, ChemicalStructure.id, func.count(ChemicalSite.id)
        )
        .join(ChemicalSite)
        .group_by(ChemicalStructure.id)
    )

    print(statement)

    structure = session.exec(statement).all()
    print(structure)


def elements(session):
    # statement = (
    # select(ChemicalStructure,
    #        func.count(ChemicalSite.id),
    #        func.array_agg(func.distinct(ChemicalSite.element_z)))
    #        .join(ChemicalSite)
    #        .group_by(ChemicalStructure.id))

    user_id = "test_user"

    statement = (
        select(
            ChemicalStructure,
            func.count(ChemicalSite.id),
            func.array_agg(func.distinct(ChemicalSite.element_z)),
        )
        .join(ChemicalSite)
        .join(Person)
        .where(
            and_(Person.identifier == user_id, ChemicalStructure.lattice_id.is_(None)),
        )
        .group_by(ChemicalStructure.id)
    )

    structure = session.exec(statement).all()
    t = TypeAdapter(List[StructureWithMetadata])

    test = [
        {"structure": s[0], "atom_count": s[1], "elements": s[2]} for s in structure
    ]

    output = t.validate_python(test)

    print(output)


def main():
    with contextmanager(get_session)() as session:
        #  atom_count(session)

        elements(session)


if __name__ == "__main__":
    main()
