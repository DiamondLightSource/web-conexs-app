import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getOrcaXyz } from "../../queryfunctions";

export default function OrcaXYZViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["orca", "xyz", props.id],
    queryFn: () => getOrcaXyz(props.id),
  });

  return (
    <Typography
      sx={{
        fontFamily: "Monospace",
        whiteSpace: "pre-wrap",
        overflowY: "auto",
      }}
    >
      {query.data ? query.data : "No XYZ"}
    </Typography>
  );
}
