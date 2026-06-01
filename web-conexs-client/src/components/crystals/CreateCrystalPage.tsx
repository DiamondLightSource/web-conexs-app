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
import { defaultCrystal } from "../../defaultstructures";

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

  const [crystal, setCrytal] = useState<CrystalInput | null>(defaultCrystal);
  const [renderedCrystal, setRenderedCrytal] = useState<CrystalInput | null>(
    defaultCrystal,
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
          <CrystalEditor
            crystal={crystal}
            setCrystal={(crystal) => {
              setCrytal(crystal);
            }}
          />
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
