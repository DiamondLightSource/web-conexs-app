import { Typography } from "@mui/material";
import MainPanel from "./MainPanel";

export default function LoginPage() {
  return (
    <MainPanel
      toolbarElements={<Typography variant="h5">Logged In</Typography>}
    >
      <Typography>Successfully Logged In!</Typography>
    </MainPanel>
  );
}
