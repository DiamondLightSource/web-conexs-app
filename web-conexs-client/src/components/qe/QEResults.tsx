import { Box, Stack } from "@mui/material";
import QEModelCard from "./QEModelCard";
import QEResultsTabs from "./QEResultsTabs";
import SimulationStructureViewer from "../SimulationStructureViewer";

export default function QEResults(props: { qeSimulationId: number }) {
  return (
    <Stack
      sx={{ minHeight: 0, justifyContent: "space-between", flex: 1 }}
      spacing={2}
      margin={"10px"}
    >
      <Stack minHeight={200} direction="row" spacing={2}>
        <QEModelCard qeSimulationId={props.qeSimulationId}></QEModelCard>
        <Box flex={1}>
          <SimulationStructureViewer simulationId={props.qeSimulationId} />
        </Box>
      </Stack>
      <QEResultsTabs qeSimulationId={props.qeSimulationId} />
    </Stack>
  );
}
