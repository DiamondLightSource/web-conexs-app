import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import { UserContext } from "../UserContext";

export default function SideDrawer() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const user = useContext(UserContext);

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
        {user && (
          <>
            <Divider />
            <ListItem key="Simulations" disablePadding>
              <Link to={"/simulations"}>
                <ListItemButton>
                  <ListItemText primary="Simulations" />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem key="Molecules" disablePadding>
              <Link to={"/molecules"}>
                <ListItemButton>
                  <ListItemText primary="Molecules" />
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
            <ListItem key="Submit Orca" disablePadding>
              <Link to={"/orca"}>
                <ListItemButton>
                  <ListItemText primary="Submit Orca" />
                </ListItemButton>
              </Link>
            </ListItem>
            <Divider />
            <ListItem key="Crystals" disablePadding>
              <Link to={"/crystals"}>
                <ListItemButton>
                  <ListItemText primary="Crystals" />
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
            <ListItem key="Submit FDMNES" disablePadding>
              <Link to={"/fdmnes"}>
                <ListItemButton>
                  <ListItemText primary="Submit FDMNES" />
                </ListItemButton>
              </Link>
            </ListItem>
          </>
        )}
        {user == null && (
          <ListItem key="Login" disablePadding>
            <Link to={"/login"} reloadDocument={true}>
              <ListItemButton>
                <ListItemText primary="Log In" />
              </ListItemButton>
            </Link>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <IconButton size="large" onClick={toggleDrawer(true)}>
        <MenuIcon color="secondary" fontSize="large" />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}
