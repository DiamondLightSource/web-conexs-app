import { AppBar, Toolbar, Typography } from "@mui/material";
import SideDrawer from "./SideDrawer";

export default function Header() {
  return (
    <AppBar style={{ position: "static" }}>
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <SideDrawer />
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Web-CONEXS
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
