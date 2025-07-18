import { Chip, useTheme } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import { useQuery } from "@tanstack/react-query";
import { getClusterStatus } from "../queryfunctions";

export default function ClusterBadge() {
  const theme = useTheme();
  const query = useQuery({
    queryKey: ["cluster"],
    queryFn: getClusterStatus,
    refetchInterval: 5000,
  });

  let background = theme.palette.background.default;

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
        }
      }
    }
  }

  return (
    <Chip
      sx={{ backgroundColor: background }}
      size="large"
      variant="outlined"
      label="HPC"
      icon={<StorageIcon></StorageIcon>}
    ></Chip>
  );
}
