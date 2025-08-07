import React, { useState, useEffect, useRef } from "react";
import Key from "./Key.jsx";
import {
  keyboardLayouts,
  getFullNoteName,
  isNoteKey,
  isAlpha,
} from "./utils/musicUtils";
import { useAudioManager } from "./useAudioManager.jsx";
import useSemitoneShift from "./useSemitoneShift.jsx";
import { SemitoneShiftChangerGraph } from "./SemitoneShiftChangerGraph.jsx";

export const Keyboard = () => {
  const [activeEventKey, setActiveEventKey] = useState(new Set());
  const { semitoneShift } = useSemitoneShift();
  const audioManagerRef = useAudioManager(semitoneShift);
  useEffect(() => {
    const handleNoteKeyDown = ({ key: eventKey }) => {
      if (isNoteKey(eventKey)) {
        audioManagerRef.current?.playNote(eventKey);
        setActiveEventKey((prev) => new Set(prev).add(eventKey));
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

    document.addEventListener("keydown", handleNoteKeyDown);
    document.addEventListener("keyup", handleNoteKeyUp);

    return () => {
      document.removeEventListener("keydown", handleNoteKeyDown);
      document.removeEventListener("keyup", handleNoteKeyUp);
    };
  }, []);

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
