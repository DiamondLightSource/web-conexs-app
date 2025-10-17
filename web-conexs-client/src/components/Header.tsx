import { Stack, Typography, useTheme } from "@mui/material";

import { useContext } from "react";
import { UserContext } from "../UserContext";
import {
  ColourSchemeButton,
  Navbar,
  User,
} from "@diamondlightsource/sci-react-ui";

import ClusterBadge from "./ClusterBadge";

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
      logo={null}
      rightSlot={
        <Stack direction="row" alignItems="center">
          <ClusterBadge></ClusterBadge>
          <User
            color="white"
            onLogin={handleLogin}
            onLogout={handleLogout}
            user={
              user.person == null || user.person == undefined
                ? null
                : { fedid: user.person.identifier }
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
        sx={{ padding: "10px 5px 2px 5px" }}
        height="100%"
      >
        Web&#8209;CONEXS
      </Typography>
    </Navbar>
  );
}
