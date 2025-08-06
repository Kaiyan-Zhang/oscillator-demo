import React, { useState, useEffect } from "react";
import Key from "./Key.jsx";
import {
  keyboardLayouts,
  getFullNoteName,
  isNoteKey,
  isAlpha,
} from "./utils/musicUtils";
import { useAudioContext } from "./AudioContextWrapper.jsx";
import { useAudioManagerRef } from "./hooks/useAudioManagerRef.jsx";

export const Keyboard = () => {
  const [activeEventKey, setActiveEventKey] = useState(new Set());
  const [semitoneShift, setSemitoneShift] = useState(0);
  const audioContext = useAudioContext();
  const { updateSemitoneShift, playNote, stopNote } = useAudioManagerRef({
    audioContext,
  });

  useEffect(() => {
    updateSemitoneShift(semitoneShift);
  }, [semitoneShift, updateSemitoneShift]);

  const handlePlayNote = (eventKey) => {
    playNote(eventKey);
    setActiveEventKey((prev) => new Set(prev).add(eventKey));
  };

  const handleStopNote = (eventKey) => {
    stopNote(eventKey);
    setActiveEventKey((prev) => {
      const newSet = new Set(prev);
      newSet.delete(eventKey);
      return newSet;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const eventKey = event.key.toLowerCase();

      if (isNoteKey(eventKey)) {
        event.preventDefault();
        handlePlayNote(eventKey);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSemitoneShift(semitoneShift + 12);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSemitoneShift(semitoneShift - 12);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSemitoneShift(semitoneShift + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSemitoneShift(semitoneShift - 1);
      }
    };

    const handleKeyUp = (event) => {
      const eventKey = event.key.toLowerCase();

      if (isNoteKey(eventKey)) {
        event.preventDefault();
        handleStopNote(eventKey);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [semitoneShift, handlePlayNote, handleStopNote]);

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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "15px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#f0f0f0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "5px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            fontSize: "20px",
          }}
        >
          ↑
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontSize: "20px",
            }}
          >
            ←
          </div>

          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontSize: "20px",
            }}
          >
            ↓
          </div>

          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontSize: "20px",
            }}
          >
            →
          </div>
        </div>

        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          使用方向键调整半音
        </div>
      </div>

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
