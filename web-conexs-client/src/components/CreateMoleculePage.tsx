import { Box, Button, Stack } from "@mui/material";
import { MoleculeInput } from "../models";
import { useState } from "react";
import XYZFileEditor from "./XYZFileEditor";
import React3dMol from "./React3dMol";
import useMoleculeAPI from "../hooks/useMoleculeAPI";
import { useNavigate } from "react-router-dom";

const templateMolecule: MoleculeInput = {
  label: "Benzene",

  structure:
    "C   0.000000  1.402720  0.000000\nH   0.000000  2.490290  0.000000\nC  -1.214790  0.701360  0.000000\nH  -2.156660  1.245150  0.000000\nC  -1.214790 -0.701360  0.000000\nH  -2.156660 -1.245150  0.000000\nC   0.000000 -1.402720  0.000000\nH   0.000000 -2.490290  0.000000\nC   1.214790 -0.701360  0.000000\nH   2.156660 -1.245150  0.000000\nC   1.214790  0.701360  0.000000\nH   2.156660  1.245150  0.000000",
};

export default function CreateMoleculePage() {
  const [molecule, setMolecule] = useState<MoleculeInput>(templateMolecule);
  const { insertMolecule } = useMoleculeAPI();
  const navigate = useNavigate();

  const callback = () => {
    window.alert("Thank you for your submission");
    navigate("/molecule");
  };

  return (
    <Stack direction={"row"}>
      <XYZFileEditor
        molecularInput={molecule}
        setMolecularInput={setMolecule}
      />
      <React3dMol
        moleculedata={molecule}
        color="#3465A4"
        style="Stick"
        orbital={null}
      ></React3dMol>
      <Button
        onClick={() => {
          insertMolecule(molecule, callback);
        }}
      >
        Create
      </Button>
    </Stack>
  );
}
