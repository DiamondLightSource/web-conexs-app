import { useCallback, useState } from "react";

import { Crystal, CrystalInput } from "../models";
import axios from "axios";
import useCRUD from "./useCRUD";

const crystalUrl = "/api/crystals";

export default function useCrystalAPI() {
  // const [molecule, setMolecule] = useState<Molecule | null>(null);
  const [crystalList, setCrystalList] = useState<Crystal[] | null>(null);
  const [newCrystal, setNewCrystal] = useState<CrystalInput | null>(null);
  const { data, getData, loadingStatus, dataList, insertData } = useCRUD<
    Crystal,
    CrystalInput
  >(crystalUrl);

  function getCrystal(id: number) {
    getData(id);
  }

  const getCrystals = useCallback(() => {
    axios.get(crystalUrl).then((res) => {
      setCrystalList(res.data);
    });
  }, []);

  function insertCrystal(crystalInput: CrystalInput, callbackDone: () => void) {
    insertData(crystalInput, callbackDone);
  }

  return {
    data,
    getCrystal,
    insertCrystal,
    getCrystals,
    crystalList,
    newCrystal,
    setNewCrystal,
    loadingStatus,
    dataList,
  };
}
