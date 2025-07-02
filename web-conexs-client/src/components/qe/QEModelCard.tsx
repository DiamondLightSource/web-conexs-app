import { Box, Card, CardContent, Link, Typography } from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { getQESimulation } from "../../queryfunctions";

const data_url = "/api/simulations/";

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

        {(qeSimulation.simulation.status == "completed" ||
          qeSimulation.simulation.status == "failed" ||
          qeSimulation.simulation.status == "cancelled") && (
          <Link
            href={data_url + String(props.qeSimulationId) + "?format=zip"}
            download={"simulation_" + String(props.qeSimulationId) + ".zip"}
          >
            Download
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
