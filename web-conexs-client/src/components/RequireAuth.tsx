import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import MainPanel from "./MainPanel";
import { Typography } from "@mui/material";
import Forbidden from "./Forbidden";

export default function RequireAuth(props: {
  children: React.ReactNode;
  requireOrcaEULA: boolean;
}) {
  const user_result = useContext(UserContext);

  if (user_result.person_status == "ERROR") {
    return (
      <MainPanel
        toolbarElements={<Typography variant="h5">Internal Error!</Typography>}
      >
        <Typography>Internal Error!</Typography>
      </MainPanel>
    );
  }

  if (user_result.person_status == "FORBIDDEN") {
    return (
      <MainPanel
        toolbarElements={<Typography variant="h5">Access Forbidden</Typography>}
      >
        <Forbidden></Forbidden>
      </MainPanel>
    );
  }

  if (
    user_result.person_status == "UNAUTHORIZED" &&
    user_result.person == null
  ) {
    return <Navigate to={"/"} replace />;
  }

  const user = user_result.person;

  if (user_result.person_status == "PENDING" || user == null) {
    return (
      <MainPanel
        toolbarElements={<Typography variant="h5">Loading...</Typography>}
      >
        <Typography>Loading...</Typography>
      </MainPanel>
    );
  }

  if (!user.accepted_orca_eula && props.requireOrcaEULA) {
    return <Navigate to={"/orcaeula"} replace />;
  }
  return props.children;
}
