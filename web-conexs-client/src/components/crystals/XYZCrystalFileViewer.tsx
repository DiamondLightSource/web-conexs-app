import { Stack, TextField, Typography } from "@mui/material";

import { CrystalInput } from "../../models";
import LatticeEditor from "./LatticeEditor";

interface LatticeParameter {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
}

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
        }
      : {
          a: 1,
          b: 1,
          c: 1,
          alpha: 90,
          beta: 90,
          gamma: 90,
        };

  return (
    <Stack spacing={3} minWidth={"450px"}>
      <Typography>
        {props.crystal == null ? " " : props.crystal.ibrav}
      </Typography>
      <TextField
        id="Label"
        label="Label"
        value={props.crystal == null ? " " : props.crystal.label}
      />
      <TextField
        id="BravaisLatticeIndex"
        label="Bravais Lattice Index"
        value={props.crystal == null ? " " : props.crystal.ibrav}
      />
      <LatticeEditor lattice={lp} setLattice={() => {}}></LatticeEditor>

      <TextField
        sx={{ width: "100%" }}
        id="datafilebox"
        label="Atomic Coordinates (Angstroms)"
        multiline
        rows={12}
        value={props.crystal != null ? props.crystal.structure : ""}
      />
    </Stack>
  );
}
