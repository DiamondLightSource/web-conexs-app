import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import OrcaLogViewer from "./OrcaLogViewer";
import { useState } from "react";
import { getOrcaSimulation } from "../queryfunctions";

export default function OrcaModelCard(props: { orcaSimulationId: number }) {
  const query = useQuery({
    queryKey: ["orca", props.orcaSimulationId],
    queryFn: () => getOrcaSimulation(props.orcaSimulationId),
  });

  const orcaSimulation = query.data;

  if (!orcaSimulation) {
    return <Box>Loading...</Box>;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Orca Simulation
        </Typography>
        <Typography variant="h5" component="div">
          {orcaSimulation.calculation_type.toUpperCase()} Calculation
        </Typography>
        <Typography variant="h6" component="div">
          {orcaSimulation.functional}
        </Typography>
        <Typography variant="h6" component="div">
          {orcaSimulation.basis_set}
        </Typography>
      </CardContent>
    </Card>
  );
}
