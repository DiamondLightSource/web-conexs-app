import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { patchUser } from "../../queryfunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function OrcaEulaPage() {
  const theme = useTheme();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: patchUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const submitHandler = (e) => {
    e.preventDefault();
    mutation.mutate();
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="stretch"
      flex={1}
      minHeight={0}
    >
      <Paper
        flex={1}
        sx={{
          margin: "20px",
          flex: 1,
          minHeight: 0,
          alignItems: "stretch",
          display: "flex",
          flexDirection: "column",
          spacing: "2px",
        }}
        elevation={12}
      >
        <Stack flex={1}>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.palette.action.disabled,
              borderRadius: "4px 4px 0px 0px",
            }}
          >
            <Typography variant="h5" component="div">
              Orca End-User Licence Agreement
            </Typography>
          </Toolbar>
          <Stack>
            <Typography>ORCA is free for Academic use.</Typography>
            <Typography>
              To use ORCA through the CONEXS platform you must agree to the
              terms of the ORCA End User Licence Agreement.
            </Typography>

            <Link
              to="https://orcaforum.kofo.mpg.de/app.php/privacypolicy/policy"
              target="_blank"
            >
              <Stack direction="row">
                <Typography>ORCA EULA</Typography>
                <OpenInNewIcon></OpenInNewIcon>
              </Stack>
            </Link>
            <Box component="form" onSubmit={submitHandler}>
              <FormControlLabel
                required
                control={<Checkbox />}
                label="I have read the ORCA EULA and confirm that my use falls within the terms defined within"
              />
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
