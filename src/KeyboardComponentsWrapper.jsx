import React from "react";
import { SemitoneShiftChangerGraph } from "./SemitoneShiftChangerGraph.jsx";
import { ActiveNotesDisplay } from "./ActiveNotesDisplay.jsx";
import { KeyboardLayout } from "./KeyboardLayout.jsx";

export const KeyboardComponentsWrapper = ({
  semitoneShift,
  activeEventKey,
}) => {
  return (
    <>
      <SemitoneShiftChangerGraph semitoneShift={semitoneShift} />
      <ActiveNotesDisplay
        activeEventKey={activeEventKey}
        semitoneShift={semitoneShift}
      />
      <KeyboardLayout activeEventKey={activeEventKey} />
    </>
  );
};
