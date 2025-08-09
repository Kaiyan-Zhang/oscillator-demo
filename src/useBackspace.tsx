import { useCallback } from "react";
import { useWhenKeyDown } from "./utils/useWhenKeyDown";

export function useBackspace(setSemitoneStack: React.Dispatch<React.SetStateAction<number[]>>) {
  const onBackspace = useCallback(() => {
    setSemitoneStack((prev) => {
      if (prev.length === 0) return prev;
      const newStack = [...prev];
      newStack.pop();
      return newStack;
    });
  }, [setSemitoneStack]);
  useWhenKeyDown("Backspace", onBackspace);
}