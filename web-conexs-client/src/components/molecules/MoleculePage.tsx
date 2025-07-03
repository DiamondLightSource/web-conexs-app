import {
  Box,
  Typography,
  Stack,
  Paper,
  Toolbar,
  useTheme,
} from "@mui/material";
import React3dMol from "../React3dMol";
import MoleculeTable from "./MoleculeTable";
import { useState } from "react";
import XYZFileViewer from "./XYZFileViewer";
import { useQuery } from "@tanstack/react-query";
import { getMolecules } from "../../queryfunctions";
import MainPanel from "../MainPanel";
import NavButton from "../NavButton";
import MoleculeIcon from "../icons/MoleculeIcon";
import MoleculePlusIcon from "../icons/MoleculePlusIcon";
import OrcaIcon from "../icons/OrcaIcon";
import FDMNESIcon from "../icons/FDMNESIcon";

export default function MoleculePage() {
  const query = useQuery({
    queryKey: ["molecules"],
    queryFn: getMolecules,
  });

  const [selectedMoleculeId, setSelectedMoleculeId] = useState<number | null>();
  const theme = useTheme();

  let finalMolecule = null;

  if (query.data && query.data.length != 0 && selectedMoleculeId) {
    finalMolecule = query.data.find((d) => d.id == selectedMoleculeId);
    if (finalMolecule == undefined) {
      finalMolecule = null;
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
            Molecules
          </Typography>
        </Toolbar>
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
      <Stack direction="row" padding={"2em"} spacing={"2em"}>
        <NavButton
          label="Create Molecule"
          path={"/createmolecule"}
          icon={<MoleculePlusIcon sx={{ width: "5em", height: "5em" }} />}
        ></NavButton>
        <NavButton
          label="Submit ORCA"
          path={"/orca"}
          icon={<OrcaIcon sx={{ width: "5em", height: "5em" }} />}
        ></NavButton>
        <NavButton
          label="Submit FDMNES"
          path={"/fdmnesmolecule"}
          icon={<FDMNESIcon sx={{ width: "5em", height: "5em" }} />}
        ></NavButton>
      </Stack>
    </MainPanel>
  );
}
