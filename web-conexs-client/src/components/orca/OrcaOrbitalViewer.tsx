import { useQuery } from "@tanstack/react-query";
import { getOrcaCube } from "../../queryfunctions";
import { Box } from "@mui/material";
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

  return (
    <Box height="100%" width="100%">
      <MolStarOrbitalWrapper
        cube={query.data}
        isoValue={props.isoValue}
      ></MolStarOrbitalWrapper>
    </Box>
  );
}
