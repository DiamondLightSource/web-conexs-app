import { Button, Card, Stack, Typography } from "@mui/material";
import VisuallyHiddenInput from "./VisuallyHiddenInput";
import { useMutation } from "@tanstack/react-query";
import { postConvertCrystal, postConvertMolecule } from "../queryfunctions";
import { CrystalInput, MoleculeInput } from "../models";
import { useState } from "react";

export default function ConvertFromCif(props: {
  isFractional: boolean;
  setStructure: (moleculeInput: MoleculeInput | CrystalInput | null) => void;
}) {
  const [textFile, setTextFile] = useState<string | null>(null);
  const [filename, setFileName] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: props.isFractional ? postConvertCrystal : postConvertMolecule,
    onSuccess: (data) => {
      props.setStructure(data);
      // Invalidate and refetch
      callback();
    },
    onError: () => {
      window.alert("Error submitting structure!");
    },
  });
  const callback = () => {
    window.alert("Success");
  };

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
        <Stack direction="row" spacing="5px">
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
                mutation.mutate(textFile);
              }
            }}
          >
            Run Convert
          </Button>
          <Typography>{filename ? filename : "No file"}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
