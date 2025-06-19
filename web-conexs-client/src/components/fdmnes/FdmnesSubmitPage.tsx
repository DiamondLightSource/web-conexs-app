import {
  Box,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import FdmnesForm from "./FdmnesForm";

export default function FdmnesSubmitPage(props: { isCrystal: boolean }) {
  const theme = useTheme();
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
          spacing: "2px",
        }}
        elevation={12}
      >
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
              Submit FDMNES {props.isCrystal ? "Crystal" : "Molecule"}{" "}
              Simulation
            </Typography>
          </Toolbar>
          <FdmnesForm isCrystal={props.isCrystal}></FdmnesForm>
        </Stack>
      </Paper>
    </Box>
  );
}
