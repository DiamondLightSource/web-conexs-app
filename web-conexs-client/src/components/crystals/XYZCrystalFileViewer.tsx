import { skipToken, useQuery } from "@tanstack/react-query";
import { getCrystal } from "../../queryfunctions";
import XYZCrystalViewer from "./XYZCrystalViewer";

export default function XYZCrystalFileViewer(props: {
  id: number | undefined;
}) {
  const id = props.id;

  const query = useQuery({
    queryKey: ["crystal", props.id],
    queryFn: id ? () => getCrystal(id) : skipToken,
  });

  return <XYZCrystalViewer crystal={query.data}></XYZCrystalViewer>;
}
