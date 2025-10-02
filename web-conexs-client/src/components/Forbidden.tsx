import { Button, Stack, Typography } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";

const handleLogout = () => window.location.assign("/oauth2/sign_out");

export default function Forbidden() {
  return (
    <Stack>
      <Typography>
        You are not authorised to use the CONEXS platform, if you believe this
        is an error please contact an administrator
      </Typography>
      <Button
        onClick={handleLogout}
        variant={"contained"}
        startIcon={<LogoutOutlined sx={{ width: "3em", height: "3em" }} />}
      >
        Log out
      </Button>
    </Stack>
  );
}
