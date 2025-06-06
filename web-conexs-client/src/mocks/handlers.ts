import { http, HttpResponse, delay } from "msw";
import {
  Crystal,
  Molecule,
  MoleculeInput,
  OrcaSimulation,
  OrcaSimulationInput,
  Person,
  Simulation,
  SimulationPage,
} from "../models";

const orcaMockOutput = "********\n**ORCA RESULT**\n********";

const mockMolecule: Molecule = {
  id: 1,
  label: "MockBenzene",

  structure:
    "C   0.000000  1.402720  0.000000\nH   0.000000  2.490290  0.000000\nC  -1.214790  0.701360  0.000000\nH  -2.156660  1.245150  0.000000\nC  -1.214790 -0.701360  0.000000\nH  -2.156660 -1.245150  0.000000\nC   0.000000 -1.402720  0.000000\nH   0.000000 -2.490290  0.000000\nC   1.214790 -0.701360  0.000000\nH   2.156660 -1.245150  0.000000\nC   1.214790  0.701360  0.000000\nH   2.156660  1.245150  0.000000",
};

const mockCrystal: Crystal = {
  id: 1,

  a: 4.1043564,
  b: 4.1043564,
  c: 4.1043564,
  alpha: 90,
  beta: 90,
  gamma: 90,
  ibrav: "0",
  label: "test",
  structure: "Ag 0. 0. 0.\nAg 0.5 0.5 0.\nAg 0.5 0. 0.5\nAg 0. 0.5 0.5",
};

const mockCrystalArray = [mockCrystal];

const mockArray = [mockMolecule];

const mockSimulation: Simulation = {
  id: 1,
  message: "Mock simulation",
  person_id: 1,
  simulation_type: { id: 1, type: "MOCK" },
  status: "mock",
  working_directory: "/mock",
  request_date: "2025-02-27T09:22:41.035872",
  submission_date: null,
  completion_date: null,
};

const mockOrcaSimulation: OrcaSimulation = {
  basis_set: "mockBasisSet",
  charge: 0,
  functional: "mockFunctional",
  memory_per_core: 1,
  molecular_structure_id: 1,
  multiplicity: 0,
  orb_win_0_start: null,
  orb_win_0_stop: null,
  orb_win_1_start: null,
  orb_win_1_stop: null,
  simulation: mockSimulation,
  solvent: "None",
  calculation_type: "mock",
};

const mockSimulations = [mockSimulation];

export const handlers = [
  http.get("/api/molecules", async () => {
    await delay(10000);
    return HttpResponse.json(mockArray);
  }),

  http.get("/api/molecules/:id", ({ params }) => {
    const { id } = params;

    const mol = mockArray.find((el) => el.id == Number(id));

    if (mol) {
      return HttpResponse.json(mol);
    } else {
      return new HttpResponse(null, { status: 404 });
    }
  }),

  http.post("/api/molecules", async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newMolecule = (await request.json()) as MoleculeInput;

    const responseMolecule: Molecule = { ...newMolecule, id: 10 };

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created post!
    return HttpResponse.json(responseMolecule, { status: 201 });
  }),

  http.get("/api/simulations", () => {
    const page: SimulationPage = {
      items: [mockSimulation],
      next_page: "test",
      total: null,
      current_page: "test",
      current_page_backwards: "test",
      previous_page: null,
    };

    return HttpResponse.json(page);
  }),

  http.get("/api/simulations/:id", ({ params }) => {
    const { id } = params;

    const mol = mockSimulations.find((el) => el.id == Number(id));

    if (mol) {
      return HttpResponse.json(mol);
    } else {
      return new HttpResponse(null, { status: 404 });
    }
  }),

  http.get("/api/orca/:id", ({ params }) => {
    const { id } = params;

    return HttpResponse.json(mockOrcaSimulation);
  }),

  http.get("/api/orca/:id/output", ({ params }) => {
    const { id } = params;

    return HttpResponse.text(orcaMockOutput);
  }),

  http.post("/api/submit/orca", async ({ request }) => {
    // Read the intercepted request body as JSON.
    const newOrcaSimulation = (await request.json()) as OrcaSimulationInput;

    const responseSimulation: OrcaSimulation = {
      ...newOrcaSimulation,
      simulation: mockSimulation,
    };

    // Don't forget to declare a semantic "201 Created"
    // response and send back the newly created post!
    return HttpResponse.json(responseSimulation, { status: 201 });
  }),

  http.get("/api/crystals", async () => {
    return HttpResponse.json(mockCrystalArray);
  }),

  http.get("/api/user", async (request) => {
    const auth = request.request.headers.get("authorization");

    if (auth && auth.startsWith("Bearer ")) {
      const user: Person = { identifier: auth.slice(7) };
      return HttpResponse.json(user);
    }

    return new HttpResponse(null, { status: 401 });
  }),

  //   # mapspc
  // # @app.get("/api/orca/{id}/spectra")
  // # @app.get("/api/orca/{id}/spectra/{spectrum_id}")
  // # request new mapspc call
  // # @app.post("/api/orca/{id}/spectra/")
  // # orbital cube files
  // # @app.get("/api/orca/{id}/orbitals")
  // # @app.get("/api/orca/{id}/orbitals/{orbital_calculation_id}")
  // # request new mapspc call
  // # @app.post("/api/orca/{id}/orbitals/")
];
