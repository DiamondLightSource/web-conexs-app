import { Button, Stack, Typography } from "@mui/material";
import { MoleculeInput } from "../../models";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMolecule } from "../../queryfunctions";
import MoleculeEditor from "./MoleculeEditor";
import MainPanel from "../MainPanel";
import { MolStarMoleculeWrapper } from "../MolstarMoleculeViewer";
import { moleculeInputToXYZ } from "../../utils";

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

export default function CreateMoleculePage() {
  const [molecule, setMolecule] = useState<MoleculeInput | null>(
    templateMolecule
  );

  const [renderedMolecule, setRenderedMolecule] =
    useState<MoleculeInput | null>(molecule);

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
    onError: () => {
      window.alert("Error submitting structure!");
    },
  });

  return (
    <MainPanel
      toolbarElements={<Typography variant="h5">Create Molecule</Typography>}
    >
      <Stack
        direction={{ sm: "column", md: "row" }}
        spacing={"10px"}
        margin={"20px"}
        overflow="auto"
      >
        <Stack spacing="10px" margin="10px">
          <MoleculeEditor
            molecule={molecule}
            setMolecule={setMolecule}
          ></MoleculeEditor>
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
        <Stack flex={1}>
          <Button
            variant="outlined"
            onClick={() => {
              setRenderedMolecule(molecule);
            }}
          >
            Re-Render Structure
          </Button>
          <MolStarMoleculeWrapper
            xyz={
              renderedMolecule == null
                ? null
                : moleculeInputToXYZ(renderedMolecule)
            }
          />
        </Stack>
      </Stack>
    </MainPanel>
  );
}
