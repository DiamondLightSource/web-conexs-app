import { useState } from "react";
import { OrcaSimulation, OrcaSimulationInput, Simulation } from "../models";

const simulationUrl = "/api/simulations";
const orcaUrl = "/api/orca";

import axios, { AxiosError } from "axios";

export default function useSimulationAPI() {
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [simulationList, setSimulationList] = useState<Simulation[]>([]);
  const [orcaSimulation, setOrcaSimulation] = useState<OrcaSimulation | null>(
    null
  );

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

  return {
    simulation,
    getSimulation,
    getSimulations,
    simulationList,
    orcaSimulation,
    getOrcaSimulation,
    postOrcaSimulation,
  };
}
