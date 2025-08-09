import React, { useState, useEffect, useRef } from "react";  // 添加 React 导入
import NoteButton from "./NoteButton";
import {
  keyboardLayouts,
  getFullNoteName,
  isNoteKey,
  isAlpha,
  MIDDLE_C_FREQUENCY,
  getSemitone,
} from "./utils/musicUtils";
import { useAudioManager } from "./useAudioManager";
import useSemitoneShift from "./useSemitoneShift";
import { useAudioContext } from "./AudioContextWrapper";
import { KeyboardComponentsWrapper } from "./KeyboardComponentsWrapper";
import { GLOBAL_GAIN } from "./utils/audioUtils";

interface SemitoneShiftHookResult {
  semitoneShift: number;
  // 假设useSemitoneShift返回的其他属性
}

export const Keyboard = () => {
  const [activeEventKey, setActiveEventKey] = useState<Set<string>>(new Set());
  const { semitoneShift } = useSemitoneShift() as SemitoneShiftHookResult;
  const audioManagerRef = useAudioManager(semitoneShift);
  const audioContext = useAudioContext();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [semitoneStack, setSemitoneStack] = useState<number[]>([]);
  const [recordedNotes, setRecordedNotes] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimeoutRef = useRef<number | null>(null);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number>(-1);

  const playRecording = (startIndex: number = 0): void => {
    if (!audioContext || semitoneStack.length === 0 || isRecording || isPlaying) return;

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
    const handleNoteKeyDown = ({ key: eventKey, repeat }: KeyboardEvent): void => {
      if (!repeat && isNoteKey(eventKey)) {
        audioManagerRef.current?.playNote(eventKey);
        setActiveEventKey((prev) => new Set(prev).add(eventKey));

        if (isRecording) {
          const semitone = getSemitone(eventKey, semitoneShift);
          setSemitoneStack((prev) => [...prev, semitone]);
          setRecordedNotes((prev) => [
            ...prev,
            getFullNoteName(eventKey, semitoneShift) as string,
          ]);
        }
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

    const handleSpecialKeys = ({ key: eventKey, repeat }: KeyboardEvent): void => {
      if (repeat) return;

      if (eventKey === "Enter") {
        setIsRecording((prev) => !prev);
      }

      if (eventKey === "Backspace" && isRecording && semitoneStack.length > 0) {
        setSemitoneStack((prev) => prev.slice(0, -1));
        setRecordedNotes((prev) => prev.slice(0, -1));
      }

      if (eventKey === " ") {
        playRecording();
      }
    };

    document.addEventListener("keydown", handleNoteKeyDown);
    document.addEventListener("keyup", handleNoteKeyUp);
    document.addEventListener("keydown", handleSpecialKeys);

    return () => {
      document.removeEventListener("keydown", handleNoteKeyDown);
      document.removeEventListener("keyup", handleNoteKeyUp);
      document.removeEventListener("keydown", handleSpecialKeys);
    };
  }, [isRecording, semitoneStack.length, semitoneShift, isPlaying]);

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
      <h2>音乐键盘</h2>
      {/* 录音和播放状态显示 */}
      <div
        style={{
          padding: "8px 16px",
          borderRadius: "4px",
          marginBottom: "10px",
          backgroundColor: isRecording
            ? "#ffcccc"
            : isPlaying
              ? "#ffffcc"
              : "#ccffcc",
          fontWeight: "bold",
        }}
      >
        {isRecording
          ? "录音中... 再次按Enter结束录音"
          : isPlaying
            ? "播放中... 每个音符播放0.2秒"
            : semitoneStack.length > 0
              ? "按Enter继续录音 / 按空格键播放录音"
              : "准备录音 - 按Enter开始 / 按空格键播放录音"}
      </div>
      {/* 录音内容显示 */}
      {(isRecording || semitoneStack.length > 0) && (
        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          <p style={{ fontWeight: "bold" }}>已录音符:</p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {recordedNotes.map((note, index) => (
              <NoteButton
                key={index}
                note={note}
                isHighlighted={isPlaying && currentPlayingIndex === index}
                onClick={() => {
                  if (!audioContext) return;
                  const semitone = semitoneStack[index];
                  const frequency = MIDDLE_C_FREQUENCY * Math.pow(2, semitone / 12);

                  const oscillator = audioContext.createOscillator();
                  const gainNode = audioContext.createGain();

                  oscillator.type = "sine";
                  oscillator.frequency.setValueAtTime(
                    frequency,
                    audioContext.currentTime
                  );
                  oscillator.connect(gainNode);
                  gainNode.connect(audioContext.destination);
                  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                  gainNode.gain.exponentialRampToValueAtTime(
                    0.01,
                    audioContext.currentTime + 0.5
                  );

                  oscillator.start();
                  oscillator.stop(audioContext.currentTime + 0.5);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  playRecording(index);
                }}
              />
            ))}
          </div>
          {recordedNotes.length === 0 && <p>暂无</p>}
          {isRecording && (
            <p style={{ marginTop: "5px", fontSize: "12px", color: "#666" }}>
              按Backspace删除最后一个音符
            </p>
          )}
          {!isRecording && semitoneStack.length > 0 && !isPlaying && (
            <p style={{ marginTop: "5px", fontSize: "12px", color: "#666" }}>
              按空格键播放录音（每次播放都从头开始） | 按Enter继续录音
            </p>
          )}
        </div>
      )}
      {!isPlaying && (
        <KeyboardComponentsWrapper
          semitoneShift={semitoneShift}
          activeEventKey={activeEventKey}
        />
      )}
    </div>
  );
};
