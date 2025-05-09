import { Button, Stack } from "@mui/material";
import { CrystalInput } from "../models";
import { useState } from "react";
import XYZFileEditor from "./XYZFileEditor";
import React3dMol from "./React3dMol";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCrystal } from "../queryfunctions";

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
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const callback = () => {
    window.alert("Thank you for your submission");
    navigate("/crystal");
  };

  const mutation = useMutation({
    mutationFn: postCrystal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["crystals"] });
      callback();
    },
  });

  const [crystal, setCrytal] = useState<CrystalInput>(templateCrystal);

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
          mutation.mutate(crystal);
        }}
      >
        Create
      </Button>
    </Stack>
  );
}
