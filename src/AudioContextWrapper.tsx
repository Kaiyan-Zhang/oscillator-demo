import React, {  // 添加 React 导入
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from "react";

interface AudioContextType {
  current: AudioContext | null;
}

const AudioContext = createContext<AudioContext | null>(null);
const AudioContextActiveContext = createContext<boolean>(false);

interface AudioContextWrapperProps {
  children: ReactNode;
}

export const AudioContextWrapper = ({ children }: AudioContextWrapperProps) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const audioContext = useRef<AudioContext | null>(null);

  useEffect(() => {
    audioContext.current = new window.AudioContext();

    const activateAudioContext = (event: KeyboardEvent) => {
      if (event.type === "keydown" && event.key !== "Enter") {
        return;
      }

      if (audioContext.current?.state === "suspended") {
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

export const useAudioContext = (): AudioContext => {
  const context = useContext(AudioContext);
  return context as AudioContext;
};
