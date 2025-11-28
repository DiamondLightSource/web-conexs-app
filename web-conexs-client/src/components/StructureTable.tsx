import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  Paper,
  TableBody,
  Box,
} from "@mui/material";

import { tableCellClasses } from "@mui/material/TableCell";

import { styled } from "@mui/material/styles";
import { useState } from "react";

import { StructureWithMetadata } from "../models";
import { periodic_table } from "../periodictable";

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

function StructureMetadata(props: {
  key: number;
  structure: StructureWithMetadata | null;
  selected: StructureWithMetadata | undefined;
  selectedRow: number;
  clickStructure: (molecule: StructureWithMetadata | null) => void;
  setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element {
  const className = props.structure === props.selected ? "activeclicked" : "";

  const elementString: string = props.structure
    ? props.structure.elements
        .map((e) => {
          return periodic_table[e - 1].symbol;
        })
        .join(", ")
    : "";

  return (
    <StyledTableRow
      onClick={() => {
        props.setSelectedRow(props.key);
        props.clickStructure(props.structure);
      }}
      key={props.key}
      className={className}
      hover={true}
      selected={props.selectedRow === props.key}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <StyledTableCell align="left">
        {props.structure?.structure.id ?? "\xa0"}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.structure?.structure.label ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.structure?.atom_count ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">{elementString}</StyledTableCell>
    </StyledTableRow>
  );
}

export default function StructureTable(props: {
  structures: StructureWithMetadata[];
  selectedStructure: StructureWithMetadata | undefined;
  setSelectedStructure: (x: StructureWithMetadata | null) => void;
}) {
  const [selectedRow, setSelectedRow] = useState(0);

  const clickStructure = (molecule: StructureWithMetadata | null) => {
    props.setSelectedStructure(molecule);
  };

  return (
    <Box padding={"10px"} sx={{ display: "flex", flexDirection: "column" }}>
      <TableContainer component={Paper} sx={{ height: "100%" }}>
        <Table sx={{ minWidth: 250 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="center">Label</TableCell>
              <TableCell align="center">No. Atoms</TableCell>
              <TableCell align="center">Elements</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.structures.map((molecule, key) =>
              StructureMetadata({
                key: key,
                structure: molecule,
                selected: props.selectedStructure,
                selectedRow: selectedRow,
                clickStructure: clickStructure,
                setSelectedRow: setSelectedRow,
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
