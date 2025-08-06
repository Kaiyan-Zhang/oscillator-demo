import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";

const AudioContext = createContext(null);

const AudioContextActiveContext = createContext(false);

export const AudioContextWrapper = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const audioContext = useRef(null);

  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    const activateAudioContext = (event) => {
      if (event.type === "keydown" && event.key !== "Enter") {
        return;
      }

      if (audioContext.current.state === "suspended") {
        audioContext.current.resume().then(() => {
          setIsActive(true);
        });
      }
    };

    document.addEventListener("keydown", activateAudioContext);

    return () => {
      document.removeEventListener("keydown", activateAudioContext);

      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  return (
    <AudioContext.Provider value={audioContext.current}>
      <AudioContextActiveContext.Provider value={isActive}>
        {!isActive ? (
          <div style={{ padding: "20px" }}>
            <h1>按下回车以开始</h1>
          </div>
        ) : (
          children
        )}
      </AudioContextActiveContext.Provider>
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error(
      "useAudioContext must be used within an AudioContextWrapper"
    );
  }
  return context;
};

export const useAudioContextActive = () => {
  const context = useContext(AudioContextActiveContext);
  if (context === undefined) {
    throw new Error(
      "useAudioContextActive must be used within an AudioContextWrapper"
    );
  }
  return context;
};
