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

import { StructureWithMetadata } from "../../models";
import { periodic_table } from "../../periodictable";

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

function MoleculeMetadata(props: {
  key: number;
  molecule: StructureWithMetadata | null;
  selected: StructureWithMetadata | undefined;
  selectedRow: number;
  clickMolecule: (molecule: StructureWithMetadata | null) => void;
  setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element {
  const className = props.molecule === props.selected ? "activeclicked" : "";

  const elementString: string = props.molecule
    ? props.molecule.elements
        .map((e) => {
          return periodic_table[e - 1].symbol;
        })
        .join(", ")
    : "";

  return (
    <StyledTableRow
      onClick={() => {
        console.log("click");
        props.setSelectedRow(props.key);
        props.clickMolecule(props.molecule);
      }}
      key={props.key}
      className={className}
      hover={true}
      selected={props.selectedRow === props.key}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <StyledTableCell align="left">
        {props.molecule?.structure.id ?? "\xa0"}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.molecule?.structure.label ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.molecule?.atom_count ?? ""}
      </StyledTableCell>
      <StyledTableCell align="center">{elementString}</StyledTableCell>
    </StyledTableRow>
  );
}

export default function MoleculeTable(props: {
  molecules: StructureWithMetadata[];
  selectedMolecule: StructureWithMetadata | undefined;
  setSelectedMolecule: (x: StructureWithMetadata | null) => void;
  setCurrent: (cursor: string | null) => void;
  prevNext: string[] | null;
}) {
  const [selectedRow, setSelectedRow] = useState(-1);

  const clickMolecule = (molecule: StructureWithMetadata | null) => {
    props.setSelectedMolecule(molecule);
  };

  const moleculesList: (StructureWithMetadata | null)[] = [...props.molecules];

  if (props.molecules.length < nResults) {
    while (moleculesList.length < nResults) {
      moleculesList.push(null);
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="center">Label</TableCell>
              <TableCell align="center">No. Atoms</TableCell>
              <TableCell align="center">Elements</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moleculesList.map((molecule, key) =>
              MoleculeMetadata({
                key: key,
                molecule: molecule,
                selected: props.selectedMolecule,
                selectedRow: selectedRow,
                clickMolecule: clickMolecule,
                setSelectedRow: setSelectedRow,
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
