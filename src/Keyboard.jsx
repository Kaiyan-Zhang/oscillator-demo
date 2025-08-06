import React, { useState, useEffect, useRef } from "react";
import { useAudioContext } from "./AudioContextWrapper.jsx";
import Key from "./Key.jsx";

export const Keyboard = () => {
  // 使用自定义 Hook 获取音频上下文
  const audioContext = useAudioContext();

  // 定义中央 C (C4) 的频率
  const MIDDLE_C_FREQUENCY = 261.63;

  // 定义音符名称 - 修改为CDE、FGAB
  const noteNames = ["C", "D", "E", "F", "G", "A", "B"];

  // 定义键到音符的映射关系
  const keyToNoteMap = {
    1: { index: 0, octaveOffset: 2 }, // C6 (高八度)
    2: { index: 1, octaveOffset: 2 }, // D6
    3: { index: 2, octaveOffset: 2 }, // E6
    4: { index: 3, octaveOffset: 2 }, // F6
    5: { index: 4, octaveOffset: 2 }, // G6
    6: { index: 5, octaveOffset: 2 }, // A6
    7: { index: 6, octaveOffset: 2 }, // B6
    q: { index: 0, octaveOffset: 1 }, // C5
    w: { index: 1, octaveOffset: 1 }, // D5
    e: { index: 2, octaveOffset: 1 }, // E5
    r: { index: 3, octaveOffset: 1 }, // F5
    t: { index: 4, octaveOffset: 1 }, // G5
    y: { index: 5, octaveOffset: 1 }, // A5
    u: { index: 6, octaveOffset: 1 }, // B5
    a: { index: 0, octaveOffset: 0 }, // C4 (中央C)
    s: { index: 1, octaveOffset: 0 }, // D4
    d: { index: 2, octaveOffset: 0 }, // E4
    f: { index: 3, octaveOffset: 0 }, // F4
    g: { index: 4, octaveOffset: 0 }, // G4
    h: { index: 5, octaveOffset: 0 }, // A4
    j: { index: 6, octaveOffset: 0 }, // B4
  };

  const [activeKeys, setActiveKeys] = useState(new Set());
  const [semitoneShift, setSemitoneShift] = useState(0);
  const oscillators = useRef({});
  const gainNodes = useRef({});

  // 初始化所有振荡器
  useEffect(() => {
    // 为所有可能的键创建振荡器
    Object.keys(keyToNoteMap).forEach((key) => {
      const { index, octaveOffset } = keyToNoteMap[key];
      const frequency = getFrequency(index, octaveOffset);

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
      const { index, octaveOffset } = keyToNoteMap[key];
      const frequency = getFrequency(index, octaveOffset);
      oscillators.current[key].frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );
    });
  }, [semitoneShift, audioContext]);

  // 计算音符频率
  const getFrequency = (noteIndex, octaveOffset) => {
    // 计算基本频率 (C4 为基准)
    const baseFrequency = MIDDLE_C_FREQUENCY * Math.pow(2, octaveOffset);
    // 根据音符索引计算频率 (全音阶)
    const scaleRatio = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8][
      noteIndex
    ];
    // 应用半音偏移
    const shiftedFrequency =
      baseFrequency * scaleRatio * Math.pow(2, semitoneShift / 12);
    return shiftedFrequency;
  };

  // 获取音符名称
  // 获取级数 (1-7)
  const getNoteName = (key) => {
    if (!keyToNoteMap[key]) return null;
    const { index } = keyToNoteMap[key];
    return (index + 1).toString(); // 返回1-7的级数
  };

  // 获取完整音符名称（包含八度）
  const getFullNoteName = (key) => {
    if (!keyToNoteMap[key]) return null;
    const { index, octaveOffset } = keyToNoteMap[key];
    const octave = 4 + octaveOffset; // 中央C是C4
    return `${noteNames[index]}${octave}`;
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

  // 键盘布局配置 - 简化为直接的键数组
  const keyboardLayouts = [
    ["1", "2", "3", "4", "5", "6", "7"], // C6, D6, E6, F6, G6, A6, B6
    ["q", "w", "e", "r", "t", "y", "u"], // C5, D5, E5, F5, G5, A5, B5
    ["a", "s", "d", "f", "g", "h", "j"], // C4, D4, E4, F4, G4, A4, B4
  ];

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
                    keyValue={key}
                    noteName={getNoteName(key)}
                    isActive={activeKeys.has(key)}
                    onPlay={() => playNote(key)}
                    onStop={() => stopNote(key)}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
