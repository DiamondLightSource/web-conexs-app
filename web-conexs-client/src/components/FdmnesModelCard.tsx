import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { FDMNESSimulation } from "../models";

export default function FdmnesModelCard(props: {
  fdmnesSimulation: FDMNESSimulation;
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          FDMNES Simulation
        </Typography>
        <Typography variant="h5" component="div">
          {props.fdmnesSimulation.element}
        </Typography>
        <Typography variant="h6" component="div">
          {props.fdmnesSimulation.element}
        </Typography>
      </CardContent>
    </Card>
  );
}
