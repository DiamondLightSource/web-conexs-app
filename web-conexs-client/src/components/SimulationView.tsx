import { Button, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import MainPanel from "./MainPanel";
import { SimulationInformation } from "./SimulationInformation";
import { useNavigate, useParams } from "react-router-dom";

export default function SimulationView() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const intId = parseInt(id ? id : "");

  return (
    <MainPanel>
      <Stack overflow="auto" justifyContent="space-between" width={"100%"}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.action.disabled,
            borderRadius: "4px 4px 0px 0px",
          }}
        >
          <Button variant="contained" onClick={() => navigate("/simulations")}>
            Back
          </Button>
        </Toolbar>
        {isNaN(intId) ? (
          <Typography>Invalid Simulation Id</Typography>
        ) : (
          <SimulationInformation simId={intId}></SimulationInformation>
        )}
      </Stack>
    </MainPanel>
  );
}
