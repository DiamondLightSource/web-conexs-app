import { Stack, TextField } from "@mui/material";

import { LatticeParameter } from "../../models";
import LatticeEditor from "./LatticeEditor";
import { inputToXYZNoHeader } from "../../utils";
import { skipToken, useQuery } from "@tanstack/react-query";
import { getCrystal } from "../../queryfunctions";

export default function XYZCrystalFileViewer(props: {
  id: number | undefined;
}) {
  const id = props.id;

  const query = useQuery({
    queryKey: ["crystal", props.id],
    queryFn: id ? () => getCrystal(id) : skipToken,
  });
  const lp: LatticeParameter =
    query.data != null
      ? {
          alpha: query.data.lattice.alpha,
          beta: query.data.lattice.beta,
          gamma: query.data.lattice.gamma,
          a: query.data.lattice.a,
          b: query.data.lattice.b,
          c: query.data.lattice.c,
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
      <TextField
        id="Label"
        label="Label"
        value={query.data ? query.data.label : ""}
      />
      <LatticeEditor lattice={lp} setLattice={() => {}}></LatticeEditor>

      <TextField
        sx={{ width: "100%" }}
        id="datafilebox"
        label="Atomic Coordinate (Fractional)"
        multiline
        rows={12}
        value={query.data ? inputToXYZNoHeader(query.data) : ""}
      />
    </Stack>
  );
}
