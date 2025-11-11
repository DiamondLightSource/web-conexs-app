import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { patchUser } from "../../queryfunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MainPanel from "../MainPanel";

export default function OrcaEulaPage() {
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
    <MainPanel
      toolbarElements={
        <Typography variant="h5">Orca End-User Licence Agreement</Typography>
      }
    >
      <Stack margin="20px">
        <Container>
          <Card>
            <CardContent>
              <Typography variant="h6" margin="10px">
                ORCA is free for Academic use only.
              </Typography>
              <Typography gutterBottom margin="10px">
                To use ORCA through the CONEXS platform you must agree to the
                terms of the ORCA End User Licence Agreement.
              </Typography>
              <Box margin="10px">
                <Link
                  to="https://orcaforum.kofo.mpg.de/app.php/privacypolicy/policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Stack direction="row">
                    <Typography>ORCA EULA</Typography>
                    <OpenInNewIcon></OpenInNewIcon>
                  </Stack>
                </Link>
              </Box>
              <Box component="form" onSubmit={submitHandler} margin="10px">
                <FormControlLabel
                  required
                  control={<Checkbox />}
                  label="I have read the ORCA EULA and confirm that my use falls within the terms defined within"
                />
              </Box>
              <Button variant="contained" type="submit">
                Submit
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Stack>
    </MainPanel>
  );
}
