import {
  Box,
  Typography,
  Stack,
  Paper,
  Toolbar,
  useTheme,
} from "@mui/material";

import React3dMol from "../React3dMol";
import MoleculeTable from "../molecules/MoleculeTable";
import XYZCrystalFileViewer from "./XYZCrystalFileViewer";
import { getCrystals } from "../../queryfunctions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function CrystalPage() {
  const query = useQuery({
    queryKey: ["crystals"],
    queryFn: getCrystals,
  });

  const [selectedCrystalId, setSelectedCrystalId] = useState<number | null>();
  const theme = useTheme();

  let finalCrystal = null;

  if (query.data && query.data.length != 0 && selectedCrystalId) {
    finalCrystal = query.data.find((d) => d.id == selectedCrystalId);
    if (finalCrystal == undefined) {
      finalCrystal = null;
    }
  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="stretch"
      flex={1}
      minHeight={0}
    >
      <Paper
        flex={1}
        sx={{
          margin: "20px",
          flex: 1,
          minHeight: 0,
          alignItems: "stretch",
          display: "flex",
          flexDirection: "column",
        }}
        elevation={12}
      >
        <Stack spacing={"10px"}>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.palette.action.disabled,
              borderRadius: "4px 4px 0px 0px",
            }}
          >
            <Typography variant="h5" component="div">
              Crystals
            </Typography>
          </Toolbar>
          <Stack direction={"row"} spacing={3}>
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

            <XYZCrystalFileViewer crystal={finalCrystal} />
            <React3dMol
              moleculedata={finalCrystal}
              color="#3465A4"
              style="Stick"
              orbital={null}
            ></React3dMol>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
