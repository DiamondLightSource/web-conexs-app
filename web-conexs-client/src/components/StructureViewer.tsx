import { Box } from "@mui/material";
import { skipToken, useQuery } from "@tanstack/react-query";
import { getStructure } from "../queryfunctions";
import React3dMol from "./React3dMol";
import { Q } from "vitest/dist/chunks/reporters.d.DG9VKi4m.js";
import { crystalInputToCIF, moleculeInputToXYZ } from "../utils";
import { MolStarMoleculeWrapper } from "./MolstarMoleculeViewer";
import { MolStarMolecule2Wrapper } from "./MolstarOrbitalViewer";
import { Quickreply } from "@mui/icons-material";
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

  if (query.data && query.data.lattice) {
    xyzData = crystalInputToCIF(query.data);
    molecule = false;
  } else if (query.data) {
    xyzData = moleculeInputToXYZ(query.data);
  }

  console.log(xyzData);

  return (
    <Box>
      {molecule ? (
        <MolStarMoleculeWrapper xyz={xyzData} />
      ) : (
        <MolStarCrystalWrapper
          cif={xyzData}
          labelledAtomIndex={props.labelledAtomIndex}
        />
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
