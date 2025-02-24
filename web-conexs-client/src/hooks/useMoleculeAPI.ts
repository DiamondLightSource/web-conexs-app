import { useCallback, useState } from "react";

import { Molecule, MoleculeInput } from "../models";
import axios from "axios";
import { AxiosError } from "axios";
import useCRUD from "./useCRUD";

const moleculeUrl = "/api/molecules";

export default function useMoleculeAPI() {
  // const [molecule, setMolecule] = useState<Molecule | null>(null);
  const [moleculeList, setMoleculeList] = useState<Molecule[] | null>(null);
  const [newMolecule, setNewMolecule] = useState<MoleculeInput | null>(null);
  const { data, getData, loadingStatus, dataList, insertData } =
    useCRUD<Molecule, MoleculeInput>(moleculeUrl);

  function getMoleculeGeneric(id: number) {
    getData(id);
  }

  function getMolecule(id: number) {
    getData(id)
  }

  const getMolecules = useCallback(() => {
    axios.get(moleculeUrl).then((res) => {
      setMoleculeList(res.data);
    });
  }, []);

  function insertMolecule(moleculeInput: MoleculeInput) {
    insertData(moleculeInput)
  }

  return {
    data,
    getMolecule,
    insertMolecule,
    getMolecules,
    moleculeList,
    newMolecule,
    setNewMolecule,
    getMoleculeGeneric,
    loadingStatus,
    dataList,
  };
}
