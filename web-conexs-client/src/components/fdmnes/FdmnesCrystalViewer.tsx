import { Box } from "@mui/material";
import React3dMol from "../React3dMol";
import { getFdmnesSimulation, getCrystal } from "../../queryfunctions";
import { useQuery } from "@tanstack/react-query";

export default function FdmnesCrystalViewer(props: {
  fdmnesSimulationid: number;
}) {
  const { data: fdmnesSim } = useQuery({
    queryKey: ["fdmnes", props.fdmnesSimulationid],
    queryFn: () => getFdmnesSimulation(props.fdmnesSimulationid),
  });

  const query = useQuery({
    queryKey: ["crystal", fdmnesSim?.crystal_structure_id],
    queryFn: () => getCrystal(fdmnesSim?.crystal_structure_id),
    enabled: !!fdmnesSim,
  });

  return (
    <Box height="100%">
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
