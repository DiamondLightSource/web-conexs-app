import { Box, Button } from "@mui/material";
import useSimulationAPI from "../hooks/useSimulationAPI";
import SimulationTable from "./SimulationTable";
import OrcaModelCard from "./OrcaModelCard";
import { Simulation } from "../models";

export default function SimulationReviewPage() {
  const {
    simulation,
    orcaSimulation,
    simulationList,
    getSimulations,
    getSimulation,
    getOrcaSimulation,
  } = useSimulationAPI();

  const updateSimulation = (simulation: Simulation) => {
    console.log("update");
    if (simulation?.simulation_type.id == 1) {
      console.log("get");
      getOrcaSimulation(simulation.id);
    }
  };

  return (
    <Box>
      <Button onClick={getSimulations}>Fetch</Button>
      <SimulationTable
        simulations={simulationList}
        selectedSimulation={undefined}
        setSelectedSimulation={(simulation) => {
          console.log(simulation);
          getSimulation(simulation?.id);
          updateSimulation(simulation);
        }}
        setCurrent={() => {}}
        prevNext={null}
      ></SimulationTable>
      {orcaSimulation && (
        <OrcaModelCard orcaSimulation={orcaSimulation}></OrcaModelCard>
      )}
    </Box>
  );
}
