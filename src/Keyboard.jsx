import React, { useState, useEffect, useRef } from 'react';
import { useAudioContext } from './AudioContextWrapper.jsx';
import Key from './Key.jsx';

export const Keyboard = () => {
  // 使用自定义 Hook 获取音频上下文
  const audioContext = useAudioContext();

  // 定义中央 C (C4) 的频率
  const MIDDLE_C_FREQUENCY = 261.63;

  // 定义音符名称
  const noteNames = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];

  // 定义键到音符的映射关系
  const keyToNoteMap = {
    '1': { index: 0, octaveOffset: 1 },  // C5 (高八度)
    '2': { index: 1, octaveOffset: 1 },  // D5
    '3': { index: 2, octaveOffset: 1 },  // E5
    '4': { index: 3, octaveOffset: 1 },  // F5
    '5': { index: 4, octaveOffset: 1 },  // G5
    '6': { index: 5, octaveOffset: 1 },  // A5
    '7': { index: 6, octaveOffset: 1 },  // B5
    'q': { index: 0, octaveOffset: 0 },  // C4 (中央C)
    'w': { index: 1, octaveOffset: 0 },  // D4
    'e': { index: 2, octaveOffset: 0 },  // E4
    'r': { index: 3, octaveOffset: 0 },  // F4
    't': { index: 4, octaveOffset: 0 },  // G4
    'y': { index: 5, octaveOffset: 0 },  // A4
    'u': { index: 6, octaveOffset: 0 },  // B4
    'a': { index: 0, octaveOffset: -1 }, // C3 (低八度)
    's': { index: 1, octaveOffset: -1 }, // D3
    'd': { index: 2, octaveOffset: -1 }, // E3
    'f': { index: 3, octaveOffset: -1 }, // F3
    'g': { index: 4, octaveOffset: -1 }, // G3
    'h': { index: 5, octaveOffset: -1 }, // A3
    'j': { index: 6, octaveOffset: -1 }, // B3
  };

  const [activeKeys, setActiveKeys] = useState(new Set());
  const [semitoneShift, setSemitoneShift] = useState(0);
  const oscillators = useRef({});
  const gainNodes = useRef({});

  // 初始化所有振荡器
  useEffect(() => {
    // 为所有可能的键创建振荡器
    Object.keys(keyToNoteMap).forEach(key => {
      const { index, octaveOffset } = keyToNoteMap[key];
      const frequency = getFrequency(index, octaveOffset);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
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
      Object.keys(oscillators.current).forEach(key => {
        oscillators.current[key]?.stop();
      });
    };
  }, [audioContext]);

  // 当半音偏移改变时更新振荡器频率
  useEffect(() => {
    Object.keys(oscillators.current).forEach(key => {
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
    const scaleRatio = [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8][noteIndex];
    // 应用半音偏移
    const shiftedFrequency = baseFrequency * scaleRatio * Math.pow(2, semitoneShift / 12);
    return shiftedFrequency;
  };

  // 获取音符名称
  const getNoteName = (key) => {
    if (!keyToNoteMap[key]) return null;
    const { index, octaveOffset } = keyToNoteMap[key];
    const octave = 4 + octaveOffset; // 中央C是C4
    return `${noteNames[index]}${octave}`;
  };

  // 播放音符
  const playNote = (key) => {
    if (!keyToNoteMap[key] || !gainNodes.current[key]) return;
    gainNodes.current[key].gain.setValueAtTime(0.1, audioContext.currentTime);
    setActiveKeys(prev => new Set(prev).add(key));
  };

  // 停止音符
  const stopNote = (key) => {
    if (!keyToNoteMap[key] || !gainNodes.current[key]) return;
    gainNodes.current[key].gain.setValueAtTime(0, audioContext.currentTime);
    setActiveKeys(prev => {
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
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSemitoneShift(semitoneShift + 12); // 上移一个八度
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSemitoneShift(semitoneShift - 12); // 下移一个八度
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        setSemitoneShift(semitoneShift + 1); // 上移一个半音
      }
      if (event.key === '-' || event.key === '_') {
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

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [semitoneShift]);

  // 键盘布局配置 - 移除了标签
  const keyboardLayouts = [
    { keys: ['1', '2', '3', '4', '5', '6', '7'] },
    { keys: ['q', 'w', 'e', 'r', 't', 'y', 'u'] },
    { keys: ['a', 's', 'd', 'f', 'g', 'h', 'j'] },
  ];

  // 渲染键盘
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px', // 减少整体内边距
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2>音乐键盘</h2>
      <p style={{ marginBottom: '10px' }}>方向键上下: 改变八度 | +/-键: 改变半音</p>
      <p style={{ marginBottom: '15px' }}>当前半音偏移: {semitoneShift}</p>

      <p style={{ marginTop: '5px', marginBottom: '15px', fontWeight: 'bold', color: '#4CAF50' }}>
        {Array.from(activeKeys).length > 0
          ? `当前按下: ${Array.from(activeKeys).map(key => `${key} (${getNoteName(key)})`).join(', ')}`
          : '未按下任何键'}
      </p>

      {/* 紧凑布局：减少间距和边距 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {keyboardLayouts.map((layout, index) => (
          <div key={index} style={{ display: 'flex', gap: '5px' }}> {/* 减少键之间的间距 */}
            {layout.keys.map((key) => (
              <Key
                key={key}
                keyValue={key}
                noteName={getNoteName(key)}
                isActive={activeKeys.has(key)}
                onPlay={() => playNote(key)}
                onStop={() => stopNote(key)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
