import { Box, Stack } from "@mui/material";

import FdmnesModelCard from "./FdmnesModelCard";
import FdmnesResultsTabs from "./FdmnesResultsTabs";
import SimulationStructureViewer from "../SimulationStructureViewer";

export default function FdmnesResults(props: { fdmnesSimulationId: number }) {
  return (
    <Stack
      sx={{ minHeight: 0, justifyContent: "space-between", flex: 1 }}
      spacing={2}
      margin={"10px"}
    >
      <Stack minHeight={200} direction="row" spacing={2}>
        <FdmnesModelCard
          fdmnesSimulationId={props.fdmnesSimulationId}
        ></FdmnesModelCard>
        <Box flex={1}>
          <SimulationStructureViewer simulationId={props.fdmnesSimulationId} />
        </Box>
      </Stack>
      <FdmnesResultsTabs fdmnesSimulationId={props.fdmnesSimulationId} />
    </Stack>
  );
}
