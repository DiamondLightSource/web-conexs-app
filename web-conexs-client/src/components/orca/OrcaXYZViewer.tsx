import { Box, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getOrcaXyz } from "../../queryfunctions";
import { MolStarMoleculeWrapper } from "../MolstarMoleculeViewer";

export default function OrcaXYZViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["orca", "xyz", props.id],
    queryFn: () => getOrcaXyz(props.id),
  });

  return (
    <Stack direction={"row"} overflow="hidden">
      <Box overflow="auto" sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontFamily: "Monospace",
            whiteSpace: "pre-wrap",
            overflowY: "auto",
          }}
        >
          {query.data ? query.data : "No XYZ"}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <MolStarMoleculeWrapper xyz={query.data}></MolStarMoleculeWrapper>
      </Box>
    </Stack>
  );
}
