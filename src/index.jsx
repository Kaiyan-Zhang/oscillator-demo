import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { Keyboard } from "./Keyboard.jsx";

const App = () => {
  const [isAudioContextActive, setIsAudioContextActive] = useState(false);
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
          setIsAudioContextActive(true);
        });
      }
    };

    // 只监听键盘事件
    document.addEventListener("keydown", activateAudioContext);

    return () => {
      document.removeEventListener("keydown", activateAudioContext);

      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  return (
    <div className="app">
      {!isAudioContextActive ? (
        <div style={{ padding: "20px" }}>
          <h1>按下回车以开始</h1>
        </div>
      ) : (
        <Keyboard audioContext={audioContext.current} />
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.body);
root.render(<App />);
