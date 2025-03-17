import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Grid, Grid2, Skeleton } from "@mui/material";
import useFDMNESSchema from "../hooks/useFdmnesAPI";
import useSimulationAPI from "../hooks/useSimulationAPI";
import React3dMol from "./React3dMol";
// import useSimulationAPI from "../hooks/useSimulationAPI";

export default function FdmnesForm() {
  const { data, setData, schema, uischema, hasData, getCrystal, crystal } =
    useFDMNESSchema();
  const { postFdmnesSimulation } = useSimulationAPI();

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
            console.log(localData);
            postFdmnesSimulation(localData);
          }}
        >
          Submit Simulation
        </Button>
      </Grid2>
    </Grid2>
  );
}
