import {
  Box,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { OrcaCoreOrbitalInfo } from "../../models";

import { tableCellClasses } from "@mui/material/TableCell";
import { useState } from "react";

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

function OrbitalMetadata(props: {
  key: number;
  popInfo: OrcaCoreOrbitalInfo | null;
  selectedRow: number;
  clickRow: (index: number) => void;
}): JSX.Element {
  return (
    <StyledTableRow
      onClick={() => props.clickRow(props.key)}
      key={props.key}
      className={""}
      hover={true}
      selected={props.selectedRow === props.key}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <StyledTableCell align="left">
        {props.popInfo?.idx ?? "\xa0"}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.popInfo?.el ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.popInfo?.orb_1s ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.popInfo?.orb_2s ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.popInfo?.orb_2px ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.popInfo?.orb_2py ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.popInfo?.orb_2pz ?? ""}
      </StyledTableCell>
    </StyledTableRow>
  );
}
export default function CoreOrbitalTable(props: {
  population: OrcaCoreOrbitalInfo[];
}) {
  const [selectedRow, setSelectedRow] = useState(0);

  const clickRow = (index: number) => {
    setSelectedRow(index);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TableContainer component={Paper} sx={{ height: "20em" }}>
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Atom</TableCell>
              <TableCell align="center">Element</TableCell>
              <TableCell align="center">1s</TableCell>
              <TableCell align="center">2s</TableCell>
              <TableCell align="center">2px </TableCell>
              <TableCell align="center">2py</TableCell>
              <TableCell align="center">2pz</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.population.map((orbital, key) =>
              OrbitalMetadata({
                key: key,
                popInfo: orbital,
                selectedRow: selectedRow,
                clickRow: clickRow,
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
