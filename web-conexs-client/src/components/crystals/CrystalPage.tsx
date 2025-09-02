import { Typography, Stack, Toolbar, useTheme } from "@mui/material";

import XYZCrystalFileViewer from "./XYZCrystalFileViewer";
import { getCrystals } from "../../queryfunctions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import MainPanel from "../MainPanel";
import FDMNESIcon from "../icons/FDMNESIcon";
import QEIcon from "../icons/QEIcon";
import NavButton from "../NavButton";
import GrainPlusIcon from "../icons/GrainPlusIcon";
import StructureViewer from "../StructureViewer";
import StructureTable from "../StructureTable";

export default function CrystalPage() {
  const query = useQuery({
    queryKey: ["crystals"],
    queryFn: getCrystals,
  });

  const [selectedCrystalId, setSelectedCrystalId] = useState<number | null>();
  const theme = useTheme();

  let finalCrystal = null;

  if (query.data && query.data.length != 0 && selectedCrystalId) {
    finalCrystal = query.data.find((d) => d.structure.id == selectedCrystalId);
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
          <StructureTable
            structures={query.data ? query.data : []}
            selectedStructure={undefined}
            setSelectedStructure={(data) => {
              if (data) {
                setSelectedCrystalId(data.structure.id);
              }
            }}
          ></StructureTable>

          <XYZCrystalFileViewer id={finalCrystal?.structure.id} />
          <StructureViewer id={finalCrystal?.structure.id}></StructureViewer>
        </Stack>
      </Stack>
      <Stack direction="row" padding={"2em"} spacing={"2em"}>
        <NavButton
          label="Create Crystal"
          path={"/createcrystal"}
          icon={<GrainPlusIcon sx={{ width: "5em", height: "5em" }} />}
          reload={false}
        ></NavButton>
        <NavButton
          label="Submit FDMNES"
          path={"/fdmnescrystal"}
          icon={<FDMNESIcon sx={{ width: "5em", height: "5em" }} />}
          reload={false}
        ></NavButton>
        <NavButton
          label="Submit Quantum Espresso"
          path={"/qe"}
          icon={<QEIcon sx={{ width: "5em", height: "5em" }} />}
          reload={false}
        ></NavButton>
      </Stack>
    </MainPanel>
  );
}
