import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { patchUser } from "../../queryfunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MainPanel from "../MainPanel";

export default function OrcaEulaPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: patchUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/orca");
      navigate(0);
    },
  });

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };
  return (
    <MainPanel>
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
            To use ORCA through the CONEXS platform you must agree to the terms
            of the ORCA End User Licence Agreement.
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
    </MainPanel>
  );
}
