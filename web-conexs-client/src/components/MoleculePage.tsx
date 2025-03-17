import { Button, Box, Typography, Stack } from "@mui/material";
import XYZFileEditor from "./XYZFileEditor";
import useMoleculeAPI from "../hooks/useMoleculeAPI";
import { Molecule, MoleculeInput } from "../models";
import React3dMol from "./React3dMol";
import MoleculeTable from "./MoleculeTable";
import { useState } from "react";
import XYZFileViewer from "./XYZFileViewer";

export default function MoleculePage() {
  const { moleculeEdited, setMoleculeEdited } = useState<Molecule | null>();
  // const templateMolecule: MoleculeInput = {
  //   label: "Benzene",
  //   structure:
  //     "C   0.000000  1.402720  0.000000\nH   0.000000  2.490290  0.000000\nC  -1.214790  0.701360  0.000000\nH  -2.156660  1.245150  0.000000\nC  -1.214790 -0.701360  0.000000\nH  -2.156660 -1.245150  0.000000\nC   0.000000 -1.402720  0.000000\nH   0.000000 -2.490290  0.000000\nC   1.214790 -0.701360  0.000000\nH   2.156660 -1.245150  0.000000\nC   1.214790  0.701360  0.000000\nH   2.156660  1.245150  0.000000",
  // };
  const {
    data,
    getMolecule,
    getMolecules,
    moleculeList,
    insertMolecule,
    setNewMolecule,
    newMolecule,
    getMoleculeGeneric,
    loadingStatus,
    dataList,
  } = useMoleculeAPI();

  // console.log(molecule);
  // console.log(moleculeList);
  let finalMolecule = data;

  if (finalMolecule == null) {
    finalMolecule = dataList.length != 0 ? dataList[0] : null;
  }

  return (
    <Stack>
      <Typography variant="h4" padding="24px">
        Molecules
      </Typography>
      <Stack direction={"row"} height={"100vh"} spacing={3}>
        <MoleculeTable
          molecules={dataList == null ? [] : dataList}
          selectedMolecule={undefined}
          setSelectedMolecule={(data) => getMolecule(data?.id)}
          setCurrent={() => {}}
          prevNext={null}
        ></MoleculeTable>
        <Stack spacing={"2px"}>
          <XYZFileViewer molecule={finalMolecule} />
        </Stack>

        <Box height="100%vh">
          <React3dMol
            moleculedata={finalMolecule}
            color="#3465A4"
            style="Stick"
            orbital={null}
          ></React3dMol>
        </Box>
      </Stack>
    </Stack>
  );
}
