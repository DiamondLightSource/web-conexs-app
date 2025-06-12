import { Box, Container, Paper, Typography } from "@mui/material";

export default function WelcomePage() {
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
          textAlign: "center",
        }}
        elevation={12}
      >
        <Container maxWidth="md" sx={{ alignSelf: "center", p: "24px" }}>
          <Typography variant="h4" padding="24px">
            User-Friendly XAS Simulation!
          </Typography>
        </Container>
      </Paper>
    </Box>
  );
}
