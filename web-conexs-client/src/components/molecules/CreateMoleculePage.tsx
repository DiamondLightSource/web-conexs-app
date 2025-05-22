import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { MoleculeInput } from "../../models";
import { useState } from "react";
import XYZFileEditor from "../XYZFileEditor";
import React3dMol from "../React3dMol";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMolecule } from "../../queryfunctions";
import XYZEditor from "../XYZEditor";
import MoleculeEditor from "./MoleculeEditor";

const templateMolecule: MoleculeInput = {
  label: "Benzene",

  structure:
    "C   0.000000  1.402720  0.000000\nH   0.000000  2.490290  0.000000\nC  -1.214790  0.701360  0.000000\nH  -2.156660  1.245150  0.000000\nC  -1.214790 -0.701360  0.000000\nH  -2.156660 -1.245150  0.000000\nC   0.000000 -1.402720  0.000000\nH   0.000000 -2.490290  0.000000\nC   1.214790 -0.701360  0.000000\nH   2.156660 -1.245150  0.000000\nC   1.214790  0.701360  0.000000\nH   2.156660  1.245150  0.000000",
};

export default function CreateMoleculePage() {
  const [molecule, setMolecule] = useState<MoleculeInput | null>(
    templateMolecule
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const callback = () => {
    window.alert("Thank you for your submission");
    navigate("/molecules");
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="stretch"
      flex={1}
      minHeight={0}
    >
      <Paper
        flex={1}
        sx={{
          margin: "20px",
          flex: 1,
          minHeight: 0,
          alignItems: "stretch",
          display: "flex",
          flexDirection: "column",
          spacing: "2px",
        }}
        elevation={12}
      >
        <Typography variant="h4" padding="24px">
          Create Molecule
        </Typography>
        <Stack direction={"row"} spacing="2px">
          <MoleculeEditor
            molecule={molecule}
            setMolecule={setMolecule}
          ></MoleculeEditor>
          <React3dMol
            moleculedata={molecule}
            color="#3465A4"
            style="Stick"
            orbital={null}
          ></React3dMol>
        </Stack>
        <Button
          disabled={molecule == null}
          onClick={() => {
            if (molecule != null) {
              console.log(molecule);
              mutation.mutate(molecule);
            }
          }}
        >
          Create Molecule
        </Button>
      </Paper>
    </Box>
  );
}
