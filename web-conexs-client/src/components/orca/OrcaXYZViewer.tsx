import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getOrcaXyz } from "../../queryfunctions";
import { MolStarMoleculeWrapper } from "../MolstarMoleculeViewer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { cleanOrcaXYZ } from "../../utils";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

function getCopyIcon(state: string) {
  if (state == "ok") {
    return <CheckCircleIcon />;
  } else if (state == "failed") {
    return <ErrorIcon />;
  }

  return <ContentCopyIcon />;
}

export default function OrcaXYZViewer(props: { id: number }) {
  const query = useQuery({
    queryKey: ["orca", "xyz", props.id],
    queryFn: () => getOrcaXyz(props.id),
  });

  const [copyState, setCopyState] = useState<"default" | "ok" | "failed">(
    "default"
  );

  const handleCopy = async () => {
    try {
      if (query.data == null) {
        return;
      }

      const xyz = cleanOrcaXYZ(query.data);

      await navigator.clipboard.writeText(xyz);
      setCopyState("ok");
      setTimeout(() => setCopyState("default"), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopyState("failed");
      setTimeout(() => setCopyState("default"), 2000);
    }
  };

  return (
    <Stack direction={"row"} overflow="hidden" spacing="10px">
      <Stack spacing="10px">
        <Button variant="contained" onClick={handleCopy}>
          {getCopyIcon(copyState)}
        </Button>
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
      </Stack>
      <Box sx={{ flex: 1 }}>
        <MolStarMoleculeWrapper xyz={query.data}></MolStarMoleculeWrapper>
      </Box>
    </Stack>
  );
}
