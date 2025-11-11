import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import FDMNESIcon from "../icons/FDMNESIcon";

export default function FdmnesGuide() {
  return (
    <Stack
      flex={1}
      sx={{
        margin: "20px",
        flex: 1,
        minHeight: "auto",
        alignItems: "stretch",
        display: "flex",
        flexDirection: "column",
        spacing: "2px",
        minWidth: "auto",
      }}
      elevation={3}
    >
      <Stack flex={1} spacing={"20px"} margin={"20px"}>
        <Card>
          <CardContent>
            <Stack direction="row" spacing={"10px"}>
              <FDMNESIcon />
              <Typography variant="h6">FDMNES</Typography>
            </Stack>
            <Typography gutterBottom margin="10px">
              The FDMNES project is developed in the SIN team, Institut Néel,
              CNRS, Grenoble, France.
            </Typography>
            <Typography variant="body2" gutterBottom margin="10px">
              If you publish calculation results performed with FDMNES code
              please cite the original papers:
            </Typography>
            <Typography sx={{ fontStyle: "italic" }} variant="body2">
              J. Phys.: Condens. Matter 21, 345501 (2009).
            </Typography>
            <Typography sx={{ fontStyle: "italic" }} variant="body2">
              J. Chem. Theory Comput. 11, 4512-4521 (2015).
            </Typography>
            <Typography sx={{ fontStyle: "italic" }} variant="body2">
              J. Synchrotron Rad. 23, 551-559 (2016).
            </Typography>
          </CardContent>
        </Card>
        <Divider />
        <Stack>
          <Typography variant="h6">Quick Start</Typography>
          <Typography variant="h7" sx={{ fontStyle: "italic" }}>
            Structure
          </Typography>
          <Typography gutterBottom margin="10px">
            Select one of your molecules or crystal structures from the drop
            down menu. If you do not have any head to the molecule or crystal
            creation page.
          </Typography>
          <Typography variant="h7" sx={{ fontStyle: "italic" }}>
            Element & Edge
          </Typography>
          <Typography gutterBottom margin="10px">
            Simply select the element you wish to probe and the edge you where
            you would like to simulate the x-ray absorption spectrum.
          </Typography>
          <Typography variant="h7" sx={{ fontStyle: "italic" }}>
            Theory
          </Typography>
          <Typography gutterBottom margin="10px">
            Finite Difference vs. Green’s functions - The Green’s function
            approach is typically faster, but less accurate, than the finite
            differences approach in FDMNES. We generally recommend applying
            both, starting from the Green’s function approach.
          </Typography>
        </Stack>
        <Divider />
        <Typography variant="body2">
          Additional information can be found here:
        </Typography>
        <Link
          to="https://cloud.neel.cnrs.fr/index.php/s/nL2c6kH2PLwcB5r"
          target="_blank"
          rel="noopener noreferrer"
        >
          FDMNES manual
        </Link>
        <Link
          to="https://fdmnes.neel.cnrs.fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          FDMNES webpage
        </Link>
      </Stack>
    </Stack>
  );
}
