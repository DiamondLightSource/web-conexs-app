import { Alert, Button, Grid2, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { MoleculeInput } from "../models";

type Molecule3DProps = {
  moleculedata: string;
  setmoleculeData: (moleculedata: MoleculeInput) => void;
};

export default function XYZFileEditor(props: Molecule3DProps) {
  const initialSetup = props.moleculedata.split("\n");

  const [atoms, setAtoms] = useState<number>(Number(initialSetup[0]));
  const [comment, setComment] = useState<string>(initialSetup[1]);
  const [data, setData] = useState<string>(initialSetup.slice(2).join("\n"));
  const [error, setError] = useState<string[]>([""]);
  const [isError, setIsError] = useState<boolean>(false);

  function validateMoleculeData(data: string): string {
    const a = data.split("\n");
    let errorList = "";

    for (let index = 0; index < a.length; index++) {
      const currentLine = a[index].split(/\b\s+/).filter((i) => i);
      if (currentLine.length == 0) {
        continue;
      }
      if (currentLine.length != 4) {
        errorList =
          errorList + "Wrong number of items on line " + (index + 1) + "\n";
        setIsError(true);
      }
      if (!/^[a-zA-Z]+$/.test(currentLine[0])) {
        errorList =
          errorList + "Invalid chemical on line " + (index + 1) + "\n";
        setIsError(true);
      }
      if (
        !/^[+-]?[0-9]{1,}(?:\.[0-9]{1,})?$/.test(currentLine[1]) ||
        !/^[+-]?[0-9]{1,}(?:\.[0-9]{1,})?$/.test(currentLine[2]) ||
        !/^[+-]?[0-9]{1,}(?:\.[0-9]{1,})?$/.test(currentLine[3])
      ) {
        errorList = errorList + "Invalid number on line " + (index + 1) + "\n";
        setIsError(true);
      }
    }
    return errorList;
  }

  useEffect(() => {
    const setup = props.moleculedata.split("\n");
    setAtoms(Number(setup[0]));
    setComment(setup[1]);
    setData(setup.slice(2).join("\n"));
  }, [props.moleculedata]);

  function renderMolecule() {
    const errors = validateMoleculeData(data);
    if (errors == "") {
      setIsError(false);
      props.setmoleculeData( {label: "new molecule", structure: data
            .split("\n")
            .filter((i) => i)
            .join("\n")});
    } else {
      const temp = errors.split("\n");
      temp.length = temp.length - 1;
      setError(temp);
    }
  }

  return (
    <Grid2 container spacing={2} height="100%">
      {/* <Grid2 size={4}>
        <TextField id="atomBox" label="Atoms" value={atoms} disabled />
      </Grid2>
      <Grid2 size={8}>
        <TextField
          id="Comment/Lattice"
          label="Comment/Lattice"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Grid2> */}
      <Grid2 size={12}>
        <TextField
          sx={{ width: "100%" }}
          id="datafilebox"
          label="Atomic Coordinates (Angstroms)"
          multiline
          rows={12}
          value={data}
          onChange={(e) => {
            setAtoms(e.target.value.split("\n").filter((i) => i).length);
            setData(e.target.value);
          }}
        />
      </Grid2>
      <Grid2 size={12}>
        <Button variant="contained" onClick={renderMolecule}>
          Render
        </Button>
      </Grid2>
      {isError ? (
        <Alert variant="filled" sx={{ m: 2, width: "100%" }} severity="error">
          <ul style={{ padding: 0 }}>
            {error.map((data, index) => {
              return (
                <li key={index} style={{ listStyle: "none" }}>
                  {data}
                </li>
              );
            })}
          </ul>
        </Alert>
      ) : (
        <></>
      )}
    </Grid2>
  );
}
