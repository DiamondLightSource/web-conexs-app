import { Stack, Typography } from "@mui/material";
import { MoleculeInput } from "../../models";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postMolecule } from "../../queryfunctions";
import MoleculeEditor from "./MoleculeEditor";
import MainPanel from "../MainPanel";
import { MolStarMoleculeWrapper } from "../MolstarMoleculeViewer";
import { moleculeInputToXYZ } from "../../utils";
import PublishIcon from "@mui/icons-material/Publish";
import StateIconButton from "../StateIconButton";
import useStateIconButton from "../useStateIconButton";
import { defaultMolecule } from "../../defaultstructures";

export default function CreateMoleculePage() {
  const [molecule, setMolecule] = useState<MoleculeInput | null>(
    defaultMolecule,
  );

  const [renderedMolecule, setRenderedMolecule] =
    useState<MoleculeInput | null>(molecule);

  const [disabled, setDisabled] = useState(false);
  const { state, setState, resetState } = useStateIconButton();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const callback = () => {
    setState("ok");
    setDisabled(false);
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
      setState("error");
      setDisabled(false);
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
        <Stack spacing="10px" margin="10px" padding="10px">
          <MoleculeEditor
            molecule={molecule}
            setMolecule={setMolecule}
            triggerRender={() => setRenderedMolecule(molecule)}
          ></MoleculeEditor>
          <StateIconButton
            endIcon={<PublishIcon />}
            resetState={resetState}
            state={state}
            disabled={disabled || molecule == null}
            variant="contained"
            onClick={() => {
              setDisabled(true);
              setState("running");
              if (molecule != null) {
                mutation.mutate(molecule);
              }
            }}
          >
            Create Molecule
          </StateIconButton>
        </Stack>
        <Stack flex={1}>
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
