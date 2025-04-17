import { Grid2, Stack, TextField, Typography } from "@mui/material";
import { FDMNESSimulation } from "../models";
import FdmnesModelCard from "./FdmnesModelCard";
import useSimulationAPI from "../hooks/useSimulationAPI";
import { useEffect } from "react";
import XASChart from "./XASChart";
import FdmnesChart from "./FdmnesChart";

export default function FdmnesResults(props: {
  fdmnesSimulation: FDMNESSimulation;
}) {
  const { fdmnesOutput, getFdmnesSimulationOutput } = useSimulationAPI();

  console.log("RERENDER");

  useEffect(() => {
    console.log("Use effect");
    getFdmnesSimulationOutput(props.fdmnesSimulation.simulation.id);
  }, [props.fdmnesSimulation.simulation.id, getFdmnesSimulationOutput]);

  return (
    <Grid2 container>
      <Grid2 size={4}>
        <Stack>
          <FdmnesModelCard
            fdmnesSimulation={props.fdmnesSimulation}
          ></FdmnesModelCard>
          <FdmnesChart id={props.fdmnesSimulation.simulation.id}></FdmnesChart>
        </Stack>
      </Grid2>
      <Grid2 size={8}>
        <TextField
          sx={{ width: "100%" }}
          id="datafilebox"
          label="FDMNES log"
          multiline
          rows={12}
          value={fdmnesOutput}
        />
      </Grid2>
    </Grid2>
  );
}
