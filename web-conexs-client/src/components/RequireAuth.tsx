import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth(props: {
  children: React.ReactNode;
  requireOrcaEULA: boolean;
}) {
  const user = useContext(UserContext);

  if (user == undefined) {
    return <div>Loading...</div>;
  }

  if (user == null) {
    return <Navigate to={"/"} replace />;
  }

  if (!user.accepted_orca_eula && props.requireOrcaEULA) {
    return <Navigate to={"/orcaeula"} replace />;
  }
  return props.children;
}
