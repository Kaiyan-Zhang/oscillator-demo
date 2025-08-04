import React, { useState, useEffect, useRef } from "react";
import { useAudioContext } from "./AudioContextWrapper.jsx";

export const Keyboard = () => {
  // 使用自定义 Hook 获取音频上下文
  const audioContext = useAudioContext();

  // Define note names and frequencies
  const baseScale = [
    { name: "Do", frequency: 261.63 }, // C4 (Do)
    { name: "Re", frequency: 293.66 }, // D4 (Re)
    { name: "Mi", frequency: 329.63 }, // E4 (Mi)
    { name: "Fa", frequency: 349.23 }, // F4 (Fa)
    { name: "Sol", frequency: 392.0 }, // G4 (Sol)
    { name: "La", frequency: 440.0 }, // A4 (La)
    { name: "Si", frequency: 493.88 }, // B4 (Si)
  ];

  const [activeKey, setActiveKey] = useState(null);
  const [semitoneShift, setSemitoneShift] = useState(0);
  const oscillators = useRef({});
  const gainNodes = useRef({});

  // Initialize all oscillators when component mounts
  useEffect(() => {
    // Create oscillators for all 7 notes
    for (let i = 1; i <= 7; i++) {
      const noteIndex = i - 1;
      const frequency = getTransposedFrequency(noteIndex);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start with volume 0

      oscillator.start();

      oscillators.current[i] = oscillator;
      gainNodes.current[i] = gainNode;
    }

    // Cleanup function to stop all oscillators when component unmounts
    return () => {
      for (let i = 1; i <= 7; i++) {
        oscillators.current[i]?.stop();
      }
    };
  }, [audioContext]);

  // Update oscillator frequencies when semitoneShift changes
  useEffect(() => {
    for (let i = 1; i <= 7; i++) {
      const noteIndex = i - 1;
      const frequency = getTransposedFrequency(noteIndex);
      oscillators.current[i].frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );
    }
  }, [semitoneShift, audioContext]);

  // Calculate note frequency (considering semitone shifts)
  const getTransposedFrequency = (noteIndex) => {
    let frequency = baseScale[noteIndex].frequency;
    frequency *= Math.pow(2, semitoneShift / 12); // Semitone change (includes octave shifts)
    return frequency;
  };

  // Get note name from key
  const getNoteName = (key) => {
    if (!key) return null;
    const noteIndex = parseInt(key) - 1;
    return baseScale[noteIndex]?.name || null;
  };

  // Function to play a note
  const playNote = (key) => {
    if (!gainNodes.current[key]) return;
    gainNodes.current[key].gain.setValueAtTime(0.1, audioContext.currentTime); // Set volume
    console.log("Playing note:", key); // 添加调试日志
    setActiveKey(key);
  };

  // Function to stop a note
  const stopNote = (key) => {
    if (!gainNodes.current[key]) return;
    gainNodes.current[key].gain.setValueAtTime(0, audioContext.currentTime); // Mute
    console.log("Stopping note:", key); // 添加调试日志
    // 只有当释放的是当前激活的键时，才清除 activeKey
    if (activeKey === key) {
      setActiveKey(null);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if (key >= "1" && key <= "7") {
        event.preventDefault(); // 防止默认行为
        playNote(key);
      }

      // Semitone controls (12 semitones = 1 octave)
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSemitoneShift(semitoneShift + 12); // Up one octave
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSemitoneShift(semitoneShift - 12); // Down one octave
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setSemitoneShift(semitoneShift + 1); // Up one semitone
      }
      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        setSemitoneShift(semitoneShift - 1); // Down one semitone
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key;
      if (key >= "1" && key <= "7") {
        event.preventDefault(); // 防止默认行为
        stopNote(key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [semitoneShift]);

  // 渲染键盘
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h2>音乐键盘</h2>
      <p>按键 1-7 播放音符，方向键上下改变八度，+/- 改变半音</p>
      <p>当前半音偏移: {semitoneShift}</p>
      <p style={{ marginTop: "10px", fontWeight: "bold", color: "#4CAF50" }}>
        {activeKey
          ? `当前按下: ${activeKey} (${getNoteName(activeKey)})`
          : "未按下任何键"}
      </p>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {["1", "2", "3", "4", "5", "6", "7"].map((key) => (
          <button
            key={key}
            style={{
              width: "60px",
              height: "120px",
              fontSize: "18px",
              backgroundColor: activeKey === key ? "#4CAF50" : "#f0f0f0",
              border: activeKey === key ? "3px solid #2E7D32" : "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
              boxShadow:
                activeKey === key
                  ? "0 0 15px rgba(76, 175, 80, 0.7)" : "0 2px 4px rgba(0,0,0,0.1)",
              transform:
                activeKey === key
                  ? "scale(1.05) translateY(-5px)" : "scale(1) translateY(0)",
              transition: "all 0.2s ease-in-out",
              outline: "none",
              zIndex: activeKey === key ? 1 : 0,
            }}
            onClick={() => playNote(key)}
            onMouseDown={() => playNote(key)}
            onMouseUp={() => stopNote(key)}
            onMouseLeave={() => stopNote(key)}
          >
            {key}
            <br />
            {getNoteName(key)}
          </button>
        ))}
      </div>
    </div>
  );
};
