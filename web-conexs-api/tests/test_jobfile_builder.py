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


def test_orca_scf_filebuilder():
    test_simulation = Simulation(n_cores=1, memory=1)

    test_model = OrcaSimulation(
        basis_set="test",
        functional="test",
        multiplicity=1,
        calculation_type=OrcaCalculation.scf,
    )

    test_model.simulation = test_simulation

    test_structure = ChemicalStructure(
        label="test",
        person_id=1,
        sites=[ChemicalSite(element_z=1, x=0, y=0, z=0, index=0)],
        id=1,
    )

    jobfile = build_orca_input_file(test_model, test_structure)

    print(jobfile)

    assert "P_ReducedOrbPopMO_L" in jobfile
    assert "!ReducedPop UNO" in jobfile


def test_orca_xas_filebuilder():
    test_simulation = Simulation(n_cores=1, memory=1)

    test_model = OrcaSimulation(
        basis_set="test",
        functional="test",
        multiplicity=1,
        calculation_type=OrcaCalculation.xas,
    )

    test_model.simulation = test_simulation

    test_structure = ChemicalStructure(
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
    test_simulation = Simulation(n_cores=1, memory=1)

    test_model = OrcaSimulation(
        basis_set="test",
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

    # TEST ONE ATOM
    test_structure = ChemicalStructure(
        label="test",
        sites=[
            ChemicalSite(element_z=19, x=0, y=0, z=0, index=0),
        ],
        lattice=Lattice(
            a=4.44,
            b=4.44,
            c=4.44,
            alpha=60,
            beta=60,
            gamma=60,
        ),
    )

    jobfile, absorbing_atom, abs_edge, pp, pp_abs = build_qe_inputfile(
        test_model, test_structure
    )

    assert "nat = 1" in jobfile
    assert "ntyp = 1" in jobfile

    jobfile_array = jobfile.split("\n")

    species_line = -1

    for idx, line in enumerate(jobfile_array):
        if line.startswith("ATOMIC_SPECIES"):
            species_line = idx
            break

    assert species_line > 0

    for i in range(species_line + 1, species_line + 4):
        assert jobfile_array[i].startswith("K*") or len(jobfile_array[i]) == 0

    # TEST TWO DIFFERENT ATOMS

    test_structure = ChemicalStructure(
        label="test",
        sites=[
            ChemicalSite(element_z=19, x=0, y=0, z=0, index=0),
            ChemicalSite(element_z=17, x=0.5, y=0.5, z=0.5, index=1),
        ],
        lattice=Lattice(
            a=4.44,
            b=4.44,
            c=4.44,
            alpha=60,
            beta=60,
            gamma=60,
        ),
    )

    jobfile, absorbing_atom, abs_edge, pp, pp_abs = build_qe_inputfile(
        test_model, test_structure
    )

    assert "nat = 2" in jobfile
    assert "ntyp = 2" in jobfile

    print(jobfile)
    jobfile_array = jobfile.split("\n")

    species_line = -1

    for idx, line in enumerate(jobfile_array):
        if line.startswith("ATOMIC_SPECIES"):
            species_line = idx
            break

    assert species_line > 0

    for i in range(species_line + 1, species_line + 5):
        assert (
            jobfile_array[i].startswith("K*")
            or jobfile_array[i].startswith("Cl")
            or len(jobfile_array[i]) == 0
        )

        # TEST TWO DIFFERENT ATOMS, THREE TYPES

    test_structure = ChemicalStructure(
        label="test",
        sites=[
            ChemicalSite(element_z=19, x=0, y=0, z=0, index=0),
            ChemicalSite(element_z=19, x=0.3, y=0.3, z=0.3, index=1),
            ChemicalSite(element_z=17, x=0.5, y=0.5, z=0.5, index=2),
        ],
        lattice=Lattice(
            a=4.44,
            b=4.44,
            c=4.44,
            alpha=60,
            beta=60,
            gamma=60,
        ),
    )

    jobfile, absorbing_atom, abs_edge, pp, pp_abs = build_qe_inputfile(
        test_model, test_structure
    )

    assert "nat = 3" in jobfile
    assert "ntyp = 3" in jobfile

    jobfile_array = jobfile.split("\n")

    species_line = -1

    for idx, line in enumerate(jobfile_array):
        if line.startswith("ATOMIC_SPECIES"):
            species_line = idx
            break

    assert species_line > 0

    for i in range(species_line + 1, species_line + 6):
        assert (
            jobfile_array[i].startswith("K")
            or jobfile_array[i].startswith("Cl")
            or len(jobfile_array[i]) == 0
        )


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
