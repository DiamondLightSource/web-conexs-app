import { Box } from "@mui/material";
import React3dMol from "../React3dMol";
import { getMolecule } from "../../queryfunctions";
import { useQuery } from "@tanstack/react-query";

export default function MoleculeViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["molecule", props.id],
    queryFn: () => getMolecule(props.id),
  });

  return (
    <Box width={"100%"} height={"100%"}>
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
