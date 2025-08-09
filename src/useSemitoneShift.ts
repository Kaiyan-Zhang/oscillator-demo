import { useState, useEffect } from "react";

interface SemitoneShiftHookResult {
  semitoneShift: number;
  increaseSemitone: () => void;
  decreaseSemitone: () => void;
  setSemitoneShift: (value: number) => void;
}

export default function useSemitoneShift(): SemitoneShiftHookResult {
  const [semitoneShift, setSemitoneShift] = useState<number>(0);

  const increaseSemitone = () => {
    setSemitoneShift((prev) => prev + 1);
  };

  const decreaseSemitone = () => {
    setSemitoneShift((prev) => prev - 1);
  };

  return {
    semitoneShift,
    increaseSemitone,
    decreaseSemitone,
    setSemitoneShift,
  };
}
