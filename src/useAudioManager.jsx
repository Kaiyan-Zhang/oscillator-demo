import { useRef, useEffect } from "react";
import { useAudioContext } from "./AudioContextWrapper.jsx";
import { AudioManager } from "./utils/audioUtils.js";

export const useAudioManager = (semitoneShift) => {
  const audioContext = useAudioContext();
  const audioManagerRef = useRef(new AudioManager(audioContext));

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
