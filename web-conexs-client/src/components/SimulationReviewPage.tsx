import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import SimulationTable from "./SimulationTable";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getSimulationPage } from "../queryfunctions";
import MainPanel from "./MainPanel";
import { useNavigate } from "react-router-dom";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";


export default function SimulationReviewPage() {
  const [cursor, setCursor] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleProceed = () => {
    const newTab = window.open("api/archive", "_blank", "noopener,noreferrer");
    if (newTab) newTab.opener = null;
    setOpen(false);
  };

  const query = useQuery({
    queryKey: ["simulations", cursor],
    queryFn: () => getSimulationPage(cursor, 20),
    refetchInterval: 10000,
  });

  if (query.data) {
    if (next != query.data.next_page) {
      setNext(query.data.next_page);
    }
    if (previous != query.data.previous_page) {
      setPrevious(query.data.previous_page);
    }
  }

  return (
    <MainPanel
      toolbarElements={
        <>
          <Stack
            spacing={"30px"}
            direction="row"
            alignItems="center"
            margin="5px 20px"
          >
            <Typography
              variant="h5"
              component="div"
              fontSize={{ xs: "1rem", sm: "1.25rem", md: "1.5rem" }}
            >
              Simulation Results
            </Typography>
            <Button variant="contained" onClick={handleClickOpen}>
              Download
            </Button>
            <Dialog
              open={open}
              onClose={handleCancel}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Download All Simulation Results?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  The download will be a single zip file and open in a new tab.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleProceed} autoFocus>
                  Proceed
                </Button>
              </DialogActions>
            </Dialog>
          </Stack>
          <Stack direction="row" spacing={"10px"}>
            <Button
              variant="contained"
              disabled={previous == null}
              onClick={() => setCursor(previous)}
            >
              <NavigateBeforeIcon />
            </Button>
            <Button
              variant="contained"
              disabled={next == null}
              onClick={() => setCursor(next)}
            >
              <NavigateNextIcon />
            </Button>
          </Stack>
        </>
      }
    >
      <Stack
        overflow="auto"
        justifyContent="space-between"
        width={"100%"}
        padding="10px"
      >
        <SimulationTable
          simulations={query.data ? query.data.items : []}
          setSelectedSimulation={(simulation) => {
            if (simulation != null && simulation.id) {
              navigate("/simulations/" + simulation.id);
            }
          }}
        ></SimulationTable>
      </Stack>
    </MainPanel>
  );
}
