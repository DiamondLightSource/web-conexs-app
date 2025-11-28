import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCrystals, postQe } from "../../queryfunctions";
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  Typography,
} from "@mui/material";
import { qeDefaultValues, QESimulationSubmission } from "../../models";
import { useNavigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { Formik, useFormikContext } from "formik";
import StateIconButton from "../StateIconButton";
import PublishIcon from "@mui/icons-material/Publish";

interface ChemicalStructureInfo {
  const: number;
  title: string;
  atom_count: number;
}

export default function QEForm(props: {
  setStructureId: (id: number) => void;
}) {
  const query = useQuery({
    queryKey: ["crystals"],
    queryFn: getCrystals,
  });

  if (!query.data) {
    return <Typography>Loading...</Typography>;
  }

  if (query.data.length == 0) {
    return <Typography>Make Crystals...</Typography>;
  }

  const output: ChemicalStructureInfo[] = query.data.map((m) => ({
    const: m.structure.id,
    title: m.structure.id + " " + m.structure.label,
    atom_count: m.atom_count,
  }));

  return (
    <QEFormikForm
      structures={output}
      setStructureId={props.setStructureId}
    ></QEFormikForm>
  );
}

function QEFormikForm(props: {
  structures: ChemicalStructureInfo[];
  setStructureId: (id: number) => void;
}) {
  const setStructureId = props.setStructureId;
  const structId = props.structures[0].const;
  const initialValues: QESimulationSubmission = qeDefaultValues;
  initialValues.chemical_structure_id = structId;

  const navigate = useNavigate();
  useEffect(() => {
    setStructureId(structId);
  }, [structId, setStructureId]);

  const [state, setState] = useState<"ok" | "running" | "error" | "default">(
    "default"
  );
  const [snackOpen, setSnackOpen] = useState(false);

  const handleSnackClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const resetState = () => {
    setState("default");
  };

  const mutation = useMutation({
    mutationFn: postQe,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["qe"] });
      callback();
    },
    onError: () => {
      errorCallback();
    },
  });

  const queryClient = useQueryClient();
  const callback = () => {
    setState("ok");
    setSnackOpen(true);

    setTimeout(() => {
      navigate("/simulations");
    }, 2000);
  };

  const errorCallback = () => {
    setState("error");
    setSnackOpen(true);
  };

  const errorMessage = "Error Submitting Job!";
  const successMessage = "Successfully submitted job!";

  return (
    <Box>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
      >
        <Alert
          onClose={handleSnackClose}
          severity={state == "ok" ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {state == "ok" ? successMessage : errorMessage}
        </Alert>
      </Snackbar>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          setState("running");
          mutation.mutate(values, {
            onSettled: () => {
              setTimeout(() => {
                setSubmitting(false);
              }, 2000);
            },
          });
        }}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <QEInnerForm
            values={values}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            setStructureId={setStructureId}
            structures={props.structures}
            state={state}
            resetState={resetState}
          ></QEInnerForm>
        )}
      </Formik>
    </Box>
  );
}

function QEInnerForm(props: {
  values: QESimulationSubmission;
  handleChange: (e: unknown) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  isSubmitting: boolean;
  setStructureId: (id: number) => void;
  structures: ChemicalStructureInfo[];
  resetState: () => void;
  state: "ok" | "running" | "error" | "default";
}) {
  const { values, handleChange, handleSubmit, isSubmitting } = { ...props };
  const edges: string[] = ["k", "l1", "l2", "l23"];
  const conductivity: string[] = ["metallic", "semiconductor", "insulator"];

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack margin="5px" spacing="10px">
        <Typography>Structure</Typography>
        <FormControl fullWidth>
          <InputLabel id="select-basis-set">Chemical Structure</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="chemical_structure_id"
            name="chemical_structure_id"
            type="number"
            value={values.chemical_structure_id}
            label="Chemical Structure"
            onChange={(e) => {
              handleChange(e);
              props.setStructureId(e.target.value as number);
            }}
          >
            {props.structures.map((b, i) => (
              <MenuItem key={i} value={b.const}>
                {b.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" spacing="10px" justifyContent="space-between">
          <DependentSelect
            structures={props.structures}
            selectedStructure={values.chemical_structure_id}
            selectedAtom={values.absorbing_atom}
            handleChange={handleChange}
          ></DependentSelect>
          <FormControl fullWidth>
            <InputLabel id="select-basis-set">Edge</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="edge"
              name="edge"
              type="text"
              value={values.edge}
              label="Edge"
              onChange={handleChange}
            >
              {edges.map((b, i) => (
                <MenuItem key={i} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="select-basis-set">Conductivity</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="conductivity"
              name="conductivity"
              type="text"
              value={values.conductivity}
              label="Conductivity"
              onChange={handleChange}
            >
              {conductivity.map((b, i) => (
                <MenuItem key={i} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <StateIconButton
          type="submit"
          endIcon={<PublishIcon />}
          resetState={props.resetState}
          state={props.state}
          disabled={isSubmitting}
          variant="contained"
        >
          Submit Simulation
        </StateIconButton>
      </Stack>
    </Box>
  );
}

function DependentSelect(props: {
  structures: ChemicalStructureInfo[];
  selectedStructure: number;
  selectedAtom: number;
  handleChange: (event: SelectChangeEvent<number>, child: ReactNode) => void;
}) {
  const { setFieldValue } = useFormikContext();
  const [atoms, setAtoms] = useState<{ const: number; title: string }[]>([]);

  useEffect(() => {
    const structure = props.structures.find((s) => {
      return s.const == props.selectedStructure;
    });

    let oneOfAtoms: { const: number; title: string }[] = [];

    if (structure != undefined) {
      oneOfAtoms = [...Array(structure.atom_count).keys()].map((i) => {
        return {
          const: i + 1,
          title: String(i + 1),
        };
      });

      setAtoms(oneOfAtoms);
      setFieldValue("absorbing_atom", oneOfAtoms[0].const);
    }
  }, [props.structures, props.selectedStructure, setFieldValue]);

  const isValidElement =
    atoms.find((e) => {
      return props.selectedAtom == e.const;
    }) != undefined;

  return (
    <FormControl fullWidth>
      <InputLabel id="select-basis-set">Element</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="absorbing_atom"
        name="absorbing_atom"
        type="number"
        value={isValidElement ? props.selectedAtom : ""}
        label="Element"
        onChange={props.handleChange}
      >
        {isValidElement &&
          atoms.map((b, i) => (
            <MenuItem key={i} value={b.const}>
              {b.title}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}
