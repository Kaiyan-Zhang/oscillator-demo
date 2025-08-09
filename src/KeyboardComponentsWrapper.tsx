import React from "react";
import { SemitoneShiftChangerGraph } from "./SemitoneShiftChangerGraph";
import { ActiveNotesDisplay } from "./ActiveNotesDisplay";
import { KeyboardLayout } from "./KeyboardLayout";

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
