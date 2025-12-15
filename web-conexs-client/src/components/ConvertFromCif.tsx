import { Button, Card, Stack, Typography } from "@mui/material";
import VisuallyHiddenInput from "./VisuallyHiddenInput";
import { useMutation } from "@tanstack/react-query";
import { postConvertCrystal, postConvertMolecule } from "../queryfunctions";
import { CrystalInput, MoleculeInput } from "../models";
import { useState } from "react";
import GrainIcon from "./icons/GrainIcon";
import MoleculeIcon from "./icons/MoleculeIcon";
import useStateIconButton from "./useStateIconButton";
import StateIconButton from "./StateIconButton";

export default function ConvertFromCif(props: {
  isFractional: boolean;
  setStructure: (moleculeInput: MoleculeInput | CrystalInput | null) => void;
}) {
  const [textFile, setTextFile] = useState<string | null>(null);
  const [filename, setFileName] = useState<string | null>(null);

  const { state, setState, resetState } = useStateIconButton();
  const [submitting, setSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: props.isFractional ? postConvertCrystal : postConvertMolecule,
    onSuccess: (data) => {
      setSubmitting(false);
      props.setStructure(data);
      setState("ok");
      setTimeout(() => resetState, 2000);
    },
    onError: () => {
      setSubmitting(false);
      setState("error");
      setTimeout(() => resetState, 2000);
    },
  });

  //   mutation.data
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    setFileName(file.name);

    if (file.name.endsWith(".cif")) {
      const reader = new FileReader();
      reader.onload = function () {
        const content = reader.result as string;

        setTextFile(content);
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  const title = props.isFractional
    ? "Convert from Crystal Cif File:"
    : "Convert from Molecular Crystal Cif File:";

  return (
    <Card>
      <Stack margin="5px">
        <Typography variant="subtitle1">{title}</Typography>
        {!props.isFractional && (
          <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>
            Only suitable for molecular crystals
          </Typography>
        )}
        <Stack direction="row" spacing="5px" margin="5px">
          <Button
            variant="contained"
            type="submit"
            role={undefined}
            tabIndex={-1}
            component="label"
          >
            Upload
            <VisuallyHiddenInput
              type="file"
              name="file1"
              onChange={handleFile}
            />
          </Button>
          <StateIconButton
            endIcon={props.isFractional ? <GrainIcon /> : <MoleculeIcon />}
            resetState={resetState}
            state={state}
            disabled={textFile == null || submitting}
            variant="contained"
            onClick={() => {
              if (textFile != null) {
                setSubmitting(true);
                setState("running");
                mutation.mutate(textFile);
              }
            }}
          >
            Run Convert
          </StateIconButton>
          <Typography>{filename ? filename : "No file"}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
