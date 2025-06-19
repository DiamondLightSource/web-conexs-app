import { Typography, useTheme } from "@mui/material";
import SideDrawer from "./SideDrawer";

import { useContext } from "react";
import { UserContext } from "../UserContext";
import {
  ColourSchemeButton,
  Navbar,
  User,
} from "@diamondlightsource/sci-react-ui";

export default function Header() {
  const user = useContext(UserContext);
  const theme = useTheme();

  const handleLogin = () => window.location.assign("/login");

  const handleLogout = () => window.location.assign("/oauth2/sign_out");

  return (
    <Navbar
      logo="theme"
      leftSlot={<SideDrawer />}
      rightSlot={
        <>
          <User
            color="white"
            onLogin={handleLogin}
            onLogout={handleLogout}
            user={user == null ? null : { fedid: user.identifier }}
          />
          <ColourSchemeButton />
        </>
      }
      containerWidth={false}
    >
      <Typography variant="h4" color={theme.palette.primary.contrastText}>
        Web-CONEXS
      </Typography>
    </Navbar>
  );
}
