import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";

const LOADING_STATES = ["loading", "error", "success"];

export default function useCRUD<A extends object>(url: string) {
  const [data, setData] = useState<A>();
  const [dataList, setDataList] = useState<A[]>([]);
  const [error, setError] = useState();
  const [loadingStatus, setLoadingStatus] = useState("loading");

  useEffect(() => {
    function getDataUseEffect() {
      axios
        .get(url)
        .then((result) => {
          setDataList(result.data);
          setLoadingStatus(LOADING_STATES[2]);
        })
        .catch((e) => {
          setError(e);
          setLoadingStatus(LOADING_STATES[1]);
        });
    }
    setTimeout(getDataUseEffect, 2000);
  }, [url]);

  function getData(id: number) {
    setLoadingStatus(LOADING_STATES[0]);

    const doGet = () => {
      axios
        .get(url + "/" + id)
        .then((result) => {
          setData(result.data);
          setLoadingStatus(LOADING_STATES[2]);
        })
        .catch((e) => {
          setError(e);
          setLoadingStatus(LOADING_STATES[1]);
        });
    };

    setTimeout(doGet, 5000);
  }

  return { data, getData, loadingStatus, dataList };
}
