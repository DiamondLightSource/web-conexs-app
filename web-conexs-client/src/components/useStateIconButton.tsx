import { useState } from "react";

export default function useStateIconButton() {
  const [state, setState] = useState<"ok" | "running" | "error" | "default">(
    "default"
  );

  const resetState = () => {
    setState("default");
  };

  return { state, setState, resetState };
}
