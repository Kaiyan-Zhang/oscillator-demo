import React, { useEffect, useRef, useState } from "react";
import { getFullNoteNameV2, MIDDLE_C_FREQUENCY } from "./utils/musicUtils";
import NoteButton from "./NoteButton";
import { useAudioContext } from "./AudioContextWrapper";
import { GLOBAL_GAIN } from "./utils/audioUtils";

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
  const playRecording = (startIndex: number = 0): void => {
    if (isPlaying) return;
    setIsPlaying(true);
    if (!audioContext || semitoneStack.length === 0) return;

    setCurrentPlayingIndex(startIndex);
    let currentTime = audioContext.currentTime;
    const noteDuration = 0.2;

    semitoneStack.slice(startIndex).forEach((semitone, index) => {
      setTimeout(
        () => {
          setCurrentPlayingIndex(startIndex + index);
        },
        index * noteDuration * 1000
      );

      const frequency = MIDDLE_C_FREQUENCY * Math.pow(2, semitone / 12);
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        frequency,
        currentTime + index * noteDuration
      );
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(
        GLOBAL_GAIN,
        currentTime + index * noteDuration
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        currentTime + (index + 1) * noteDuration
      );

      oscillator.start(currentTime + index * noteDuration);
      oscillator.stop(currentTime + (index + 1) * noteDuration);
    });

    playTimeoutRef.current = setTimeout(
      () => {
        setIsPlaying(false);
        setCurrentPlayingIndex(-1);
      },
      semitoneStack.slice(startIndex).length * noteDuration * 1000
    ) as unknown as number;
  };

  useEffect(() => {
    const handleSpace = ({ key: eventKey, repeat }: KeyboardEvent): void => {
      if (repeat) return;
      if (eventKey === " ") {
        playRecording();
      }
    };
    document.addEventListener("keydown", handleSpace);
    return () => {
      document.removeEventListener("keydown", handleSpace);
    };
  }, [playRecording]);

  useEffect(() => {
    const handleEnter = ({ key: eventKey, repeat }: KeyboardEvent): void => {
      if (repeat) return;
      if (eventKey === "Enter") {
        setIsRecording((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, []);

  useEffect(() => {
    const handleBackspace = ({
      key: eventKey,
      repeat,
    }: KeyboardEvent): void => {
      if (repeat) return;
      if (eventKey === "Backspace") {
        setSemitoneStack((prev) => {
          if (prev.length === 0) return prev;
          return prev.slice(0, -1);
        });
      }
    };
    document.addEventListener("keydown", handleBackspace);
    return () => {
      document.removeEventListener("keydown", handleBackspace);
    };
  }, []);

  return semitoneStack
    .map((semitone) => {
      const note = getFullNoteNameV2(semitone);
      return note;
    })
    .map((fullNoteName, index) => (
      <NoteButton
        key={index}
        fullNoteName={fullNoteName}
        isHighlighted={isPlaying && currentPlayingIndex === index}
        onClick={() => {
          playRecording(index);
        }}
      />
    ));
};
