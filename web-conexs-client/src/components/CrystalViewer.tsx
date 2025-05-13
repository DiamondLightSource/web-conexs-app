import { Box } from "@mui/material";
import React3dMol from "./React3dMol";
import { getCrystal } from "../queryfunctions";
import { useQuery } from "@tanstack/react-query";

export default function CrystalViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["crystal", props.id],
    queryFn: () => getCrystal(props.id),
  });

  return (
    <Box height="100%vh">
      {query.data && (
        <React3dMol
          moleculedata={query.data}
          color="#3465A4"
          style="Stick"
          orbital={null}
        ></React3dMol>
      )}
    </Box>
  );
}
