import { Stack, TextField, Typography, useTheme } from "@mui/material";
import { LatticeParameter } from "../../models";

function NumberNoSpinner(props: {
  value: number;
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <TextField
      sx={{
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
          {
            display: "none",
          },
        "& input[type=number]": {
          MozAppearance: "textfield",
        },
      }}
      type="number"
      id={props.label}
      value={props.value}
      label={props.label}
      variant="outlined"
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
}

export default function LatticeEditor(props: {
  lattice: LatticeParameter;
  setLattice: (l: LatticeParameter) => void;
}) {
  const firstRowKeys: string[] = ["a", "b", "c"];
  const secondRowKeys: string[] = ["alpha", "beta", "gamma"];

  const theme = useTheme();

  return (
    <Stack spacing={"10px"}>
      <Stack direction={"row"} spacing={"10px"}>
        {firstRowKeys.map((k) => (
          <NumberNoSpinner
            key={k}
            value={props.lattice[k]}
            label={k}
            onChange={(value) => {
              const tmpLattice = { ...props.lattice };
              tmpLattice[k] = value;
              props.setLattice(tmpLattice);
            }}
          ></NumberNoSpinner>
        ))}
      </Stack>

      <Stack direction={"row"} spacing={"10px"}>
        {secondRowKeys.map((k) => (
          <NumberNoSpinner
            key={k}
            value={props.lattice[k]}
            label={k}
            onChange={(value) => {
              const tmpLattice = { ...props.lattice };

              if (value.length == 0) {
                tmpLattice[k] = null;
                props.setLattice(tmpLattice);
                return;
              }

              const numberVal = Number(value);

              if (!Number.isFinite(numberVal)) {
                tmpLattice[k] = null;
                props.setLattice(tmpLattice);
                return;
              }
              tmpLattice[k] = numberVal;
              props.setLattice(tmpLattice);
            }}
          ></NumberNoSpinner>
        ))}
      </Stack>
      <Typography
        variant="caption"
        color={theme.palette.error.main}
      ></Typography>
    </Stack>
  );
}
