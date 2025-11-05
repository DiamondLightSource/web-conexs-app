import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Theme,
  Toolbar,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../UserContext";

import HomeIcon from "@mui/icons-material/Home";
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
import MatProjPlus from "./icons/MatProjPlus";

const drawerWidth = 320;

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

export default function SideToolbar(props: { open: boolean }) {
  const theme = useTheme();

  const user = useContext(UserContext);

  return (
    <Box>
      <Toolbar />
      <List>
        <ListItemStyled
          theme={theme}
          open={props.open}
          to={"/"}
          label="Home Page"
          icon={<HomeIcon />}
          reloadDocument={false}
        ></ListItemStyled>
        <ListItemStyled
          theme={theme}
          open={props.open}
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
              open={props.open}
              to={"/simulations"}
              label="Simulations"
              icon={<LabIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <Divider />
            <ListItemStyled
              theme={theme}
              open={props.open}
              to={"/molecules"}
              label="Molecules"
              icon={<MoleculeIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={props.open}
              to={"/createmolecule"}
              label="Create Molecule"
              icon={<MoleculePlusIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={props.open}
              to={"/orca"}
              label="Submit Orca"
              icon={<OrcaIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={props.open}
              to={"/fdmnesmolecule"}
              label="Submit FDMNES Molecule"
              icon={<FDMNESIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <Divider />
            <ListItemStyled
              theme={theme}
              open={props.open}
              to={"/crystals"}
              label="Crystals"
              icon={<GrainIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={props.open}
              to={"/createcrystal"}
              label="Create Crystal"
              icon={<GrainPlusIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={props.open}
              to={"/matprojcrystal"}
              label="Crystal From Materials Project"
              icon={<MatProjPlus />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={props.open}
              to={"/fdmnescrystal"}
              label="Submit FDMNES Crystal"
              icon={<FDMNESIcon />}
              reloadDocument={false}
            ></ListItemStyled>
            <ListItemStyled
              theme={theme}
              open={props.open}
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
            open={props.open}
            to={"/login"}
            label="Login"
            icon={<Login />}
            reloadDocument={true}
          ></ListItemStyled>
        )}
      </List>
    </Box>
  );
}
