import { Box } from "@mui/material";
import React3dMol from "../React3dMol";
import { getMolecule } from "../../queryfunctions";
import { skipToken, useQuery } from "@tanstack/react-query";

export default function MoleculeViewer(props: { id: number | undefined }) {
  const id = props.id;

  const query = useQuery({
    queryKey: ["molecule", props.id],
    queryFn: id ? () => getMolecule(id) : skipToken,
  });

  return (
    <Box width={"100%"} height={"100%"}>
      <React3dMol
        moleculedata={query.data ? query.data : null}
        color="#3465A4"
        style="Stick"
        orbital={null}
      ></React3dMol>
    </Box>
  );
}
