import { Stack, TextField } from "@mui/material";

import { CrystalInput, LatticeParameter } from "../../models";
import LatticeEditor from "./LatticeEditor";

export default function XYZCrystalFileViewer(props: {
  crystal: CrystalInput | null;
}) {
  const lp: LatticeParameter =
    props.crystal != null
      ? {
          alpha: props.crystal.alpha,
          beta: props.crystal.beta,
          gamma: props.crystal.gamma,
          a: props.crystal.a,
          b: props.crystal.b,
          c: props.crystal.c,
          ibrav: props.crystal.ibrav,
        }
      : {
          a: 1,
          b: 1,
          c: 1,
          alpha: 90,
          beta: 90,
          gamma: 90,
          ibrav: "0",
        };

  return (
    <Stack spacing={3} minWidth={"450px"}>
      <TextField
        id="Label"
        label="Label"
        value={props.crystal == null ? " " : props.crystal.label}
      />
      <LatticeEditor lattice={lp} setLattice={() => {}}></LatticeEditor>

      <TextField
        sx={{ width: "100%" }}
        id="datafilebox"
        label="Atomic Coordinate (Fractional)"
        multiline
        rows={12}
        value={props.crystal != null ? props.crystal.structure : ""}
      />
    </Stack>
  );
}
