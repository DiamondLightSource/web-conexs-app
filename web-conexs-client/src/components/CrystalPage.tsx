import { Box, Typography, Stack } from "@mui/material";

import React3dMol from "./React3dMol";
import MoleculeTable from "./MoleculeTable";
import XYZCrystalFileViewer from "./XYZCrystalFileViewer";
import { getCrystals } from "../queryfunctions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function CrystalPage() {
  const query = useQuery({
    queryKey: ["crystals"],
    queryFn: getCrystals,
  });

  const [selectedCrystalId, setSelectedCrystalId] = useState<number | null>();

  // console.log(molecule);
  let finalCrystal = null;

  if (query.data && query.data.length != 0 && selectedCrystalId) {
    finalCrystal = query.data.find((d) => d.id == selectedCrystalId);
    if (finalCrystal == undefined) {
      finalCrystal = null;
    }
  }
  return (
    <Stack>
      <Typography variant="h4" padding="24px">
        Crystals
      </Typography>
      <Stack direction={"row"} height={"100vh"} spacing={3}>
        <MoleculeTable
          molecules={query.data ? query.data : []}
          selectedMolecule={undefined}
          setSelectedMolecule={(data) => {
            if (data) {
              setSelectedCrystalId(data.id);
            }
          }}
          setCurrent={() => {}}
          prevNext={null}
        ></MoleculeTable>
        <Stack spacing={"2px"}>
          <XYZCrystalFileViewer crystal={finalCrystal} />
        </Stack>

        <Box height="100%vh">
          <React3dMol
            moleculedata={finalCrystal}
            color="#3465A4"
            style="Stick"
            orbital={null}
          ></React3dMol>
        </Box>
      </Stack>
    </Stack>
  );
}
