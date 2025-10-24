import { Stack, Toolbar, Typography, useTheme } from "@mui/material";
import MainPanel from "./MainPanel";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const theme = useTheme();
  return (
    <MainPanel>
      <Stack spacing={"10px"} margin={"10px"}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.action.disabled,
            borderRadius: "4px 4px 0px 0px",
          }}
        >
          <Typography variant="h5" component="div">
            About Web-CONEXS
          </Typography>
        </Toolbar>
        <Typography>
          For work arising from the use of Web-CONEXS please cite:
        </Typography>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          to={"https://journals.iucr.org/s/issues/2024/05/00/ok5117/"}
        >
          J.D. Elliott <i>et al.</i>{" "}
          <i>
            Web-CONEXS : an inroad to theoretical X-ray absorption spectroscopy.
          </i>{" "}
          Journal of Synchrotron Radiation 2024 <b>31</b> 1276
        </Link>
        <Typography>
          Funding for Web-CONEXS was provided by the Engineering and Physical
          Sciences Research Council (EPSRC) via CONEXS (grant Nos. EP/S021493/1
          \& EP/S022058) and HPC-CONEXS (grant No. No. EP/X035514/1)
        </Typography>
      </Stack>
    </MainPanel>
  );
}
