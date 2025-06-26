import {
  Box,
  Button,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { MoleculeInput } from "../../models";
import { useState } from "react";
import React3dMol from "../React3dMol";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMolecule } from "../../queryfunctions";
import MoleculeEditor from "./MoleculeEditor";
import MainPanel from "../MainPanel";

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
  const theme = useTheme();

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
    <MainPanel>
      <Stack spacing={"10px"}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.action.disabled,
            borderRadius: "4px 4px 0px 0px",
          }}
        >
          <Typography variant="h5" component="div">
            Create Molecule
          </Typography>
        </Toolbar>
        <Stack direction={"row"} spacing="10px">
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
          variant="contained"
          disabled={molecule == null}
          onClick={() => {
            if (molecule != null) {
              mutation.mutate(molecule);
            }
          }}
        >
          Create Molecule
        </Button>
      </Stack>
    </MainPanel>
  );
}
