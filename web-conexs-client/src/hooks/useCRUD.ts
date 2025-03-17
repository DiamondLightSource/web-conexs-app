import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";

const LOADING_STATES = ["loading", "error", "success"];

export default function useCRUD<A extends object, B extends object>(
  url: string
) {
  const [data, setData] = useState<A | null>(null);
  data;
  const [dataList, setDataList] = useState<A[]>([]);
  const [error, setError] = useState();
  const [loadingStatus, setLoadingStatus] = useState("loading");

  useEffect(() => {
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
  }, [url]);

  function getData(id: number) {
    setLoadingStatus(LOADING_STATES[0]);

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
  }

  function insertData(input: B, callbackDone: () => void) {
    axios
      .post(url, input)
      .then((res) => {
        if (callbackDone) callbackDone();
      })
      .catch((reason: AxiosError) => {
        if (callbackDone) callbackDone();
      });
  }

  return { data, getData, loadingStatus, dataList, insertData };
}
