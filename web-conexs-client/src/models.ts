export interface MoleculeInput {
  label: string;
  structure: string;
}

export interface CrystalInput extends MoleculeInput {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
}

export interface Molecule extends MoleculeInput {
  id: number;
}

export interface Crystal extends CrystalInput {
  id: number;
}

export interface SimulationType {
  type: string;
  id: number;
}

export interface XASData {
  energy: number[];
  xas: number[];
}

export interface Simulation {
  id: number;
  person_id: number;
  working_directory: string;
  message: string | null;
  status: string;
  simulation_type: SimulationType;
  request_date: string;
  submission_date: string | null;
  completion_date: string | null;
}

export interface OrcaSimulationInput {
  technique: string;
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
}

export interface OrcaSimulation extends OrcaSimulationInput {
  simulation: Simulation;
}

export interface OrcaSimulationWithResource extends OrcaSimulationInput {
  n_cores: number;
}

export const orcaDefaultValues: OrcaSimulationWithResource = {
  technique: "XAS",
  molecular_structure_id: -1,
  memory_per_core: 1024,
  functional: "B3LYP RIJCOSX",
  basis_set: "def2-SVP",
  charge: 0,
  multiplicity: 1,
  solvent: "None",
  orb_win_0_start: 0,
  orb_win_0_stop: 0,
  orb_win_1_start: 0,
  orb_win_1_stop: 0,
  n_cores: 4,
};

export interface FDMNESSimulationInput {
  crystal_structure_id: number;
  element: number;
  edge: string;
  greens_approach: boolean;
  structure_type: string;
  n_cores: number;
  memory: number;
}

export interface FDMNESSimulation extends FDMNESSimulationInput {
  simulation: Simulation;
}

export const fdmnesDefaultValues: FDMNESSimulationInput = {
  crystal_structure_id: -1,
  memory: 1024,
  element: 1,
  edge: "k",
  greens_approach: false,
  structure_type: "crystal",
  n_cores: 4,
};
