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

import { Molecule } from "../models";

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
  molecule: Molecule | null;
  selected: Molecule | undefined;
  selectedRow: number;
  clickMolecule: (molecule: Molecule | null) => void;
  setSelectedRow: React.Dispatch<React.SetStateAction<number>>;
}): JSX.Element {
  const className = props.molecule === props.selected ? "activeclicked" : "";

  return (
    <StyledTableRow
      onClick={() => {
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
        {props.molecule?.id ?? "\xa0"}
      </StyledTableCell>
      <StyledTableCell align="center">
        {props.molecule?.label ?? ""}
      </StyledTableCell>
    </StyledTableRow>
  );
}

export default function MoleculeTable(props: {
  molecules: Molecule[];
  selectedMolecule: Molecule | undefined;
  setSelectedMolecule: (x: Molecule | null) => void;
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

  const clickMolecule = (molecule: Molecule | null) => {
    props.setSelectedMolecule(molecule);
  };

  const moleculesList: (Molecule | null)[] = [...props.molecules];

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
