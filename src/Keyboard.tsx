import React, { useState, useCallback } from "react";
import { getSemitoneByEventKey, EventKey } from "./utils/musicUtils";
import { useSemitoneShift } from "./useSemitoneShift";
import { KeyboardComponentsWrapper } from "./KeyboardComponentsWrapper";
import { RecordedNotes } from "./RecordedNotes";

export const Keyboard = () => {
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
  return (
    <div>
      <div>Semitone Shift: {semitoneShift}</div>
      {isRecording && <div>Recording</div>}
      <RecordedNotes
        semitoneStack={semitoneStack}
        setIsRecording={setIsRecording}
        setSemitoneStack={setSemitoneStack}
      />
      <KeyboardComponentsWrapper
        semitoneShift={semitoneShift}
        recordNote={recordNote}
      />
    </div>
  );
};
