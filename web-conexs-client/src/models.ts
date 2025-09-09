export interface Site {
  element_z: number;
  x: number;
  y: number;
  z: number;
  index: number;
}

export interface MoleculeInput {
  label: string;
  sites: Site[];
}

export interface Person {
  identifier: string;
  accepted_orca_eula: boolean;
}

export interface HPCCluster {
  id: number;
  updated: string | null;
}

export interface LatticeParameter {
  a: number | null;
  b: number | null;
  c: number | null;
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

export interface CrystalInput extends MoleculeInput {
  lattice: LatticeParameter;
}

export interface Molecule extends MoleculeInput {
  id: number;
}

export interface Crystal extends CrystalInput {
  id: number;
}

export interface Structure {
  label: string;
  person_id: number;
  id: number;
  lattice_id: number | null;
}

export interface StructureWithMetadata {
  structure: Structure;
  atom_count: number;
  elements: number[];
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
  chemical_structure_id: number;
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

export interface SimulationInputBase {
  chemical_structure_id: number;
}

export interface OrcaSimulationInput extends SimulationInputBase {
  calculation_type: string;
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

export interface QESimulationSubmission
  extends QESimulationInput,
    SimulationInputBase {}

export const orcaDefaultValues: OrcaSimulationInput = {
  calculation_type: "xas",
  functional: "B3LYP RIJCOSX",
  basis_set: "def2-SVP",
  charge: 0,
  multiplicity: 1,
  solvent: "None",
  orb_win_0_start: 0,
  orb_win_0_stop: 0,
  orb_win_1_start: 0,
  orb_win_1_stop: 0,
  chemical_structure_id: -1,
};

export interface FDMNESSimulationInput extends SimulationInputBase {
  element: number;
  edge: string;
  greens_approach: boolean;
}

export interface FDMNESSimulation extends FDMNESSimulationInput {
  simulation: Simulation;
}

export const fdmnesDefaultValues: FDMNESSimulationInput = {
  element: 1,
  edge: "k",
  greens_approach: false,
  chemical_structure_id: -1,
};

export interface QESimulationInput {
  absorbing_atom: number;
  edge: string;
  conductivity: string;
}

export interface QESimulation extends QESimulationInput {
  simulation: Simulation;
}

export const qeDefaultValues: QESimulationSubmission = {
  absorbing_atom: 1,
  edge: "k",
  conductivity: "metallic",
  chemical_structure_id: -1,
};
