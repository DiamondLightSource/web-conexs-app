import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Grid2, Skeleton } from "@mui/material";
import useFDMNESSchema from "../hooks/useFdmnesAPI";

import React3dMol from "./React3dMol";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postFdmnes } from "../queryfunctions";
import { useNavigate } from "react-router-dom";

export default function FdmnesForm() {
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

  const { data, setData, schema, uischema, hasData, getCrystal, crystal } =
    useFDMNESSchema();

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
              getCrystal(data.crystal_structure_id);
            }}
          />
        ) : (
          <Skeleton animation="wave" width={210} height={118} />
        )}
      </Grid2>
      <Grid2 size={6}>
        <Box height="100%vh">
          <React3dMol
            moleculedata={crystal}
            color="#3465A4"
            style="Stick"
            orbital={null}
          ></React3dMol>
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
