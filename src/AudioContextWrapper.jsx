import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";

// 创建音频上下文的 Context
const AudioContext = createContext(null);

// 创建激活状态的 Context
const AudioContextActiveContext = createContext(false);

export const AudioContextWrapper = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const audioContext = useRef(null);

  useEffect(() => {
    // 创建音频上下文
    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    // 激活音频上下文的函数
    const activateAudioContext = (event) => {
      // 只在按下回车键时激活
      if (event.type === "keydown" && event.key !== "Enter") {
        return;
      }

      if (audioContext.current.state === "suspended") {
        audioContext.current.resume().then(() => {
          setIsActive(true);
        });
      }
    };

    // 监听键盘事件
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

// 自定义 Hook，用于获取音频上下文
export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error(
      "useAudioContext must be used within an AudioContextWrapper"
    );
  }
  return context;
};

// 自定义 Hook，用于获取音频上下文激活状态
export const useAudioContextActive = () => {
  const context = useContext(AudioContextActiveContext);
  if (context === undefined) {
    throw new Error(
      "useAudioContextActive must be used within an AudioContextWrapper"
    );
  }
  return context;
};
