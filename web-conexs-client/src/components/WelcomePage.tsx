import { Container, Typography } from "@mui/material";

export default function WelcomePage() {
  return (
    <Container maxWidth="md" sx={{ alignSelf: "center", p: "24px" }}>
      <Typography variant="h4" padding="24px">
        User-Friendly XAS Simulation!
      </Typography>
    </Container>
  );
}
