import React from "react";
import { getFullNoteName } from "./utils/musicUtils";

export const ActiveNotesDisplay = ({ activeEventKey, semitoneShift }) => {
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
            .map((eventKey) => getFullNoteName(eventKey, semitoneShift))
            .join(", ")}`
        : "--"}
    </p>
  );
};
