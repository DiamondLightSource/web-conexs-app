import { createContext } from "react";
import { Person } from "./models";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "./queryfunctions";

const UserContext = createContext<Person | null | undefined>(null);

function UserProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: (failureCount, error) => {
      if ("status" in error && error.status == 401) {
        //dont retry 401
        return false;
      }

      return failureCount < 2;
    },
  });

  //undefined if pending
  let response = undefined;

  if (query.isError) {
    response = null;
  } else {
    response = query.data;
  }

  return (
    <UserContext.Provider value={response}>{children}</UserContext.Provider>
  );
}

export { UserContext, UserProvider };
