import XASChart from "../XASChart";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getFdmnesXas } from "../../queryfunctions";

export default function FdmnesChart(props: { id: number }) {
  const query = useQuery({
    queryKey: ["fdmnes", "xas", props.id],
    queryFn: () => getFdmnesXas(props.id),
  });

  if (query.data) {
    return <XASChart xas={query.data}></XASChart>;
  } else {
    return <Box>Simulation File Not Available</Box>;
  }
}
