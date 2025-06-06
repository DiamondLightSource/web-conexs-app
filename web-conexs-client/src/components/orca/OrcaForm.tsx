import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Skeleton, Stack } from "@mui/material";
import useOrcaSchema from "../../hooks/useOrcaSchema";
// import React3dMol from "./React3dMol";
import { postOrca } from "../../queryfunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MoleculeViewer from "../molecules/MoleculeViewer";

import CompactGroupRenderer, {
  CompactGroupTester,
} from "../renderers/CompactGroup";

const renderers = [
  ...materialRenderers,
  { tester: CompactGroupTester, renderer: CompactGroupRenderer },
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

  const callback = () => {
    window.alert("Thank you for your submission");
    navigate("/simulations");
  };

  const errorCallback = () => {
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

  if (data != null && data.molecular_structure_id != selectedMoleculeID) {
    setSelectedMoleculeId(data.molecular_structure_id);
  }

  return (
    <Stack
      className="jsonFormsContainer"
      direction="row"
      justifyContent="space-between"
      margin="5px"
      spacing="5px"
    >
      {hasData && data != null ? (
        <Stack direction="row" flex={1} spacing={"5px"}>
          <Stack flex={1}>
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
            <Button
              variant="contained"
              onClick={() => {
                const localData = { ...data };
                if (localData.solvent == "None") {
                  localData.solvent = null;
                }

                mutation.mutate(localData);
              }}
            >
              Submit Simulation
            </Button>
          </Stack>
          <Stack flex={1}>
            {selectedMoleculeID != null && (
              <MoleculeViewer id={selectedMoleculeID} />
            )}
          </Stack>
          <Box backgroundColor={"red"}></Box>
        </Stack>
      ) : (
        getPlacemarker(hasData && data == null)
      )}
    </Stack>
  );
}
