import { Box, Button, Stack } from "@mui/material";
import SimulationTable from "./SimulationTable";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SimulationInformation } from "./SimulationInformation";
import { getSimulationPage } from "../queryfunctions";

export default function SimulationReviewPage() {
  const [simId, setSimId] = useState<number | undefined>();
  const [cursor, setCursor] = useState<string | null>(null);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["simulations", cursor],
    queryFn: () => getSimulationPage(cursor),
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
    <Box height={"100%"}>
      <SimulationTable
        simulations={query.data ? query.data.items : []}
        selectedSimulation={simId}
        setSelectedSimulation={(simulation) => {
          setSimId(simulation?.id);
        }}
      ></SimulationTable>
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
      {simId && <SimulationInformation simId={simId}></SimulationInformation>}
    </Box>
  );
}
