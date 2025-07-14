import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFdmnes } from "../../queryfunctions";
import { Link, useNavigate } from "react-router-dom";

import CompactGroupRenderer, {
  CompactGroupTester,
} from "../renderers/CompactGroup";
import StructureViewer from "../StructureViewer";
import { FDMNESSimulationInput } from "../../models";
import { JsonSchema, UISchemaElement } from "@jsonforms/core";

const renderers = [
  ...materialRenderers,
  { tester: CompactGroupTester, renderer: CompactGroupRenderer },
];

export default function FdmnesForm(props: {
  data: FDMNESSimulationInput;
  schema: JsonSchema;
  uischema: UISchemaElement;
  setData: (newData: FDMNESSimulationInput) => void;
  hasData: boolean;
}) {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: postFdmnes,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["fdmnes"] });
      callback();
    },
    onError: () => {
      errorCallback();
    },
  });

  const queryClient = useQueryClient();
  const callback = () => {
    window.alert("Thank you for your submission");
    navigate("/simulations");
  };

  const errorCallback = () => {
    window.alert("Error Submitting Job!");
  };

  function getPlacemarker(noCrystals: boolean) {
    if (!noCrystals) {
      return <Skeleton width={"100%"} height={"100%"} />;
    } else {
      return <Box>First create a crystal</Box>;
    }
  }

  return (
    <Stack
      className="jsonFormsContainer"
      direction="row"
      justifyContent="space-between"
      margin="5px"
      spacing="5px"
    >
      {props.hasData && props.data != null ? (
        <Stack direction="row" flex={1} spacing={"5px"}>
          <Stack flex={1}>
            <JsonForms
              schema={props.schema}
              data={props.data}
              renderers={renderers}
              uischema={props.uischema}
              cells={materialCells}
              onChange={({ data }) => {
                props.setData(data);
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                const localData = { ...props.data };
                mutation.mutate(localData);
              }}
            >
              Submit Simulation
            </Button>
          </Stack>
          <Stack flex={1}>
            <StructureViewer id={props.data.chemical_structure_id} />
          </Stack>
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
            elevation={3}
          >
            <Stack flex={1} spacing={"2px"} margin={"3px"}>
              <Typography>
                The FDMNES project is developed in the SIN team, Institut Néel,
                CNRS, Grenoble, France
              </Typography>
              <Typography variant="body2">
                Additional information can be found here:
              </Typography>
              <Link
                to="https://cloud.neel.cnrs.fr/index.php/s/nL2c6kH2PLwcB5r"
                target="_blank"
              >
                FDMNES manual
              </Link>
              <Link to="https://fdmnes.neel.cnrs.fr/" target="_blank">
                FDMNES webpage
              </Link>
              <Typography variant="body2">
                If you publish calculation results performed with FDMNES code
                please cite the original papers:
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} variant="body2">
                J. Phys.: Condens. Matter 21, 345501 (2009).
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} variant="body2">
                J. Chem. Theory Comput. 11, 4512-4521 (2015).
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} variant="body2">
                J. Synchrotron Rad. 23, 551-559 (2016).
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      ) : (
        getPlacemarker(props.hasData && props.data == null)
      )}
    </Stack>
  );
}
