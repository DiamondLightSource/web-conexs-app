import { Box } from "@mui/material";
import React3dMol from "../React3dMol";
import { getCrystal } from "../../queryfunctions";
import { skipToken, useQuery } from "@tanstack/react-query";

export default function CrystalViewer(props: { id: number | undefined }) {
  const id = props.id;
  const query = useQuery({
    queryKey: ["crystal", id],
    queryFn: id ? () => getCrystal(id) : skipToken,
  });

  console.log(id);
  console.log(query.data);

  return (
    <Box height="100%" width="100%">
      {query.data && (
        <React3dMol
          moleculedata={query.data}
          color="#3465A4"
          style="Stick"
          orbital={null}
        ></React3dMol>
      )}
    </Box>
  );
}
