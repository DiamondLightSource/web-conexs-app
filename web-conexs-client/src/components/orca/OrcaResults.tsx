import { Box, Stack } from "@mui/material";
import OrcaModelCard from "./OrcaModelCard";
import OrcaResultsTabs from "./OrcaResultsTabs";
import OrcaMoleculeViewer from "./OrcaMoleculeViewer";
import { useQuery } from "@tanstack/react-query";
import { getOrcaSimulation } from "../../queryfunctions";

export default function OrcaResults(props: { orcaSimulationId: number }) {
  const query = useQuery({
    queryKey: ["orca", props.orcaSimulationId],
    queryFn: () => getOrcaSimulation(props.orcaSimulationId),
  });

  console.log(props.orcaSimulationId);

  if (!query.data) {
    return <Box>Loading</Box>;
  }
  return (
    <Stack
      sx={{ minHeight: 0, justifyContent: "space-between", flex: 1 }}
      spacing={2}
      margin={"10px"}
    >
      <Stack minHeight={200} direction="row" spacing={2}>
        <OrcaModelCard
          orcaSimulationId={props.orcaSimulationId}
        ></OrcaModelCard>
        <Box flex={1}>
          <OrcaMoleculeViewer orcaSimulationid={props.orcaSimulationId} />
        </Box>
      </Stack>
      <OrcaResultsTabs
        orcaSimulationId={props.orcaSimulationId}
        isOpt={query.data.calculation_type == "opt"}
      />
    </Stack>
  );
}
