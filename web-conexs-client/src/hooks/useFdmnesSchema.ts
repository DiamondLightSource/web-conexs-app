import { useState } from "react";
import { fdmnesDefaultValues, FDMNESSimulationInput } from "../models";
import { periodic_table } from "../periodictable";
import { useQuery } from "@tanstack/react-query";
import { getCrystals, getMolecules } from "../queryfunctions";

const schemaTemplate = {
  type: "object",
  properties: {
    chemical_structure_id: {
      type: "integer",
      oneOf: [
        {
          const: -1,
          title: "No Structures",
        },
      ],
    },
    element: {
      title: "Element",
      type: "integer",
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
          scope: "#/properties/chemical_structure_id",
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
  ],
};

export function useFDMNESSchema(isCrystal: boolean) {
  const [data, setData] = useState({ ...fdmnesDefaultValues });
  const [schema, setSchema] = useState({ ...schemaTemplate });
  const [hasData, setHasData] = useState(false);

  function updateData(newData: FDMNESSimulationInput) {
    if (query.data == undefined) {
      setData(newData);
      return;
    }

    if (data.chemical_structure_id != newData.chemical_structure_id) {
      const tmpSchema = structuredClone(schema);

      const s = query.data.find((s) => {
        return s.structure.id == newData.chemical_structure_id;
      });

      if (s == undefined) {
        setData(newData);
        return;
      }
      const newElements = s.elements.map((el) => {
        const e = periodic_table.at(el - 1);
        return {
          const: e ? e.atomic_number : -1,
          title: e ? e.name : "unknown",
        };
      });

      tmpSchema.properties.element.oneOf = newElements;

      newData.element = s.elements[0];

      setSchema(tmpSchema);
    }
    setData(newData);
  }

  const query = useQuery({
    queryKey: [isCrystal ? "crystals" : "molecules"],
    queryFn: isCrystal ? getCrystals : getMolecules,
  });

  if (query.data != null && query.data.length != 0 && !hasData) {
    const tmpSchema = { ...schema };

    const output = query.data.map((m) => ({
      const: m.structure.id,
      title: m.structure.id + " " + m.structure.label,
      elements: m.elements,
    }));

    tmpSchema.properties.chemical_structure_id.oneOf = output;

    tmpSchema.properties.element.oneOf = query.data[0].elements.map((el) => {
      const e = periodic_table.at(el - 1);
      return {
        const: e ? e.atomic_number : -1,
        title: e ? e.name : "unknown",
      };
    });

    const tmpData = { ...data };

    tmpData.chemical_structure_id = query.data[0].structure.id;
    updateData(tmpData);
    setHasData(true);
  }

  return {
    data,
    schema,
    uischema,
    hasData,
    updateData,
  };
}
