export interface MoleculeInput {
  label: string;
  structure: string;
}

export interface Person {
  identifier: string;
  accepted_orca_eula: boolean;
}

export interface CrystalInput extends MoleculeInput {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
}

export interface LatticeParameter {
  a: number | null;
  b: number | null;
  c: number | null;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
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
  stk_energy: number[] | undefined;
  stk_xas: number[] | undefined;
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

export interface SimulationPage {
  items: Simulation[];
  total: string | null;
  current_page: string;
  current_page_backwards: string;
  previous_page: string | null;
  next_page: string | null;
}

export interface OrcaSimulationInput {
  calculation_type: string;
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
  calculation_type: "xas",
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
  crystal_structure_id: number | null;
  molecular_structure_id: number | null;
  element: number;
  edge: string;
  greens_approach: boolean;
  n_cores: number;
  memory: number;
}

export interface FDMNESSimulation extends FDMNESSimulationInput {
  simulation: Simulation;
}

export const fdmnesDefaultValues: FDMNESSimulationInput = {
  crystal_structure_id: null,
  molecular_structure_id: null,
  memory: 1024,
  element: 1,
  edge: "k",
  greens_approach: false,
  n_cores: 4,
};

export interface QESimulationInput {
  crystal_structure_id: number;
  absorbing_atom: number;
  edge: string;
  conductivity: string;
  n_cores: number;
  memory: number;
}

export interface QESimulation extends QESimulationInput {
  simulation: Simulation;
}

export const qeDefaultValues: QESimulationInput = {
  crystal_structure_id: -1,
  memory: 1024,
  absorbing_atom: 1,
  edge: "k",
  conductivity: "metallic",
  n_cores: 4,
};
