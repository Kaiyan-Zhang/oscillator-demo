import React, { useState, useEffect, useRef } from "react";
import Key from "./Key.jsx";
import {
  keyboardLayouts,
  getFullNoteName,
  isNoteKey,
  isAlpha,
  eventKeyToSemitone,
} from "./utils/musicUtils";
import { useAudioManager } from "./useAudioManager.jsx";
import useSemitoneShift from "./useSemitoneShift.jsx";
import { SemitoneShiftChangerGraph } from "./SemitoneShiftChangerGraph.jsx";

export const Keyboard = () => {
  const [activeEventKey, setActiveEventKey] = useState(new Set());
  const { semitoneShift } = useSemitoneShift();
  const audioManagerRef = useAudioManager(semitoneShift);
  // 新增录音状态和半音栈
  const [isRecording, setIsRecording] = useState(false);
  const [semitoneStack, setSemitoneStack] = useState([]);
  const [recordedNotes, setRecordedNotes] = useState([]);

  useEffect(() => {
    const handleNoteKeyDown = ({ key: eventKey, repeat }) => {
      if (!repeat && isNoteKey(eventKey)) {
        audioManagerRef.current?.playNote(eventKey);
        setActiveEventKey((prev) => new Set(prev).add(eventKey));

        // 录音时将真正的半音值压栈
        if (isRecording) {
          const baseSemitone = eventKeyToSemitone[eventKey];
          const actualSemitone = baseSemitone + semitoneShift;
          setSemitoneStack((prev) => [...prev, actualSemitone]);
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

    // 处理回车键和backspace键
    const handleSpecialKeys = ({ key: eventKey, repeat }) => {
      if (repeat) return;

      // 回车键控制录音
      if (eventKey === "Enter") {
        setIsRecording((prev) => !prev);
        if (!isRecording) {
          // 开始录音时清空栈
          setSemitoneStack([]);
          setRecordedNotes([]);
        }
      }

      // Backspace键出栈
      if (eventKey === "Backspace" && isRecording && semitoneStack.length > 0) {
        setSemitoneStack((prev) => prev.slice(0, -1));
        setRecordedNotes((prev) => prev.slice(0, -1));
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
  }, [isRecording, semitoneStack.length, semitoneShift]);

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
      <p style={{ marginBottom: "15px" }}>当前半音偏移: {semitoneShift}</p>

      {/* 录音状态显示 */}
      <div
        style={{
          padding: "8px 16px",
          borderRadius: "4px",
          marginBottom: "10px",
          backgroundColor: isRecording ? "#ffcccc" : "#ccffcc",
          fontWeight: "bold",
        }}
      >
        {isRecording ? "录音中... 再次按Enter结束录音" : "准备录音 - 按Enter开始"}
      </div>

      {/* 录音内容显示 */}
      {isRecording && (
        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          <p style={{ fontWeight: "bold" }}>已录音符:</p>
          <p>{recordedNotes.join(" → ") || "暂无"}</p>
          <p style={{ marginTop: "5px", color: "#666" }}>
            半音栈: [{semitoneStack.join(", ")}]
          </p>
          <p style={{ marginTop: "5px", fontSize: "12px", color: "#666" }}>
            按Backspace删除最后一个音符
          </p>
        </div>
      )}

      <SemitoneShiftChangerGraph />

      <p
        style={{
          marginTop: "5px",
          marginBottom: "15px",
          fontWeight: "bold",
          color: "#4CAF50",
        }}
      >
        {Array.from(activeEventKey).length > 0
          ? `${Array.from(activeEventKey)
              .map((eventKey) => getFullNoteName(eventKey, semitoneShift))
              .join(", ")}`
          : "--"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {keyboardLayouts.map((keys, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: `${index * 20}px`,
            }}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              {keys.map((key, keyIndex) => (
                <React.Fragment key={key}>
                  {keyIndex === 3 && <div style={{ width: "15px" }}></div>}
                  <Key
                    rightUpCornerTag={keyIndex + 1}
                    isActive={activeEventKey.has(key)}
                  >
                    {isAlpha(key) ? key.toUpperCase() : key}
                  </Key>
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
