import { Stack, TextField } from "@mui/material";
import { MoleculeInput } from "../../models";
import XYZEditor from "../XYZEditor";
import { useState } from "react";

const templateMolecule: MoleculeInput = {
  label: "Benzene",

  structure:
    "C   0.000000  1.402720  0.000000\nH   0.000000  2.490290  0.000000\nC  -1.214790  0.701360  0.000000\nH  -2.156660  1.245150  0.000000\nC  -1.214790 -0.701360  0.000000\nH  -2.156660 -1.245150  0.000000\nC   0.000000 -1.402720  0.000000\nH   0.000000 -2.490290  0.000000\nC   1.214790 -0.701360  0.000000\nH   2.156660 -1.245150  0.000000\nC   1.214790  0.701360  0.000000\nH   2.156660  1.245150  0.000000",
};

export default function MoleculeEditor(props: {
  molecule: MoleculeInput | null;
  setMolecule: (moleculeInput: MoleculeInput | null) => void;
}) {
  const [label, setLabel] = useState(templateMolecule.label);
  const [labelError, setLabelError] = useState("");

  const updateStructure = (structure: string | null) => {
    if (structure == null) {
      props.setMolecule(null);
    } else {
      props.setMolecule({ label: label, structure: structure });
    }
  };

  const updateLabel = (label: string) => {
    if (label.length == 0) {
      setLabelError("Label cannot be empty");
    } else {
      setLabelError("");
      if (props.molecule != null) {
        props.setMolecule({
          label: label,
          structure: props.molecule.structure,
        });
      }
    }
    setLabel(label);
  };

  return (
    <Stack spacing={"10px"} minWidth={"450px"}>
      <TextField
        error={labelError.length != 0}
        helperText={labelError}
        id="Label"
        label="Label"
        value={label}
        onChange={(e) => updateLabel(e.target.value)}
      />
      <XYZEditor
        structure={templateMolecule.structure}
        setStructure={(structure) => updateStructure(structure)}
        isFractional={false}
      ></XYZEditor>
    </Stack>
  );
}
