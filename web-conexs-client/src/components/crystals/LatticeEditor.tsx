import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { LatticeParameter } from "../../models";

const ibravOptions = {
  "0": "free",
  "1": "cubic P (sc)",
  "2": "cubic F (fcc)",
  "3": "cubic I (bcc)",
  "-3": "cubic I (bcc), more symmetric axis",
  "4": "Hexagonal and Trigonal P",
  "5": "Trigonal R, 3fold axis c",
  "-5": "Trigonal R, 3fold axis <111>",
  "6": "Tetragonal P (st)",
  "7": "Tetragonal I (bct)",
  "8": "Orthorhombic P",
  "9": "Orthorhombic base-centered(bco) celldm(2)=b/a",
  "-9": "as 9, alternate description",
  "91": "Orthorhombic one-face base-centered A-type",
  "10": "Orthorhombic face-centered",
  "11": "Orthorhombic body-centered",
  "12": "Monoclinic P, unique axis c",
  "-12": "Monoclinic P, unique axis b",
  "13": "Monoclinic base-centered",
  "-13": "Monoclinic base-centered",
  "14": "Triclinic",
};

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
  setLattice: (l: LatticeParameter | null) => void;
}) {
  const firstRowKeys: string[] = ["a", "b", "c"];
  const secondRowKeys: string[] = ["alpha", "beta", "gamma"];

  const theme = useTheme();

  console.log("RENDER");
  console.log(props.lattice);
  console.log(props.lattice.ibrav);

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
              console.log(numberVal);

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
      {/* <FormControl> */}
      <InputLabel id="demo-simple-select-label">
        Bravais Lattice Index
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={props.lattice.ibrav + ""}
        defaultValue=""
        label="Bravais Lattice Index"
        onChange={(e) => {
          const tmpLattice = { ...props.lattice };
          tmpLattice.ibrav = e.target.value;
          props.setLattice(tmpLattice);
        }}
      >
        {Object.entries(ibravOptions).map((e) => (
          <MenuItem key={e[0]} value={e[0] + ""}>
            {e[0] + " - " + e[1]}
          </MenuItem>
        ))}
      </Select>
      {/* </FormControl> */}
      <Typography
        variant="caption"
        color={theme.palette.error.main}
      ></Typography>
    </Stack>
  );
}
