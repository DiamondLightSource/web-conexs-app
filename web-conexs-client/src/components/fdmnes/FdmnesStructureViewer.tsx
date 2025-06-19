import { Box } from "@mui/material";
import React3dMol from "../React3dMol";
import {
  getFdmnesSimulation,
  getCrystal,
  getMolecule,
} from "../../queryfunctions";
import { useQuery } from "@tanstack/react-query";

export default function FdmnesStructureViewer(props: {
  fdmnesSimulationid: number;
}) {
  const { data: fdmnesSim } = useQuery({
    queryKey: ["fdmnes", props.fdmnesSimulationid],
    queryFn: () => getFdmnesSimulation(props.fdmnesSimulationid),
  });

  const isCrystal = fdmnesSim?.crystal_structure_id != null;

  const query = useQuery({
    queryKey: [
      isCrystal ? "crystal" : "molecule",
      isCrystal
        ? fdmnesSim?.crystal_structure_id
        : fdmnesSim?.molecular_structure_id,
    ],
    queryFn: () =>
      isCrystal
        ? getCrystal(fdmnesSim?.crystal_structure_id)
        : getMolecule(fdmnesSim?.molecular_structure_id),
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
