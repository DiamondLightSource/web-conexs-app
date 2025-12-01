import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import QEIcon from "../icons/QEIcon";

export default function QEGuide() {
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
              <QEIcon />
              <Typography sx={{ fontWeight: "bold" }} variant="h6">
                Quantum Espresso
              </Typography>
            </Stack>

            <Typography margin="10px">
              Quantum ESPRESSO (Quantum opEn-Source Package for Research in
              Electronic Structure, Simulation, and Optimisation) is a suite of
              applications for ab-initio electronic structure calculations using
              plane waves and pseudopotentials.
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              margin="10px"
              sx={{ fontWeight: "bold" }}
            >
              If you publish calculation results performed with FDMNES code
              please cite the original papers:
            </Typography>
            <Typography
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
              variant="body2"
              margin="0px 10px"
            >
              Journal of Physics: Condensed Matter 21, 395502 (2009).
            </Typography>
            <Typography
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
              variant="body2"
              margin="0px 10px"
            >
              Phys. Rev. B 80, 075102 (2009)
            </Typography>
            <Typography
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
              variant="body2"
              margin="0px 10px"
            >
              Phys. Rev. B 87, 205105 (2013)
            </Typography>
            <Typography
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
              variant="body2"
              margin="0px 10px"
            >
              Journal of Physics: Condensed Matter 29, 465901 (2017).
            </Typography>
            <Typography
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
              variant="body2"
              margin="0px 10px"
            >
              The Journal of Chemical Physics 152, 154105 (2020).
            </Typography>
          </CardContent>
        </Card>
        <Divider />
        <Stack>
          <Typography
            margin="0px 10px"
            variant="h6"
            sx={{ fontWeight: "bold" }}
          >
            Quick Start
          </Typography>
          <Typography
            variant="h7"
            margin="0px 10px"
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            Structure
          </Typography>
          <Typography gutterBottom margin="10px">
            Select one of your crystal structures from the drop down menu. If
            you do not have any head to the crystal creation or materials
            project page.
          </Typography>
          <Typography
            margin="0px 10px"
            variant="h7"
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            Absorbing Atom
          </Typography>
          <Typography gutterBottom margin="10px">
            Quantum ESPRESSO computes the x-ray absorption spectrum for each
            individual atom (not 2element) in the crystal. This means you will
            need to perform a simulation for each inequivalent element in the
            crystal structure. Choose from the index in your crystal structure,
            to help the current absorbing atom is highlighted in the structure
            displayed.
          </Typography>
          <Typography
            margin="0px 10px"
            variant="h7"
            sx={{ fontStyle: "italic", fontWeight: "bold" }}
          >
            Conductivity
          </Typography>
          <Typography margin="10px">
            The conductivity dropdown menu determines which set of computational
            parameters are used to aid with convergence of the electronic
            structure. One set of parameters better suits systems with a
            zero-band gap (metals) and the other better suits systems with a
            finite band-gap (insulators & semiconductors). If you do not know
            the conductivity of the system we recommend first trying with the
            Insulator option and then switching to metallic.
          </Typography>
        </Stack>
        <Divider />
        <Typography variant="body2">
          Additional information can be found here:
        </Typography>
        <Link
          to="https://www.quantum-espresso.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Quantum Espresso Webpage
        </Link>
      </Stack>
    </Stack>
  );
}
