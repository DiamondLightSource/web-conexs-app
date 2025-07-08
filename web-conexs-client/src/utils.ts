import { CrystalInput, MoleculeInput, Site } from "./models";
import { elementMap, elementSet, periodic_table } from "./periodictable";

function sortSites(sites: Site[]) {
  const s = [...sites];

  return s.sort((a, b) => a.index - b.index);
}

function joinSites(sites: Site[], output: string) {
  sites.forEach((s) => {
    output +=
      periodic_table[s.element_z - 1].symbol +
      " " +
      s.x +
      " " +
      s.y +
      " " +
      s.z +
      "\n";
  });
  return output;
}

export function inputToXYZNoHeader(input: MoleculeInput | CrystalInput) {
  const sites = sortSites(input.sites);
  const output = joinSites(sites, "");
  return output;
}

export function moleculeInputToXYZ(input: MoleculeInput) {
  const sites = sortSites(input.sites);

  let output = input.sites.length + "\n\n";

  output = joinSites(sites, output);

  return output;
}

export function crystalInputToCIF(input: CrystalInput) {
  let cif = "data_1\n\n";
  cif = cif + "_cell_angle_alpha" + " " + input.lattice.alpha + "\n";
  cif = cif + "_cell_angle_beta" + " " + input.lattice.beta + "\n";
  cif = cif + "_cell_angle_gamma" + " " + input.lattice.gamma + "\n";
  cif = cif + "_cell_length_a" + " " + input.lattice.a + "\n";
  cif = cif + "_cell_length_b" + " " + input.lattice.b + "\n";
  cif = cif + "_cell_length_c" + " " + input.lattice.c + "\n\n";

  cif =
    cif +
    "loop_\n_atom_site_label\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n";

  const sites = sortSites(input.sites);

  sites.forEach((s, i) => {
    cif =
      cif +
      periodic_table[s.element_z - 1].symbol +
      "_" +
      i +
      " " +
      s.x +
      " " +
      s.y +
      " " +
      s.z +
      "\n";
  });

  return cif;
}

export function validateMoleculeData(data: string): string {
  if (data.trim() === "") {
    return "Structure cannot be empty";
  }

  const a = data.split("\n");
  let errorList = "";

  for (let index = 0; index < a.length; index++) {
    const currentLine = a[index].split(/\b\s+/).filter((i) => i);
    if (currentLine.length == 0) {
      errorList = errorList + "Empty line:  " + (index + 1) + "\n";
    }
    if (currentLine.length != 4) {
      errorList =
        errorList + "Wrong number of items on line " + (index + 1) + "\n";
    }
    if (!elementSet.has(currentLine[0])) {
      errorList = errorList + "Invalid chemical on line " + (index + 1) + "\n";
    }
  }
  return errorList;
}

export function siteFromString(data: string): Site[] {
  if (data.trim() === "") {
    throw new Error("Structure cannot be empty");
  }

  const a = data.split("\n");
  let errorList = "";

  const sites: Site[] = [];

  for (let index = 0; index < a.length; index++) {
    const currentLine = a[index].split(/\b\s+/).filter((i) => i);
    if (currentLine.length == 0) {
      errorList = errorList + "Empty line:  " + (index + 1) + "\n";
    } else if (currentLine.length != 4) {
      errorList =
        errorList + "Wrong number of items on line " + (index + 1) + "\n";
    } else if (!elementSet.has(currentLine[0])) {
      errorList = errorList + "Invalid chemical on line " + (index + 1) + "\n";
    } else {
      const el = elementMap.get(currentLine[0]);

      if (el) {
        sites.push({
          index: index,
          element_z: el,
          x: parseFloat(currentLine[1]),
          y: parseFloat(currentLine[2]),
          z: parseFloat(currentLine[3]),
        });
      } else {
        errorList =
          errorList + "Invalid chemical on line " + (index + 1) + "\n";
      }
    }
  }

  if (errorList.length != 0) {
    throw new Error(errorList);
  }

  return sites;
}
