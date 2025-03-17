import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SideDrawer() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem key="Welcome Page" disablePadding>
          <Link to={"/"}>
            <ListItemButton>
              <ListItemText primary="Welcome Page" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem key="Molecules" disablePadding>
          <Link to={"/molecule"}>
            <ListItemButton>
              <ListItemText primary="Molecule" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem key="Create Molecule" disablePadding>
          <Link to={"/createmolecule"}>
            <ListItemButton>
              <ListItemText primary="Create Molecule" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem key="Crystals" disablePadding>
          <Link to={"/crystal"}>
            <ListItemButton>
              <ListItemText primary="Crystal" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem key="Create Crystal" disablePadding>
          <Link to={"/createcrystal"}>
            <ListItemButton>
              <ListItemText primary="Create Crystal" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem key="Simulations" disablePadding>
          <Link to={"/simulation"}>
            <ListItemButton>
              <ListItemText primary="Simulations" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem key="Submit Orca" disablePadding>
          <Link to={"/orca"}>
            <ListItemButton>
              <ListItemText primary="Submit Orca" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem key="Submit FDMNES" disablePadding>
          <Link to={"/fdmnes"}>
            <ListItemButton>
              <ListItemText primary="Submit FDMNES" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Button onClick={toggleDrawer(true)}>...</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}
