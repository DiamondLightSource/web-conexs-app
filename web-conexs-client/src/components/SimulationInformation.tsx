import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FdmnesResults from "./fdmnes/FdmnesResults";
import OrcaResults from "./orca/OrcaResults";
import { getSimulation } from "../queryfunctions";

export function SimulationInformation(props: { simId: number }) {
  const query = useQuery({
    queryKey: ["simulations", props.simId],
    queryFn: () => getSimulation(props.simId),
  });

  return (
    <Box width={"100%"} overflow="hidden" flex={1} display="flex">
      {query.data && query.data.simulation_type.id == 1 && (
        <OrcaResults orcaSimulationId={query.data.id}></OrcaResults>
      )}
      {query.data && query.data.simulation_type.id == 2 && (
        <FdmnesResults fdmnesSimulationId={query.data.id}></FdmnesResults>
      )}
    </Box>
  );
}
