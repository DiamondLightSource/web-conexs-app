import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Grid2, Skeleton } from "@mui/material";
import useOrcaSchema from "../hooks/useOrcaSchema";
import useSimulationAPI from "../hooks/useSimulationAPI";
import React3dMol from "./React3dMol";

export default function OrcaForm() {
  const { data, setData, schema, uischema, hasData, getMolecule, molecule } =
    useOrcaSchema();
  const { postOrcaSimulation } = useSimulationAPI();

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
            onChange={({ data, _errors }) => {
              setData(data);
              getMolecule(data.molecular_structure_id);
            }}
          />
        ) : (
          <Skeleton animation="wave" width={210} height={118} />
        )}
      </Grid2>
      <Grid2 size={6}>
        <Box height="100%vh">
          <React3dMol
            moleculedata={molecule}
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
            if (localData.solvent == "None") {
              localData.solvent = null;
            }

            postOrcaSimulation(localData);
          }}
        >
          Submit Simulation
        </Button>
      </Grid2>
    </Grid2>
  );
}
