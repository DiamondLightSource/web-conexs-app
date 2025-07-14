import { Button, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import { CrystalInput } from "../../models";
import { useState } from "react";
import React3dMol from "../React3dMol";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCrystal } from "../../queryfunctions";
import CrystalEditor from "./CrystalEditor";
import MainPanel from "../MainPanel";

const templateCrystal: CrystalInput = {
  lattice: {
    a: 4.1043564,
    b: 4.1043564,
    c: 4.1043564,
    alpha: 90,
    beta: 90,
    gamma: 90,
  },
  label: "test",
  sites: [
    { element_z: 47, x: 0.0, y: 0.0, z: 0.0, index: 1 },
    { element_z: 47, x: 0.5, y: 0.5, z: 0.0, index: 2 },
    { element_z: 47, x: 0.5, y: 0.0, z: 0.5, index: 3 },
    { element_z: 47, x: 0.0, y: 0.5, z: 0.5, index: 4 },
  ],
};

export default function CreateCystalPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const theme = useTheme();

  const callback = () => {
    window.alert("Thank you for your submission");
    navigate("/crystals");
  };

  const mutation = useMutation({
    mutationFn: postCrystal,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["crystals"] });
      callback();
    },
    onError: () => {
      window.alert("Error submitting structure!");
    },
  });

  const [crystal, setCrytal] = useState<CrystalInput | null>(templateCrystal);

  return (
    <MainPanel>
      <Stack spacing={"10px"}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: theme.palette.action.disabled,
            borderRadius: "4px 4px 0px 0px",
          }}
        >
          <Typography variant="h5" component="div">
            Create Crystal
          </Typography>
        </Toolbar>
        <Stack direction={"row"} spacing="5px" margin="5px">
          <CrystalEditor crystal={crystal} setCrystal={setCrytal} />
          <React3dMol
            moleculedata={crystal}
            color="#3465A4"
            style="Stick"
            orbital={null}
          ></React3dMol>
        </Stack>
        <Button
          variant="contained"
          onClick={() => {
            if (crystal != null) {
              mutation.mutate(crystal);
            }
          }}
        >
          Create
        </Button>
      </Stack>
    </MainPanel>
  );
}
