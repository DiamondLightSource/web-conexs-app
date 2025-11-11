import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Paper, Skeleton, Stack } from "@mui/material";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFdmnes } from "../../queryfunctions";
import { useNavigate } from "react-router-dom";

import { CompactGroup, CompactGroupTester } from "../renderers/CompactGroup";
import StructureViewer from "../StructureViewer";
import { FDMNESSimulationInput } from "../../models";
import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import FdmnesGuide from "./FdmnesGuide";

const renderers = [
  ...materialRenderers,
  { tester: CompactGroupTester, renderer: CompactGroup },
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
      overflow="auto"
    >
      {props.hasData && props.data != null ? (
        <Stack
          direction={{ sm: "column", md: "row" }}
          flex={1}
          spacing={"5px"}
          align-content={"stretch"}
          margin={"10px"}
        >
          <Stack flex={1} margin={"10px"} spacing="10px">
            <Paper margin={"10px"} spacing="10px" elevation={16}>
              <Stack flex={1} margin={"10px"} spacing="10px">
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
            </Paper>
            <StructureViewer id={props.data.chemical_structure_id} />
          </Stack>

          <FdmnesGuide />
        </Stack>
      ) : (
        getPlacemarker(props.hasData && props.data == null)
      )}
    </Stack>
  );
}
