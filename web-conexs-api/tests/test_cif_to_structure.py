from web_conexs_api.jobfilebuilders import cif_string_to_crystal, cif_string_to_molecule

cif_h_string = (
    "data_1\n\n_symmetry_space_group_name_H-M   P-1\n"
    + "loop_\n_symmetry_equiv_pos_site_id\n_symmetry_equiv_pos_as_xyz\n1 +x,+y,+z\n\n"
    + "_cell_angle_alpha 90\n_cell_angle_beta 90\n_cell_angle_gamma 90\n "
    + "_cell_length_a 4.1043564\n_cell_length_b 4.1043564"
    + "\n_cell_length_c 4.1043564\n\n\n"
    + "loop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n"
    + "_atom_site_fract_y\n_atom_site_fract_z\nH_0 H 0 0 0\nH_1 H 0.1 0.1 0.1"
)


def test_cif_string_to_molecule():
    molecule = cif_string_to_molecule(cif_h_string)
    assert len(molecule.sites) == 2


def test_cif_string_to_crystal():
    crystal = cif_string_to_crystal(cif_h_string)
    print(crystal)
    assert crystal.lattice.alpha == 90
