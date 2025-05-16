import { Box, Grid2, Stack } from "@mui/material";
import OrcaModelCard from "./OrcaModelCard";
import MoleculeViewer from "./MoleculeViewer";
import OrcaResultsTabs from "./OrcaResultsTabs";
import OrcaMoleculeViewer from "./OrcaMoleculeViewer";
import { useQuery } from "@tanstack/react-query";
import { getOrcaSimulation } from "../queryfunctions";

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
    <Grid2 container spacing={2} height="100%">
      <Grid2 size={4}>
        <Stack>
          <OrcaModelCard
            orcaSimulationId={props.orcaSimulationId}
          ></OrcaModelCard>
          <OrcaMoleculeViewer orcaSimulationid={props.orcaSimulationId} />
        </Stack>
      </Grid2>

      <Grid2 size={8}>
        <OrcaResultsTabs
          orcaSimulationId={props.orcaSimulationId}
          isOpt={query.data.calculation_type == "opt"}
        />
      </Grid2>
    </Grid2>
  );
}
