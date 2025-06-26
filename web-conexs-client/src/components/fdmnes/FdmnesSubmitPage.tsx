import {
  Box,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import FdmnesForm from "./FdmnesForm";
import MainPanel from "../MainPanel";

export default function FdmnesSubmitPage(props: { isCrystal: boolean }) {
  const theme = useTheme();
  return (
    <MainPanel>
      <Stack flex={1}>
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
        <FdmnesForm isCrystal={props.isCrystal}></FdmnesForm>
      </Stack>
    </MainPanel>
  );
}
