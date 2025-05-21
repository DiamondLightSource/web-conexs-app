import { TextField } from "@mui/material";
import { useState } from "react";

export default function XYZEditor(props: {
  template: string;
  setStructure: () => void;
}) {
  const [data, setData] = useState<string>(props.template);

  return (
    <TextField
      error={true}
      sx={{ width: "100%" }}
      id="datafilebox"
      label="Atomic Coordinates (Angstroms)"
      multiline
      value={data}
      helperText={"oops"}
      onChange={(e) => {
        setData(e.target.value);
      }}
    />
  );
}
