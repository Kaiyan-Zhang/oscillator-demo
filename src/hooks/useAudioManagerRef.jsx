import { useRef, useEffect } from "react";
import AudioManager from "../utils/audioUtils.js";

export const useAudioManagerRef = ({ audioContext, semitoneShift }) => {
  const audioManagerRef = useRef(null);

  useEffect(() => {
    if (!audioContext) return;
    audioManagerRef.current = new AudioManager(audioContext);
    audioManagerRef.current.initOscillators();
    return () => {
      audioManagerRef.current?.cleanup();
    };
  }, [audioContext]);

  useEffect(() => {
    audioManagerRef.current?.updateSemitoneShift(semitoneShift);
  }, [semitoneShift]);

  return {
    playNote: (eventKey) => {
      audioManagerRef.current?.playNote(eventKey);
    },
    stopNote: (eventKey) => {
      audioManagerRef.current?.stopNote(eventKey);
    },
  };
};
