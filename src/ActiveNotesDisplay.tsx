import React from "react";
import { getFullNoteName } from "./utils/musicUtils";

interface ActiveNotesDisplayProps {
  activeEventKey: Set<string>;
  semitoneShift: number;
}

export const ActiveNotesDisplay = ({ activeEventKey, semitoneShift }: ActiveNotesDisplayProps) => {
  return (
    <p
      style={{
        marginTop: "5px",
        marginBottom: "15px",
        fontWeight: "bold",
        color: "#4CAF50",
      }}
    >
      {Array.from(activeEventKey).length > 0
        ? `${Array.from(activeEventKey)
            .map((eventKey) => getFullNoteName(eventKey, semitoneShift) as string)
            .join(", ")}`
        : "--"}
    </p>
  );
};
