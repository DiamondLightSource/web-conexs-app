import { Stack, TextField, Typography, useTheme } from "@mui/material";
import { LatticeParameter } from "../../models";

function NumberNoSpinner(props: {
  value: number | null;
  label: string;
  onChange: (value: string) => void;
}) {
  return (
    <TextField
      fullWidth
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
  const theme = useTheme();

  type LatticeParameterKey = keyof typeof props.lattice;

  const firstRowKeys: LatticeParameterKey[] = ["a", "b", "c"];
  const secondRowKeys: LatticeParameterKey[] = ["alpha", "beta", "gamma"];

  const onChangeValue = (value: string, k: LatticeParameterKey) => {
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
  };

  return (
    <Stack flex={1} spacing={"10px"}>
      <Stack
        flex={1}
        direction={"row"}
        spacing={"10px"}
        justifyContent="space-between"
      >
        {firstRowKeys.map((k) => (
          <NumberNoSpinner
            key={k}
            value={props.lattice[k]}
            label={k}
            onChange={(value) => onChangeValue(value, k)}
          ></NumberNoSpinner>
        ))}
      </Stack>

      <Stack flex={1} direction={"row"} spacing={"10px"}>
        {secondRowKeys.map((k) => (
          <NumberNoSpinner
            key={k}
            value={props.lattice[k]}
            label={k}
            onChange={(value) => onChangeValue(value, k)}
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
