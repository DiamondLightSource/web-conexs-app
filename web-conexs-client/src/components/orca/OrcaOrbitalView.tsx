import { Box, Stack, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getOrcaCubeInfo } from "../../queryfunctions";
import OrbitalTable from "./OrbitalTable";
import OrcaOrbitalViewer from "./OrcaOrbitalViewer";
import { useState } from "react";

export default function OrcaOrbitalView(props: { id: number }) {
  const query = useQuery({
    queryKey: ["orca", "cube", props.id],
    queryFn: () => getOrcaCubeInfo(props.id),
  });

  const [selectedCubeId, setSelectedCubeID] = useState(0);
  const [isoValue, setIsoValue] = useState(1);

  return (
    <Stack direction="row" margin={"5px"}>
      <Stack margin={"5px"} spacing={"15px"}>
        <OrbitalTable
          orbitals={query.data ? query.data : []}
          setCubeID={setSelectedCubeID}
        />
        <TextField
          id="outlined-number"
          label="Iso-Surface Value"
          type="number"
          value={isoValue}
          onChange={(e) => {
            setIsoValue(parseFloat(e.target.value));
          }}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </Stack>
      {query.data ? (
        <Box
          height="100%"
          width="
        100%"
        >
          <OrcaOrbitalViewer
            cubeID={query.data[selectedCubeId].index}
            isoValue={isoValue}
            id={props.id}
          />
        </Box>
      ) : (
        <Typography>No Cube Files</Typography>
      )}
    </Stack>
  );
}
