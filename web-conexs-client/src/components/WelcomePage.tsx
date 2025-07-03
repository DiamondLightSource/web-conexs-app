import { Stack, Typography } from "@mui/material";
import MainPanel from "./MainPanel";

import LoginIcon from "@mui/icons-material/Login";
import GrainIcon from "./icons/GrainIcon";
import MoleculeIcon from "./icons/MoleculeIcon";
import NavButton from "./NavButton";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function WelcomePage() {
  const user = useContext(UserContext);

  return (
    <MainPanel>
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
        <Typography variant="h4" padding="24px">
          User-Friendly XAS Simulation!
        </Typography>
        <Typography variant="h6" padding="24px">
          Place holder text!
        </Typography>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam velit
          eros, ornare sodales augue vel, facilisis laoreet odio. Etiam ultrices
          sed metus nec molestie. Fusce fringilla ac dui varius vehicula. Morbi
          nec elementum metus. Duis in cursus tortor. In libero purus,
          pellentesque in pretium in, sollicitudin in quam. Class aptent taciti
          sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. In ac ipsum erat. Cras tempus ac dolor id feugiat.
          Vestibulum ac enim maximus, luctus lorem non, tempor dolor. Praesent
          porta augue nec diam eleifend ultrices.
        </Typography>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam velit
          eros, ornare sodales augue vel, facilisis laoreet odio. Etiam ultrices
          sed metus nec molestie. Fusce fringilla ac dui varius vehicula. Morbi
          nec elementum metus. Duis in cursus tortor. In libero purus,
          pellentesque in pretium in, sollicitudin in quam. Class aptent taciti
          sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. In ac ipsum erat. Cras tempus ac dolor id feugiat.
          Vestibulum ac enim maximus, luctus lorem non, tempor dolor. Praesent
          porta augue nec diam eleifend ultrices.
        </Typography>
        {!user ? (
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
                icon={<GrainIcon sx={{ width: "5em", height: "5em" }} />}
                reload={false}
              ></NavButton>
            </Stack>
          </Stack>
        )}
      </Stack>
    </MainPanel>
  );
}
