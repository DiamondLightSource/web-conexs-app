import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import { CrystalInput, LatticeParameter } from "../../models";
import LatticeEditor from "./LatticeEditor";
import XYZEditor from "../XYZEditor";
import { inputToXYZNoHeader, siteFromString } from "../../utils";

const templateCrystal: CrystalInput = {
  lattice: {
    a: 4.1043564,
    b: 4.1043564,
    c: 4.1043564,
    alpha: 90,
    beta: 90,
    gamma: 90,
  },
  label: "test",
  sites: [
    { element_z: 47, x: 0.0, y: 0.0, z: 0.0, index: 1 },
    { element_z: 47, x: 0.5, y: 0.5, z: 0.0, index: 2 },
    { element_z: 47, x: 0.5, y: 0.0, z: 0.5, index: 3 },
    { element_z: 47, x: 0.0, y: 0.5, z: 0.5, index: 4 },
  ],
};

export default function CrystalEditor(props: {
  crystal: CrystalInput | null;
  setCrystal: (structureInput: CrystalInput | null) => void;
}) {
  const [label, setLabel] = useState(templateCrystal.label);
  const [labelError, setLabelError] = useState("");
  const [lattice, setLattice] = useState<LatticeParameter>({
    ...templateCrystal.lattice,
  });
  const [structure, setStructure] = useState<string | null>(
    inputToXYZNoHeader(templateCrystal)
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
    <Stack spacing={2} minWidth={"350px"}>
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
        structure={inputToXYZNoHeader(templateCrystal)}
        setStructure={updateStructure}
        isFractional={true}
      ></XYZEditor>
    </Stack>
  );
}
