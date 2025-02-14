import { CrystalInput, MoleculeInput } from "./models";

export function moleculeInputToXYZ(input: MoleculeInput) {
  const lines = (input.structure.match(/\n/g) || "").length + 1;
  return lines.toString() + "\n\n" + input.structure;
}

export function crystalInputToCIF(input: CrystalInput) {
  let cif = "data_1\n\n";
  //   const cifString =
  //     "data_1 \n\n_cell_angle_alpha                90\ncell_angle_beta                 90\n_cell_angle_gamma                120\n\n_cell_length_a                   3.22\n_cell_length_b                   3.22\n_cell_length_c                   5.2\n\n\nloop_\n_atom_site_label\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\nZn 0.3333 0.6667 0.\nO 0.3333 0.6667 0.375";

  cif = cif + "_cell_angle_alpha" + " " + input.lattice_params.alpha + "\n";
  cif = cif + "_cell_angle_beta" + " " + input.lattice_params.beta + "\n";
  cif = cif + "_cell_angle_gamma" + " " + input.lattice_params.gamma + "\n";
  cif = cif + "_cell_length_a" + " " + input.lattice_params.a + "\n";
  cif = cif + "_cell_length_b" + " " + input.lattice_params.b + "\n";
  cif = cif + "_cell_length_c" + " " + input.lattice_params.c + "\n\n";

  cif =
    cif +
    "loop_\n_atom_site_label\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n";

  const lines = input.structure.split("\n");

  lines.forEach((l, i) => {
    const cols = l.split(/\s/);
    cif =
      cif +
      cols[0] +
      "_" +
      i +
      " " +
      cols[1] +
      " " +
      cols[2] +
      " " +
      cols[3] +
      "\n";
  });

  return cif;
}
