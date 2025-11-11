import { Box } from "@mui/material";
import { skipToken, useQuery } from "@tanstack/react-query";
import { getStructure } from "../queryfunctions";
import { crystalInputToCIF, isCrystal, moleculeInputToXYZ } from "../utils";
import { MolStarMoleculeWrapper } from "./MolstarMoleculeViewer";
import { MolStarCrystalWrapper } from "./MolstarCrystalViewer";

export default function StructureViewer(props: {
  id: number | undefined;
  labelledAtomIndex?: number | undefined;
}) {
  const id = props.id;
  const query = useQuery({
    queryKey: ["structure", id],
    queryFn: id ? () => getStructure(id) : skipToken,
  });

  let xyzData = null;
  let molecule = true;

  if (query.data && isCrystal(query.data)) {
    xyzData = crystalInputToCIF(query.data);
    molecule = false;
  } else if (query.data) {
    xyzData = moleculeInputToXYZ(query.data);
  }

  return (
    <Box width={"100%"} height={"100%"}>
      {molecule ? (
        <MolStarMoleculeWrapper xyz={xyzData} />
      ) : (
        <MolStarCrystalWrapper
          cif={xyzData}
          labelledAtomIndex={props.labelledAtomIndex}
        />
      )}
    </Box>
  );
}
