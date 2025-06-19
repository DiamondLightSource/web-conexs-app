import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Skeleton, Stack } from "@mui/material";
import { useFDMNESSchema } from "../../hooks/useFdmnesSchema";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFdmnes } from "../../queryfunctions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import CompactGroupRenderer, {
  CompactGroupTester,
} from "../renderers/CompactGroup";
import StructureViewer from "../StructureViewer";

const renderers = [
  ...materialRenderers,
  { tester: CompactGroupTester, renderer: CompactGroupRenderer },
];

export default function FdmnesForm(props: { isCrystal: boolean }) {
  const [selectedStructureID, setSelectedStructureId] = useState<null | number>(
    null
  );
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

  const { data, setData, schema, uischema, hasData } = useFDMNESSchema(
    props.isCrystal
  );

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
                setSelectedStructureId(
                  props.isCrystal
                    ? data.crystal_structure_id
                    : data.molecular_structure_id
                );
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                const localData = { ...data };
                mutation.mutate(localData);
              }}
            >
              Submit Simulation
            </Button>
          </Stack>
          <Stack flex={1}>
            {selectedStructureID != null && (
              <StructureViewer
                id={selectedStructureID}
                isCrystal={props.isCrystal}
              />
            )}
          </Stack>
        </Stack>
      ) : (
        getPlacemarker(hasData && data == null)
      )}
    </Stack>
  );
}
