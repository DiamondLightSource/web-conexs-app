import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Grid2, Skeleton } from "@mui/material";
import useFDMNESSchema from "../hooks/useFdmnesSchema";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFdmnes } from "../queryfunctions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CrystalViewer from "./CrystalViewer";

export default function FdmnesForm() {
  const [selectedCrystalID, setSelectedCrystalId] = useState<null | number>(
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
    navigate("/simulation");
  };

  const errorCallback = () => {
    window.alert("Error Submitting Job!");
  };


  const { data, setData, schema, uischema, hasData } = useFDMNESSchema();

  if (data != null && data.crystal_structure_id != selectedCrystalID) {
    setSelectedCrystalId(data.crystal_structure_id);
  }

  return (
    <Grid2 container>
      <Grid2 size={6} className="jsonFormsContainer">
        {hasData ? (
          <JsonForms
            schema={schema}
            data={data}
            renderers={materialRenderers}
            uischema={uischema}
            cells={materialCells}
            onChange={({ data }) => {
              setData(data);
              setSelectedCrystalId(data.crystal_structure_id);
            }}
          />
        ) : (
          <Skeleton animation="wave" width={210} height={118} />
        )}
      </Grid2>
      <Grid2 size={6}>
        <Box height="100%vh">
          {selectedCrystalID && <CrystalViewer id={selectedCrystalID} />}
        </Box>
      </Grid2>
      <Grid2 size={12}>
        <Button
          onClick={() => {
            const localData = { ...data };
            mutation.mutate(localData);
          }}
        >
          Submit Simulation
        </Button>
      </Grid2>
    </Grid2>
  );
}
