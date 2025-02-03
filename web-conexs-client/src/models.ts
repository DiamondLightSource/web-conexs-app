export interface MoleculeInput {
  label: string;
  structure: string;
}

export interface Molecule extends MoleculeInput {
  id: number;
}

export interface SimulationType {
  type: string;
  id: number;
}

export interface Simulation {
  id: number;
  person_id: number;
  working_directory: string;
  message: string | null;
  status: string;
  simulation_type: SimulationType;
}

export interface OrcaSimulation {
  molecular_structure_id: number;
  memory_per_core: number;
  functional: string;
  basis_set: string;
  charge: number;
  multiplicity: number;
  solvent: string | null;
  orb_win_0_start: number | null;
  orb_win_0_stop: number | null;
  orb_win_1_start: number | null;
  orb_win_1_stop: number | null;
  simulation: Simulation;
}
