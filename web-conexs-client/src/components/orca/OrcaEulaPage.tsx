import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PublishIcon from "@mui/icons-material/Publish";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { patchUser } from "../../queryfunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MainPanel from "../MainPanel";
import StateIconButton from "../StateIconButton";
import useStateIconButton from "../useStateIconButton";
import { useState } from "react";

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
      setSubmitting(false);
      setState("ok");
    },
    onError: () => {
      setState("error");
      setSubmitting(false);
    },
  });

  const { state, setState, resetState } = useStateIconButton();
  const [submitting, setSubmitting] = useState(false);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    setSubmitting(true);
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
              <Divider />
              <Box component="form" onSubmit={submitHandler} margin="10px">
                <Stack alignItems="center">
                  <FormControlLabel
                    required
                    control={<Checkbox />}
                    label="I have read the ORCA EULA and confirm that my use falls within the terms defined within"
                  />
                  <StateIconButton
                    type="submit"
                    endIcon={<PublishIcon />}
                    resetState={resetState}
                    state={state}
                    disabled={submitting}
                    variant="contained"
                  >
                    Submit Simulation
                  </StateIconButton>
                  {/* <Button variant="contained" type="submit">
                    Submit
                  </Button> */}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Stack>
    </MainPanel>
  );
}
