import { Simulation } from "../models";

import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  Paper,
  TableBody,
  Stack,
  Button,
  Box,
} from "@mui/material";

import { tableCellClasses } from "@mui/material/TableCell";

import { styled } from "@mui/material/styles";
import { useState } from "react";

const nResults = 7;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd):not(:hover):not(.activeclicked)": {
    backgroundColor: theme.palette.action.selected,
  },

  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function SimulationMetadata(props: {
  key: number;
  simulation: Simulation | null;
  selected: Simulation | undefined;
  selectedRow: number;
  clickSimulation: (simulation: Simulation | null) => void;
  setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element {
  const className = props.simulation === props.selected ? "activeclicked" : "";

  return (
    <StyledTableRow
      onClick={() => {
        props.setSelectedRow(props.key);
        props.clickSimulation(props.simulation);
      }}
      key={props.key}
      className={className}
      hover={true}
      selected={props.selectedRow === props.key}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <StyledTableCell align="left">
        {props.simulation?.id ?? "\xa0"}
      </StyledTableCell>

      <StyledTableCell align="center">
        {props.simulation?.simulation_type.type ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.simulation?.status ?? ""}
      </StyledTableCell>
      <StyledTableCell align="left">
        {props.simulation?.request_date ?? ""}
      </StyledTableCell>
      <StyledTableCell align="left">
        {props.simulation?.submission_date ?? ""}
      </StyledTableCell>
    </StyledTableRow>
  );
}

export default function SimulationTable(props: {
  simulations: Simulation[];
  selectedSimulation: Simulation | undefined;
  setSelectedSimulation: (x: Simulation | null) => void;
  setCurrent: (cursor: string | null) => void;
  prevNext: string[] | null;
}) {
  const [selectedRow, setSelectedRow] = useState(-1);

  const nextPage = () => {
    props.setCurrent(props.prevNext == null ? null : props.prevNext[1]);
  };

  const prevPage = () => {
    props.setCurrent(props.prevNext == null ? null : props.prevNext[0]);
  };

  const simulationList: (Simulation | null)[] = [...props.simulations];

  if (props.simulations.length < nResults) {
    while (simulationList.length < nResults) {
      simulationList.push(null);
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="left">Request Date</TableCell>
              <TableCell align="left">Submission Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {simulationList.map((simulation, key) =>
              SimulationMetadata({
                key: key,
                simulation: simulation,
                selected: props.selectedSimulation,
                selectedRow: selectedRow,
                clickSimulation: props.setSelectedSimulation,
                setSelectedRow: setSelectedRow,
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          disabled={props.prevNext == null || props.prevNext[0] == null}
          onClick={prevPage}
        >
          &lt;
        </Button>
        <Button
          variant="contained"
          disabled={props.prevNext == null || props.prevNext[1] == null}
          onClick={nextPage}
        >
          &gt;
        </Button>
      </Stack>
    </Box>
  );
}
