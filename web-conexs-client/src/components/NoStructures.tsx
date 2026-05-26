import { Stack, Typography } from "@mui/material";
import NavButton from "./NavButton";
import MoleculePlusIcon from "./icons/MoleculePlusIcon";
import GrainPlusIcon from "./icons/GrainPlusIcon";

export default function NoStructures(props: { isCrytal: boolean }) {
  return (
    <Stack spacing="10px">
      <Typography sx={{ fontWeight: "bold" }} variant="h6">
        No {props.isCrytal ? "Crystals" : "Molecules"} Registered!
      </Typography>
      <Typography>
        Running simulations requires structures. To create{" "}
        {props.isCrytal ? "crystals" : "molecules"} to simulate follow the link
        below.
      </Typography>
      {props.isCrytal ? (
        <NavButton
          label="Create Crystal"
          path={"/createcrystal"}
          icon={<GrainPlusIcon />}
          reload={false}
        ></NavButton>
      ) : (
        <NavButton
          label="Create Molecule"
          path={"/createmolecule"}
          icon={<MoleculePlusIcon />}
          reload={false}
        ></NavButton>
      )}
    </Stack>
  );
}
