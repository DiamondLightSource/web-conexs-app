import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { OrcaSimulation } from "../models";
import useSimulationAPI from "../hooks/useSimulationAPI";

export default function OrcaModelCard(props: {
  orcaSimulation: OrcaSimulation;
}) {
  const { orcaSimulationLog, getOrcaSimulationLog } = useSimulationAPI();
  const orcaSimulation = props.orcaSimulation;

  return (
    <Stack height={"100%"}>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Orca Simulation
          </Typography>
          <Typography variant="h5" component="div">
            {orcaSimulation.functional}
          </Typography>
          <Typography variant="h6" component="div">
            {orcaSimulation.basis_set}
          </Typography>
        </CardContent>
      </Card>

      <Button
        onClick={() => getOrcaSimulationLog(orcaSimulation.simulation.id)}
      >
        Get Output
      </Button>
      <Typography
        maxHeight={"20em"}
        sx={{
          fontFamily: "Monospace",
          whiteSpace: "pre-wrap",
          overflowY: "scroll",
        }}
      >
        {orcaSimulationLog}
      </Typography>
    </Stack>
  );
}
