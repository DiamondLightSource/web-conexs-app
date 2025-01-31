import { useState } from "react";

import { Molecule, MoleculeInput } from "../models";
import axios from "axios";
import { AxiosError } from "axios";

const moleculeUrl = "/api/molecules";

export default function useMoleculeAPI() {
  const [molecule, setMolecule] = useState<Molecule | null>(null);
  const [moleculeList, setMoleculeList] = useState<Molecule[] | null>(null);
  const [newMolecule, setNewMolecule] = useState<MoleculeInput | null>(null);

  function getMolecule(id: number) {
    axios.get(moleculeUrl + "/" + id).then((res) => {
      setMolecule(res.data);
    });
  }

  function getMolecules() {
    axios.get(moleculeUrl).then((res) => {
      setMoleculeList(res.data);
    });
  }

  function insertMolecule(moleculeInput: MoleculeInput) {
    axios
      .post(moleculeUrl, moleculeInput)
      .then((res) => {
        window.alert("Thank you for your submission");
        setMolecule(res.data);
      })
      .catch((reason: AxiosError) => {
        window.alert(reason.message);
      });
  }

  return {
    molecule,
    getMolecule,
    insertMolecule,
    getMolecules,
    moleculeList,
    newMolecule,
    setNewMolecule,
  };
}
