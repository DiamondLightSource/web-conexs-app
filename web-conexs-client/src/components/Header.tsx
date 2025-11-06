import {
  Box,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import {
  ColourSchemeButton,
  Navbar,
  User,
  Logo,
} from "@diamondlightsource/sci-react-ui";

import ClusterBadge from "./ClusterBadge";
import SideToolbar from "./SideToolbar";

export default function Header() {
  const user = useContext(UserContext);
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogin = () => window.location.assign("/login");

  const handleLogout = () => window.location.assign("/oauth2/sign_out");

  const icon = theme.logos?.short;

  return (
    <Navbar
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: "70px",
      }}
      leftSlot={
        <Stack
          direction="row"
          sx={{ alignItems: "center", justifyConent: "center" }}
        >
          <IconButton
            size="large"
            onClick={handleDrawerToggle}
            sx={{
              color: theme.palette.primary.contrastText,
              display: { xs: "block", md: "none" },
            }}
          >
            <MenuIcon fontSize="inherit"></MenuIcon>
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            onClick={() => {
              handleDrawerClose();
              handleDrawerTransitionEnd();
            }}
          >
            <SideToolbar open={mobileOpen}></SideToolbar>
          </Drawer>
          {icon && (
            <Box
              maxWidth="2rem"
              margin="5px"
              height="100%"
              sx={{
                "&:hover": { filter: "brightness(80%);" },
                marginRight: { xs: "0", md: "50px" },
              }}
            >
              <Logo short={true}></Logo>
            </Box>
          )}
        </Stack>
      }
      logo={undefined}
      rightSlot={
        <Stack direction="row" alignItems="center">
          <ClusterBadge />

          <User
            colour="white"
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
