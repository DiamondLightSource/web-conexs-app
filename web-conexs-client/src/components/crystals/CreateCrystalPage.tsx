import { Button, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import { CrystalInput } from "../../models";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCrystal } from "../../queryfunctions";
import CrystalEditor from "./CrystalEditor";
import MainPanel from "../MainPanel";
import { MolStarCrystalWrapper } from "../MolstarCrystalViewer";
import { crystalInputToCIF } from "../../utils";

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
        <Stack direction={"row"} margin="10px">
          <Stack spacing="10px" margin="10px">
            <CrystalEditor crystal={crystal} setCrystal={setCrytal} />
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
          <MolStarCrystalWrapper
            cif={crystal == null ? null : crystalInputToCIF(crystal)}
            labelledAtomIndex={undefined}
          />
        </Stack>
      </Stack>
    </MainPanel>
  );
}
