import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getOrcaJobfile } from "../../queryfunctions";

export default function OrcaJobFileViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["orca", "jobfile", props.id],
    queryFn: () => getOrcaJobfile(props.id),
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
