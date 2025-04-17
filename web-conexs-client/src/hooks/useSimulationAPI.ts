import { useState } from "react";
import {
  FDMNESSimulation,
  FDMNESSimulationInput,
  OrcaSimulation,
  OrcaSimulationInput,
  Simulation,
  XASData,
} from "../models";

const simulationUrl = "/api/simulations";
const orcaUrl = "/api/orca";
const fdmnesUrl = "/api/fdmnes";

import axios, { AxiosError } from "axios";

export default function useSimulationAPI() {
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [simulationList, setSimulationList] = useState<Simulation[]>([]);
  const [orcaSimulation, setOrcaSimulation] = useState<OrcaSimulation | null>(
    null
  );
  const [fdmnesSimulation, setFdmnesSimulation] =
    useState<FDMNESSimulation | null>(null);
  const [fdmnesOutput, setFdmnesOutput] = useState("");

  const [fdmnesXAS, setFdmnesXAS] = useState<XASData>({
    energy: [0],
    xas: [0],
  });

  console.log("USE API CALLED");

  const [orcaSimulationLog, setOrcaSimulationLog] = useState<string>("");

  function getSimulation(id: number) {
    axios.get(simulationUrl + "/" + id).then((res) => {
      setSimulation(res.data);
    });
  }

  function getSimulations() {
    axios.get(simulationUrl).then((res) => {
      setSimulationList(res.data);
    });
  }

  function getOrcaSimulation(id: number) {
    axios.get(orcaUrl + "/" + id).then((res) => {
      setOrcaSimulation(res.data);
    });
  }

  function getOrcaSimulationLog(id: number) {
    axios.get(orcaUrl + "/" + id + "/output").then((res) => {
      setOrcaSimulationLog(res.data);
    });
  }

  function postOrcaSimulation(input: OrcaSimulationInput) {
    axios
      .post("/api/submit/orca", input)
      .then(() => {
        window.alert("Thank you for your submission");
      })
      .catch((reason: AxiosError) => {
        window.alert(reason.message);
      });
  }

  function getFdmnesSimulation(id: number) {
    axios.get(fdmnesUrl + "/" + id).then((res) => {
      setFdmnesSimulation(res.data);
    });
  }

  function getFdmnesSimulationOutput(id: number) {
    axios.get(fdmnesUrl + "/" + id + "/output").then((res) => {
      setFdmnesOutput(res.data);
    });
    // axios.get(fdmnesUrl + "/" + id + "/xas").then((res) => {
    //   setFdmnesXAS(res.data);
    // });
  }

  function getFdmnesSimulationXAS(id: number) {
    axios.get(fdmnesUrl + "/" + id + "/xas").then((res) => {
      console.log("Set called");
      // setFdmnesOutput({test : res.statusText});
      setFdmnesXAS(res.data);
    });
  }

  // const testFunction = useCallback(getFdmnesSimulation, [id]);

  function postFdmnesSimulation(input: FDMNESSimulationInput) {
    axios
      .post("/api/submit/fdmnes", input)
      .then(() => {
        window.alert("Thank you for your submission");
      })
      .catch((reason: AxiosError) => {
        window.alert(reason.message);
      });
  }

  return {
    simulation,
    getSimulation,
    getSimulations,
    simulationList,
    orcaSimulation,
    getOrcaSimulation,
    postOrcaSimulation,
    orcaSimulationLog,
    getOrcaSimulationLog,
    getFdmnesSimulation,
    postFdmnesSimulation,
    fdmnesSimulation,
    fdmnesOutput,
    getFdmnesSimulationOutput,
    getFdmnesSimulationXAS,
    fdmnesXAS,
  };
}
