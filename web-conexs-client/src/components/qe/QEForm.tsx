import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { INIT, UPDATE_CORE, UPDATE_DATA } from "@jsonforms/core";
import { Box, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postQe } from "../../queryfunctions";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import CrystalViewer from "../crystals/CrystalViewer";

import CompactGroupRenderer, {
  CompactGroupTester,
} from "../renderers/CompactGroup";
import useQESchema from "../../hooks/useQESchema";

const renderers = [
  ...materialRenderers,
  { tester: CompactGroupTester, renderer: CompactGroupRenderer },
];

export default function QEForm() {
  const [selectedCrystalID, setSelectedCrystalId] = useState<null | number>(
    null
  );
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: postQe,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["qe"] });
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

  const { data, setData, schema, uischema, hasData } = useQESchema();

  if (data != null && data.crystal_structure_id != selectedCrystalID) {
    setSelectedCrystalId(data.crystal_structure_id);
  }

  function getPlacemarker(noCrystals: boolean) {
    if (!noCrystals) {
      return <Skeleton width={"100%"} height={"100%"} />;
    } else {
      return <Box>First create a crystal</Box>;
    }
  }

  const middleware = (state, action, defaultReducer) => {
    const newState = defaultReducer(state, action);
    switch (action.type) {
      case INIT:
      case UPDATE_CORE:
      case UPDATE_DATA: {
        console.log(newState);
        return newState;
      }
      default:
        return newState;
    }
  };

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
              middleware={middleware}
              uischema={uischema}
              cells={materialCells}
              onChange={({ data }) => {
                setData(data);
                setSelectedCrystalId(data.crystal_structure_id);
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
            {selectedCrystalID != null && (
              <CrystalViewer id={selectedCrystalID} />
            )}
          </Stack>
          <Paper
            flex={1}
            sx={{
              margin: "20px",
              flex: 1,
              minHeight: 0,
              alignItems: "stretch",
              display: "flex",
              flexDirection: "column",
              spacing: "2px",
            }}
            elevation={3}
          >
            <Stack flex={1} spacing={"2px"} margin={"3px"}>
              <Typography>
                Quantum ESPRESSO (Quantum opEn-Source Package for Research in
                Electronic Structure, Simulation, and Optimisation) is a suite
                of applications for ab-initio electronic structure calculations
                using plane waves and pseudopotentials.
              </Typography>
              <Typography variant="body2">
                Additional information can be found here:
              </Typography>
              <Link to="https://www.quantum-espresso.org" target="_blank">
                Quantum Espresso Webpage
              </Link>
              <Typography variant="body2">
                If you publish calculation results performed with QE code please
                cite the original papers:
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} variant="body2">
                Journal of Physics: Condensed Matter 21, 395502 (2009).
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} variant="body2">
                Phys. Rev. B 80, 075102 (2009)
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} variant="body2">
                Phys. Rev. B 87, 205105 (2013)
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} variant="body2">
                Journal of Physics: Condensed Matter 29, 465901 (2017).
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} variant="body2">
                The Journal of Chemical Physics 152, 154105 (2020).
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      ) : (
        getPlacemarker(hasData && data == null)
      )}
    </Stack>
  );
}
