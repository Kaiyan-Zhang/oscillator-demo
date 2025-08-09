import { useRef, useEffect } from "react";
import { useAudioContext } from "./AudioContextWrapper";
import { AudioManager } from "./utils/audioUtils";

export function useAudioManager(semitoneShift: number): React.RefObject<AudioManager | null> {
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
