import { useRef, useEffect } from "react";
import { useAudioContext } from "../AudioContextWrapper.jsx";
import AudioManager from "../utils/audioUtils.js";
import { keyToNoteMap } from "../utils/musicUtils.js";

export const useAudioManagerRef = ({ audioContext }) => {
  const audioManagerRef = useRef(null);

  useEffect(() => {
    if (!audioContext) return;

    audioManagerRef.current = new AudioManager(audioContext);
    audioManagerRef.current.initOscillators(keyToNoteMap);

    return () => {
      audioManagerRef.current?.cleanup();
    };
  }, [audioContext]);

  const updateSemitoneShift = (semitoneShift) => {
    audioManagerRef?.current.updateFrequencies(keyToNoteMap, semitoneShift);
  };

  const playNote = (key) => {
    audioManagerRef.current?.playNote(key);
  };

  const stopNote = (key) => {
    audioManagerRef.current?.stopNote(key);
  };

  return {
    updateSemitoneShift,
    playNote,
    stopNote,
  };
};
