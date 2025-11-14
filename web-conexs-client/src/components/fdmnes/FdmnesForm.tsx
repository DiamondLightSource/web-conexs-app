import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Paper, Skeleton, Stack } from "@mui/material";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFdmnes } from "../../queryfunctions";
import { useNavigate } from "react-router-dom";

import { CompactGroup, CompactGroupTester } from "../renderers/CompactGroup";
import StructureViewer from "../StructureViewer";
import { FDMNESSimulationInput } from "../../models";
import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import FdmnesGuide from "./FdmnesGuide";
import { useState } from "react";
import StateIconButton from "../StateIconButton";
import PublishIcon from "@mui/icons-material/Publish";

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

  const [disabled, setDisabled] = useState(false);
  const [state, setState] = useState<"ok" | "running" | "error" | "default">(
    "default"
  );

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
    setState("ok");
    setDisabled(false);
    window.alert("Thank you for your submission");
    navigate("/simulations");
  };

  const errorCallback = () => {
    setState("error");
    setDisabled(false);
    window.alert("Error Submitting Job!");
  };

  const resetState = () => {
    setState("default");
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
                <StateIconButton
                  endIcon={<PublishIcon />}
                  resetState={resetState}
                  state={state}
                  disabled={disabled}
                  variant="contained"
                  onClick={() => {
                    setDisabled(true);
                    setState("running");
                    const localData = { ...props.data };
                    mutation.mutate(localData);
                  }}
                >
                  Submit Simulation
                </StateIconButton>
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
