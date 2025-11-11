import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getQELog } from "../../queryfunctions";

export default function QELogViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["qe", "output", props.id],
    queryFn: () => getQELog(props.id),
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
