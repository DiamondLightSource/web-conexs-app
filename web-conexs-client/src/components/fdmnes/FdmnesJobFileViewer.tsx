import { Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getFdmnesJobfile } from "../../queryfunctions";

export default function FdmnesJobFileViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["fdmnes", "jobfile", props.id],
    queryFn: () => getFdmnesJobfile(props.id),
  });

  console.log("FDMNES JOB FILE RENDER");

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
