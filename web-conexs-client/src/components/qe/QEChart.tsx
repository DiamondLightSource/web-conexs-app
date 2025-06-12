import XASChart from "../XASChart";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getQEXas } from "../../queryfunctions";

export default function QEChart(props: { id: number }) {
  const query = useQuery({
    queryKey: ["qe", "xas", props.id],
    queryFn: () => getQEXas(props.id),
  });

  if (query.data) {
    return <XASChart xas={query.data}></XASChart>;
  } else {
    return <Box>Simulation File Not Available</Box>;
  }
}
