import React, { useState, useEffect, useRef } from "react";
import { useAudioContext } from "./AudioContextWrapper.jsx";
import Key from "./Key.jsx";
import {
  keyToNoteMap,
  keyboardLayouts,
  getFrequency,
  getFullNoteName,
  isAlpha,
} from "./utils/musicUtils";

export const Keyboard = () => {
  // 使用自定义 Hook 获取音频上下文
  const audioContext = useAudioContext();

  const [activeKeys, setActiveKeys] = useState(new Set());
  const [semitoneShift, setSemitoneShift] = useState(0);
  const oscillators = useRef({});
  const gainNodes = useRef({});

  // 初始化所有振荡器
  useEffect(() => {
    // 为所有可能的键创建振荡器
    Object.keys(keyToNoteMap).forEach((key) => {
      const noteValue = keyToNoteMap[key];
      const frequency = getFrequency(noteValue, semitoneShift);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime); // 初始音量为0

      oscillator.start();

      oscillators.current[key] = oscillator;
      gainNodes.current[key] = gainNode;
    });

    // 组件卸载时停止所有振荡器
    return () => {
      Object.keys(oscillators.current).forEach((key) => {
        oscillators.current[key]?.stop();
      });
    };
  }, [audioContext]);

  // 当半音偏移改变时更新振荡器频率
  useEffect(() => {
    Object.keys(oscillators.current).forEach((key) => {
      const noteValue = keyToNoteMap[key];
      const frequency = getFrequency(noteValue, semitoneShift);
      oscillators.current[key].frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );
    });
  }, [semitoneShift, audioContext]);

  // 播放音符
  const playNote = (key) => {
    if (!keyToNoteMap[key] || !gainNodes.current[key]) return;
    gainNodes.current[key].gain.setValueAtTime(0.1, audioContext.currentTime);
    setActiveKeys((prev) => new Set(prev).add(key));
  };

  // 停止音符
  const stopNote = (key) => {
    if (!keyToNoteMap[key] || !gainNodes.current[key]) return;
    gainNodes.current[key].gain.setValueAtTime(0, audioContext.currentTime);
    setActiveKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  };

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase(); // 忽略大小写

      if (keyToNoteMap[key]) {
        event.preventDefault();
        playNote(key);
      }

      // 半音控制
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSemitoneShift(semitoneShift + 12); // 上移一个八度
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSemitoneShift(semitoneShift - 12); // 下移一个八度
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSemitoneShift(semitoneShift + 1); // 上移一个半音
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSemitoneShift(semitoneShift - 1); // 下移一个半音
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();

      if (keyToNoteMap[key]) {
        event.preventDefault();
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
        padding: "10px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>音乐键盘</h2>
      <p style={{ marginBottom: "15px" }}>当前半音偏移: {semitoneShift}</p>

      {/* 添加方向键提示图形 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "15px",
          fontFamily: "monospace",
        }}
      >
        {/* 上键 */}
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

        {/* 左、下、右键水平排列 */}
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
        {Array.from(activeKeys).length > 0
          ? `${Array.from(activeKeys)
              .map((key) => getFullNoteName(key, semitoneShift))
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
              marginLeft: `${index * 20}px`, // 为每行添加递增的左边距
            }}
          >
            <div style={{ display: "flex", gap: "5px" }}>
              {keys.map((key, keyIndex) => (
                <React.Fragment key={key}>
                  {/* 在第三个键(索引为2)和第四个键(索引为3)之间添加间隔 */}
                  {keyIndex === 3 && <div style={{ width: "15px" }}></div>}
                  <Key
                    rightUpCornerTag={keyIndex + 1}
                    isActive={activeKeys.has(key)}
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
