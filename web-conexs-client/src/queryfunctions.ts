import axios, { AxiosResponse } from "axios";
import {
  Crystal,
  CrystalInput,
  FDMNESSimulation,
  FDMNESSimulationInput,
  Molecule,
  MoleculeInput,
  OrcaSimulation,
  OrcaSimulationInput,
  Person,
  QESimulation,
  QESimulationInput,
  Simulation,
  SimulationPage,
  XASData,
} from "./models";

const simulationUrl = "/api/simulations";
const orcaUrl = "/api/orca";
const fdmnesUrl = "/api/fdmnes";
const qeUrl = "/api/qe";
const moleculeUrl = "/api/molecules";
const crystalUrl = "/api/crystals";
const userUrl = "/api/user";
const matprojUrl = "/api/matproj"

export const getSimulationPage = async (
  cursor: string | null,
  size: number
) => {
  let url = simulationUrl + "?size=" + size;

  if (cursor != null) {
    url = url + "&cursor=" + cursor;
  }

  const { data } = await axios.get<
    SimulationPage,
    AxiosResponse<SimulationPage>
  >(url);
  return data;
};

export const getSimulation = async (id: number) => {
  const { data } = await axios.get<Simulation, AxiosResponse<Simulation>>(
    simulationUrl + "/" + id
  );
  return data;
};

export const getOrcaSimulation = async (id: number) => {
  const { data } = await axios.get<
    OrcaSimulation,
    AxiosResponse<OrcaSimulation>
  >(orcaUrl + "/" + id);
  return data;
};

export const getFdmnesSimulation = async (id: number) => {
  const { data } = await axios.get<
    FDMNESSimulation,
    AxiosResponse<FDMNESSimulation>
  >(fdmnesUrl + "/" + id);
  return data;
};

export const getQESimulation = async (id: number) => {
  const { data } = await axios.get<QESimulation, AxiosResponse<QESimulation>>(
    qeUrl + "/" + id
  );
  return data;
};

export const getMolecules = async () => {
  const { data } = await axios.get<Molecule[], AxiosResponse<Molecule[]>>(
    moleculeUrl
  );
  return data;
};

export const getMolecule = async (id: number) => {
  const { data } = await axios.get<Molecule, AxiosResponse<Molecule>>(
    moleculeUrl + "/" + id
  );
  return data;
};

export const postMolecule = async (input: MoleculeInput) => {
  axios.post(moleculeUrl, input);
};

export const getCrystals = async () => {
  const { data } = await axios.get<Crystal[], AxiosResponse<Crystal[]>>(
    crystalUrl
  );
  return data;
};

export const getCrystal = async (id: number) => {
  const { data } = await axios.get<Crystal, AxiosResponse<Crystal>>(
    crystalUrl + "/" + id
  );
  return data;
};

export const postCrystal = async (input: CrystalInput) => {
  axios.post(crystalUrl, input);
};

export const postOrca = async (input: OrcaSimulationInput) => {
  const response = await axios.post(orcaUrl, input);

  if (response.status != 200) {
    throw new Error("Failed to submit job");
  }
};

export const getOrcaLog = async (id: number) => {
  const { data } = await axios.get<string, AxiosResponse<string>>(
    orcaUrl + "/" + id + "/output"
  );
  return data;
};

export const getOrcaXyz = async (id: number) => {
  const { data } = await axios.get<string, AxiosResponse<string>>(
    orcaUrl + "/" + id + "/xyz"
  );
  return data;
};

export const getFdmnesLog = async (id: number) => {
  const { data } = await axios.get<string, AxiosResponse<string>>(
    fdmnesUrl + "/" + id + "/output"
  );
  return data;
};

export const getFdmnesJobfile = async (id: number) => {
  const { data } = await axios.get<string, AxiosResponse<string>>(
    fdmnesUrl + "/" + id + "/jobfile"
  );
  return data;
};

export const getFdmnesXas = async (id: number) => {
  const { data } = await axios.get<XASData, AxiosResponse<XASData>>(
    fdmnesUrl + "/" + id + "/xas"
  );
  return data;
};

export const getOrcaXas = async (id: number) => {
  const { data } = await axios.get<XASData, AxiosResponse<XASData>>(
    orcaUrl + "/" + id + "/xas"
  );
  return data;
};

export const getOrcaJobfile = async (id: number) => {
  const { data } = await axios.get<XASData, AxiosResponse<XASData>>(
    orcaUrl + "/" + id + "/jobfile"
  );
  return data;
};

export const getQEXas = async (id: number) => {
  const { data } = await axios.get<XASData, AxiosResponse<XASData>>(
    qeUrl + "/" + id + "/xas"
  );
  return data;
};

export const getQELog = async (id: number) => {
  const { data } = await axios.get<string, AxiosResponse<string>>(
    qeUrl + "/" + id + "/output"
  );
  return data;
};

export const getQEJobFile = async (id: number) => {
  const { data } = await axios.get<string, AxiosResponse<string>>(
    qeUrl + "/" + id + "/jobfile"
  );
  return data;
};

export const postFdmnes = async (input: FDMNESSimulationInput) => {
  const response = await axios.post(fdmnesUrl, input);

  if (response.status != 200) {
    throw new Error("Failed to submit job");
  }
};

export const getUser = async () => {
  const { data } = await axios.get<Person, AxiosResponse<Person>>(userUrl);
  return data;
};

export const patchUser = async () => {
  const { data } = await axios.patch<Person, AxiosResponse<Person>>(userUrl);
  return data;
};

export const postQe = async (input: QESimulationInput) => {
  const response = await axios.post(qeUrl, input);

  if (response.status != 200) {
    throw new Error("Failed to submit job");
  }
};

export const cancelSimulation = async (id: number) => {
  const { data } = await axios.patch<Simulation, AxiosResponse<Simulation>>(
    simulationUrl + "/" + id + "/status"
  );
  return data;
};

export const getMatProjStructure = async (id: string) => {
  const  response  = await axios.get<
    Crystal,
    AxiosResponse<Crystal>
  >(matprojUrl + "/" + id);

  if (response.status != 200) {
    throw new Error("Failed to submit job");
  }
  return response.data;
};
