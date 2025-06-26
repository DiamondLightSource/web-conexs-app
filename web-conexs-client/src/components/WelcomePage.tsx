import { Stack, Typography } from "@mui/material";
import MainPanel from "./MainPanel";

export default function WelcomePage() {
  return (
    <MainPanel>
      <Stack
        maxWidth={"md"}
        overflow="auto"
        flex={1}
        display="flex"
        sx={{ alignSelf: "center", p: "24px", minHeight: 0 }}
      >
        <Typography variant="h4" padding="24px">
          User-Friendly XAS Simulation!
        </Typography>
      </Stack>
    </MainPanel>
  );
}
