import { Box } from "@mui/material";
import React3dMol from "./React3dMol";
import { getMolecule, getOrcaSimulation } from "../queryfunctions";
import { useQuery } from "@tanstack/react-query";

export default function MoleculeViewer(props: { id: number }) {
  const { data: orcaSim } = useQuery({
    queryKey: ["orca", props.id],
    queryFn: () => getOrcaSimulation(props.id),
  });

  const query = useQuery({
    queryKey: ["molecule", orcaSim?.molecular_structure_id],
    queryFn: () => getMolecule(orcaSim?.molecular_structure_id),
    enabled: !!orcaSim,
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
