import { Button, Box, Typography, Stack } from "@mui/material";
import { useState } from "react";
import XYZFileEditor from "./XYZFileEditor";
import useMoleculeAPI from "../hooks/useMoleculeAPI";
import { Molecule, MoleculeInput } from "../models";
import React3dMol from "./React3dMol";
import MoleculeTable from "./MoleculeTable";

export default function MoleculePage() {
  const templateMolecule: MoleculeInput = {
    label: "Benzene",
    structure:
      "C   0.000000  1.402720  0.000000\nH   0.000000  2.490290  0.000000\nC  -1.214790  0.701360  0.000000\nH  -2.156660  1.245150  0.000000\nC  -1.214790 -0.701360  0.000000\nH  -2.156660 -1.245150  0.000000\nC   0.000000 -1.402720  0.000000\nH   0.000000 -2.490290  0.000000\nC   1.214790 -0.701360  0.000000\nH   2.156660 -1.245150  0.000000\nC   1.214790  0.701360  0.000000\nH   2.156660  1.245150  0.000000",
  };
  const {
    molecule,
    getMolecule,
    getMolecules,
    moleculeList,
    insertMolecule,
    setNewMolecule,
    newMolecule,
  } = useMoleculeAPI();

  console.log(molecule);
  console.log(moleculeList);

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
        Molecules
      </Typography>
      <Stack direction={"row"} height={"100vh"}>
        <Stack>
          <Stack direction="row">
            <Button onClick={() => getMolecule(1)}>Fetch</Button>
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
            moleculedata={renderMolecule}
            setmoleculeData={setNewMolecule}
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
