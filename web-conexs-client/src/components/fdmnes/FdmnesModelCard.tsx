import { Box, Card, CardContent, Link, Typography } from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { getFdmnesSimulation } from "../../queryfunctions";
import { periodic_table } from "../../periodictable";

const data_url = "/api/simulations/";

export default function FdmnesModelCard(props: { fdmnesSimulationId: number }) {
  const query = useQuery({
    queryKey: ["fdmnes", props.fdmnesSimulationId],
    queryFn: () => getFdmnesSimulation(props.fdmnesSimulationId),
  });

  const fdmnesSimulation = query.data;

  if (!fdmnesSimulation) {
    return <Box>Loading...</Box>;
  }

  return (
    <Card variant="outlined" sx={{ overflow: "auto" }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          FDMNES Simulation
        </Typography>
        <Typography variant="h5" component="div">
          {"Absorbing element: " +
            periodic_table[fdmnesSimulation.element - 1].name}
        </Typography>
        <Typography variant="h6" component="div">
          {fdmnesSimulation.edge.toLocaleUpperCase() + "-edge"}
        </Typography>
        {fdmnesSimulation.greens_approach && (
          <Typography variant="h6" component="div">
            {"Using Green's approach"}
          </Typography>
        )}
        {(fdmnesSimulation.simulation.status == "completed" ||
          fdmnesSimulation.simulation.status == "failed" ||
          fdmnesSimulation.simulation.status == "cancelled") && (
          <Link
            href={data_url + String(props.fdmnesSimulationId) + "?format=zip"}
            download={"simulation_" + String(props.fdmnesSimulationId) + ".zip"}
          >
            Download
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
