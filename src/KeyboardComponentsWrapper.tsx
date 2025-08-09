import React, { useEffect, useState } from "react";
import { ShowFullNoteName } from "./ShowFullNoteName";
import { KeyboardLayout } from "./KeyboardLayout";
import { EventKey, isNoteKey } from "./utils/musicUtils";
import { AudioManager } from "./utils/audioUtils";

export const KeyboardComponentsWrapper = ({
  semitoneShift,
  audioManagerRef,
  recordNote,
}: {
  semitoneShift: number;
  audioManagerRef: React.RefObject<AudioManager | null>;
  recordNote: (eventKey: EventKey) => void;
}) => {
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
