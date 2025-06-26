import { Button, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import SimulationTable from "./SimulationTable";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { getSimulationPage } from "../queryfunctions";
import { SimulationInformation } from "./SimulationInformation";
import MainPanel from "./MainPanel";

export default function SimulationReviewPage() {
  const [simId, setSimId] = useState<number | undefined>();
  const [cursor, setCursor] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

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

  const theme = useTheme();

  return (
    <MainPanel>
      {!simId ? (
        <Stack overflow="auto" justifyContent="space-between" width={"100%"}>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.palette.action.disabled,
              borderRadius: "4px 4px 0px 0px",
            }}
          >
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
          </Toolbar>
          <SimulationTable
            simulations={query.data ? query.data.items : []}
            selectedSimulation={simId}
            setSelectedSimulation={(simulation) => {
              setSimId(simulation?.id);
            }}
          ></SimulationTable>
        </Stack>
      ) : (
        <Stack overflow="auto" justifyContent="space-between" width={"100%"}>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.palette.action.disabled,
              borderRadius: "4px 4px 0px 0px",
            }}
          >
            <Button variant="contained" onClick={() => setSimId(undefined)}>
              Back
            </Button>
          </Toolbar>
          <SimulationInformation simId={simId}></SimulationInformation>
        </Stack>
      )}
    </MainPanel>
  );
}
