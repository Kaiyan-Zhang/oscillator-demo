import React, { useState, useCallback } from "react";
import { getSemitoneByEventKey, EventKey } from "./utils/musicUtils";
import { useSemitoneShift } from "./useSemitoneShift";
import { RecordedNotes } from "./RecordedNotes";
import { useActiveEventKey } from "./useActiveEventKey";
import { KeyboardLayout } from "./KeyboardLayout";
import { TiktokSetter } from "./TiktokSetter";

export const Main = () => {
  const semitoneShift = useSemitoneShift();

  const [isRecording, setIsRecording] = useState(false);
  const [semitoneStack, setSemitoneStack] = useState<number[]>([]);
  const recordNote = useCallback(
    (eventKey: EventKey) => {
      if (isRecording) {
        const semitone = getSemitoneByEventKey(eventKey, semitoneShift);
        setSemitoneStack((prev) => [...prev, semitone]);
      }
    },
    [isRecording, semitoneShift]
  );
  const { activeEventKey, activeFullNoteNames } = useActiveEventKey({
    semitoneShift,
    recordNote,
  });
  return (
    <div>
      <TiktokSetter />
      <div>Semitone Shift: {semitoneShift}</div>
      {isRecording && <div>Recording</div>}
      <RecordedNotes
        semitoneStack={semitoneStack}
        setIsRecording={setIsRecording}
        setSemitoneStack={setSemitoneStack}
      />
      {activeFullNoteNames}
      <KeyboardLayout activeEventKey={activeEventKey} />
    </div>
  );
};
