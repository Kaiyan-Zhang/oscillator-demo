import React from "react";
import { SemitoneShiftChangerGraph } from "./SemitoneShiftChangerGraph";
import { ActiveNotesDisplay } from "./ActiveNotesDisplay";
import { KeyboardLayout } from "./KeyboardLayout";
import { AudioManager } from "./utils/audioUtils";
import { EventKey } from "./utils/musicUtils";

export const KeyboardComponentsWrapper = ({
  semitoneShift,
  activeEventKey,
  audioManager,
}: {
  semitoneShift: number;
  activeEventKey: Set<EventKey>;
  audioManager: React.RefObject<AudioManager | null>;
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
