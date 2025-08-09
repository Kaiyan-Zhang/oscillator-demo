import React, { useState, useEffect, useRef, useCallback } from "react"; // 添加 React 导入
import NoteButton from "./NoteButton";
import {
  keyboardLayouts,
  getFullNoteName,
  isNoteKey,
  isAlpha,
  MIDDLE_C_FREQUENCY,
  getSemitoneByEventKey,
  EventKey,
  getFullNoteNameV2,
} from "./utils/musicUtils";
import { useAudioManager } from "./useAudioManager";
import { useSemitoneShift } from "./useSemitoneShift";
import { useAudioContext } from "./AudioContextWrapper";
import { KeyboardComponentsWrapper } from "./KeyboardComponentsWrapper";
import { GLOBAL_GAIN } from "./utils/audioUtils";

export const Keyboard = () => {
  const { semitoneShift, semitoneShiftChangerGraph } = useSemitoneShift();

  const audioManagerRef = useAudioManager(semitoneShift);
  const audioContext = useAudioContext();
  const [isRecording, setIsRecording] = useState(false);
  const [semitoneStack, setSemitoneStack] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimeoutRef = useRef<number | null>(null);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number>(-1);

  const playRecording = (startIndex: number = 0): void => {
    if (!audioContext || semitoneStack.length === 0 || isRecording || isPlaying)
      return;

    setIsPlaying(true);
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
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {
        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          <p style={{ fontWeight: "bold" }}>已录音符:</p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {semitoneStack
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
              ))}
          </div>
        </div>
      }
      {!isPlaying && (
        <>
          {semitoneShiftChangerGraph}
          <KeyboardComponentsWrapper
            semitoneShift={semitoneShift}
            audioManagerRef={audioManagerRef}
            recordNote={recordNote}
          />
        </>
      )}
    </div>
  );
};
