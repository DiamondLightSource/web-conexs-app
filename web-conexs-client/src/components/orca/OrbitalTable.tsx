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
import { OrcaCubeInfo } from "../../models";

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
  cubeInfo: OrcaCubeInfo | null;
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
        {props.cubeInfo?.index ?? "\xa0"}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.cubeInfo?.energy ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.cubeInfo?.intensity ?? ""}
      </StyledTableCell>
    </StyledTableRow>
  );
}
export default function OrbitalTable(props: {
  orbitals: OrcaCubeInfo[];
  setCubeID: (id: number) => void;
}) {
  const [selectedRow, setSelectedRow] = useState(0);

  const clickRow = (index: number) => {
    setSelectedRow(index);
    props.setCubeID(index);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TableContainer component={Paper} sx={{ height: "20em" }}>
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Index</TableCell>
              <TableCell align="center">Energy</TableCell>
              <TableCell align="center">Intensity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.orbitals.map((orbital, key) =>
              OrbitalMetadata({
                key: key,
                cubeInfo: orbital,
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
