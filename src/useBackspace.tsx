import { useEffect } from "react";

export function useBackspace(setSemitoneStack: React.Dispatch<React.SetStateAction<number[]>>) {
  useEffect(() => {
    const handleBackspace = ({ key: eventKey, repeat }: KeyboardEvent): void => {
      if (repeat) return;
      if (eventKey === "Backspace") {
        setSemitoneStack((prev) => {
          if (prev.length === 0) return prev;
          return prev.slice(0, -1);
        });
      }
    };

    document.addEventListener("keydown", handleBackspace);
    return () => {
      document.removeEventListener("keydown", handleBackspace);
    };
  }, [setSemitoneStack]);
}