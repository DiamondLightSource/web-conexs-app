import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMatProjStructure, postCrystal } from "../../queryfunctions";
import { Button, Checkbox, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import XYZCrystalViewer from "./XYZCrystalViewer";
import { MolStarCrystalWrapper } from "../MolstarCrystalViewer";
import { crystalInputToCIF } from "../../utils";

function MatProjCrystalViewer(props: { mpid: string }) {
  const mpid = props.mpid;
  const query = useQuery({
    queryKey: ["matproj", mpid],
    queryFn: () => getMatProjStructure(mpid),
    retry: false,
  });

  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
  });

  if (query.isPending) {
    return <Typography>Loading {mpid}...</Typography>;
  }

  if (query.error || query.data == null) {
    return <Typography>Error retrieving {mpid}...</Typography>;
  }

  return (
    <Stack height="100%" width="100%" flex={1} spacing={"5px"}>
      <Stack
        direction="row"
        height="100%"
        width="100%"
        flex={1}
        spacing={"5px"}
      >
        <XYZCrystalViewer crystal={query.data}></XYZCrystalViewer>
        <MolStarCrystalWrapper
          cif={crystalInputToCIF(query.data)}
          labelledAtomIndex={undefined}
        ></MolStarCrystalWrapper>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Checkbox checked={checked} onChange={handleChange}></Checkbox>
        <Typography>Round Lattice Parameters to 4 Decimal Places</Typography>
      </Stack>
      <Button
        variant="contained"
        onClick={() => {
          const structure = query.data;

          if (checked) {
            structure.lattice.a =
              Math.round(structure.lattice.a * 10000.0) / 10000.0;
            structure.lattice.b =
              Math.round(structure.lattice.b * 10000.0) / 10000.0;
            structure.lattice.c =
              Math.round(structure.lattice.c * 10000.0) / 10000.0;
            structure.lattice.alpha =
              Math.round(structure.lattice.alpha * 10000.0) / 10000.0;
            structure.lattice.beta =
              Math.round(structure.lattice.beta * 10000.0) / 10000.0;
            structure.lattice.gamma =
              Math.round(structure.lattice.gamma * 10000.0) / 10000.0;
          }

          mutation.mutate(structure);
        }}
      >
        Create Crystal
      </Button>
    </Stack>
  );
}

export default React.memo(MatProjCrystalViewer);
