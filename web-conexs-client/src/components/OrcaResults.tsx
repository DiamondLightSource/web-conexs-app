import { Box, Grid2, Stack } from "@mui/material";
import OrcaModelCard from "./OrcaModelCard";
import OrcaChart from "./OrcaChart";
import MoleculeViewer from "./MoleculeViewer";
import OrcaResultsTabs from "./OrcaResultsTabs";

export default function OrcaResults(props: { orcaSimulationId: number }) {
  return (
    <Grid2 container spacing={2} height="100%">
      <Grid2 size={4}>
        <Stack>
          <OrcaModelCard
            orcaSimulationId={props.orcaSimulationId}
          ></OrcaModelCard>
          <MoleculeViewer id={props.orcaSimulationId} />
        </Stack>
      </Grid2>

      <Grid2 size={8}>
        <OrcaResultsTabs orcaSimulationId={props.orcaSimulationId} />
      </Grid2>
    </Grid2>
  );
}
