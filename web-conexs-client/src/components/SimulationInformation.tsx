import { Box } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { Simulation } from "../models";
import { useQuery } from "@tanstack/react-query";
import FdmnesResults from "./fdmnes/FdmnesResults";
import OrcaResults from "./orca/OrcaResults";
const simulationUrl = "/api/simulations";

export function SimulationInformation(props: { simId: number }) {
  const getSim = async (id: number) => {
    const { data } = await axios.get<Simulation, AxiosResponse<Simulation>>(
      simulationUrl + "/" + id
    );
    return data;
  };

  const query = useQuery({
    queryKey: ["simulations", props.simId],
    queryFn: () => getSim(props.simId),
  });

  console.log(props.simId);
  if (query.data) {
    console.log(query.data.id);
  }
  return (
    <Box width={"100%"} overflow="hidden" flex={1} display="flex">
      {query.data && query.data.simulation_type.id == 1 && (
        <OrcaResults orcaSimulationId={query.data.id}></OrcaResults>
      )}
      {query.data && query.data.simulation_type.id == 2 && (
        <FdmnesResults fdmnesSimulationId={query.data.id}></FdmnesResults>
      )}
    </Box>
  );
}
