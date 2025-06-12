import { Box } from "@mui/material";
import React3dMol from "../React3dMol";
import { getCrystal, getQESimulation } from "../../queryfunctions";
import { useQuery } from "@tanstack/react-query";

export default function QECrystalViewer(props: { qeSimulationid: number }) {
  const { data: qeSim } = useQuery({
    queryKey: ["qe", props.qeSimulationid],
    queryFn: () => getQESimulation(props.qeSimulationid),
  });

  const query = useQuery({
    queryKey: ["crystal", qeSim?.crystal_structure_id],
    queryFn: () => getCrystal(qeSim?.crystal_structure_id),
    enabled: !!qeSim,
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
