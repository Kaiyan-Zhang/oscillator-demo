import React, { useEffect, useState } from "react";
import { ShowFullNoteName } from "./ShowFullNoteName";
import { KeyboardLayout } from "./KeyboardLayout";
import { EventKey, isNoteKey } from "./utils/musicUtils";
import { useAudioManager } from "./useAudioManager";

export const KeyboardComponentsWrapper = ({
  semitoneShift,
  recordNote,
}: {
  semitoneShift: number;
  recordNote: (eventKey: EventKey) => void;
}) => {
  const audioManagerRef = useAudioManager(semitoneShift);
  const [activeEventKey, setActiveEventKey] = useState<Set<EventKey>>(new Set());
  useEffect(() => {
    const handleNoteKeyDown = ({ key: eventKey, repeat }: KeyboardEvent): void => {
      if (!repeat && isNoteKey(eventKey)) {
        audioManagerRef.current?.playNote(eventKey);
        setActiveEventKey((prev) => new Set(prev).add(eventKey));
        recordNote(eventKey);
      }
    };

    const handleNoteKeyUp = ({ key: eventKey }: KeyboardEvent): void => {
      if (isNoteKey(eventKey)) {
        audioManagerRef.current?.stopNote(eventKey);
        setActiveEventKey((prev) => {
          const newSet = new Set(prev);
          newSet.delete(eventKey);
          return newSet;
        });
      }
    };
    document.addEventListener("keydown", handleNoteKeyDown);
    document.addEventListener("keyup", handleNoteKeyUp);

    return () => {
      document.removeEventListener("keydown", handleNoteKeyDown);
      document.removeEventListener("keyup", handleNoteKeyUp);
    };
  }, [recordNote, semitoneShift]);
  return (
    <>
      <ShowFullNoteName
        activeEventKey={activeEventKey}
        semitoneShift={semitoneShift}
      />
      <KeyboardLayout activeEventKey={activeEventKey} />
    </>
  );
};
