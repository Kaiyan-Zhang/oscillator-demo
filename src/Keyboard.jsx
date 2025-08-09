import React, { useState, useEffect, useRef } from "react";
import NoteButton from "./NoteButton.jsx"; // 导入新组件
import {
  keyboardLayouts,
  getFullNoteName,
  isNoteKey,
  isAlpha,
  eventKeyToSemitone,
  noteNames,
  MIDDLE_C_FREQUENCY,
  getSemitone,
} from "./utils/musicUtils";
import { useAudioManager } from "./useAudioManager.jsx";
import useSemitoneShift from "./useSemitoneShift.jsx";
import { useAudioContext } from "./AudioContextWrapper.jsx";
import { KeyboardComponentsWrapper } from "./KeyboardComponentsWrapper.jsx";
import { GLOBAL_GAIN } from "./utils/audioUtils.js";

export const Keyboard = () => {
  const [activeEventKey, setActiveEventKey] = useState(new Set());
  const { semitoneShift } = useSemitoneShift();
  const audioManagerRef = useAudioManager(semitoneShift);
  const audioContext = useAudioContext();
  // 录音状态和半音栈
  const [isRecording, setIsRecording] = useState(false);
  const [semitoneStack, setSemitoneStack] = useState([]);
  const [recordedNotes, setRecordedNotes] = useState([]);
  // 播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimeoutRef = useRef(null);

  // 播放录音函数
  // 添加当前播放索引的状态
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);

  // 修改播放录音函数
  const playRecording = (startIndex = 0) => {
    if (semitoneStack.length === 0 || isRecording || isPlaying) return;

    setIsPlaying(true);
    setCurrentPlayingIndex(startIndex); // 设置开始播放的索引
    let currentTime = audioContext.currentTime;
    const noteDuration = 0.2; // 每个音符播放0.2秒

    semitoneStack.slice(startIndex).forEach((semitone, index) => {
      // 设置当前播放索引的定时器
      setTimeout(
        () => {
          setCurrentPlayingIndex(startIndex + index);
        },
        index * noteDuration * 1000
      );

      // 计算频率
      const frequency = MIDDLE_C_FREQUENCY * Math.pow(2, semitone / 12);

      // 创建振荡器和增益节点
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

    // 设置播放结束的定时器
    playTimeoutRef.current = setTimeout(
      () => {
        setIsPlaying(false);
        setCurrentPlayingIndex(-1);
      },
      semitoneStack.slice(startIndex).length * noteDuration * 1000
    );
  };

  // 清除播放定时器
  useEffect(() => {
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleNoteKeyDown = ({ key: eventKey, repeat }) => {
      if (!repeat && isNoteKey(eventKey)) {
        audioManagerRef.current?.playNote(eventKey);
        setActiveEventKey((prev) => new Set(prev).add(eventKey));

        // 录音时将真正的半音值压栈
        if (isRecording) {
          const semitone = getSemitone(eventKey, semitoneShift);
          setSemitoneStack((prev) => [...prev, semitone]);
          setRecordedNotes((prev) => [
            ...prev,
            getFullNoteName(eventKey, semitoneShift),
          ]);
        }
      }
    };

    const handleNoteKeyUp = ({ key: eventKey }) => {
      if (isNoteKey(eventKey)) {
        audioManagerRef.current?.stopNote(eventKey);
        setActiveEventKey((prev) => {
          const newSet = new Set(prev);
          newSet.delete(eventKey);
          return newSet;
        });
      }
    };

    // 处理回车键、backspace键和空格键
    const handleSpecialKeys = ({ key: eventKey, repeat }) => {
      if (repeat) return;

      // 回车键控制录音 - 移除了清空栈的代码
      if (eventKey === "Enter") {
        setIsRecording((prev) => !prev);
      }

      // Backspace键出栈
      if (eventKey === "Backspace" && isRecording && semitoneStack.length > 0) {
        setSemitoneStack((prev) => prev.slice(0, -1));
        setRecordedNotes((prev) => prev.slice(0, -1));
      }

      // 空格键播放录音
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
                  // 点击播放单个音符
                  const semitone = semitoneStack[index];
                  const frequency =
                    MIDDLE_C_FREQUENCY * Math.pow(2, semitone / 12);

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
                onContextMenu={() => {
                  // 右键从当前音符开始播放
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
