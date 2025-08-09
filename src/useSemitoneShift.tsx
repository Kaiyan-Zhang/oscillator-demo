import React, { useState, useEffect } from "react";

export const useSemitoneShift = () => {
  const [semitoneShift, setSemitoneShift] = useState<number>(0);
  
  useEffect(() => {
    const handleArrowKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSemitoneShift((prev) => prev + 12);
      } else if (e.key === "ArrowDown") {
        setSemitoneShift((prev) => prev - 12);
      } else if (e.key === "ArrowLeft") {
        setSemitoneShift((prev) => prev - 1);
      } else if (e.key === "ArrowRight") {
        setSemitoneShift((prev) => prev + 1);
      }
    };
    document.addEventListener("keydown", handleArrowKeyDown);
    return () => {
      document.removeEventListener("keydown", handleArrowKeyDown);
    };
  }, []);


  return semitoneShift ;
}
