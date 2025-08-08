import { useRef, useEffect } from "react";
import { useAudioContext } from "./AudioContextWrapper.jsx";
import { AudioManager } from "./utils/audioUtils.js";

export const useAudioManager = (semitoneShift) => {
  const audioContext = useAudioContext();
  // const audioManagerRef = useRef(new AudioManager(audioContext)); // 实测这样写会有问题，但是不知道为什么

  /* 必须像下面这样写 >>>>>>>>>> */
  const audioManagerRef = useRef(null);
  useEffect(() => {
    if (audioContext) {
      audioManagerRef.current = new AudioManager(audioContext);
    }
  }, [audioContext]);
  /* 必须像上面这样写 <<<<<<<<<< */

  useEffect(() => {
    return () => {
      audioManagerRef.current?.cleanup();
    };
  }, []);

  useEffect(() => {
    audioManagerRef.current?.updateSemitoneShift(semitoneShift);
  }, [semitoneShift]);

  return audioManagerRef;
};
