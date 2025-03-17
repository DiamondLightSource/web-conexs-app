import { useState } from "react";
import {
  FDMNESSimulation,
  FDMNESSimulationInput,
  OrcaSimulation,
  OrcaSimulationInput,
  Simulation,
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
  };
}
