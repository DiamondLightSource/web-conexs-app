import {
  Box,
  Collapse,
  CSSObject,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  Theme,
  Toolbar,
  useTheme,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import ScienceIcon from "@mui/icons-material/Science";
import FunctionsIcon from "@mui/icons-material/Functions";
import { UserContext } from "../UserContext";
import GrainIcon from "./icons/GrainIcon";
import LabIcon from "./icons/LabIcon";
import GrainPlusIcon from "./icons/GrainPlusIcon";
import QEIcon from "./icons/QEIcon";
import MoleculeIcon from "./icons/MoleculeIcon";
import MoleculePlusIcon from "./icons/MoleculePlusIcon";
import FDMNESIcon from "./icons/FDMNESIcon";
import OrcaIcon from "./icons/OrcaIcon";
import { Login } from "@mui/icons-material";

function ListItemStyled(props: {
  theme: Theme;
  open: boolean;
  to: string;
  label: string;
  icon: React.ReactElement;
}) {
  const { theme, open, to, label, icon } = props;
  return (
    <ListItem
      component={NavLink}
      to={to}
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
            minHeight: 48,
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
        ></ListItemStyled>

        {user && (
          <>
            <Divider />
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/simulations"}
              label="Simulations"
              icon={<LabIcon />}
            ></ListItemStyled>
            <Divider />
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/molecules"}
              label="Molecules"
              icon={<MoleculeIcon />}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/createmolecule"}
              label="Create Molecule"
              icon={<MoleculePlusIcon />}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/orca"}
              label="Submit Orca"
              icon={<OrcaIcon />}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/fdmnesmolecule"}
              label="Submit FDMNES Molecule"
              icon={<FDMNESIcon />}
            ></ListItemStyled>
            <Divider />
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/crystals"}
              label="Crystals"
              icon={<GrainIcon />}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/createcrystal"}
              label="Create Crystal"
              icon={<GrainPlusIcon />}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/fdmnescrystal"}
              label="Submit FDMNES Crystal"
              icon={<FDMNESIcon />}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={open}
              to={"/qe"}
              label="Submit QE"
              icon={<QEIcon />}
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
          ></ListItemStyled>
        )}
      </List>
    </>
  );

  // return (
  //   <Drawer2
  //     variant="permanent"
  //     open={open}
  //     onMouseEnter={() => {
  //       setOpen(true);
  //     }}
  //     onMouseLeave={() => {
  //       setOpen(false);
  //     }}
  //   >
  //     <Divider />
  //     <List>
  //       {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
  //         <ListItem key={text} disablePadding sx={{ display: "block" }}>
  //           <ListItemButton
  //             sx={[
  //               {
  //                 minHeight: 48,
  //                 px: 2.5,
  //               },
  //               open
  //                 ? {
  //                     justifyContent: "initial",
  //                   }
  //                 : {
  //                     justifyContent: "center",
  //                   },
  //             ]}
  //           >
  //             <ListItemIcon
  //               sx={[
  //                 {
  //                   minWidth: 0,
  //                   justifyContent: "center",
  //                 },
  //                 open
  //                   ? {
  //                       mr: 3,
  //                     }
  //                   : {
  //                       mr: "auto",
  //                     },
  //               ]}
  //             >
  //               <MenuIcon />
  //             </ListItemIcon>
  //             <ListItemText
  //               primary={text}
  //               sx={[
  //                 open
  //                   ? {
  //                       opacity: 1,
  //                     }
  //                   : {
  //                       opacity: 0,
  //                     },
  //               ]}
  //             />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //     <Divider />
  //     <List>
  //       {["All mail", "Trash", "Spam"].map((text, index) => (
  //         <ListItem key={text} disablePadding sx={{ display: "block" }}>
  //           <ListItemButton
  //             sx={[
  //               {
  //                 minHeight: 48,
  //                 px: 2.5,
  //               },
  //               open
  //                 ? {
  //                     justifyContent: "initial",
  //                   }
  //                 : {
  //                     justifyContent: "center",
  //                   },
  //             ]}
  //           >
  //             <ListItemIcon
  //               sx={[
  //                 {
  //                   minWidth: 0,
  //                   justifyContent: "center",
  //                 },
  //                 open
  //                   ? {
  //                       mr: 3,
  //                     }
  //                   : {
  //                       mr: "auto",
  //                     },
  //               ]}
  //             >
  //               <MenuIcon />
  //             </ListItemIcon>
  //             <ListItemText
  //               primary={text}
  //               sx={[
  //                 open
  //                   ? {
  //                       opacity: 1,
  //                     }
  //                   : {
  //                       opacity: 0,
  //                     },
  //               ]}
  //             />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //   </Drawer2>
  // );

  return (
    <Drawer2
      variant="permanent"
      open={open}
      // onClose={toggleDrawer(false)}
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

  // return DrawerList;
  // <>
  //   <IconButton size="large" onClick={toggleDrawer(true)}>
  //     <MenuIcon color="secondary" fontSize="large" />
  //   </IconButton>
  //   <Drawer open={open} onClose={toggleDrawer(false)}>
  //     {DrawerList}
  //   </Drawer>
  // </>
}
