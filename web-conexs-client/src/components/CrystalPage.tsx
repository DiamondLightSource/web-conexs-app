import { Box, Typography, Stack } from "@mui/material";

import React3dMol from "./React3dMol";
import MoleculeTable from "./MoleculeTable";
import useCrystalAPI from "../hooks/useCrystalAPI";
import XYZCrystalFileViewer from "./XYZCrystalFileViewer";

export default function CrystalPage() {
  const { data, getCrystal, dataList } = useCrystalAPI();

  // console.log(molecule);
  let finalMolecule = data;

  if (finalMolecule == null) {
    finalMolecule = dataList.length != 0 ? dataList[0] : null;
  }

  return (
    <Stack>
      <Typography variant="h4" padding="24px">
        Crystals
      </Typography>
      <Stack direction={"row"} height={"100vh"} spacing={3}>
        <MoleculeTable
          molecules={dataList == null ? [] : dataList}
          selectedMolecule={undefined}
          setSelectedMolecule={(data) => {
            if (data) {
              getCrystal(data.id);
            }
          }}
          setCurrent={() => {}}
          prevNext={null}
        ></MoleculeTable>
        <Stack spacing={"2px"}>
          <XYZCrystalFileViewer crystal={finalMolecule} />
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
