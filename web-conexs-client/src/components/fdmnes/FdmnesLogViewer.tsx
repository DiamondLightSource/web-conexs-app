import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getFdmnesLog } from "../../queryfunctions";

export default function FdmnesLogViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["fdmnes", "output", props.id],
    queryFn: () => getFdmnesLog(props.id),
  });

  return (
    <Typography
      sx={{
        fontFamily: "Monospace",
        whiteSpace: "pre-wrap",
        overflowY: "auto",
      }}
    >
      {query.data ? query.data : "No Log"}
    </Typography>
  );
}
