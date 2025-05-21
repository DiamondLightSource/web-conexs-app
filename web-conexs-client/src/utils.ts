import { CrystalInput, MoleculeInput } from "./models";
import { elementSet } from "./periodictable";

export function moleculeInputToXYZ(input: MoleculeInput) {
  const lines = (input.structure.match(/\n/g) || "").length + 1;
  return lines.toString() + "\n\n" + input.structure;
}

export function crystalInputToCIF(input: CrystalInput) {
  let cif = "data_1\n\n";
  cif = cif + "_cell_angle_alpha" + " " + input.alpha + "\n";
  cif = cif + "_cell_angle_beta" + " " + input.beta + "\n";
  cif = cif + "_cell_angle_gamma" + " " + input.gamma + "\n";
  cif = cif + "_cell_length_a" + " " + input.a + "\n";
  cif = cif + "_cell_length_b" + " " + input.b + "\n";
  cif = cif + "_cell_length_c" + " " + input.c + "\n\n";

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

export function validateMoleculeData(data: string): string {
  const a = data.split("\n");
  let errorList = "";

  for (let index = 0; index < a.length; index++) {
    const currentLine = a[index].split(/\b\s+/).filter((i) => i);
    if (currentLine.length == 0) {
      continue;
    }
    if (currentLine.length != 4) {
      errorList =
        errorList + "Wrong number of items on line " + (index + 1) + "\n";
    }
    if (!elementSet.has(currentLine[0])) {
      errorList = errorList + "Invalid chemical on line " + (index + 1) + "\n";
    }
    // if (
    //   !/^[+-]?[0-9]{1,}(?:\.[0-9]{1,})?$/.test(currentLine[1]) ||
    //   !/^[+-]?[0-9]{1,}(?:\.[0-9]{1,})?$/.test(currentLine[2]) ||
    //   !/^[+-]?[0-9]{1,}(?:\.[0-9]{1,})?$/.test(currentLine[3])
    // ) {
    //   errorList = errorList + "Invalid number on line " + (index + 1) + "\n";
    // }
  }
  return errorList;
}
