import { useQuery } from "@tanstack/react-query";
import { getOrcaCoreOrbitalInfo } from "../../queryfunctions";
import CoreOrbitalTable from "./CoreOrbitalTable";

export default function OrcaCoreOrbitals(props: { id: number }) {
  const query = useQuery({
    queryKey: ["orca", "population", props.id],
    queryFn: () => getOrcaCoreOrbitalInfo(props.id),
  });

  return <CoreOrbitalTable population={query.data ? query.data : []} />;
}
