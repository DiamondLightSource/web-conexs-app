import { Button, Link, Stack, Typography } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";

const handleLogout = () => window.location.assign("/oauth2/sign_out");

export default function Forbidden() {
  return (
    <Stack
      maxWidth={"md"}
      overflow="auto"
      flex={1}
      display="flex"
      spacing="20px"
      sx={{
        alignSelf: "center",
        p: "24px",
        minHeight: 0,
        alignItems: "center",
      }}
    >
      <Typography variant="h6">
        You are not authorised to use Web-CONEXS.
      </Typography>
      <Typography>
        Web-CONEXS is only available to users of the beamlines at the Diamond
        Light Source Ltd. If you are a Diamond user and believe you should be
        have access to Web-CONEXS please contact an adminstrator at{" "}
        <Link href="mailto:conexs@diamond.ac.uk">conexs@diamond.ac.uk</Link>
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
