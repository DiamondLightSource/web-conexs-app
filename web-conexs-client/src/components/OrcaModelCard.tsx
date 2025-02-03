import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { OrcaSimulation } from "../models";

export default function OrcaModelCard(props: {
  orcaSimulation: OrcaSimulation;
}) {
  const orcaSimulation = props.orcaSimulation;

  return (
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
  );
}
