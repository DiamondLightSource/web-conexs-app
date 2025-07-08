from web_conexs_api.jobfilebuilders import (
    build_fdmnes_inputfile,
    build_orca_input_file,
    build_qe_inputfile,
    fdmnes_molecule_to_crystal,
)
from web_conexs_api.models.models import (
    ChemicalSite,
    ChemicalStructure,
    ConductivityType,
    Edge,
    FdmnesSimulation,
    Lattice,
    MolecularStructure,
    OrcaCalculation,
    OrcaSimulation,
    OrcaSolvent,
    QEEdge,
    QESimulation,
    Simulation,
)


def test_orca_xas_filebuilder():
    test_simulation = Simulation(n_cores=1)

    test_model = OrcaSimulation(
        basis_set="test",
        memory_per_core=1,
        functional="test",
        multiplicity=1,
        calculation_type=OrcaCalculation.xas,
    )

    test_model.simulation = test_simulation

    test_structure = MolecularStructure(
        label="test",
        person_id=1,
        sites=[ChemicalSite(element_z=1, x=0, y=0, z=0, index=0)],
        id=1,
    )

    jobfile = build_orca_input_file(test_model, test_structure)

    assert "%tddft" in jobfile
    assert "H " in jobfile

    test_model.solvent = OrcaSolvent.Water

    jobfile = build_orca_input_file(test_model, test_structure)

    assert "CPCM(Water)" in jobfile


def test_orca_opt_filebuilder():
    test_simulation = Simulation(n_cores=1)

    test_model = OrcaSimulation(
        basis_set="test",
        memory_per_core=1,
        functional="test",
        multiplicity=1,
        calculation_type=OrcaCalculation.opt,
    )

    test_model.simulation = test_simulation

    test_structure = MolecularStructure(
        label="test",
        person_id=1,
        sites=[ChemicalSite(element_z=1, x=0, y=0, z=0, index=0)],
        id=1,
    )
    jobfile = build_orca_input_file(test_model, test_structure)

    assert "OPT" in jobfile
    assert "%tddft" not in jobfile
    assert "%xes" not in jobfile


def test_qe_filebuilder():
    test_simulation = Simulation(n_cores=1)
    test_model = QESimulation(
        absorbing_atom=1, edge=QEEdge.k, conductivity=ConductivityType.metallic
    )

    test_model.simulation = test_simulation

    test_structure = ChemicalStructure(
        label="test",
        # structure="He 0.0 0.0 0.0\nH 1.0 0.0 0.0\nHe 2.0 0.0 0.0",
        sites=[
            ChemicalSite(element_z=2, x=0, y=0, z=0, index=0),
            ChemicalSite(element_z=1, x=1, y=0, z=0, index=1),
            ChemicalSite(element_z=2, x=2, y=0, z=0, index=2),
        ],
        lattice=Lattice(
            a=1,
            b=1,
            c=1,
            alpha=90,
            beta=90,
            gamma=90,
        ),
    )

    jobfile, absorbing_atom, abs_edge, pp, pp_abs = build_qe_inputfile(
        test_model, test_structure
    )

    assert "CELL_PARAMETERS" in jobfile


def test_fdmnes_crystal_filebuilder():
    test_simulation = Simulation(n_cores=1)
    test_model = FdmnesSimulation(edge=Edge.k, greens_approach=True, element=1)

    test_model.simulation = test_simulation

    test_structure = ChemicalStructure(
        person_id=1,
        label="Water",
        sites=[
            ChemicalSite(element_z=1, x=0.7493682, y=0.0000000, z=0.4424329, index=0),
            ChemicalSite(element_z=8, x=0.0000000, y=0.0000000, z=-0.1653507, index=0),
            ChemicalSite(element_z=1, x=-0.7493682, y=0.0000000, z=0.4424329, index=0),
        ],
        id=1,
        lattice=Lattice(
            a=1,
            b=1,
            c=1,
            alpha=90,
            beta=90,
            gamma=90,
        ),
    )

    job_file = build_fdmnes_inputfile(test_model, test_structure, False)
    assert "Crystal" in job_file


def test_fdmnes_molecule_to_crystal():
    test_structure = ChemicalStructure(
        person_id=1,
        label="Water",
        sites=[
            ChemicalSite(element_z=1, x=0.7493682, y=0.0000000, z=0.4424329, index=0),
            ChemicalSite(element_z=8, x=0.0000000, y=0.0000000, z=-0.1653507, index=0),
            ChemicalSite(element_z=1, x=-0.7493682, y=0.0000000, z=0.4424329, index=0),
        ],
        id=1,
    )

    crystal = fdmnes_molecule_to_crystal(test_structure)

    assert crystal is not None

    # TODO check crystal

    test_simulation = Simulation(n_cores=1)
    test_model = FdmnesSimulation(edge=Edge.k, greens_approach=True, element=1)
    test_model.simulation = test_simulation
    job_file = build_fdmnes_inputfile(test_model, crystal, True)

    assert "Molecule" in job_file
