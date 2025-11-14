import { Typography, Stack } from "@mui/material";
import { useState } from "react";
import XYZFileViewer from "./XYZFileViewer";
import { useQuery } from "@tanstack/react-query";
import { getMolecules } from "../../queryfunctions";
import MainPanel from "../MainPanel";
import NavButton from "../NavButton";
import MoleculePlusIcon from "../icons/MoleculePlusIcon";
import OrcaIcon from "../icons/OrcaIcon";
import FDMNESIcon from "../icons/FDMNESIcon";
import StructureViewer from "../StructureViewer";
import StructureTable from "../StructureTable";

export default function MoleculePage() {
  const query = useQuery({
    queryKey: ["molecules"],
    queryFn: getMolecules,
  });

  const [selectedMoleculeId, setSelectedMoleculeId] = useState<number | null>();

  let finalMolecule = null;

  if (query.data && query.data.length != 0 && selectedMoleculeId) {
    finalMolecule = query.data.find(
      (d) => d.structure.id == selectedMoleculeId
    );
    if (finalMolecule == undefined) {
      finalMolecule = null;
    }
  }

  const icon_breakpoints = {
    width: { sm: "1em", md: "3em" },
    height: { sm: "1em", md: "3em" },
  };

  return (
    <MainPanel
      toolbarElements={<Typography variant="h5">Molecules</Typography>}
    >
      <Stack
        direction={{ sm: "column", md: "row" }}
        spacing={"20px"}
        margin={"20px"}
        overflow="auto"
      >
        <StructureTable
          structures={query.data ? query.data : []}
          selectedStructure={undefined}
          setSelectedStructure={(data) => {
            setSelectedMoleculeId(data?.structure.id);
          }}
        ></StructureTable>
        <Stack spacing={"2px"}>
          <XYZFileViewer id={finalMolecule?.structure.id} />
        </Stack>
        <Stack>
          <StructureViewer id={finalMolecule?.structure.id}></StructureViewer>
          <Stack
            direction={{ md: "row", lg: "column", xl: "row" }}
            padding={"1em"}
            spacing={"1em"}
          >
            <NavButton
              label="Create Molecule"
              path={"/createmolecule"}
              icon={<MoleculePlusIcon sx={{ ...icon_breakpoints }} />}
              reload={false}
            ></NavButton>
            <NavButton
              label="Submit ORCA"
              path={"/orca"}
              icon={<OrcaIcon sx={{ ...icon_breakpoints }} />}
              reload={false}
            ></NavButton>
            <NavButton
              label="Submit FDMNES"
              path={"/fdmnesmolecule"}
              icon={<FDMNESIcon sx={{ ...icon_breakpoints }} />}
              reload={false}
            ></NavButton>
          </Stack>
        </Stack>
      </Stack>
    </MainPanel>
  );
}
