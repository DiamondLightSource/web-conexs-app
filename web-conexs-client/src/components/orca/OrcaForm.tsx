import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  SnackbarCloseReason,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik, FormikErrors } from "formik";
import { orcaDefaultValues, OrcaSimulationInput } from "../../models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMolecules, postOrca } from "../../queryfunctions";
import { useNavigate } from "react-router-dom";
import StateIconButton from "../StateIconButton";
import { useEffect, useState } from "react";
import PublishIcon from "@mui/icons-material/Publish";
interface ChemicalStructureInfo {
  const: number;
  title: string;
}

export default function OrcaForm(props: {
  setStructureId: (id: number) => void;
}) {
  const query = useQuery({
    queryKey: ["molecules"],
    queryFn: getMolecules,
  });

  if (!query.data) {
    return <Typography>Loading...</Typography>;
  }

  if (query.data.length == 0) {
    return <Typography>Make Molecules...</Typography>;
  }

  const output: ChemicalStructureInfo[] = query.data.map((m) => ({
    const: m.structure.id,
    title: m.structure.id + " " + m.structure.label,
  }));

  return (
    <OrcaFormikForm
      structures={output}
      setStructureId={props.setStructureId}
    ></OrcaFormikForm>
  );
}

interface Dictionary {
  [key: string]: string;
}

function OrcaFormikForm(props: {
  structures: ChemicalStructureInfo[];
  setStructureId: (id: number) => void;
}) {
  const setStructureId = props.setStructureId;
  const structId = props.structures[0].const;
  const initialValues: OrcaSimulationInput = orcaDefaultValues;
  initialValues.chemical_structure_id = structId;

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

  useEffect(() => {
    setStructureId(structId);
  }, [structId, setStructureId]);

  const [state, setState] = useState<"ok" | "running" | "error" | "default">(
    "default"
  );
  const resetState = () => {
    setState("default");
  };

  const callback = () => {
    setState("ok");
    setSnackOpen(true);

    setTimeout(() => {
      navigate("/simulations");
    }, 2000);

    // navigate("/simulations");
  };

  const errorCallback = () => {
    setState("error");
    setSnackOpen(true);
  };

  const errorMessage = "Error Submitting Job!";
  const successMessage = "Successfully submitted job!";

  const mutation = useMutation({
    mutationFn: postOrca,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["orca"] });
      callback();
    },
    onError: () => {
      errorCallback();
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <Box>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
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
        validate={(values) => {
          const errors: Dictionary = {};

          if (!Number.isInteger(values.charge)) {
            errors["charge"] = "Charge must be a valid integer";
          }

          if (!Number.isInteger(values.multiplicity)) {
            errors["multiplicity"] = "Multiplicity must be a valid integer";
          } else {
            if (values.multiplicity < 1) {
              errors["multiplicity"] =
                "Multiplicity must be a positive value above 1";
            }
          }

          if (!Number.isInteger(values.orb_win_0_start)) {
            errors["orb_win_0_start"] = "OrbWin Start must be a valid integer";
          } else {
            if (values.orb_win_0_start < 0) {
              errors["orb_win_0_start"] = "OrbWin Start must be positive";
            }
          }

          if (!Number.isInteger(values.orb_win_0_stop)) {
            errors["orb_win_0_stop"] = "OrbWin Start must be a valid integer";
          } else {
            if (values.orb_win_0_stop < 0) {
              errors["orb_win_0_stop"] = "OrbWin Start must be positive";
            }
          }

          if (
            Number.isInteger(values.orb_win_0_stop) &&
            Number.isInteger(values.orb_win_0_stop)
          ) {
            if (values.orb_win_0_stop < values.orb_win_0_start) {
              errors["orb_win_0_stop"] =
                "OrbWin Stop must be greater or equal to OrbWin Start";
            }
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setState("running");
          const localData = { ...values };
          if (localData.solvent == "None") {
            localData.solvent = null;
          }
          mutation.mutate(localData, {
            onError: () => {
              setSubmitting(false);
            },
            onSuccess: () => {
              setSubmitting(false);
            },
          });
        }}
      >
        {({ values, handleChange, handleSubmit, isSubmitting, errors }) => (
          <OrcaInnerForm
            values={values}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            setStructureId={setStructureId}
            structures={props.structures}
            state={state}
            resetState={resetState}
            errors={errors}
          ></OrcaInnerForm>
        )}
      </Formik>
    </Box>
  );
}

