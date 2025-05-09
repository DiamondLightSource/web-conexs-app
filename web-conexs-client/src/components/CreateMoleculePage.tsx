import { Button, Stack } from "@mui/material";
import { MoleculeInput } from "../models";
import { useState } from "react";
import XYZFileEditor from "./XYZFileEditor";
import React3dMol from "./React3dMol";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMolecule } from "../queryfunctions";

const templateMolecule: MoleculeInput = {
  label: "Benzene",

  structure:
    "C   0.000000  1.402720  0.000000\nH   0.000000  2.490290  0.000000\nC  -1.214790  0.701360  0.000000\nH  -2.156660  1.245150  0.000000\nC  -1.214790 -0.701360  0.000000\nH  -2.156660 -1.245150  0.000000\nC   0.000000 -1.402720  0.000000\nH   0.000000 -2.490290  0.000000\nC   1.214790 -0.701360  0.000000\nH   2.156660 -1.245150  0.000000\nC   1.214790  0.701360  0.000000\nH   2.156660  1.245150  0.000000",
};

export default function CreateMoleculePage() {
  const [molecule, setMolecule] = useState<MoleculeInput>(templateMolecule);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const callback = () => {
    window.alert("Thank you for your submission");
    navigate("/molecule");
  };

  const mutation = useMutation({
    mutationFn: postMolecule,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["molecules"] });
      callback();
    },
  });

  return (
    <Stack direction={"row"}>
      <XYZFileEditor
        structureInput={molecule}
        setStructureInput={setMolecule}
        isMolecule={true}
      />
      <React3dMol
        moleculedata={molecule}
        color="#3465A4"
        style="Stick"
        orbital={null}
      ></React3dMol>
      <Button
        onClick={() => {
          mutation.mutate(molecule);
        }}
      >
        Create
      </Button>
    </Stack>
  );
}
