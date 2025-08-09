import { useEffect } from "react";

export const useWhenKeyDown = (eventKey: string, onKeyDown: (event: KeyboardEvent) => void) => {
  useEffect(() => {
    const handleEvent = (event: KeyboardEvent): void => {
      if (event.key === eventKey && !event.repeat) {
        event.preventDefault();
        onKeyDown(event);
      }
    };
    document.addEventListener("keydown", handleEvent);
    return () => {
      document.removeEventListener("keydown", handleEvent);
    };
  }, [eventKey, onKeyDown]);
};
