import React from "react";
import { getFullNoteName } from "./utils/musicUtils";
import { EventKey } from "./utils/musicUtils";

interface IActiveFullNoteNamesProps {
  activeEventKey: Set<EventKey>;
  semitoneShift: number;
}

export const ActiveFullNoteNames = ({
  activeEventKey,
  semitoneShift,
}: IActiveFullNoteNamesProps) => {
  return (
    <div>
      {Array.from(activeEventKey).length > 0
        ? `${Array.from(activeEventKey)
            .map(
              (eventKey) => getFullNoteName(eventKey, semitoneShift) as string
            )
            .join(", ")}`
        : "--"}
    </div>
  );
};
