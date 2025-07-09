import { Box } from "@mui/material";
import { skipToken, useQuery } from "@tanstack/react-query";
import { getStructure } from "../queryfunctions";
import React3dMol from "./React3dMol";

export default function StructureViewer(props: { id: number | undefined }) {
  const id = props.id;
  const query = useQuery({
    queryKey: ["structure", id],
    queryFn: id ? () => getStructure(id) : skipToken,
  });

  return (
    <Box height="100%" width="100%">
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
