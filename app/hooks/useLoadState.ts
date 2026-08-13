import { useEffect, useState } from "react";

export function subscribeToBrowser() {
  return () => undefined;
}

export function useLoadState(key: string) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const shouldFail =
        window.localStorage.getItem("curio-simulated-error") === key;
      setStatus(shouldFail ? "error" : "ready");
    }, 520);
    return () => window.clearTimeout(timeout);
  }, [attempt, key]);

  return {
    status,
    retry: () => {
      window.localStorage.removeItem("curio-simulated-error");
      setStatus("loading");
      setAttempt((value) => value + 1);
    },
  };
}
