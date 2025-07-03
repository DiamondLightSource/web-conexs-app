import { useState } from "react";
import { orcaDefaultValues, OrcaSimulationWithResource } from "../models";
import { useQuery } from "@tanstack/react-query";
import { getMolecules } from "../queryfunctions";

const orb_rule = {
  effect: "DISABLE",
  condition: {
    scope: "#/properties/calculation_type",
    schema: { not: { const: "xas" } },
  },
};

const schemaTemplate = {
  type: "object",
  properties: {
    molecular_structure_id: {
      type: "integer",
      oneOf: [
        {
          const: -1,
          title: "No Structures",
        },
      ],
    },
    calculation_type: {
      title: "Technique",
      enum: ["xas", "xes", "opt"],
      default: "xas",
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
      type: "integer",
      default: 0,
    },
    multiplicity: {
      title: "Multiplicity Value",
      type: "integer",
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
      type: "integer",
      default: 4,
    },
    memory_per_core: {
      title: "Memory per Core",
      type: "integer",
      default: 3072,
      enum: [1024, 2048, 3072, 4096, 6144, 8192, 12288],
    },
    orb_win_0_start: {
      title: "OrbWin[0] Start",
      type: "integer",
      default: 0,
    },
    orb_win_0_stop: {
      title: "OrbWin[0] Stop",
      type: "integer",
      default: 0,
    },
    orb_win_1_start: {
      title: "OrbWin[1] Start",
      type: "integer",
      default: 0,
    },
    orb_win_1_stop: {
      title: "OrbWin[0] Stop",
      type: "integer",
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
              scope: "#/properties/calculation_type",
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
  const [data, setData] = useState<OrcaSimulationWithResource | null>(null);
  const [schema, setSchema] = useState({ ...schemaTemplate });
  const [hasData, setHasData] = useState(false);
  const query = useQuery({
    queryKey: ["molecules"],
    queryFn: getMolecules,
  });

  if (query.data && !hasData) {
    const tmpSchema = { ...schema };

    const output = query.data.map((m) => ({
      const: m.id,
      title: m.id + " " + m.label,
    }));

    tmpSchema.properties.molecular_structure_id.oneOf = output;
    let tmpData: OrcaSimulationWithResource | null = { ...orcaDefaultValues };
    if (output.length != 0) {
      tmpData.molecular_structure_id = output[0].const;
    } else {
      tmpData = null;
    }

    setData(tmpData);
    setSchema(tmpSchema);
    setHasData(true);
  }

  return {
    data,
    setData,
    schema,
    uischema,
    hasData,
  };
}
