import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import VisuallyHiddenInput from "./VisuallyHiddenInput";
import { useMutation } from "@tanstack/react-query";
import {
  postConvertCrystal,
  postConvertMolecule,
  postExtractMolecule,
} from "../queryfunctions";
import { CrystalInput, MoleculeInput } from "../models";
import { useState } from "react";
import GrainIcon from "./icons/GrainIcon";
import MoleculeIcon from "./icons/MoleculeIcon";
import useStateIconButton from "./useStateIconButton";
import StateIconButton from "./StateIconButton";
import { getDetailFromError, TIMEOUT_TIME } from "../utils";

export default function ConvertFromCif(props: {
  isFractional: boolean;
  setStructure: (moleculeInput: MoleculeInput | CrystalInput | null) => void;
}) {
  const [textFile, setTextFile] = useState<string | null>(null);
  const [filename, setFileName] = useState<string | null>(null);

  const { state, setState, resetState } = useStateIconButton();
  const [submitting, setSubmitting] = useState(false);
  const [extractMolecule, setExtractMolecule] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const getMutation = () => {
    if (props.isFractional) {
      return postConvertCrystal;
    } else if (extractMolecule) {
      return postExtractMolecule;
    } else {
      return postConvertMolecule;
    }
  };

  const mutation = useMutation({
    mutationFn: getMutation(),
    onSuccess: (data) => {
      setSubmitting(false);
      data.label = filename ? filename : "Convert from cif";
      props.setStructure(data);
      setState("ok");
      setTimeout(() => resetState, TIMEOUT_TIME);
    },
    onError: (error) => {
      const detail = getDetailFromError(error);
      setMessage(detail);
      setSubmitting(false);
      setState("error");
      setTimeout(() => resetState, TIMEOUT_TIME);
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
          <Stack>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  onChange={() => setExtractMolecule(!extractMolecule)}
                />
              }
              label="Extract Molecule"
            />
            <Typography variant="subtitle2" sx={{ fontStyle: "italic" }}>
              Only suitable for molecular crystals
            </Typography>
          </Stack>
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
                setMessage(null);
                mutation.mutate(textFile);
              }
            }}
            message={message}
          >
            Run Convert
          </StateIconButton>
          <Typography>{filename ? filename : "No file"}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
