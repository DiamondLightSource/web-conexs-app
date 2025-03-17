import { useState } from "react";
import { fdmnesDefaultValues } from "../models";
import useCrystalAPI from "./useCrystalAPI";
import { periodic_table } from "../periodictable";

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
      title: "Use Green's Function Approach",
      type: "boolean",
      default: false,
    },
    structure_type: {
      title: "Structure type",
      type: "string",
      enum: ["crystal", "molecule"],
      default: "crystal",
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
            {
              type: "Control",
              scope: "#/properties/structure_type",
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
export default function useFDMNESSchema() {
  const [data, setData] = useState({ ...fdmnesDefaultValues });
  const [schema, setSchema] = useState({ ...schemaTemplate });
  const [hasData, setHasData] = useState(false);
  const { dataList, getCrystal, data: crystal } = useCrystalAPI();

  if (dataList.length != 0 && !hasData) {
    const tmpSchema = { ...schema };

    const output = dataList.map((m) => ({
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
    dataList,
    schema,
    uischema,
    hasData,
    getCrystal,
    crystal,
  };
}
