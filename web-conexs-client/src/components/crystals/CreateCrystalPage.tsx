import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { CrystalInput } from "../../models";
import { useState } from "react";
import XYZFileEditor from "../XYZFileEditor";
import React3dMol from "../React3dMol";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCrystal } from "../../queryfunctions";

const templateCrystal: CrystalInput = {
  a: 4.1043564,
  b: 4.1043564,
  c: 4.1043564,
  alpha: 90,
  beta: 90,
  gamma: 90,
  label: "test",
  ibrav: "0",
  structure: "Ag 0.0 0.0 0.0\nAg 0.5 0.5 0.0\nAg 0.5 0.0 0.5\nAg 0.0 0.5 0.5",
};

export default function CreateCystalPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const callback = () => {
    window.alert("Thank you for your submission");
    navigate("/crystal");
  };

  const mutation = useMutation({
    mutationFn: postCrystal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["crystals"] });
      callback();
    },
  });

  const [crystal, setCrytal] = useState<CrystalInput>(templateCrystal);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="stretch"
      flex={1}
      minHeight={0}
    >
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
        elevation={12}
      >
        <Typography variant="h4" padding="24px">
          Create Crystals
        </Typography>
        <Stack direction={"row"} spacing="5px" margin="5px">
          <XYZFileEditor
            structureInput={crystal}
            setStructureInput={setCrytal}
            isMolecule={false}
          />
          <React3dMol
            moleculedata={crystal}
            color="#3465A4"
            style="Stick"
            orbital={null}
          ></React3dMol>
        </Stack>
        <Button
          onClick={() => {
            mutation.mutate(crystal);
          }}
        >
          Create
        </Button>
      </Paper>
    </Box>
  );
}
