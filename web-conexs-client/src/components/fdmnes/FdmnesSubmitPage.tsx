import { Typography } from "@mui/material";
import MainPanel from "../MainPanel";
import FdmnesFormOuter from "./FdmnesFormOuter";

export default function FdmnesSubmitPage(props: { isCrystal: boolean }) {
  const title =
    "Submit FDMNES " +
    (props.isCrystal ? "Crystal" : "Molecule") +
    " Simulation";
  return (
    <MainPanel
      toolbarElements={<Typography variant="h5">{title}</Typography>}
    >
      <FdmnesFormOuter isCrystal={props.isCrystal}></FdmnesFormOuter>
    </MainPanel>
  );
}
