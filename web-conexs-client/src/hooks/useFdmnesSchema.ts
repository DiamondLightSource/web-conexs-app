import { useState } from "react";
import { fdmnesDefaultValues } from "../models";
import { periodic_table } from "../periodictable";
import { useQuery } from "@tanstack/react-query";
import { getCrystals, getMolecules } from "../queryfunctions";

const structure_template = {
  type: "number",
  oneOf: [
    {
      const: -1,
      title: "No Structures",
    },
  ],
};

const schemaTemplate = {
  type: "object",
  properties: {
    element: {
      title: "Element",
      type: "number",
      oneOf: periodic_table.map((e) => ({
        const: e.atomic_number,
        title: e.name,
      })),
    },
    edge: {
      title: "Absorption Edge",
      type: "string",
      enum: ["k", "l1", "l2", "l3", "m1", "m2", "m3", "m4", "m5"],
      default: "k",
    },
    greens_approach: {
      type: "boolean",
      title: "Theory",
      oneOf: [
        {
          const: false,
          title: "Finite-Difference Method",
        },
        {
          const: true,
          title: "Multiple-Scattering Theory (Green's function)",
        },
      ],
    },
    n_cores: {
      title: "Number of Cores",
      type: "number",
      default: 4,
    },
    memory: {
      title: "Memory",
      type: "number",
      default: 3072,
      enum: [1024, 2048, 3072, 4096, 6144, 8192, 12288],
    },
  },
  required: [],
};

const crystal_schema_properties = {
  ...schemaTemplate.properties,
  crystal_structure_id: structure_template,
};
const crystal_schema_template = {
  ...schemaTemplate,
  properties: crystal_schema_properties,
};

const molecule_schema_properties = {
  ...schemaTemplate.properties,
  molecular_structure_id: structure_template,
};
const molecule_schema_template = {
  ...schemaTemplate,
  properties: molecule_schema_properties,
};

const crystal_uischema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Group",
      label: "Structure",
      elements: [
        {
          type: "Control",
          scope: "#/properties/crystal_structure_id",
        },
        {
          type: "HorizontalLayout",
          elements: [
            {
              type: "Control",
              scope: "#/properties/element",
            },
            {
              type: "Control",
              scope: "#/properties/edge",
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
              scope: "#/properties/greens_approach",
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
              scope: "#/properties/memory",
            },
          ],
        },
      ],
    },
  ],
};

const molecule_uischema = structuredClone(crystal_uischema);

molecule_uischema.elements[0].elements[0].scope =
  "#/properties/molecular_structure_id";

export function useFDMNESSchema(isCrystal: boolean) {
  const [data, setData] = useState({ ...fdmnesDefaultValues });
  const [schema, setSchema] = useState(
    isCrystal ? { ...crystal_schema_template } : { ...molecule_schema_template }
  );
  const [hasData, setHasData] = useState(false);

  const query = useQuery({
    queryKey: [isCrystal ? "crystals" : "molecules"],
    queryFn: isCrystal ? getCrystals : getMolecules,
  });

  if (query.data != null && query.data.length != 0 && !hasData) {
    const tmpSchema = { ...schema };

    const output = query.data.map((m) => ({
      const: m.id,
      title: m.id + " " + m.label,
    }));

    if ("crystal_structure_id" in tmpSchema.properties) {
      tmpSchema.properties.crystal_structure_id.oneOf = output;
    }

    if ("molecular_structure_id" in tmpSchema.properties) {
      tmpSchema.properties.molecular_structure_id.oneOf = output;
    }

    const tmpData = { ...data };

    if (isCrystal) {
      tmpData.crystal_structure_id = output[0].const;
    } else {
      tmpData.molecular_structure_id = output[0].const;
    }

    setData(tmpData);
    setSchema(tmpSchema);
    setHasData(true);
  }

  const uischema = isCrystal ? crystal_uischema : molecule_uischema;

  console.log(uischema);

  return {
    data,
    setData,
    schema,
    uischema,
    hasData,
  };
}

export function useFDMNESMoleculeSchema() {
  const [data, setData] = useState({ ...fdmnesDefaultValues });
  const [schema, setSchema] = useState({ ...molecule_schema_template });
  const [hasData, setHasData] = useState(false);

  const query = useQuery({
    queryKey: ["molecules"],
    queryFn: getMolecules,
  });

  if (query.data != null && query.data.length != 0 && !hasData) {
    const tmpSchema = { ...schema };

    const output = query.data.map((m) => ({
      const: m.id,
      title: m.id + " " + m.label,
    }));

    molecule_schema_template.properties.molecular_structure_id.oneOf = output;
    const tmpData = { ...data };
    tmpData.molecular_structure_id = output[0].const;
    setData(tmpData);
    setSchema(tmpSchema);
    setHasData(true);
  }

  const uischema = molecule_uischema;

  return {
    data,
    setData,
    schema,
    uischema,
    hasData,
  };
}
