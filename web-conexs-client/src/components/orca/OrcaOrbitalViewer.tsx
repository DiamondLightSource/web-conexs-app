import { useQuery } from "@tanstack/react-query";
import { getOrcaCube } from "../../queryfunctions";
import { Box } from "@mui/material";
import React3dMolOrbital from "../React3dMolOrbital";
import { MolStarOrbitalWrapper } from "../MolstarOrbitalViewer";

export default function OrcaOrbitalViewer(props: {
  id: number;
  cubeID: number;
  isoValue: number;
}) {
  const query = useQuery({
    queryKey: ["orca", "cube", props.id, props.cubeID],
    queryFn: () => getOrcaCube(props.id, props.cubeID),
  });

  const trans = {
    positiveColor: "#FF0000",
    negativeColor: "#0000FF",
    positiveMin: props.isoValue,
    positiveMax: 0.1,
    negativeMin: props.isoValue,
    negativeMax: 0.1,
    isosurface: true,
  };

  return (
    <Box height="100%" width="100%">
      <MolStarOrbitalWrapper cube={query.data}></MolStarOrbitalWrapper>
      {/* <React3dMolOrbital
        orbital={{
          transferfn: trans,
          cubeData: query.data ? query.data : null,
        }}
      /> */}
    </Box>
  );
}
