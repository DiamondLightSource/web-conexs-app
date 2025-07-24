import { Stack, Typography, useTheme } from "@mui/material";

import { useContext } from "react";
import { UserContext } from "../UserContext";
import {
  ColourSchemeButton,
  Navbar,
  User,
} from "@diamondlightsource/sci-react-ui";

import ClusterBadge from "./ClusterBadge";
import { Margin } from "@mui/icons-material";

export default function Header() {
  const user = useContext(UserContext);
  const theme = useTheme();

  const handleLogin = () => window.location.assign("/login");

  const handleLogout = () => window.location.assign("/oauth2/sign_out");

  return (
    <Navbar
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      logo="theme"
      rightSlot={
        <Stack direction="row" alignItems="center">
          <ClusterBadge></ClusterBadge>
          <User
            color="white"
            onLogin={handleLogin}
            onLogout={handleLogout}
            user={
              user == null || user == undefined
                ? null
                : { fedid: user.identifier }
            }
          />
          <ColourSchemeButton />
        </Stack>
      }
      containerWidth={false}
    >
      <Typography
        variant="h4"
        color={theme.palette.primary.contrastText}
        sx={{ padding: "10px 0px 2px 0px" }}
        s
        height="100%"
      >
        Web-CONEXS
      </Typography>
    </Navbar>
  );
}
