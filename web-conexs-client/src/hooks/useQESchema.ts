import { useState } from "react";
import { qeDefaultValues, QESimulationSubmission } from "../models";
import { useQuery } from "@tanstack/react-query";
import { getCrystals } from "../queryfunctions";

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
    absorbing_atom: {
      title: "Absorbing Atom",
      type: "integer",
      oneOf: [
        {
          const: 1,
          title: "1",
        },
      ],
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

    function updateData(newData: QESimulationSubmission){
  
      if (query.data == undefined) {
        setData(newData)
        return
      }
  
      if (data.chemical_structure_id != newData.chemical_structure_id) {
  
        const tmpSchema = structuredClone(schema)
  
      const s = query.data.find((s) => {return s.structure.id == newData.chemical_structure_id})
  
      if (s == undefined) {
        setData(newData)
        return
      }

      const oneOfAtoms = [...Array(s.atom_count).keys()].map((i) => {return {
          const: i+1,
          title: String(i+1),
        }});


      tmpSchema.properties.absorbing_atom.oneOf = oneOfAtoms
  
      newData.absorbing_atom = 1
  
        setSchema(tmpSchema)
      }
        setData(newData)
    }

  if (query.data != null && query.data.length != 0 && !hasData) {
    const tmpSchema = { ...schema };

    const output = query.data.map((m) => ({
      const: m.structure.id,
      title: m.structure.id + " " + m.structure.label,
    }));


    tmpSchema.properties.chemical_structure_id.oneOf = output;
    const tmpData = { ...data };
    tmpData.chemical_structure_id = output[0].const;
    updateData(tmpData);
    setHasData(true);
  }

  return {
    data,
    updateData,
    schema,
    uischema,
    hasData,
  };
}
