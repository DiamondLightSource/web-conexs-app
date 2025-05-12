import { Box } from "@mui/material";
import React3dMol from "./React3dMol";
import { getFdmnesSimulation, getCrystal } from "../queryfunctions";
import { useQuery } from "@tanstack/react-query";

export default function CrystalViewer(props: { id: number }) {
  const { data: fdmnesSim } = useQuery({
    queryKey: ["fdmnes", props.id],
    queryFn: () => getFdmnesSimulation(props.id),
  });

  const query = useQuery({
    queryKey: ["crystal", fdmnesSim?.crystal_structure_id],
    queryFn: () => getCrystal(fdmnesSim?.crystal_structure_id),
    enabled: !!fdmnesSim,
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
