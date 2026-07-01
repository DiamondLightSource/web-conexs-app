import { useQuery } from "@tanstack/react-query";
import { getOrcaCoreOrbitalInfo } from "../../queryfunctions";
import CoreOrbitalTable from "./CoreOrbitalTable";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import OrcaCoreOrbitalSelect from "./OrcaCoreOrbitalSelect";

export default function OrcaCoreOrbitals(props: { id: number }) {
  const query = useQuery({
    queryKey: ["orca", "population", props.id],
    queryFn: () => getOrcaCoreOrbitalInfo(props.id),
  });

  const [elementIndex, setElementIndex] = useState(0);

  if (!query.data) {
    return <Stack></Stack>;
  }

  return (
    <Stack spacing={"5px"} margin={"10px"}>
      <Typography>
        Atomic orbitals of core electrons from Loewdin Reduced Orbital
        Population.
      </Typography>
      <OrcaCoreOrbitalSelect
        coreOrbitals={query.data}
        elementIndex={elementIndex}
        setElementIndex={setElementIndex}
      ></OrcaCoreOrbitalSelect>
      <CoreOrbitalTable
        orbitalInfo={
          query.data && query.data.length > elementIndex
            ? query.data[elementIndex]
            : null
        }
      />
    </Stack>
  );
}
