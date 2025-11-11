import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getOrcaLog } from "../../queryfunctions";

export default function OrcaLogViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["orca", "output", props.id],
    queryFn: () => getOrcaLog(props.id),
  });

  return (
    <Typography
      fontSize={{ xs: "8px", sm: "10px", md: "12px", lg: "16px" }}
      sx={{
        fontFamily: "Monospace",
        whiteSpace: "pre-wrap",
        overflow: "auto",
      }}
    >
      {query.data ? query.data : "No Log"}
    </Typography>
  );
}
