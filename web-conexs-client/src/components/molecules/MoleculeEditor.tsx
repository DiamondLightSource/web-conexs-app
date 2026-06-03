import { Stack, TextField } from "@mui/material";
import { MoleculeInput } from "../../models";
import XYZEditor from "../XYZEditor";
import { useState } from "react";
import {
  inputToXYZNoHeader,
  isCrystalInput,
  siteFromString,
} from "../../utils";
import { defaultMolecule } from "../../defaultstructures";

export default function MoleculeEditor(props: {
  molecule: MoleculeInput | null;
  setMolecule: (moleculeInput: MoleculeInput | null) => void;
  triggerRender: () => void;
}) {
  const [label, setLabel] = useState(defaultMolecule.label);
  const [labelError, setLabelError] = useState("");

  const updateStructure = (structure: string | null) => {
    if (structure == null) {
      props.setMolecule(null);
    } else {
      try {
        const sites = siteFromString(structure);
        props.setMolecule({ label: label, sites: sites });
      } catch (error) {
        console.log(error);
        props.setMolecule(null);
      }
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
          sites: [...props.molecule.sites],
        });
      }
    }
    setLabel(label);
  };

  return (
    <Stack spacing={"10px"} minWidth={{ sm: "350px", md: "550px" }}>
      <TextField
        error={labelError.length != 0}
        helperText={labelError}
        id="Label"
        label="Label"
        value={label}
        onChange={(e) => updateLabel(e.target.value)}
      />
      <XYZEditor
        structure={inputToXYZNoHeader(defaultMolecule)}
        setStructure={(structure) => updateStructure(structure)}
        isFractional={false}
        setFull={(structure) => {
          if (!isCrystalInput(structure)) {
            props.setMolecule(structure);
            updateLabel(structure.label);
          }
        }}
        triggerRender={props.triggerRender}
      ></XYZEditor>
    </Stack>
  );
}
