import { Button, Typography } from "@mui/material";
import MainPanel from "./MainPanel";
import { SimulationInformation } from "./SimulationInformation";
import { useNavigate, useParams } from "react-router-dom";

export default function SimulationView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const intId = parseInt(id ? id : "");

  return (
    <MainPanel
      toolbarElements={
        <Button variant="contained" onClick={() => navigate("/simulations")}>
          Back
        </Button>
      }
    >
      {isNaN(intId) ? (
        <Typography>Invalid Simulation Id</Typography>
      ) : (
        <SimulationInformation simId={intId}></SimulationInformation>
      )}
    </MainPanel>
  );
}
