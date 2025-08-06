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

  const playNote = (eventKey) => {
    audioManagerRef.current?.playNote(eventKey);
  };

  const stopNote = (eventKey) => {
    audioManagerRef.current?.stopNote(eventKey);
  };

  return {
    updateSemitoneShift,
    playNote,
    stopNote,
  };
};
