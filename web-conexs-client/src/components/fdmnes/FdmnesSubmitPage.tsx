import { Box, Container, Paper, Typography } from "@mui/material";
import FdmnesForm from "./FdmnesForm";

export default function FdmnesSubmitPage() {
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
        <Typography variant="h4" padding="10px">
          Submit FDMNES Simulation
        </Typography>
        <FdmnesForm></FdmnesForm>
      </Paper>
    </Box>
  );
}
