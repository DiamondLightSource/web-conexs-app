import { TextField } from "@mui/material";
import { useState } from "react";
import { validateMoleculeData } from "../utils";

export default function XYZEditor(props: {
  structure: string;
  setStructure: (structure: string | null) => void;
  isFractional: boolean;
}) {
  const [data, setData] = useState<string>(props.structure);
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = (structure: string) => {
    setData(structure);
    const errors = validateMoleculeData(structure);

    const isError = errors.length != 0;

    if (!isError) {
      props.setStructure(structure);
      setErrorMessage("");
    } else {
      props.setStructure(null);
      setErrorMessage(errors);
    }
  };

  return (
    <TextField
      error={errorMessage.length != 0}
      sx={{ width: "100%" }}
      id="datafilebox"
      label={
        props.isFractional
          ? "Atomic Coordinates (Fractional)"
          : "Atomic Coordinates (Angstroms)"
      }
      rows={12}
      multiline
      value={data}
      helperText={errorMessage}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    />
  );
}
