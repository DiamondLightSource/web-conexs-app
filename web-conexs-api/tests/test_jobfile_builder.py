from web_conexs_api.jobfilebuilders import build_orca_input_file
from web_conexs_api.models.models import MolecularStructure, OrcaSimulation, Simulation


def test_orca_filebuilder():
    test_simulation = Simulation(n_cores=1)

    test_model = OrcaSimulation(
        basis_set="test",
        memory_per_core=1,
        functional="test",
        multiplicity=1,
        calculation_type="xas",
    )

    test_model.simulation = test_simulation

    test_structure = MolecularStructure(
        label="test", structure="He 0.0 0.0 0.0", person_id=1
    )

    jobfile = build_orca_input_file(test_model, test_structure)

    print(jobfile)

    assert "%tddft" in jobfile
