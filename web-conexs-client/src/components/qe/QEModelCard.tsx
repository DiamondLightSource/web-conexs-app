import { Box, Card, CardContent, Typography } from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { getQESimulation } from "../../queryfunctions";

export default function QEModelCard(props: { qeSimulationId: number }) {
  const query = useQuery({
    queryKey: ["qe", props.qeSimulationId],
    queryFn: () => getQESimulation(props.qeSimulationId),
  });

  const qeSimulation = query.data;

  if (!qeSimulation) {
    return <Box>Loading...</Box>;
  }

  return (
    <Card variant="outlined" sx={{ overflow: "auto" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Quantum Espresso Simulation
        </Typography>
        <Typography variant="h5" component="div">
          {"Absorbing Atom: " + qeSimulation.absorbing_atom}
        </Typography>
        <Typography variant="h6" component="div">
          {qeSimulation.edge.toLocaleUpperCase() + "-edge"}
        </Typography>
        <Typography variant="h6" component="div">
          {qeSimulation.conductivity}
        </Typography>
      </CardContent>
    </Card>
  );
}
