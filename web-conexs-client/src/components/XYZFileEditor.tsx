import { Alert, Button, Grid2, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { LatticeParameter, MoleculeInput } from "../models";
import LatticeEditor from "./LatticeEditor";

export default function XYZFileEditor(props: {
  molecularInput: MoleculeInput;
  setMolecularInput: (molecularInput: MoleculeInput) => void;
}) {
  // const initialSetup = props.molecularInput.structure.split("\n");

  const [lattice, setLattice] = useState<LatticeParameter>({
    a: 1,
    b: 1,
    c: 1,
    alpha: 90,
    beta: 90,
    gamma: 90,
  });
  // const [atoms, setAtoms] = useState<number>(Number(initialSetup[0]));
  // const [comment, setComment] = useState<string>(initialSetup[1]);
  const [data, setData] = useState<string>("");
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

  // useEffect(() => {
  //   const setup = props.moleculedata.split("\n");
  //   setAtoms(Number(setup[0]));
  //   setComment(setup[1]);
  //   setData(setup.slice(2).join("\n"));
  // }, [props.moleculedata]);

  function renderMolecule() {
    const errors = validateMoleculeData(data);
    if (errors == "") {
      setIsError(false);
      props.setMolecularInput({
        label: "new molecule",
        structure: data
          .split("\n")
          .filter((i) => i)
          .join("\n"),
      });
    } else {
      const temp = errors.split("\n");
      temp.length = temp.length - 1;
      setError(temp);
    }
  }

  return (
    <Stack spacing={3} minWidth={"450px"}>
      <TextField
        id="Label"
        label="Label"
        value={props.molecularInput == null ? " " : props.molecularInput.label}
        onChange={(e) => setComment(e.target.value)}
      />

      {props.molecularInput != null &&
        "lattice_params" in props.molecularInput && (
          <LatticeEditor
            lattice={lattice}
            setLattice={setLattice}
          ></LatticeEditor>
        )}

      <TextField
        sx={{ width: "100%" }}
        id="datafilebox"
        label="Atomic Coordinates (Angstroms)"
        multiline
        rows={12}
        value={
          data.length == 0 && props.molecularInput != null
            ? props.molecularInput.structure
            : data
        }
        onChange={(e) => {
          // setAtoms(e.target.value.split("\n").filter((i) => i).length);
          setData(e.target.value);
        }}
      />

      <Button variant="contained" onClick={renderMolecule}>
        Render
      </Button>

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
    </Stack>
  );
}
