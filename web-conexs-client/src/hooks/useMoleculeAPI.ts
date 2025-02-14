import { useCallback, useState } from "react";

import { Molecule, MoleculeInput } from "../models";
import axios from "axios";
import { AxiosError } from "axios";
import useCRUD from "./useCRUD";

const moleculeUrl = "/api/molecules";

export default function useMoleculeAPI() {
  const [molecule, setMolecule] = useState<Molecule | null>(null);
  const [moleculeList, setMoleculeList] = useState<Molecule[] | null>(null);
  const [newMolecule, setNewMolecule] = useState<MoleculeInput | null>(null);
  const { data, getData, loadingStatus, dataList } =
    useCRUD<Molecule>(moleculeUrl);

  function getMoleculeGeneric(id: number) {
    getData(id);
  }

  function getMolecule(id: number) {
    axios.get(moleculeUrl + "/" + id).then((res) => {
      setMolecule(res.data);
    });
  }

  const getMolecules = useCallback(() => {
    axios.get(moleculeUrl).then((res) => {
      setMoleculeList(res.data);
    });
  }, []);

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
    data,
    getMoleculeGeneric,
    loadingStatus,
    dataList,
  };
}
