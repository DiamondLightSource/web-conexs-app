import { Box, Chip, Tooltip, useTheme } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import { useQuery } from "@tanstack/react-query";
import { getClusterStatus } from "../queryfunctions";

export default function ClusterBadge() {
  const theme = useTheme();
  const query = useQuery({
    queryKey: ["cluster"],
    queryFn: getClusterStatus,
    refetchInterval: 30000,
  });

  let background = theme.palette.background.default;
  let status =
    "CONEXS HPC cluster is currently offline, simulations can be requested, but will not be submitted until the cluser is operational";

  if (!(query.data == undefined)) {
    background = theme.palette.error.dark;

    const datestring = query.data.updated;
    if (datestring != null) {
      //time stamp stored in database as UTC without timezone
      const date = Date.parse(datestring + "+00:00");

      if (!isNaN(date)) {
        const dif = Date.now() - date;

        if (dif < 120000) {
          background = theme.palette.success.dark;
          status =
            "CONEXS HPC cluster is currently online, requested simulations will be submitted immediately.";
        }
      }
    }
  }

  return (
    <Tooltip title={status} arrow>
      <Box>
        <Chip
          sx={{
            backgroundColor: background,
            color: theme.palette.primary.contrastText,
          }}
          size="large"
          variant="outlined"
          label="HPC"
          icon={
            <StorageIcon
              color={theme.palette.primary.contrastText}
            ></StorageIcon>
          }
        ></Chip>
      </Box>
    </Tooltip>
  );
}
