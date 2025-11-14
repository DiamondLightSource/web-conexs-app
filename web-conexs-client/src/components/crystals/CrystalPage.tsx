import { Typography, Stack } from "@mui/material";

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

  let finalCrystal = null;

  if (query.data && query.data.length != 0 && selectedCrystalId) {
    finalCrystal = query.data.find((d) => d.structure.id == selectedCrystalId);
    if (finalCrystal == undefined) {
      finalCrystal = null;
    }
  }

  const icon_breakpoints = {
    width: { sm: "1em", md: "3em" },
    height: { sm: "1em", md: "3em" },
  };

  return (
    <MainPanel toolbarElements={<Typography variant="h5">Crystals</Typography>}>
      <Stack
        direction={{ md: "column", lg: "row" }}
        spacing={"10px"}
        margin={"20px"}
        overflow="auto"
      >
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
        <Stack>
          <StructureViewer id={finalCrystal?.structure.id}></StructureViewer>
          <Stack
            direction={{ md: "row", lg: "column", xl: "row" }}
            padding={"1em"}
            spacing={"1em"}
          >
            <NavButton
              label="Create Crystal"
              path={"/createcrystal"}
              icon={<GrainPlusIcon sx={{ ...icon_breakpoints }} />}
              reload={false}
            ></NavButton>
            <NavButton
              label="Submit FDMNES"
              path={"/fdmnescrystal"}
              icon={<FDMNESIcon sx={{ ...icon_breakpoints }} />}
              reload={false}
            ></NavButton>
            <NavButton
              label="Submit Quantum Espresso"
              path={"/qe"}
              icon={<QEIcon sx={{ ...icon_breakpoints }} />}
              reload={false}
            ></NavButton>
          </Stack>
        </Stack>
      </Stack>
    </MainPanel>
  );
}
