import { createContext } from "react";
import { Person } from "./models";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "./queryfunctions";

const UserContext = createContext<Person | null>(null);

function UserProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const query = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  return (
    <UserContext.Provider value={query.data ? query.data : null}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
