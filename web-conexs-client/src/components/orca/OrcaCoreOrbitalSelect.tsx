import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { OrcaCoreOrbitalInfo } from "../../models";

export default function OrcaCoreOrbitalSelect(props: {
  coreOrbitals: OrcaCoreOrbitalInfo[];
  elementIndex: number;
  setElementIndex: (index: number) => void;
}) {
  const handleChange = (event: SelectChangeEvent) => {
    props.setElementIndex(Number(event.target.value));
  };

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Element</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.elementIndex.toString()}
          label="Element"
          onChange={handleChange}
        >
          {props.coreOrbitals.map((v, i) => {
            return (
              <MenuItem key={i} value={i}>
                {v.index}: {v.element}{" "}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
