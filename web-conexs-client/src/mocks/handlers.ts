import { http, HttpResponse } from "msw";
import {
  Crystal,
  HPCCluster,
  Molecule,
  OrcaSimulation,
  OrcaSimulationInput,
  Person,
  Simulation,
  SimulationPage,
  Structure,
  StructureWithMetadata,
  XASData,
} from "../models";

const orcaMockOutput = "********\n**ORCA RESULT**\n********";
const orcaMockJobfile = "********\n**ORCA JOBFILE**\n********";

const mockCrystalStructure: Crystal = {
  id: 1,
  lattice: {
    a: 4.1043564,
    b: 4.1043564,
    c: 4.1043564,
    alpha: 90,
    beta: 90,
    gamma: 90,
  },
  label: "test",
  sites: [
    { element_z: 47, x: 0.0, y: 0.0, z: 0.0, index: 1 },
    { element_z: 47, x: 0.5, y: 0.5, z: 0.0, index: 2 },
    { element_z: 47, x: 0.5, y: 0.0, z: 0.5, index: 3 },
    { element_z: 47, x: 0.0, y: 0.5, z: 0.5, index: 4 },
  ],
};

const mockCrystal: Structure = {
  id: 1,
  label: "test",
  person_id: 1,
  lattice_id: 1,
};

const mockCrysWithMetadata: StructureWithMetadata = {
  atom_count: 4,
  elements: [47],
  structure: mockCrystal,
};

const mockMoleculeStructure: Molecule = {
  id: 2,
  label: "Benzene",
  sites: [
    { index: 1, element_z: 6, x: 0.0, y: 1.40272, z: 0.0 },
    { index: 2, element_z: 1, x: 0.0, y: 2.49029, z: 0.0 },
    { index: 3, element_z: 6, x: -1.21479, y: 0.70136, z: 0.0 },
    { index: 4, element_z: 1, x: -2.15666, y: 1.24515, z: 0.0 },
    { index: 5, element_z: 6, x: -1.21479, y: -0.70136, z: 0.0 },
    { index: 6, element_z: 1, x: -2.15666, y: -1.24515, z: 0.0 },
    { index: 7, element_z: 6, x: 0.0, y: -1.40272, z: 0.0 },
    { index: 8, element_z: 1, x: 0.0, y: -2.49029, z: 0.0 },
    { index: 9, element_z: 6, x: 1.21479, y: -0.70136, z: 0.0 },
    { index: 10, element_z: 1, x: 2.15666, y: -1.24515, z: 0.0 },
    { index: 11, element_z: 6, x: 1.21479, y: 0.70136, z: 0.0 },
    { index: 12, element_z: 1, x: 2.15666, y: 1.24515, z: 0.0 },
  ],
};

const mockMole: Structure = {
  id: 2,
  label: "test",
  person_id: 1,
  lattice_id: null,
};

const mockMoleWithMetadata: StructureWithMetadata = {
  atom_count: 12,
  elements: [1, 6],
  structure: mockMole,
};

const mockXASdata: XASData = {
  energy: [1, 2, 3, 4, 5],
  xas: [1, 2, 3, 2, 1],
  stk_energy: [2, 3, 3, 3, 4],
  stk_xas: [0, 0, 3, 0, 0],
};

const mockSimulation: Simulation = {
  id: 1,
  message: "Mock simulation",
  person_id: 1,
  simulation_type: { id: 1, type: "MOCK" },
  status: "mock",
  working_directory: "/mock",
  request_date: "2025-02-27T09:22:41.035872",
  chemical_structure_id: 2,
  submission_date: null,
  completion_date: null,
};

const mockOrcaSimulation: OrcaSimulation = {
  basis_set: "mockBasisSet",
  charge: 0,
  functional: "mockFunctional",
  chemical_structure_id: 1,
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

  http.get("/api/orca/:id", () => {
    return HttpResponse.json(mockOrcaSimulation);
  }),

  http.get("/api/orca/:id/output", () => {
    return HttpResponse.text(orcaMockOutput);
  }),

  http.get("/api/orca/:id/jobfile", () => {
    return HttpResponse.text(orcaMockJobfile);
  }),

  http.get("/api/orca/:id/xas", () => {
    return HttpResponse.json(mockXASdata);
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

  http.get("/api/user", async (request) => {
    const auth = request.request.headers.get("authorization");

    if (auth && auth.startsWith("Bearer ")) {
      const user: Person = {
        identifier: auth.slice(7),
        accepted_orca_eula: true,
      };
      return HttpResponse.json(user);
    }

    return new HttpResponse(null, { status: 401 });
  }),

  http.get("/api/cluster/status", async () => {
    const clusterStatus: HPCCluster = {
      id: 1,
      updated: new Date(Date.now()).toISOString().slice(0, -1),
    };
    return HttpResponse.json(clusterStatus);
  }),

  http.get("/api/matproj/:id", async (request) => {
    const auth = request.request.headers.get("authorization");

    if (auth && auth.startsWith("Bearer ")) {
      return HttpResponse.json(mockCrystalStructure);
    }

    return new HttpResponse(null, { status: 401 });
  }),

  http.get("/api/cluster/status", async () => {
    const cluster: HPCCluster = { id: 1, updated: Date.now().toString() };

    return HttpResponse.json(cluster);
  }),

  http.get("/api/structures", async ({ request }) => {
    const url = new URL(request.url);

    console.log(url);

    // Given a request url of "/product?id=1",
    // the `productId` will be a "1" string.
    const type = url.searchParams.get("type");

    console.log(type);

    if (type == "crystal") {
      return HttpResponse.json([mockCrysWithMetadata]);
    } else {
      return HttpResponse.json([mockMoleWithMetadata]);
    }
  }),

  http.get("/api/structures/:id", async ({ params }) => {
    const { id } = params;

    if (id == "1") {
      return HttpResponse.json(mockCrystalStructure);
    } else if (id == "2") {
      return HttpResponse.json(mockMoleculeStructure);
    }

    return new HttpResponse(null, { status: 404 });
  }),
];
