import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Box, Button, Paper, Skeleton, Stack, Typography } from "@mui/material";
import useOrcaSchema from "../../hooks/useOrcaSchema";
// import React3dMol from "./React3dMol";
import { postOrca } from "../../queryfunctions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import CompactGroupRenderer, {
  CompactGroupTester,
} from "../renderers/CompactGroup";
import StructureViewer from "../StructureViewer";

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

  if (data != null && data.chemical_structure_id != selectedMoleculeID) {
    setSelectedMoleculeId(data.chemical_structure_id);
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
              <StructureViewer id={selectedMoleculeID} />
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
                ORCA is an ab initio, DFT, and semi-empirical SCF-MO package
                developed by Frank Neese et al. at the Max Planck Institut für
                Kohlenforschung.
              </Typography>
              <Typography variant="body2">
                Additional information can be found here:
              </Typography>
              <Link
                to="https://www.kofo.mpg.de/en/research/services/orca"
                target="_blank"
              >
                ORCA manual
              </Link>
              <Link
                to="https://www.kofo.mpg.de/412442/orca_manual-opt.pdf"
                target="_blank"
              >
                ORCA webpage at Max-Planck-Institut
              </Link>
              <Link
                to="https://sites.google.com/site/orcainputlibrary/home"
                target="_blank"
              >
                ORCA input library website
              </Link>
              <Typography variant="body2">
                If you publish calculation results performed with ORCA code
                please cite the original papers:
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} variant="body2">
                F. Neese, Wiley Interdisciplinary Reviews: Computational
                Molecular Science 2, 73 (2012).
              </Typography>
              <Typography sx={{ fontStyle: "italic" }} variant="body2">
                F. Neese, Wiley Interdisciplinary Reviews: Computational
                Molecular Science 8, e1327 (2018).
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
