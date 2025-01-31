export interface MoleculeInput {
  label: string;
  structure: string;
}

export interface Molecule extends MoleculeInput {
  id: number;
}
