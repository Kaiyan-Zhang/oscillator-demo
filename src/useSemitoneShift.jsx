import { useState, useEffect } from "react";

const useSemitoneShift = () => {
  const [semitoneShift, setSemitoneShift] = useState(0);

  useEffect(() => {
    const handleArrowKeys = ({ key: eventKey, repeat }) => {
      if (repeat) return;
      if (eventKey === "ArrowUp") {
        setSemitoneShift((semitoneShift) => semitoneShift + 12);
      }
      if (eventKey === "ArrowDown") {
        setSemitoneShift((semitoneShift) => semitoneShift - 12);
      }
      if (eventKey === "ArrowRight") {
        setSemitoneShift((semitoneShift) => semitoneShift + 1);
      }
      if (eventKey === "ArrowLeft") {
        setSemitoneShift((semitoneShift) => semitoneShift - 1);
      }
    };
    document.addEventListener("keydown", handleArrowKeys);
    return () => {
      document.removeEventListener("keydown", handleArrowKeys);
    };
  }, []);

  return {
    semitoneShift,
  };
};

export default useSemitoneShift;
