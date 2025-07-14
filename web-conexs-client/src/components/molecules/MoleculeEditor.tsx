import { Stack, TextField } from "@mui/material";
import { MoleculeInput } from "../../models";
import XYZEditor from "../XYZEditor";
import { useState } from "react";
import { inputToXYZNoHeader, siteFromString } from "../../utils";

const templateMolecule: MoleculeInput = {
  label: "Benzene",
  sites: [
    { index: 1, element_z: 6, x: 0.0, y: 1.40272, z: 0.0 },
    { index: 2, element_z: 1, x: 0.0, y: 2.49029, z: 0.0 },
    { index: 3, element_z: 6, x: -1.21479, y: 0.70136, z: 0.0 },
    { index: 4, element_z: 1, x: -2.15666, y: 1.24515, z: 0.0 },
    { index: 5, element_z: 6, x: -1.21479, y: -0.70136, z: 0.0 },
    { index: 6, element_z: 1, x: -2.15666, y: -1.24515, z: 0.0 },
    { index: 7, element_z: 6, x: 0.0, y: -1.40272, z: 0.0 },
    { index: 8, element_z: 1, x: 0.0, y: -2.49029, z: 0.0 },
    { index: 9, element_z: 6, x: 1.21479, y: -0.70136, z: 0.0 },
    { index: 10, element_z: 1, x: 2.15666, y: -1.24515, z: 0.0 },
    { index: 11, element_z: 6, x: 1.21479, y: 0.70136, z: 0.0 },
    { index: 12, element_z: 1, x: 2.15666, y: 1.24515, z: 0.0 },
  ],
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
      try {
        const sites = siteFromString(structure);
        props.setMolecule({ label: label, sites: sites });
      } catch (error) {
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
        structure={inputToXYZNoHeader(templateMolecule)}
        setStructure={(structure) => updateStructure(structure)}
        isFractional={false}
      ></XYZEditor>
    </Stack>
  );
}
