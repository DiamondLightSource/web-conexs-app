import { Button, Box, Typography, Stack } from "@mui/material";
import XYZFileEditor from "./XYZFileEditor";
import useMoleculeAPI from "../hooks/useMoleculeAPI";
import { CrystalInput } from "../models";
import React3dMol from "./React3dMol";
import MoleculeTable from "./MoleculeTable";

export default function CrystalPage() {
  const templateMolecule: CrystalInput = {
    lattice_params: {
      a: 4.1043564,
      b: 4.1043564,
      c: 4.1043564,
      alpha: 90,
      beta: 90,
      gamma: 90,
    },
    label: "test",
    structure: "Ag 0. 0. 0.\nAg 0.5 0.5 0.\nAg 0.5 0. 0.5\nAg 0. 0.5 0.5",
  };

  const {
    molecule,
    getMolecule,
    getMolecules,
    moleculeList,
    insertMolecule,
    setNewMolecule,
    newMolecule,
    data,
    getMoleculeGeneric,
    loadingStatus,
  } = useMoleculeAPI();

  // console.log(molecule);
  // console.log(moleculeList);

  let finalMolecule = newMolecule != null ? newMolecule : molecule;

  if (finalMolecule == null) {
    finalMolecule = templateMolecule;
  }

  const lines =
    finalMolecule == null
      ? 0
      : (finalMolecule.structure.match(/\n/g) || "").length + 1;
  console.log(lines);

  const renderMolecule = lines.toString() + "\n\n" + finalMolecule?.structure;

  return (
    <Stack>
      <Typography variant="h4" padding="24px">
        Crystals
      </Typography>
      <Stack direction={"row"} height={"100vh"}>
        <Stack>
          <Stack direction="row">
            <Button onClick={() => getMoleculeGeneric(2)}>Fetch</Button>
            <Button onClick={getMolecules}>Fetch List</Button>
            <Button
              onClick={() => {
                insertMolecule(newMolecule);
                setNewMolecule(null);
              }}
            >
              Post
            </Button>
          </Stack>
          <XYZFileEditor
            molecularInput={templateMolecule}
            setMolecularInput={() => {}}
          />
        </Stack>
        <Box height="100%vh">
          <React3dMol
            moleculedata={finalMolecule}
            color="#3465A4"
            style="Stick"
            orbital={null}
          ></React3dMol>

          <MoleculeTable
            molecules={moleculeList == null ? [] : moleculeList}
            selectedMolecule={undefined}
            setSelectedMolecule={(molecule) => getMolecule(molecule?.id)}
            setCurrent={() => {}}
            prevNext={null}
          ></MoleculeTable>
        </Box>
      </Stack>
    </Stack>
  );
}
