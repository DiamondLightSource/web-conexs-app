import { createContext } from "react";
import { PersonResult } from "./models";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "./queryfunctions";
import { AxiosError } from "axios";

const UserContext = createContext<PersonResult>({
  person: null,
  person_status: "PENDING",
});

function UserProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: (failureCount, error: AxiosError) => {
      if ("status" in error && (error.status == 401 || error.status == 403)) {
        //dont retry 401/403
        return false;
      }

      return failureCount < 2;
    },
  });

  //undefined if pending
  let response: PersonResult = {
    person: null,
    person_status: "PENDING",
  };

  if (query.isError) {
    if (query.error.status == 401) {
      response = {
        person: null,
        person_status: "UNAUTHORIZED",
      };
    } else if (query.error.status == 403) {
      response = {
        person: null,
        person_status: "FORBIDDEN",
      };
    } else {
      response = {
        person: null,
        person_status: "ERROR",
      };
    }
  } else {
    response = { person: query.data, person_status: "OK" };
  }

  return (
    <UserContext.Provider value={response}>{children}</UserContext.Provider>
  );
}

export { UserContext, UserProvider };
