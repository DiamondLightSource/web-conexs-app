import { Grid2, Stack } from "@mui/material";

import FdmnesModelCard from "./FdmnesModelCard";

import FdmnesChart from "./FdmnesChart";

export default function FdmnesResults(props: { fdmnesSimulationId: number }) {
  return (
    <Grid2 container>
      <Grid2 size={4}>
        <Stack>
          <FdmnesModelCard
            fdmnesSimulationId={props.fdmnesSimulationId}
          ></FdmnesModelCard>
          <FdmnesChart id={props.fdmnesSimulationId}></FdmnesChart>
        </Stack>
      </Grid2>
    </Grid2>
  );
}
