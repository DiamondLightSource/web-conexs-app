import { Box, Button, Stack } from "@mui/material";
import { CrystalInput, MoleculeInput } from "../models";
import { useState } from "react";
import XYZFileEditor from "./XYZFileEditor";
import React3dMol from "./React3dMol";
import useMoleculeAPI from "../hooks/useMoleculeAPI";
import { useNavigate } from "react-router-dom";
import useCrystalAPI from "../hooks/useCrystalAPI";

const templateCrystal: CrystalInput = {
  a: 4.1043564,
  b: 4.1043564,
  c: 4.1043564,
  alpha: 90,
  beta: 90,
  gamma: 90,
  label: "test",
  structure: "Ag 0.0 0.0 0.0\nAg 0.5 0.5 0.0\nAg 0.5 0.0 0.5\nAg 0.0 0.5 0.5",
};

export default function CreateCystalPage() {
  const [crystal, setCrytal] = useState<CrystalInput>(templateCrystal);
  const { insertCrystal } = useCrystalAPI();
  const navigate = useNavigate();

  console.log(crystal);

  const callback = () => {
    window.alert("Thank you for your submission");
    navigate("/crystal");
  };

  return (
    <Stack direction={"row"}>
      <XYZFileEditor
        structureInput={crystal}
        setStructureInput={setCrytal}
        isMolecule={false}
      />
      <React3dMol
        moleculedata={crystal}
        color="#3465A4"
        style="Stick"
        orbital={null}
      ></React3dMol>
      <Button
        onClick={() => {
          insertCrystal(crystal, callback);
        }}
      >
        Create
      </Button>
    </Stack>
  );
}
