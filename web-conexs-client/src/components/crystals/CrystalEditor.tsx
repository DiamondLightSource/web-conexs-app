import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import { CrystalInput, LatticeParameter } from "../../models";
import LatticeEditor from "./LatticeEditor";
import XYZEditor from "../XYZEditor";
import {
  inputToXYZNoHeader,
  isCrystalInput,
  siteFromString,
} from "../../utils";
import { defaultCrystal } from "../../defaultstructures";

export default function CrystalEditor(props: {
  crystal: CrystalInput | null;
  setCrystal: (structureInput: CrystalInput | null) => void;
  triggerRender: () => void;
}) {
  const [label, setLabel] = useState(defaultCrystal.label);
  const [labelError, setLabelError] = useState("");
  const [lattice, setLattice] = useState<LatticeParameter>({
    ...defaultCrystal.lattice,
  });
  const [structure, setStructure] = useState<string | null>(
    inputToXYZNoHeader(defaultCrystal),
  );

  const updateStructure = (structure: string | null) => {
    setStructure(structure);
    if (structure == null || lattice === null || label == null) {
      props.setCrystal(null);
    } else {
      props.setCrystal({
        label: label,
        lattice: { ...lattice },
        sites: siteFromString(structure),
      });
    }
  };

  const updateLattice = (latticeParams: LatticeParameter) => {
    setLattice(latticeParams);
    if (
      structure == null ||
      lattice === null ||
      label == null ||
      Object.values(latticeParams).includes(null)
    ) {
      props.setCrystal(null);
    } else {
      props.setCrystal({
        label: label,
        lattice: { ...latticeParams },
        sites: siteFromString(structure),
      });
    }
  };

  const updateLabel = (label: string) => {
    if (label.length == 0) {
      setLabelError("Label cannot be empty");
    } else {
      setLabelError("");
      if (props.crystal != null) {
        props.setCrystal({
          label: label,
          sites: [...props.crystal.sites],
          lattice: { ...props.crystal.lattice },
        });
      }
    }
    setLabel(label);
  };

  return (
    <Stack spacing={2} minWidth={{ sm: "350px", md: "550px" }}>
      <TextField
        error={labelError.length != 0}
        helperText={labelError}
        id="Label"
        label="Label"
        value={label}
        onChange={(e) => updateLabel(e.target.value)}
      />
      <LatticeEditor
        lattice={lattice}
        setLattice={updateLattice}
      ></LatticeEditor>
      <XYZEditor
        structure={inputToXYZNoHeader(defaultCrystal)}
        setStructure={updateStructure}
        isFractional={true}
        setFull={(structure) => {
          if (isCrystalInput(structure)) {
            props.setCrystal(structure);
          }
        }}
        triggerRender={props.triggerRender}
      ></XYZEditor>
    </Stack>
  );
}
