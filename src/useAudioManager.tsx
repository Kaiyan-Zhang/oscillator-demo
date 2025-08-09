import { useRef, useEffect } from "react";
import { useAudioContext } from "./AudioContextWrapper";
import { AudioManager } from "./utils/audioUtils";

export const useAudioManager = (semitoneShift: number) => {
  const audioContext = useAudioContext();
  const audioManagerRef = useRef<AudioManager | null>(null);

  useEffect(() => {
    if (audioContext) {
      audioManagerRef.current = new AudioManager(audioContext);
    }
  }, [audioContext]);

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
