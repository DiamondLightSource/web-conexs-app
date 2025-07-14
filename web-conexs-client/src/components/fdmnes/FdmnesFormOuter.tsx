import { useFDMNESSchema } from "../../hooks/useFdmnesSchema";
import FdmnesForm from "./FdmnesForm";

export default function FdmnesFormOuter(props: { isCrystal: boolean }) {
  const { data, schema, uischema, hasData, updateData } = useFDMNESSchema(
    props.isCrystal
  );

  return (
    <FdmnesForm
      data={data}
      setData={updateData}
      schema={schema}
      uischema={uischema}
      hasData={hasData}
    ></FdmnesForm>
  );
}
