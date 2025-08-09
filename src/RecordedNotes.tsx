import React, { useCallback, useEffect, useRef, useState } from "react";
import { getFullNoteNameV2, playNoteAsync } from "./utils/musicUtils";
import RecordedNote from "./RecordedNote";
import { useAudioContext } from "./AudioContextWrapper";
import { useBackspace } from "./useBackspace";
import { useEnter } from "./useEnter";
import { useWhenKeyDown } from "./utils/useWhenKeyDown";
import { Beemer } from "./Beemer";

export const RecordedNotes = ({
  semitoneStack,
  setSemitoneStack,
  setIsRecording,
}: {
  semitoneStack: number[];
  setSemitoneStack: React.Dispatch<React.SetStateAction<number[]>>;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playStartIndex, setPlayStartIndex] = useState(0);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const audioContext = useAudioContext();
  const playTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);
  const playRecording = async (startIndex: number) => {
    setCurrentPlayingIndex(startIndex);
    for (let i = startIndex; i < semitoneStack.length; i++) {
      setCurrentPlayingIndex(i);
      const semitone = semitoneStack[i];
      await playNoteAsync(audioContext, semitone, 0.2);
    }
    setIsPlaying(false);
    setCurrentPlayingIndex(-1);
  };

  const handlePlay = useCallback(
    (startIndex: number) => {
      if (isPlaying) return;
      setIsPlaying(true);
      playRecording(startIndex);
    },
    [isPlaying, playRecording]
  );

  const onSpace = useCallback(() => {
    handlePlay(playStartIndex);
  }, [handlePlay, playStartIndex]);
  useWhenKeyDown(" ", onSpace);

  useEnter(setIsRecording);

  useBackspace(setSemitoneStack);

  return (
    <>
      <Beemer semitoneStack={semitoneStack} />
      {semitoneStack
        .map((semitone) => {
          const note = getFullNoteNameV2(semitone);
          return note;
        })
        .map((fullNoteName, index) => (
          <RecordedNote
            key={index}
            fullNoteName={fullNoteName}
            isStartIndex={index === playStartIndex}
            isHighlighted={index === currentPlayingIndex}
            onClick={() => {
              setPlayStartIndex(index);
              handlePlay(index);
            }}
          />
        ))}
    </>
  );
};
