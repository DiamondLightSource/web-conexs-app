import { Card, CardContent, Stack, Typography } from "@mui/material";
import MatProj from "../icons/MatProj";
import { Link } from "react-router-dom";

export default function MatProjGuide() {
  return (
    <Stack flex={1} spacing={"20px"} margin={"20px"}>
      <Card>
        <CardContent>
          <Stack direction="row" spacing={"10px"}>
            <MatProj />
            <Typography variant="h6">Materials Project API</Typography>
          </Stack>
          <Typography gutterBottom margin="10px">
            Harnessing the power of supercomputing and state-of-the-art methods,
            the Materials Project provides open web-based access to computed
            information on known and predicted materials as well as powerful
            analysis tools to inspire and design novel materials.
          </Typography>
          <Typography gutterBottom margin="10px">
            If using Materials Project structures please cite the articles
            described here:{" "}
            <Link
              to="https://next-gen.materialsproject.org/about/cite"
              target="_blank"
            >
              About Materials Project
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
