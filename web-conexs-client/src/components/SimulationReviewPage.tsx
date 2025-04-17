import { Box, Button } from "@mui/material";
import useSimulationAPI from "../hooks/useSimulationAPI";
import SimulationTable from "./SimulationTable";
import OrcaModelCard from "./OrcaModelCard";
import { Simulation } from "../models";
import FdmnesModelCard from "./FdmnesModelCard";
import { or } from "@jsonforms/core";
import FdmnesForm from "./FdmnesForm";
import FdmnesResults from "./FdmnesResults";

export default function SimulationReviewPage() {
  const {
    simulation,
    orcaSimulation,
    simulationList,
    getSimulations,
    getSimulation,
    getOrcaSimulation,
    getFdmnesSimulation,
    fdmnesSimulation,
  } = useSimulationAPI();

  const updateSimulation = (simulation: Simulation) => {
    console.log("update");
    if (simulation?.simulation_type.id == 1) {
      console.log("get");
      getOrcaSimulation(simulation.id);
    } else if (simulation?.simulation_type.id == 2) {
      getFdmnesSimulation(simulation.id);
    }
  };

  return (
    <Box height={"100%"}>
      <Button onClick={getSimulations}>Fetch</Button>
      <SimulationTable
        simulations={simulationList}
        selectedSimulation={undefined}
        setSelectedSimulation={(simulation) => {
          getSimulation(simulation?.id);
          updateSimulation(simulation);
        }}
        setCurrent={() => {}}
        prevNext={null}
      ></SimulationTable>
      {orcaSimulation && simulation.id == orcaSimulation.simulation.id && (
        <OrcaModelCard orcaSimulation={orcaSimulation}></OrcaModelCard>
      )}
      {fdmnesSimulation && simulation.id == fdmnesSimulation.simulation.id && (
        <FdmnesResults fdmnesSimulation={fdmnesSimulation}></FdmnesResults>
      )}
    </Box>
  );
}
