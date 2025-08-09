import { useEffect } from "react";

export function useEnter(setIsRecording: React.Dispatch<React.SetStateAction<boolean>>) {
  useEffect(() => {
    const handleEnter = ({ key: eventKey, repeat }: KeyboardEvent): void => {
      if (repeat) return;
      if (eventKey === "Enter") {
        setIsRecording((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleEnter);
    return () => {
      document.removeEventListener("keydown", handleEnter);
    };
  }, [setIsRecording]);
}