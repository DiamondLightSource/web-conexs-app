import { Button, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import SimulationTable from "./SimulationTable";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getSimulationPage } from "../queryfunctions";
import MainPanel from "./MainPanel";
import { useNavigate } from "react-router-dom";

export default function SimulationReviewPage() {
  const [cursor, setCursor] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);
  const navigate = useNavigate();

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
          <Typography variant="h5" component="div">
            Simulation Results
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              disabled={previous == null}
              onClick={() => setCursor(previous)}
            >
              &lt;
            </Button>
            <Button
              variant="contained"
              disabled={next == null}
              onClick={() => setCursor(next)}
            >
              &gt;
            </Button>
          </Stack>
        </>
      }
    >
      <Stack overflow="auto" justifyContent="space-between" width={"100%"}>
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
