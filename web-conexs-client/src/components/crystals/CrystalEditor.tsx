import { Stack, TextField } from "@mui/material";
import { useState } from "react";
import { CrystalInput, LatticeParameter } from "../../models";
import LatticeEditor from "./LatticeEditor";
import XYZEditor from "../XYZEditor";

const templateCrystal: CrystalInput = {
  a: 4.1043564,
  b: 4.1043564,
  c: 4.1043564,
  alpha: 90,
  beta: 90,
  gamma: 90,
  label: "Silver",
  ibrav: "2",
  structure: "Ag 0.0 0.0 0.0\nAg 0.5 0.5 0.0\nAg 0.5 0.0 0.5\nAg 0.0 0.5 0.5",
};

export default function CrystalEditor(props: {
  crystal: CrystalInput | null;
  setCrystal: (structureInput: CrystalInput | null) => void;
}) {
  const [label, setLabel] = useState(templateCrystal.label);
  const [labelError, setLabelError] = useState("");
  const [lattice, setLattice] = useState<LatticeParameter | null>({
    ...templateCrystal,
  });
  const [structure, setStructure] = useState<string | null>(
    templateCrystal.structure
  );

  const updateStructure = (structure: string | null) => {
    setStructure(structure);
    if (structure == null || lattice === null || label == null) {
      props.setCrystal(null);
    } else {
      props.setCrystal({
        label: label,
        structure: structure,
        a: lattice.a,
        b: lattice.b,
        c: lattice.c,
        alpha: lattice.alpha,
        beta: lattice.beta,
        gamma: lattice.gamma,
        ibrav: lattice.ibrav,
      });
    }
  };

  const updateLattice = (latticeParams: LatticeParameter) => {
    console.log(latticeParams);
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
        structure: structure,
        a: latticeParams.a,
        b: latticeParams.b,
        c: latticeParams.c,
        alpha: latticeParams.alpha,
        beta: latticeParams.beta,
        gamma: latticeParams.gamma,
        ibrav: latticeParams.ibrav,
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
          structure: props.crystal.structure,
          a: lattice.a,
          b: lattice.b,
          c: lattice.c,
          alpha: lattice.alpha,
          beta: lattice.beta,
          gamma: lattice.gamma,
          ibrav: lattice.ibrav,
        });
      } else {
        console.log("CRYSTAL IS NULL");
      }
    }
    setLabel(label);
  };

  return (
    <Stack spacing={2} minWidth={"450px"}>
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
        structure={templateCrystal.structure}
        setStructure={updateStructure}
        isFractional={true}
      ></XYZEditor>
    </Stack>
  );
}
