import { AppBar, Checkbox, Stack, Toolbar, Typography } from "@mui/material";
import SideDrawer from "./SideDrawer";

// import { LightMode, DarkMode } from "@mui/icons-material";

import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";

export default function Header(props: {
  colorMode: string;
  toggleColorMode: () => void;
}) {
  return (
    <AppBar style={{ position: "static" }}>
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <SideDrawer />
        <Typography
          variant="h2"
          component="div"
          sx={{ flexGrow: 1 }}
          margin="5px"
        >
          Web-CONEXS
        </Typography>
        <Stack direction="row" alignItems={"center"}>
          <Checkbox
            icon={<LightMode />}
            checkedIcon={<DarkMode />}
            checked={props.colorMode === "dark"}
            onChange={props.toggleColorMode}
          ></Checkbox>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
