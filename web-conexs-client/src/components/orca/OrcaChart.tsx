import XASChart from "../XASChart";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getOrcaXas } from "../../queryfunctions";

export default function OrcaChart(props: { id: number }) {
  const query = useQuery({
    queryKey: ["orca", "xas", props.id],
    queryFn: () => getOrcaXas(props.id),
  });

  if (query.data) {
    return <XASChart xas={query.data}></XASChart>;
  } else {
    return <Box>Simulation File Not Available</Box>;
  }
}
