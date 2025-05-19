import { Box, Typography, Stack, Paper } from "@mui/material";
import React3dMol from "../React3dMol";
import MoleculeTable from "./MoleculeTable";
import { useState } from "react";
import XYZFileViewer from "./XYZFileViewer";
import { useQuery } from "@tanstack/react-query";
import { getMolecules } from "../../queryfunctions";

export default function MoleculePage() {
  const query = useQuery({
    queryKey: ["molecules"],
    queryFn: getMolecules,
  });

  const [selectedMoleculeId, setSelectedMoleculeId] = useState<number | null>();

  let finalMolecule = null;

  if (query.data && query.data.length != 0 && selectedMoleculeId) {
    finalMolecule = query.data.find((d) => d.id == selectedMoleculeId);
    if (finalMolecule == undefined) {
      finalMolecule = null;
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
        <Stack>
          <Typography variant="h4" padding="24px">
            Molecules
          </Typography>
          <Stack direction={"row"} spacing={3}>
            <MoleculeTable
              molecules={query.data ? query.data : []}
              selectedMolecule={undefined}
              setSelectedMolecule={(data) => setSelectedMoleculeId(data?.id)}
              setCurrent={() => {}}
              prevNext={null}
            ></MoleculeTable>
            <Stack spacing={"2px"}>
              <XYZFileViewer molecule={finalMolecule} />
            </Stack>

            <React3dMol
              moleculedata={finalMolecule}
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
