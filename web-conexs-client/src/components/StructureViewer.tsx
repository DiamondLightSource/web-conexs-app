import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getCrystal, getMolecule } from "../queryfunctions";
import React3dMol from "./React3dMol";

export default function StructureViewer(props: {
  id: number;
  isCrystal: boolean;
}) {
  const query = useQuery({
    queryKey: [props.isCrystal ? "crystal" : "molecule", props.id],
    queryFn: () =>
      props.isCrystal ? getCrystal(props.id) : getMolecule(props.id),
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
