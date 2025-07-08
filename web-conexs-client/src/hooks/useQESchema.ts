import { useState } from "react";
import { qeDefaultValues } from "../models";
import { useQuery } from "@tanstack/react-query";
import { getCrystals } from "../queryfunctions";
import { INIT, Middleware, UPDATE_CORE, UPDATE_DATA } from "@jsonforms/core";

const schemaTemplate = {
  type: "object",
  properties: {
    crystal_structure_id: {
      type: "number",
      oneOf: [
        {
          const: -1,
          title: "No Structures",
          noOfAtoms: 0,
        },
      ],
    },
    absorbing_atom: {
      title: "Absorbing Atom",
      type: "integer",
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
      type: "integer",
      default: 4,
    },
    memory: {
      title: "Memory",
      type: "integer",
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
  const [middleware, setMiddleware] = useState<Middleware | undefined>(
    undefined
  );

  const query = useQuery({
    queryKey: ["crystals"],
    queryFn: getCrystals,
  });

  if (query.data != null && query.data.length != 0 && !hasData) {
    const tmpSchema = { ...schema };

    const output = query.data.map((m) => ({
      const: m.id,
      title: m.id + " " + m.label,
      // noOfAtoms: m.structure.split(/\r\n|\r|\n/).length,
    }));

    // const lookup: { [id: number]: number } = {};

    // query.data.forEach(
    //   (m) => (lookup[m.id] = m.structure.split(/\r\n|\r|\n/).length)
    // );

    tmpSchema.properties.crystal_structure_id.oneOf = output;
    const tmpData = { ...data };
    tmpData.crystal_structure_id = output[0].const;
    setData(tmpData);
    setSchema(tmpSchema);
    setHasData(true);

    const tmp_middleware: Middleware = (state, action, defaultReducer) => {
      console.log(defaultReducer);
      const newState = defaultReducer(state, action);

      // const id = newState.data.crystal_structure_id;

      // const structures = newState.schema.properties?.crystal_structure_id.oneOf;

      console.log(output);

      // console.log(id);
      // console.log(structures);
      switch (action.type) {
        case INIT:
        case UPDATE_CORE:
        case UPDATE_DATA: {
          // console.log(newState);
          return newState;
        }
        default:
          return newState;
      }
    };
    setMiddleware(() => tmp_middleware);
  }

  return {
    data,
    setData,
    schema,
    uischema,
    hasData,
    middleware,
  };
}
