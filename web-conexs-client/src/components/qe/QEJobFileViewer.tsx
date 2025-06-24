import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getQEJobFile } from "../../queryfunctions";

export default function QEJobFileViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["qe", "jobfile", props.id],
    queryFn: () => getQEJobFile(props.id),
  });

  return (
    <Typography
      sx={{
        fontFamily: "Monospace",
        whiteSpace: "pre-wrap",
        overflowY: "auto",
      }}
    >
      {query.data ? query.data : "No Job File"}
    </Typography>
  );
}
