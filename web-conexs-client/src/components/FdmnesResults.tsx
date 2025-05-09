import { Grid2, Stack } from "@mui/material";

import FdmnesModelCard from "./FdmnesModelCard";

import FdmnesChart from "./FdmnesChart";
import FdmnesResultsTabs from "./FdmnesResultsTabs";
import CrystalViewer from "./CrystalViewer";

export default function FdmnesResults(props: { fdmnesSimulationId: number }) {
  return (
    <Grid2 container spacing={2} height="100%">
      <Grid2 size={4}>
        <Stack>
          <FdmnesModelCard
            fdmnesSimulationId={props.fdmnesSimulationId}
          ></FdmnesModelCard>
          <CrystalViewer id={props.fdmnesSimulationId} />
        </Stack>
      </Grid2>

      <Grid2 size={8}>
        <FdmnesResultsTabs fdmnesSimulationId={props.fdmnesSimulationId} />
      </Grid2>
    </Grid2>
  );
}
