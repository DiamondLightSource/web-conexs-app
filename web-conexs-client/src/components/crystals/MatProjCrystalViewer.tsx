import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMatProjStructure, postCrystal } from "../../queryfunctions";
import { Button, Stack, Typography } from "@mui/material";
import React from "react";
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
      <Button
        variant="contained"
        onClick={() => {
          mutation.mutate(query.data);
        }}
      >
        Create Crystal
      </Button>
    </Stack>
  );
}

export default React.memo(MatProjCrystalViewer);
