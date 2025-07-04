import { useState } from "react";
import { qeDefaultValues } from "../models";
import { useQuery } from "@tanstack/react-query";
import { getCrystals } from "../queryfunctions";

const schemaTemplate = {
  type: "object",
  properties: {
    crystal_structure_id: {
      type: "number",
      oneOf: [
        {
          const: -1,
          title: "No Structures",
        },
      ],
    },
    absorbing_atom: {
      title: "Absorbing Atom",
      type: "number",
      default: 1,
    },
    edge: {
      title: "Absorption Edge",
      type: "string",
      enum: ["k", "l1", "l2", "l23"],
      default: "k",
    },
    conductivity: {
      title: "Conductivity",
      type: "string",
      enum: ["metallic", "semiconductor", "insulator"],
      default: "metallic",
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

const uischema = {
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
              scope: "#/properties/absorbing_atom",
            },
            {
              type: "Control",
              scope: "#/properties/edge",
            },
            {
              type: "Control",
              scope: "#/properties/conductivity",
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
export default function useQESchema() {
  const [data, setData] = useState({ ...qeDefaultValues });
  const [schema, setSchema] = useState({ ...schemaTemplate });
  const [hasData, setHasData] = useState(false);

  const query = useQuery({
    queryKey: ["crystals"],
    queryFn: getCrystals,
  });

  if (query.data != null && query.data.length != 0 && !hasData) {
    const tmpSchema = { ...schema };

    const output = query.data.map((m) => ({
      const: m.id,
      title: m.id + " " + m.label,
    }));

    tmpSchema.properties.crystal_structure_id.oneOf = output;
    const tmpData = { ...data };
    tmpData.crystal_structure_id = output[0].const;
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
