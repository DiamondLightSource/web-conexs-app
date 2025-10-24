import { Paper, Stack, Typography } from "@mui/material";
import MainPanel from "./MainPanel";

import LoginIcon from "@mui/icons-material/Login";
import GrainIcon from "./icons/GrainIcon";
import MoleculeIcon from "./icons/MoleculeIcon";
import NavButton from "./NavButton";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import Forbidden from "./Forbidden";

const points = [
  "Guided workflows for molecular and crystalline systems.",
  "Streamlined input to reduce decision making.",
  "Interfaces to ORCA, Quantum ESPRESSO and FDMNES.",
  "Visualisation of x-ray absorption and x-ray emission spectra interactively.",
  "Plot transition density differences to assign peaks in calculated spectra.",
];

export default function WelcomePage() {
  const user = useContext(UserContext);

  return (
    <MainPanel>
      {user.person_status == "FORBIDDEN" ? (
        <Forbidden></Forbidden>
      ) : (
        <Stack
          maxWidth={"md"}
          overflow="auto"
          flex={1}
          display="flex"
          sx={{
            alignSelf: "center",
            p: "24px",
            minHeight: 0,
            alignItems: "center",
          }}
        >
          <Typography variant="h2" padding="16px">
            Web-CONEXS
          </Typography>
          <Typography variant="h6" padding="16px" fontStyle="italic">
            A platform for your first steps in theoretical x-ray spectroscopy.
          </Typography>
          <Typography>
            Build and execute electronic structure theory simulations of x-ray
            absorption and x-ray emission spectra directly from your
            web-browser, all you need to get started is the structure of your
            material!. Login and get started by selecting a molecular or
            crystalline approach.
          </Typography>
          <Stack padding="12px" spacing="12px">
            {points.map((v, i) => (
              <Typography key={i}>&#x2022; {v}</Typography>
            ))}
          </Stack>
          {!user.person ? (
            <NavButton
              label="Login"
              path={"/login"}
              icon={<LoginIcon sx={{ width: "3em", height: "3em" }} />}
              reload={true}
            ></NavButton>
          ) : (
            <Stack padding={"1em"} sx={{ border: 1, borderRadius: 1 }}>
              <Typography variant="h6">
                What would you like to simulate?
              </Typography>
              <Stack direction="row" spacing="1em" margin="1em" padding={"1em"}>
                <NavButton
                  label="Molecules"
                  path={"/molecules"}
                  icon={<MoleculeIcon sx={{ width: "3em", height: "3em" }} />}
                  reload={false}
                ></NavButton>
                <NavButton
                  label="Crystals"
                  path={"/crystals"}
                  icon={<GrainIcon sx={{ width: "4em", height: "4em" }} />}
                  reload={false}
                ></NavButton>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </MainPanel>
  );
}
