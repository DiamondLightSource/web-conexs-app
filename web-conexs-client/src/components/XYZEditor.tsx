import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import { inputToXYZNoHeader, validateMoleculeData } from "../utils";
import ConvertFromCif from "./ConvertFromCif";

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
    <Stack spacing="10px">
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

      <ConvertFromCif
        setStructure={(structure) => {
          if (structure == null) {
            return;
          }
          const s = inputToXYZNoHeader(structure);
          props.setStructure(s);
          setData(s);
          setErrorMessage("");
        }}
        isFractional={props.isFractional}
      ></ConvertFromCif>
    </Stack>
  );
}
