import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Paper, Skeleton, Stack } from "@mui/material";
import useOrcaSchema from "../../hooks/useOrcaSchema";
import { postOrca } from "../../queryfunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { CompactGroup, CompactGroupTester } from "../renderers/CompactGroup";
import StructureViewer from "../StructureViewer";
import OrcaGuide from "./OrcaGuide";
import StateIconButton from "../StateIconButton";
import PublishIcon from "@mui/icons-material/Publish";

const renderers = [
  ...materialRenderers,
  { tester: CompactGroupTester, renderer: CompactGroup },
];

function getPlacemarker(noMolecules: boolean) {
  if (!noMolecules) {
    return <Skeleton width={"100%"} height={"100%"} />;
  } else {
    return <Box>First create a molecule</Box>;
  }
}

export default function OrcaForm() {
  const [selectedMoleculeID, setSelectedMoleculeId] = useState<null | number>(
    null
  );
  const { data, setData, schema, uischema, hasData } = useOrcaSchema();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [disabled, setDisabled] = useState(false);
  const [state, setState] = useState<"ok" | "running" | "error" | "default">(
    "default"
  );

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

  const mutation = useMutation({
    mutationFn: postOrca,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["orca"] });
      callback();
    },
    onError: () => {
      errorCallback();
    },
  });

  if (data != null && data.chemical_structure_id != selectedMoleculeID) {
    setSelectedMoleculeId(data.chemical_structure_id);
  }

  const resetState = () => {
    setState("default");
  };

  return (
    <Stack
      className="jsonFormsContainer"
      direction="row"
      justifyContent="space-between"
      margin="10px"
      spacing="5px"
      overflow="auto"
    >
      {hasData && data != null ? (
        <Stack
          flex={1}
          spacing={"5px"}
          direction={{ sm: "column", md: "row" }}
          align-content={"stretch"}
          margin={"10px"}
        >
          <Stack flex={1} margin={"10px"} spacing="10px">
            <Paper margin={"10px"} spacing="10px" elevation={16}>
              <Stack flex={1} margin={"10px"} spacing="10px">
                <JsonForms
                  schema={schema}
                  data={data}
                  renderers={renderers}
                  uischema={uischema}
                  cells={materialCells}
                  onChange={({ data }) => {
                    setData(data);
                    setSelectedMoleculeId(data.molecular_structure_id);
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
                    const localData = { ...data };
                    if (localData.solvent == "None") {
                      localData.solvent = null;
                    }

                    mutation.mutate(localData);
                  }}
                >
                  Submit Simulation
                </StateIconButton>
              </Stack>
            </Paper>

            {selectedMoleculeID != null && (
              <StructureViewer id={selectedMoleculeID} />
            )}
          </Stack>
          <OrcaGuide></OrcaGuide>
        </Stack>
      ) : (
        getPlacemarker(hasData && data == null)
      )}
    </Stack>
  );
}
