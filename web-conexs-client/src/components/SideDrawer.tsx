import {
  CSSObject,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  Theme,
  Toolbar,
  useTheme,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import { UserContext } from "../UserContext";
import GrainIcon from "./icons/GrainIcon";
import LabIcon from "./icons/LabIcon";
import GrainPlusIcon from "./icons/GrainPlusIcon";
import QEIcon from "./icons/QEIcon";
import MoleculeIcon from "./icons/MoleculeIcon";
import MoleculePlusIcon from "./icons/MoleculePlusIcon";
import FDMNESIcon from "./icons/FDMNESIcon";
import OrcaIcon from "./icons/OrcaIcon";
import InfoIcon from "@mui/icons-material/Info";
import { Login } from "@mui/icons-material";
import SideToolbar from "./SideToolbar";

function ListItemStyled(props: {
  theme: Theme;
  open: boolean;
  to: string;
  label: string;
  icon: React.ReactElement;
  reloadDocument: boolean;
}) {
  const { theme, open, to, label, icon, reloadDocument } = props;
  return (
    <ListItem
      component={NavLink}
      to={to}
      reloadDocument={reloadDocument}
      key={label}
      disablePadding
      sx={{
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
        "&.active": {
          background: theme.palette.action.selected,
        },
        textDecoration: "none",
        alignItems: "center",
        display: "flex",
        padding: "13px 3px 0",
        borderBottom: "4px solid transparent",

        color: theme.palette.primary.main,
      }}
    >
      <Stack
        direction="row"
        sx={[
          {
            width: { drawerWidth },
            minHeight: 32,
            px: 2.5,
          },
          open
            ? {
                justifyContent: "initial",
              }
            : {
                justifyContent: "center",
              },
        ]}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </Stack>
    </ListItem>
  );
}

const drawerWidth = 320;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer2 = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function SideDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer2
      variant="permanent"
      open={open}
      onMouseEnter={() => {
        setOpen(true);
      }}
      onMouseLeave={() => {
        setOpen(false);
      }}
      onClick={() => {
        setOpen(false);
      }}
      sx={{ display: { xs: "none", md: "block" } }}
    >
      <SideToolbar open={open} />
    </Drawer2>
  );
}
