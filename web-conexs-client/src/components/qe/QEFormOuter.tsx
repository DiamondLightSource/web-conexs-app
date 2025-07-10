import useQESchema from "../../hooks/useQESchema";
import QEForm from "./QEForm";

export default function QEFormOuter() {
  const { data, schema, uischema, hasData, updateData } = useQESchema();

  return (
    <QEForm
      data={data}
      setData={updateData}
      schema={schema}
      uischema={uischema}
      hasData={hasData}
    ></QEForm>
  );
}
