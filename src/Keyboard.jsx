import React, { useState, useEffect, useRef } from "react";
import { useAudioContext } from "./AudioContextWrapper.jsx";
import Key from "./Key.jsx";

export const Keyboard = () => {
  // 使用自定义 Hook 获取音频上下文
  const audioContext = useAudioContext();

  // 定义中央 C (C4) 的频率
  const MIDDLE_C_FREQUENCY = 261.63;

  // 定义音符名称
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  // 定义键到音符的映射关系 (C4=0，半音为1)
  const keyToNoteMap = {
    1: 24, // C6 (高八度)
    2: 26, // D6
    3: 28, // E6
    4: 29, // F6
    5: 31, // G6
    6: 33, // A6
    7: 35, // B6
    q: 12, // C5
    w: 14, // D5
    e: 16, // E5
    r: 17, // F5
    t: 19, // G5
    y: 21, // A5
    u: 23, // B5
    a: 0, // C4 (中央C)
    s: 2, // D4
    d: 4, // E4
    f: 5, // F4
    g: 7, // G4
    h: 9, // A4
    j: 11, // B4
  };

  const [activeKeys, setActiveKeys] = useState(new Set());
  const [semitoneShift, setSemitoneShift] = useState(0);
  const oscillators = useRef({});
  const gainNodes = useRef({});

  // 初始化所有振荡器
  useEffect(() => {
    // 为所有可能的键创建振荡器
    Object.keys(keyToNoteMap).forEach((key) => {
      const noteValue = keyToNoteMap[key];
      const frequency = getFrequency(noteValue);

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
      const frequency = getFrequency(noteValue);
      oscillators.current[key].frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );
    });
  }, [semitoneShift, audioContext]);

  // 计算音符频率
  const getFrequency = (noteValue) => {
    // C4=0，每半音增加1，公式：频率 = 基准频率 * 2^(总半音数/12)
    const totalSemitones = noteValue + semitoneShift;
    return MIDDLE_C_FREQUENCY * Math.pow(2, totalSemitones / 12);
  };

  // 获取音符名称 (1-7级数)
  const getNoteName = (key) => {
    if (!keyToNoteMap[key]) return null;
    const noteValue = keyToNoteMap[key];
    // 计算在自然大调音阶中的位置 (C=1, D=2, ..., B=7)
    const scaleDegree =
      [1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7][noteValue % 12] || 1;
    return scaleDegree.toString();
  };

  // 获取完整音符名称（包含八度）
  const getFullNoteName = (key) => {
    if (!keyToNoteMap[key]) return null;
    const noteValue = keyToNoteMap[key];
    const octave = 4 + Math.floor(noteValue / 12); // C4=0，每12个半音升一个八度
    const noteIndex = noteValue % 12;
    return `${noteNames[noteIndex]}${octave}`;
  };

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
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setSemitoneShift(semitoneShift + 1); // 上移一个半音
      }
      if (event.key === "-" || event.key === "_") {
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

  // 键盘布局配置
  const keyboardLayouts = [
    ["1", "2", "3", "4", "5", "6", "7"], // C6, D6, E6, F6, G6, A6, B6
    ["q", "w", "e", "r", "t", "y", "u"], // C5, D5, E5, F5, G5, A5, B5
    ["a", "s", "d", "f", "g", "h", "j"], // C4, D4, E4, F4, G4, A4, B4
  ];

  // 判断字符是否为英文字母
  const isAlpha = (char) => {
    const code = char.charCodeAt(0);
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
  };

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
      <p style={{ marginBottom: "10px" }}>
        方向键上下: 改变八度 | +/-键: 改变半音
      </p>
      <p style={{ marginBottom: "15px" }}>当前半音偏移: {semitoneShift}</p>

      <p
        style={{
          marginTop: "5px",
          marginBottom: "15px",
          fontWeight: "bold",
          color: "#4CAF50",
        }}
      >
        {Array.from(activeKeys).length > 0
          ? `当前按下: ${Array.from(activeKeys)
              .map((key) => `${getFullNoteName(key)}`)
              .join(", ")}`
          : "未按下任何键"}
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
                    rightUpCornerTag={getNoteName(key)}
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
