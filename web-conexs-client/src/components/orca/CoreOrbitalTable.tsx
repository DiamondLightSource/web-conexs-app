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
  index: number;
  orbital: string;
  percent: number;
  energy: number;
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
      <StyledTableCell align="left">{props.index}</StyledTableCell>
      <StyledTableCell align="center">{props.orbital}</StyledTableCell>
      <StyledTableCell align="center">{props.percent}</StyledTableCell>
      <StyledTableCell align="center">{props.energy}</StyledTableCell>
    </StyledTableRow>
  );
}
export default function CoreOrbitalTable(props: {
  orbitalInfo: OrcaCoreOrbitalInfo | null;
}) {
  const [selectedRow, setSelectedRow] = useState(0);

  const clickRow = (index: number) => {
    setSelectedRow(index);
  };

  if (props.orbitalInfo == null) {
    return <Box></Box>;
  }

  const orbInfo: OrcaCoreOrbitalInfo = props.orbitalInfo;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TableContainer component={Paper} sx={{ height: "20em" }}>
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Electron Index</TableCell>
              <TableCell align="center">Orbital</TableCell>
              <TableCell align="center">Percent Population</TableCell>
              <TableCell align="center">Energy </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orbInfo.electrons.index.map((i, key) =>
              OrbitalMetadata({
                key: key,
                index: i,
                energy: orbInfo.electrons.energy[key],
                orbital: orbInfo.electrons.orbital[key],
                percent: orbInfo.electrons.percent[key],
                selectedRow: selectedRow,
                clickRow: clickRow,
              }),
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
