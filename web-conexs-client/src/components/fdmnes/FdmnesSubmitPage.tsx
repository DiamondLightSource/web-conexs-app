import { Stack, Toolbar, Typography, useTheme } from "@mui/material";
import MainPanel from "../MainPanel";
import FdmnesFormOuter from "./FdmnesFormOuter";

export default function FdmnesSubmitPage(props: { isCrystal: boolean }) {
  const theme = useTheme();
  return (
    <MainPanel>
      <Stack flex={1} overflow="hidden">
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.action.disabled,
            borderRadius: "4px 4px 0px 0px",
          }}
        >
          <Typography variant="h5" component="div">
            Submit FDMNES {props.isCrystal ? "Crystal" : "Molecule"} Simulation
          </Typography>
        </Toolbar>
        <FdmnesFormOuter isCrystal={props.isCrystal}></FdmnesFormOuter>
      </Stack>
    </MainPanel>
  );
}
