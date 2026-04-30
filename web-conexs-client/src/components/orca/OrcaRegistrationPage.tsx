import {
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import MainPanel from "../MainPanel";

export default function OrcaRegistrationPage() {
  return (
    <MainPanel
      toolbarElements={
        <Typography variant="h5">Orca Registration Required</Typography>
      }
    >
      <Stack margin="20px">
        <Container>
          <Card>
            <CardContent>
              <Stack spacing={"10px"}>
                <Typography variant="h6" margin="10px 10px">
                  ORCA is free for Academic use only.
                </Typography>
                <Typography variant="h7" margin="10px 10px">
                  To use ORCA through the Web-Conexs portal you must register
                  at:
                </Typography>
                <Container>
                  <Link
                    href="https://orcaforum.kofo.mpg.de/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://orcaforum.kofo.mpg.de/
                  </Link>
                </Container>
                <Typography variant="h7" margin="10px 10px">
                  If you accept the terms of the EULA you are eligible to run
                  ORCA jobs through Web-Conexs, forward the confirmation email
                  to{" "}
                  <Link href="mailto:conexs@diamond.ac.uk">
                    conexs@diamond.ac.uk
                  </Link>{" "}
                  including your FedID in the forwarded message and you will be
                  added to the ORCA users list.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Stack>
    </MainPanel>
  );
}