function OrcaInnerForm(props: {
  values: OrcaSimulationInput;
  handleChange: (e: unknown) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  isSubmitting: boolean;
  setStructureId: (id: number) => void;
  structures: ChemicalStructureInfo[];
  resetState: () => void;
  state: "ok" | "running" | "error" | "default";
  errors: FormikErrors<OrcaSimulationInput>;
}) {
  const { values, handleChange, handleSubmit, isSubmitting } = { ...props };
  const basis_sets: string[] = ["def2-SVP", "def2-SV(P)", "def2-TZVP"];
  const functional: string[] = ["BP86", "BLYP", "B3LYP RIJCOSX"];
  const technique: string[] = ["xas", "xes", "opt", "scf"];
  const solvent: string[] = [
    "None",
    "Water",
    "Acetone",
    "Methanol",
    "Octanol",
    "Pyridine",
    "THF",
    "Toluene",
  ];

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
        <Typography>Calculation</Typography>
        <Stack direction="row" spacing="10px" justifyContent="space-between">
          <TextField
            sx={{ flexBasis: 0, flex: 1 }}
            id="charge"
            name="charge"
            type="number"
            label="Charge"
            error={Boolean(props.errors.charge)}
            helperText={props.errors.charge}
            onChange={handleChange}
            value={values.charge}
          />
          <TextField
            sx={{ flexBasis: 0, flex: 1 }}
            id="multiplicity"
            name="multiplicity"
            type="number"
            label="Multiplicity"
            error={Boolean(props.errors.multiplicity)}
            helperText={props.errors.multiplicity}
            onChange={handleChange}
            value={values.multiplicity}
          />
          <FormControl sx={{ flexBasis: 0, flex: 1 }}>
            <InputLabel id="select-basis-set">Solvent</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="solvent"
              name="solvent"
              type="text"
              value={values.solvent}
              label="Solvent"
              onChange={handleChange}
            >
              {solvent.map((b, i) => (
                <MenuItem key={i} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing="10px" justifyContent="space-between">
          <FormControl sx={{ flexBasis: 0, flex: 1 }}>
            <InputLabel id="demo-simple-select-label">Technique</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="calculation_type"
              name="calculation_type"
              type="text"
              value={values.calculation_type}
              label="Technique"
              onChange={handleChange}
            >
              {technique.map((b, i) => (
                <MenuItem key={i} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flexBasis: 0, flex: 1 }}>
            <InputLabel id="select-basis-set">Functional</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="functional"
              name="functional"
              type="text"
              value={values.functional}
              label="Functional"
              onChange={handleChange}
            >
              {functional.map((b, i) => (
                <MenuItem key={i} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flexBasis: 0, flex: 1 }}>
            <InputLabel id="select-basis-set">Basis Set</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="basis_set"
              name="basis_set"
              type="text"
              value={values.basis_set}
              label="Basis"
              onChange={handleChange}
            >
              {basis_sets.map((b, i) => (
                <MenuItem key={i} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Typography>TD-DFT Donor/Acceptor Orbitals (XAS Only)</Typography>
        <Stack direction="row" spacing="10px" justifyContent="space-between">
          <TextField
            sx={{ flexBasis: 0, flex: 1 }}
            disabled={values.calculation_type != "xas"}
            id="orb_win_0_start"
            name="orb_win_0_start"
            type="number"
            label="OrbWin[0] Start"
            error={Boolean(props.errors.orb_win_0_start)}
            helperText={props.errors.orb_win_0_start}
            onChange={handleChange}
            value={values.orb_win_0_start}
          />
          <TextField
            sx={{ flexBasis: 0, flex: 1 }}
            disabled={values.calculation_type != "xas"}
            id="orb_win_0_stop"
            name="orb_win_0_stop"
            type="number"
            label="OrbWin[0] Stop"
            error={Boolean(props.errors.orb_win_0_stop)}
            helperText={props.errors.orb_win_0_stop}
            onChange={handleChange}
            value={values.orb_win_0_stop}
          />
        </Stack>
        <StateIconButton
          type="submit"
          endIcon={<PublishIcon />}
          resetState={props.resetState}
          state={props.state}
          disabled={isSubmitting || Object.keys(props.errors).length != 0}
          variant="contained"
        >
          Submit Simulation
        </StateIconButton>
      </Stack>
    </Box>
  );
}
