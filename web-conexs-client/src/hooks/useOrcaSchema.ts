import { useState } from "react";
import { orcaDefaultValues } from "../models";
import useMoleculeAPI from "./useMoleculeAPI";

const orb_rule = {
  effect: "DISABLE",
  condition: {
    scope: "#/properties/technique",
    schema: { not: { const: "XAS" } },
  },
};

const schemaTemplate = {
  type: "object",
  properties: {
    molecular_structure_id: {
      type: "number",
      oneOf: [
        {
          const: -1,
          title: "No Structures",
        },
      ],
    },
    technique: {
      title: "Technique",
      enum: ["XAS", "XES", "OPT"],
      default: "XAS",
    },
    functional: {
      title: "Functional",
      type: "string",
      enum: ["BP86", "BLYP", "B3LYP RIJCOSX"],
      default: "BP86",
    },
    basis_set: {
      title: "Basis",
      type: "string",
      enum: ["def2-SVP", "def2-SV(P)", "def2-TZVP"],
      default: "def2-SVP",
    },
    charge: {
      title: "Charge Value",
      type: "number",
      default: 0,
    },
    multiplicity: {
      title: "Multiplicity Value",
      type: "number",
      default: 1,
    },
    solvent: {
      title: "Solvent",
      type: "string",
      enum: [
        "None",
        "Water",
        "Acetone",
        "Methanol",
        "Octanol",
        "Pyridine",
        "THF",
        "Toluene",
      ],
      default: "None",
    },
    n_cores: {
      title: "Number of Cores",
      type: "number",
      default: 4,
    },
    memory_per_core: {
      title: "Memory per Core",
      type: "number",
      default: 3072,
      enum: [1024, 2048, 3072, 4096, 6144, 8192, 12288],
    },
    orb_win_0_start: {
      title: "OrbWin[0] Start",
      type: "number",
      default: 0,
    },
    orb_win_0_stop: {
      title: "OrbWin[0] Stop",
      type: "number",
      default: 0,
    },
    orb_win_1_start: {
      title: "OrbWin[1] Start",
      type: "number",
      default: 0,
    },
    orb_win_1_stop: {
      title: "OrbWin[0] Stop",
      type: "number",
      default: 0,
    },
  },
  required: [],
};

const uischema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Group",
      label: "Structure",
      elements: [
        {
          type: "Control",
          scope: "#/properties/molecular_structure_id",
        },
        {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/charge",
            },
            {
              type: "Control",
              scope: "#/properties/multiplicity",
            },
            {
              type: "Control",
              scope: "#/properties/solvent",
            },
          ],
        },
      ],
    },
    {
      type: "Group",
      label: "Calculation",
      elements: [
        {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/technique",
            },
            {
              type: "Control",
              scope: "#/properties/functional",
            },
            {
              type: "Control",
              scope: "#/properties/basis_set",
            },
          ],
        },
      ],
    },
    {
      type: "Group",
      label: "TD-DFT Donor/Acceptor Orbitals (XAS Only)",
      elements: [
        {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/orb_win_0_start",
              rule: orb_rule,
            },
            {
              type: "Control",
              scope: "#/properties/orb_win_0_stop",
              rule: orb_rule,
            },
          ],
        },
        {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/orb_win_1_start",
              rule: orb_rule,
            },
            {
              type: "Control",
              scope: "#/properties/orb_win_1_stop",
              rule: orb_rule,
            },
          ],
        },
      ],
    },
    {
      type: "Group",
      label: "Resources",
      elements: [
        {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/n_cores",
            },
            {
              type: "Control",
              scope: "#/properties/memory_per_core",
            },
          ],
        },
      ],
    },
  ],
};
export default function useOrcaSchema() {
  const [data, setData] = useState({ ...orcaDefaultValues });
  const [schema, setSchema] = useState({ ...schemaTemplate });
  const [hasData, setHasData] = useState(false);
  const { dataList, getMolecule, data : molecule } = useMoleculeAPI();

  if (dataList.length != 0 && !hasData) {
    const tmpSchema = { ...schema };

    const output = dataList.map((m) => ({
      const: m.id,
      title: m.id + " " + m.label,
    }));
    console.log(output);

    tmpSchema.properties.molecular_structure_id.oneOf = output;
    const tmpData = { ...data };
    tmpData.molecular_structure_id = output[0].const;
    setData(tmpData);
    setSchema(tmpSchema);
    setHasData(true);
  }

  return { data, setData, dataList, schema, uischema, hasData, getMolecule, molecule };
}
