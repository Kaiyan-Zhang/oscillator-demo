import { useRef, useEffect } from "react";
import { useAudioContext } from "../AudioContextWrapper.jsx";
import AudioManager from "../utils/audioUtils.js";
// 此文件中没有直接使用noteValue，但为了保持一致性，建议更新导入注释
import { keyToNoteMap } from "../utils/musicUtils.js"; // 键到keyNoteInt的映射关系

// 封装AudioManager引用的自定义Hook
export const useAudioManagerRef = ({ audioContext }) => {
  const audioManagerRef = useRef(null);

  // 初始化音频管理器
  useEffect(() => {
    if (!audioContext) return;

    audioManagerRef.current = new AudioManager(audioContext);
    audioManagerRef.current.initOscillators(keyToNoteMap);

    // 组件卸载时清理
    return () => {
      audioManagerRef.current?.cleanup();
    };
  }, [audioContext]);

  // 更新半音偏移
  const updateSemitoneShift = (semitoneShift) => {
    audioManagerRef?.current.updateFrequencies(keyToNoteMap, semitoneShift);
  };

  // 播放音符
  const playNote = (key) => {
    audioManagerRef.current?.playNote(key);
  };

  // 停止音符
  const stopNote = (key) => {
    audioManagerRef.current?.stopNote(key);
  };

  return {
    updateSemitoneShift,
    playNote,
    stopNote,
  };
};
