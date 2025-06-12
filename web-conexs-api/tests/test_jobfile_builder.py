from web_conexs_api.jobfilebuilders import build_orca_input_file, build_qe_inputfile
from web_conexs_api.models.models import (
    ConductivityType,
    CrystalStructure,
    MolecularStructure,
    OrcaCalculation,
    OrcaSimulation,
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
        label="test", structure="He 0.0 0.0 0.0", person_id=1
    )

    jobfile = build_orca_input_file(test_model, test_structure)

    print(jobfile)

    assert "%tddft" in jobfile


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
        label="test", structure="He 0.0 0.0 0.0", person_id=1
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

    test_structure = CrystalStructure(
        label="test",
        structure="He 0.0 0.0 0.0\nH 1.0 0.0 0.0\nHe 2.0 0.0 0.0",
        a=1,
        b=1,
        c=1,
        alpha=90,
        beta=90,
        gamma=90,
        ibrav="1",
    )

    jobfile, absorbing_atom, abs_edge, pp, pp_abs = build_qe_inputfile(
        test_model, test_structure
    )

    print(jobfile)

    assert False

    assert "ibrav" in jobfile
