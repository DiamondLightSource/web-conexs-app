import { useEffect } from "react";
import useSimulationAPI from "../hooks/useSimulationAPI";
import XASChart from "./XASChart";
import { Box } from "@mui/material";

export default function FdmnesChart(props: { id: number }) {
  const { fdmnesXAS, getFdmnesSimulationXAS, fdmnesOutput } =
    useSimulationAPI();

  //   console.log(getFdmnesSimulationXAS);

  useEffect(() => {
    console.log("Use effect chart");
    getFdmnesSimulationXAS(props.id);
  }, [props.id]);

  console.log(fdmnesOutput);

  if (fdmnesXAS) {
    return <XASChart xas={fdmnesXAS}></XASChart>;
  } else {
    return <Box></Box>;
  }
}
