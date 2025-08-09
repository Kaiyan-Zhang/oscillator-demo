import { useCallback, useEffect } from "react";
import { useWhenKeyDown } from "./utils/useWhenKeyDown";

export function useEnter(
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>
) {
  const onEnter = useCallback(() => {
    setIsRecording((prev) => !prev);
  }, [setIsRecording]);
  useWhenKeyDown("Enter", onEnter);
}
