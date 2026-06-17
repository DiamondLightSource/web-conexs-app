import { useQuery } from "@tanstack/react-query";
import { getOrcaCoreOrbitalInfo } from "../../queryfunctions";
import CoreOrbitalTable from "./CoreOrbitalTable";
import { Stack, Typography } from "@mui/material";

export default function OrcaCoreOrbitals(props: { id: number }) {
  const query = useQuery({
    queryKey: ["orca", "population", props.id],
    queryFn: () => getOrcaCoreOrbitalInfo(props.id),
  });

  return (
    <Stack spacing={"5px"} margin={"10px"}>
      <Typography>
        Atomic orbitals with localised electrons (&gt;75%) from Loewdin Reduced
        Orbital Population.
      </Typography>
      <CoreOrbitalTable population={query.data ? query.data : []} />
    </Stack>
  );
}
