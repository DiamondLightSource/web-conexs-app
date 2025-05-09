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
  SimulationPage,
  XASData,
} from "./models";

const simulationUrl = "/api/simulationsp";
const orcaUrl = "/api/orca";
const fdmnesUrl = "/api/fdmnes";
const moleculeUrl = "/api/molecules";
const crystalUrl = "/api/crystals";
const orcaSubmitUrl = "/api/submit/orca";
const fdmnesSubmitUrl = "/api/submit/fdmnes";

export const getSimulationPage = async (cursor: string | null) => {
  let url = simulationUrl + "?size=10";

  if (cursor != null) {
    url = url + "&cursor=" + cursor;
  }

  const { data } = await axios.get<
    SimulationPage,
    AxiosResponse<SimulationPage>
  >(url);
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
  const response = await axios.post(orcaSubmitUrl, input);

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

export const getFdmnesLog = async (id: number) => {
  const { data } = await axios.get<string, AxiosResponse<string>>(
    fdmnesUrl + "/" + id + "/output"
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

export const postFdmnes = async (input: FDMNESSimulationInput) => {
  const response = await axios.post(fdmnesSubmitUrl, input);

  if (response.status != 200) {
    throw new Error("Failed to submit job");
  }
};
