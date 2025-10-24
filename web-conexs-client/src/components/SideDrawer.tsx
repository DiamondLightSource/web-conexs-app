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

  const theme = useTheme();

  const user = useContext(UserContext);

  const DrawerList = (
    <>
      <Toolbar />
      <List>
        <ListItemStyled
          theme={theme}
          open={open}
          to={"/"}
          label="Home Page"
          icon={<HomeIcon />}
          reloadDocument={false}
        ></ListItemStyled>
        <ListItemStyled
          theme={theme}
          open={open}
          to={"/about"}
          label="About"
          icon={<InfoIcon />}
          reloadDocument={false}
        ></ListItemStyled>

        {user.person && (
          <>
            <Divider />
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/simulations"}
              label="Simulations"
              icon={<LabIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <Divider />
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/molecules"}
              label="Molecules"
              icon={<MoleculeIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/createmolecule"}
              label="Create Molecule"
              icon={<MoleculePlusIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/orca"}
              label="Submit Orca"
              icon={<OrcaIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/fdmnesmolecule"}
              label="Submit FDMNES Molecule"
              icon={<FDMNESIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <Divider />
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/crystals"}
              label="Crystals"
              icon={<GrainIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/createcrystal"}
              label="Create Crystal"
              icon={<GrainPlusIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/matprojcrystal"}
              label="Crystal From Materials Project"
              icon={<GrainPlusIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/fdmnescrystal"}
              label="Submit FDMNES Crystal"
              icon={<FDMNESIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/qe"}
              label="Submit QE"
              icon={<QEIcon />}
              reloadDocument={false}
            ></ListItemStyled>
          </>
        )}
        {user == null && (
          <ListItemStyled
            theme={theme}
            open={open}
            to={"/login"}
            label="Login"
            icon={<Login />}
            reloadDocument={true}
          ></ListItemStyled>
        )}
      </List>
    </>
  );

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
    >
      {DrawerList}
    </Drawer2>
  );
}
