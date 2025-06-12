import { Alert, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { CrystalInput, MoleculeInput } from "../models";
import LatticeEditor from "./crystals/LatticeEditor";

interface LatticeParameter {
  a: number;
  b: number;
  c: number;
  alpha: number;
  beta: number;
  gamma: number;
  ibrav: string;
}

export default function XYZFileEditor(props: {
  structureInput: MoleculeInput | CrystalInput | null;
  setStructureInput: (
    structureInput: MoleculeInput | CrystalInput | null
  ) => void;
  isMolecule: boolean;
}) {
  const lp: LatticeParameter =
    !props.isMolecule &&
    props.structureInput != null &&
    "alpha" in props.structureInput
      ? {
          alpha: props.structureInput.alpha,
          beta: props.structureInput.beta,
          gamma: props.structureInput.gamma,
          a: props.structureInput.a,
          b: props.structureInput.b,
          c: props.structureInput.c,
          ibrav: props.structureInput.ibrav,
        }
      : {
          a: 1,
          b: 1,
          c: 1,
          alpha: 90,
          beta: 90,
          gamma: 90,
          ibrav: "0",
        };

  const [lattice, setLattice] = useState<LatticeParameter>(lp);

  const [data, setData] = useState<string>(
    props.structureInput != null ? props.structureInput.structure : ""
  );
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

  function renderMolecule() {
    const errors = validateMoleculeData(data);

    if (errors == "") {
      setIsError(false);
      const input = {
        label: props.structureInput.label,
        structure: data
          .split("\n")
          .filter((i) => i)
          .join("\n"),
      };

      if ("alpha" in props.structureInput) {
        input.alpha = lattice.alpha;
        input.beta = lattice.beta;
        input.gamma = lattice.gamma;
        input.a = lattice.a;
        input.b = lattice.b;
        input.c = lattice.c;
        input.ibrav = lattice.ibrav;
      }

      props.setStructureInput(input);
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
        value={props.structureInput == null ? " " : props.structureInput.label}
        onChange={(e) => {
          const newMolecule = {
            ...props.structureInput,
            label: e.target.value,
          };
          props.setStructureInput(newMolecule);
        }}
      />

      {!props.isMolecule && (
        <>
          <TextField
            id="ibrav"
            label="Bravis Index"
            value={
              props.structureInput == null ? " " : props.structureInput.ibrav
            }
            onChange={(e) => {
              const newLattice = {
                ...lattice,
              };
              newLattice.ibrav = e.target.value;

              setLattice(newLattice);
            }}
          />
          <LatticeEditor
            lattice={lattice}
            setLattice={setLattice}
          ></LatticeEditor>
        </>
      )}

      <TextField
        sx={{ width: "100%" }}
        id="datafilebox"
        label="Atomic Coordinates (Angstroms)"
        multiline
        rows={12}
        value={
          data.length == 0 && props.structureInput != null
            ? props.structureInput.structure
            : data
        }
        onChange={(e) => {
          // setAtoms(e.target.value.split("\n").filter((i) => i).length);
          setData(e.target.value);
        }}
      />

      <Button variant="contained" onClick={renderMolecule}>
        Update Viewer
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
