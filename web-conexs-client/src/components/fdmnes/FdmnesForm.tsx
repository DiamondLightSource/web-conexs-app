import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCrystals, getMolecules, postFdmnes } from "../../queryfunctions";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { fdmnesDefaultValues, FDMNESSimulationInput } from "../../models";
import { Formik, useFormikContext } from "formik";
import StateIconButton from "../StateIconButton";
import { ReactNode, useEffect, useState } from "react";
import PublishIcon from "@mui/icons-material/Publish";
import { periodic_table } from "../../periodictable";
import { useNavigate } from "react-router-dom";
import useStateIconButton from "../useStateIconButton";

interface ChemicalStructureInfo {
  const: number;
  title: string;
  elements: number[];
}

function DependentSelect(props: {
  structures: ChemicalStructureInfo[];
  selectedStructure: number;
  element: number;
  handleChange: (event: SelectChangeEvent<number>, child: ReactNode) => void;
}) {
  const { setFieldValue } = useFormikContext();
  const [elements, setElements] = useState<{ const: number; title: string }[]>(
    []
  );

  useEffect(() => {
    setElements([]);
    const structure = props.structures.find((s) => {
      return s.const == props.selectedStructure;
    });

    let el: { const: number; title: string }[] = [];

    if (structure != undefined) {
      el = structure.elements.map((el) => {
        const e = periodic_table.at(el - 1);
        return {
          const: e ? e.atomic_number : -1,
          title: e ? e.name : "unknown",
        };
      });
      setElements(el);
      setFieldValue("element", el[0].const);
    }
  }, [props.structures, props.selectedStructure, setFieldValue]);

  const isValidElement =
    elements.find((e) => {
      return props.element == e.const;
    }) != undefined;

  return (
    <FormControl sx={{ flexBasis: 0, flex: 1 }}>
      <InputLabel id="select-basis-set">Element</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="element"
        name="element"
        type="number"
        value={isValidElement ? props.element : ""}
        label="Element"
        onChange={props.handleChange}
      >
        {isValidElement &&
          elements.map((b, i) => (
            <MenuItem key={i} value={b.const}>
              {b.title}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
}

export default function FdmnesForm(props: {
  isCrystal: boolean;
  setStructureId: (id: number) => void;
}) {
  const query = useQuery({
    queryKey: [props.isCrystal ? "crystals" : "molecules"],
    queryFn: props.isCrystal ? getCrystals : getMolecules,
  });

  if (!query.data) {
    return <Typography>Loading...</Typography>;
  }

  if (query.data.length == 0) {
    return (
      <Typography>
        Make {props.isCrystal ? "Crystals" : "Molecules"}...
      </Typography>
    );
  }

  const output: ChemicalStructureInfo[] = query.data.map((m) => ({
    const: m.structure.id,
    title: m.structure.id + " " + m.structure.label,
    elements: m.elements,
  }));

  return (
    <FdmnesFormikForm
      structures={output}
      setStructureId={props.setStructureId}
    ></FdmnesFormikForm>
  );
}

function FdmnesFormikForm(props: {
  structures: ChemicalStructureInfo[];
  setStructureId: (id: number) => void;
}) {
  const setStructureId = props.setStructureId;
  const structId = props.structures[0].const;
  const initialValues: FDMNESSimulationInput = fdmnesDefaultValues;
  initialValues.chemical_structure_id = structId;

  const navigate = useNavigate();
  useEffect(() => {
    setStructureId(structId);
  }, [structId, setStructureId]);

  const { state, setState, resetState } = useStateIconButton();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postFdmnes,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["fdmnes"] });
      callback();
    },
    onError: () => {
      errorCallback();
    },
  });

  const callback = () => {
    setState("ok");

    setTimeout(() => {
      navigate("/simulations");
    }, 2000);
  };

  const errorCallback = () => {
    setState("error");
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          // alert(JSON.stringify(values, null, 2));
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
          <FdmnesInnerForm
            values={values}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            setStructureId={setStructureId}
            structures={props.structures}
            state={state}
            resetState={resetState}
          ></FdmnesInnerForm>
        )}
      </Formik>
    </Box>
  );
}

function FdmnesInnerForm(props: {
  values: FDMNESSimulationInput;
  handleChange: (e: unknown) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  isSubmitting: boolean;
  setStructureId: (id: number) => void;
  structures: ChemicalStructureInfo[];
  resetState: () => void;
  state: "ok" | "running" | "error" | "default";
}) {
  const { values, handleChange, handleSubmit, isSubmitting } = { ...props };
  const edges: string[] = ["k", "l1", "l2", "l3", "m1", "m2", "m3", "m4", "m5"];
  const methods = [
    {
      const: false,
      title: "Finite-Difference Method",
    },
    {
      const: true,
      title: "Multiple-Scattering Theory (Green's function)",
    },
  ];
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack margin="5px" spacing="10px">
        <Typography>Structure</Typography>
        <FormControl sx={{ flexBasis: 0, flex: 1 }}>
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
            element={values.element}
            handleChange={handleChange}
          ></DependentSelect>
          <FormControl sx={{ flexBasis: 0, flex: 1 }}>
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
        </Stack>
        <Typography>Calculation</Typography>
        <FormControl sx={{ flexBasis: 0, flex: 1 }}>
          <InputLabel id="select-basis-set">Theory</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="greens_approach"
            name="greens_approach"
            type="boolean"
            value={values.greens_approach}
            label="Theory"
            onChange={handleChange}
          >
            {methods.map((b, i) => (
              <MenuItem key={i} value={b.const}>
                {b.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
