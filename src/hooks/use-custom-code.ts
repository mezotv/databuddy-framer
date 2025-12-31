import { type CustomCode, framer } from "framer-plugin";
import { useEffect, useState } from "react";

export function useCustomCode() {
  const [customCode, setCustomCode] = useState<CustomCode | null>(null);

  useEffect(() => {
    return framer.subscribeToCustomCode(setCustomCode);
  }, []);

  return customCode;
}
