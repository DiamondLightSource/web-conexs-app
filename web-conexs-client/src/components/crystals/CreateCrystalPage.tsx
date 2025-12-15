import { Button, Stack, Typography } from "@mui/material";
import { CrystalInput } from "../../models";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCrystal } from "../../queryfunctions";
import CrystalEditor from "./CrystalEditor";
import MainPanel from "../MainPanel";
import { MolStarCrystalWrapper } from "../MolstarCrystalViewer";
import { crystalInputToCIF } from "../../utils";
import StateIconButton from "../StateIconButton";
import PublishIcon from "@mui/icons-material/Publish";
import useStateIconButton from "../useStateIconButton";

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

export default function CreateCystalPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);

  const { state, setState, resetState } = useStateIconButton();

  const callback = () => {
    setState("ok");
    setDisabled(false);
    navigate("/crystals");
  };

  const mutation = useMutation({
    mutationFn: postCrystal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["crystals"] });
      callback();
    },
    onError: () => {
      setState("error");
      setDisabled(false);
    },
  });

  const [crystal, setCrytal] = useState<CrystalInput | null>(templateCrystal);
  const [renderedCrystal, setRenderedCrytal] = useState<CrystalInput | null>(
    templateCrystal
  );

  return (
    <MainPanel
      toolbarElements={<Typography variant="h5">Create Crystal</Typography>}
    >
      <Stack
        direction={{ sm: "column", md: "row" }}
        spacing={"10px"}
        margin={"20px"}
        overflow="auto"
      >
        <Stack spacing="10px" margin="10px" padding="10px">
          <CrystalEditor crystal={crystal} setCrystal={setCrytal} />
          <StateIconButton
            endIcon={<PublishIcon />}
            resetState={resetState}
            state={state}
            disabled={crystal == null || disabled}
            variant="contained"
            onClick={() => {
              setDisabled(true);
              setState("running");
              if (crystal != null) {
                mutation.mutate(crystal);
              }
            }}
          >
            Create Crystal
          </StateIconButton>
        </Stack>
        <Stack flex={1}>
          <Button
            variant="outlined"
            onClick={() => {
              setRenderedCrytal(crystal);
            }}
          >
            Re-Render Structure
          </Button>
          <MolStarCrystalWrapper
            cif={
              renderedCrystal == null
                ? null
                : crystalInputToCIF(renderedCrystal)
            }
            labelledAtomIndex={undefined}
          />
        </Stack>
      </Stack>
    </MainPanel>
  );
}
