import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Grid2, Skeleton } from "@mui/material";
import useOrcaSchema from "../hooks/useOrcaSchema";
// import React3dMol from "./React3dMol";
import { postOrca } from "../queryfunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import OrcaMoleculeViewer from "./OrcaMoleculeViewer";

export default function OrcaForm() {
  const [selectedMoleculeID, setSelectedMoleculeId] = useState<null | number>(
    null
  );
  const { data, setData, schema, uischema, hasData } = useOrcaSchema();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const callback = () => {
    window.alert("Thank you for your submission");
    navigate("/simulation");
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
              setSelectedMoleculeId(data.molecular_structure_id);
            }}
          />
        ) : (
          <Skeleton animation="wave" width={210} height={118} />
        )}
      </Grid2>
      <Grid2 size={6}>
        <Box height="100%vh">
          {selectedMoleculeID != null && (
            <OrcaMoleculeViewer orcaSimulationid={selectedMoleculeID} />
          )}
        </Box>
      </Grid2>
      <Grid2 size={12}>
        <Button
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
      </Grid2>
    </Grid2>
  );
}
