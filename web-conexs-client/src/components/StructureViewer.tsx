import { Box } from "@mui/material";
import { skipToken, useQuery } from "@tanstack/react-query";
import { getStructure } from "../queryfunctions";
import React3dMol from "./React3dMol";
import { Q } from "vitest/dist/chunks/reporters.d.DG9VKi4m.js";
import { moleculeInputToXYZ } from "../utils";
import { MolStarMoleculeWrapper } from "./MolstarMoleculeViewer";
import { MolStarMolecule2Wrapper } from "./MolstarOrbitalViewer";

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

  if (query.data) {
    xyzData = moleculeInputToXYZ(query.data);
  }

  return (
    <Box>
      {xyzData && (
        <MolStarMoleculeWrapper xyz={xyzData}></MolStarMoleculeWrapper>
      )}
      {/* <React3dMol
        moleculedata={query.data == undefined ? null : query.data}
        color="#3465A4"
        style="Stick"
        orbital={null}
        labelledAtom={props.labelledAtomIndex}
      ></React3dMol> */}
    </Box>
  );
}
