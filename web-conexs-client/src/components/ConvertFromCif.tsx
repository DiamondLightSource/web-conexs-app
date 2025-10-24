import {
  Button,
  Card,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import VisuallyHiddenInput from "./VisuallyHiddenInput";
import { useMutation } from "@tanstack/react-query";
import { postConvertCrystal, postConvertMolecule } from "../queryfunctions";
import { CrystalInput, MoleculeInput } from "../models";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import GrainIcon from "./icons/GrainIcon";
import MoleculeIcon from "./icons/MoleculeIcon";

function getConvertIcon(state: string, molecule: boolean) {
  if (state == "ok") {
    return <CheckCircleIcon />;
  } else if (state == "failed") {
    return <ErrorIcon />;
  } else if (state == "running") {
    return <CircularProgress size="1em" />;
  }

  return molecule ? <MoleculeIcon /> : <GrainIcon />;
}

export default function ConvertFromCif(props: {
  isFractional: boolean;
  setStructure: (moleculeInput: MoleculeInput | CrystalInput | null) => void;
}) {
  const [textFile, setTextFile] = useState<string | null>(null);
  const [filename, setFileName] = useState<string | null>(null);

  const [convertState, setConvertState] = useState<
    "default" | "ok" | "failed" | "running"
  >("default");

  const mutation = useMutation({
    mutationFn: props.isFractional ? postConvertCrystal : postConvertMolecule,
    onSuccess: (data) => {
      props.setStructure(data);
      setConvertState("ok");
      setTimeout(() => setConvertState("default"), 2000);
    },
    onError: () => {
      setConvertState("failed");
      setTimeout(() => setConvertState("default"), 2000);
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
    ? "Convert from Crystal Cif File"
    : "Convert from Molecular Crystal Cif File";

  return (
    <Card>
      <Stack>
        <Typography>{title}</Typography>
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
          <Button
            variant="outlined"
            disabled={textFile == null}
            onClick={() => {
              if (textFile != null) {
                setConvertState("running");
                mutation.mutate(textFile);
              }
            }}
            endIcon={getConvertIcon(convertState, !props.isFractional)}
          >
            Run Convert
          </Button>
          <Typography>{filename ? filename : "No file"}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
