import { Typography, Stack, Toolbar, useTheme, Button } from "@mui/material";

import React3dMol from "../React3dMol";
import MoleculeTable from "../molecules/MoleculeTable";
import XYZCrystalFileViewer from "./XYZCrystalFileViewer";
import { getCrystals } from "../../queryfunctions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MainPanel from "../MainPanel";
import GrainIcon from "../icons/GrainIcon";
import { useNavigate } from "react-router-dom";
import FDMNESIcon from "../icons/FDMNESIcon";
import QEIcon from "../icons/QEIcon";
import NavButton from "../NavButton";
import GrainPlusIcon from "../icons/GrainPlusIcon";

export default function CrystalPage() {
  const query = useQuery({
    queryKey: ["crystals"],
    queryFn: getCrystals,
  });

  const [selectedCrystalId, setSelectedCrystalId] = useState<number | null>();
  const theme = useTheme();
  const navigate = useNavigate();

  let finalCrystal = null;

  if (query.data && query.data.length != 0 && selectedCrystalId) {
    finalCrystal = query.data.find((d) => d.id == selectedCrystalId);
    if (finalCrystal == undefined) {
      finalCrystal = null;
    }
  }
  return (
    <MainPanel>
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
      <Stack direction="row" padding={"2em"} spacing={"2em"}>
        <NavButton
          label="Create Crystal"
          path={"/createcrystal"}
          icon={<GrainPlusIcon sx={{ width: "5em", height: "5em" }} />}
        ></NavButton>
        <NavButton
          label="Submit FDMNES"
          path={"/fdmnescrystal"}
          icon={<FDMNESIcon sx={{ width: "5em", height: "5em" }} />}
        ></NavButton>
        <NavButton
          label="Submit Quantum Espresso"
          path={"/qe"}
          icon={<QEIcon sx={{ width: "5em", height: "5em" }} />}
        ></NavButton>
      </Stack>
    </MainPanel>
  );
}
