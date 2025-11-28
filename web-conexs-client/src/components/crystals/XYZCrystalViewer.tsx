import { Box, Button, Stack, TextField } from "@mui/material";
import LatticeEditor from "./LatticeEditor";
import { inputToXYZNoHeader } from "../../utils";
import { Crystal, LatticeParameter } from "../../models";

export default function XYZCrystalViewer(props: {
  crystal: Crystal | undefined;
}) {
  const lp: LatticeParameter =
    props.crystal != undefined
      ? props.crystal.lattice
      : {
          a: 1,
          b: 1,
          c: 1,
          alpha: 90,
          beta: 90,
          gamma: 90,
        };

  return (
    <Stack spacing={3} minWidth={"350px"}>
      <TextField
        id="Label"
        label="Label"
        value={props.crystal ? props.crystal.label : ""}
      />
      <LatticeEditor lattice={lp} setLattice={() => {}}></LatticeEditor>
      <Stack flex={1}>
        {/* <Button variant="contained" width="100%" height="100%" sx={{ flex: 1 }}>
          Test
        </Button> */}
        <TextField
          sx={{ width: "100%", height: "100%", flex: 1 }}
          id="datafilebox"
          label="Atomic Coordinate (Fractional)"
          multiline
          minRows={5}
          variant="outlined"
          value={props.crystal ? inputToXYZNoHeader(props.crystal) : ""}
        />
      </Stack>
    </Stack>
  );
}
