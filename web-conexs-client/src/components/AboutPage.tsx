import { Card, CardContent, Stack, Typography } from "@mui/material";
import MainPanel from "./MainPanel";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <MainPanel
      toolbarElements={<Typography variant="h5">About Web-CONEXS</Typography>}
    >
      <Stack margin={"10px"} spacing={"5px"} padding={"10px"}>
        <Card>
          <CardContent>
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
                Web-CONEXS : an inroad to theoretical X-ray absorption
                spectroscopy.
              </i>{" "}
              Journal of Synchrotron Radiation 2024 <b>31</b> 1276
            </Link>
            <Typography>
              Funding for Web-CONEXS was provided by the Engineering and
              Physical Sciences Research Council (EPSRC) via CONEXS (grant Nos.
              EP/S021493/1 \& EP/S022058) and HPC-CONEXS (grant No. No.
              EP/X035514/1)
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </MainPanel>
  );
}
