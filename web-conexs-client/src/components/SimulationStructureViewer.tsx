import { skipToken, useQuery } from "@tanstack/react-query";
import { getSimulation } from "../queryfunctions";
import StructureViewer from "./StructureViewer";

export default function SimulationStructureViewer(props: {
  simulationId: number;
}) {
  const id = props.simulationId;
  const query = useQuery({
    queryKey: ["simulations", id],
    queryFn: id ? () => getSimulation(id) : skipToken,
  });

  return <StructureViewer id={query.data?.chemical_structure_id} />;
}
