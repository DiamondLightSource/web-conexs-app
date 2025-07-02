import { Box, Card, CardContent, Link, Typography } from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { getOrcaSimulation } from "../../queryfunctions";

const data_url = "/api/simulations/";

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
    <Card variant="outlined" sx={{ overflow: "auto" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Orca Simulation
        </Typography>
        <Typography variant="h5" component="div">
          {orcaSimulation.calculation_type.toUpperCase()} Calculation
        </Typography>
        <Typography variant="h6" component="div">
          {orcaSimulation.functional} {orcaSimulation.basis_set}
        </Typography>
        <Typography variant="h6" component="div">
          {orcaSimulation.solvent == null
            ? "No Solvent"
            : orcaSimulation.solvent}
        </Typography>
        {(orcaSimulation.simulation.status == "completed" ||
          orcaSimulation.simulation.status == "failed" ||
          orcaSimulation.simulation.status == "cancelled") && (
          <Link
            href={data_url + String(props.orcaSimulationId) + "?format=zip"}
            download={"simulation_" + String(props.orcaSimulationId) + ".zip"}
          >
            Download
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
