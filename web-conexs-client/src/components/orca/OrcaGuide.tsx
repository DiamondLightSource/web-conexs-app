import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import OrcaIcon from "../icons/OrcaIcon";

export default function OrcaGuide() {
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
              <OrcaIcon />
              <Typography
                sx={{ fontWeight: "bold" }}
                variant="h6"
                gutterBottom
                margin="10px"
              >
                ORCA
              </Typography>
            </Stack>
            <Typography gutterBottom margin="10px">
              ORCA is an ab initio, DFT, and semi-empirical SCF-MO package
              developed by Frank Neese et al. at the Max Planck Institut für
              Kohlenforschung.
            </Typography>
            <Typography
              variant="body2"
              margin="10px"
              sx={{ fontWeight: "bold" }}
            >
              If you publish calculation results performed with ORCA code please
              cite the original papers:
            </Typography>
            <Typography
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
              variant="body2"
              margin="0px 10px"
            >
              F. Neese, Wiley Interdisciplinary Reviews: Computational Molecular
              Science 2, 73 (2012).
            </Typography>
            <Typography
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
              variant="body2"
              margin="0px 10px"
            >
              F. Neese, Wiley Interdisciplinary Reviews: Computational Molecular
              Science 8, e1327 (2018).
            </Typography>
          </CardContent>
        </Card>
        <Divider />
        <Stack>
          <Typography
            sx={{ fontWeight: "bold" }}
            margin="0px 10px"
            variant="h6"
          >
            Quick Start
          </Typography>
          <Typography
            margin="0px 10px"
            variant="h7"
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            Structure
          </Typography>
          <Typography margin="10px">
            Select one of your molecules from the drop down menu. If you do not
            have any head to the molecule creation page.
          </Typography>
          <Typography
            margin="0px 10px"
            variant="h7"
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            Charge & Multiplicity
          </Typography>
          <Typography margin="10px">
            The charge, multiplicity describe the electronic configuration of
            your molecule. Charge should be set to the total charge, and
            multiplicity can be calculated using the formula 2S + 1, with S
            being to total spin (or number of unpaired electrons × 1/2).
          </Typography>
          <Typography
            margin="0px 10px"
            variant="h7"
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            Solvent
          </Typography>
          <Typography gutterBottom margin="10px">
            Include a solvent using Orca's conductor-like polarizable continuum
            model (C-PCM) implementation.
          </Typography>
          <Typography
            margin="0px 10px"
            variant="h7"
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            Technique
          </Typography>
          <Typography margin="10px" component="div">
            &#x2022; OPT: Geometry Optimisation of the molecule.
            <br /> &#x2022; SCF: Self-Consistent Calculation of the electronic
            structure, used to determine the donor (core) orbitals.
            <br /> &#x2022; XAS: X-ray absorption calculation and
            post-processing.
            <br />
            &#x2022; XES: X-ray emission calculation and post processing.
            <br /> <p />
            We recommend a workflow OPT → SCF → XAS/XES.
          </Typography>
          <Typography
            margin="0px 10px"
            variant="h7"
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            Functional & Basis set
          </Typography>
          <Typography margin="10px">
            We recommend trying each of the functionals, look for differences in
            the final geometries af- ter optimisation and spectra after XAS and
            XES calculations. Note that the hybrid functional B3LYP can be
            considered “the most accurate” available on Web-CONEXS.
          </Typography>
          <Typography margin="10px">
            Basis sets increase in size with def-SVP being the smallest and
            def-TZVP being the largest. Similarly we recommend exploring each of
            these, but it is worth noting that molecules with heavier elements
            will require the larger def-TZVP basis set for calculation.
          </Typography>
          <Typography
            margin="0px 10px"
            variant="h7"
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            X-ray absorption - TD-DFT Donor/Acceptor Orbitals
          </Typography>
          <Typography gutterBottom margin="10px">
            For an XAS calculation we need to provide the indexes of the donor
            (core) orbitals, these are provided in the results of an SCF
            calculation. For K- and L 1 -edge calculations ORBWIN will likely be
            1 number in all four boxes. For L 2,3 -edge calculations ORBWIN will
            be the orbital window (two indices) that spans the p orbitals.
          </Typography>
        </Stack>
        <Divider />
        <Typography variant="body2" gutterBottom margin="10px">
          Additional information can be found here:
        </Typography>
        <Link
          to="https://www.kofo.mpg.de/en/research/services/orca"
          target="_blank"
          rel="noopener noreferrer"
        >
          ORCA webpage at Max-Planck-Institut
        </Link>
        <Link
          to="https://www.kofo.mpg.de/412442/orca_manual-opt.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          ORCA manual
        </Link>
        <Link
          to="https://sites.google.com/site/orcainputlibrary/home"
          target="_blank"
          rel="noopener noreferrer"
        >
          ORCA input library website
        </Link>
      </Stack>
    </Stack>
  );
}
