import React, { useCallback, useState } from "react";
import { useAudioContext } from "./AudioContextWrapper";
import { playATiktok } from "./utils/musicUtils";
import { useWhenKeyDown } from "./utils/useWhenKeyDown";

// 添加CSS动画定义
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes tiktok {
  0% { transform: none; }
  50% { transform: scaleY(-1); }
  100% { transform: none; }
}
`;
document.head.appendChild(styleSheet);

const Tiktok = ({ bpm }: { bpm: number }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const oO = useCallback(() => {
    setIsPlaying((v) => !v);
  }, []);
  useWhenKeyDown("o", oO);
  const halfCycle = 60000 / bpm;
  return (
    <div
      style={
        isPlaying
          ? {
              animation: isPlaying ? `tiktok ${2 * halfCycle}ms infinite` : "none",
            }
          : undefined
      }
    >
      Tiktok
    </div>
  );
};

// 一个简单的用于确定BPM的组件，用户有节奏地按下p键，调用playATiktok发出一个节拍音
// 每次用户按下p都会刷新最新的BPM，默认BPM为120
// 至少要按两下键才能确定BPM
export const TiktokSetter = () => {
  const [bpm, setBpm] = useState(120);
  const [timeStampList, setTimeStampList] = useState<number[]>([]);
  const [textDirection, setTextDirection] = useState(true);
  const audioContext = useAudioContext();
  const onP = useCallback(() => {
    const currentTime = Date.now();
    setTimeStampList((prev) => {
      const newTimes = [...prev, currentTime].slice(-8);
      if (newTimes.length >= 2) {
        const interval = newTimes[newTimes.length - 1] - newTimes[0];
        const count = newTimes.length - 1;
        const newBpm = (60000 / interval) * count;
        setBpm(Number(newBpm.toFixed(0)));
      }
      return newTimes;
    });
    playATiktok(audioContext);
    setTextDirection((v) => !v);
  }, [audioContext]);
  useWhenKeyDown("p", onP);
  return (
    <div>
      <div
        style={{
          transform: textDirection ? "none" : "scaleY(-1)",
          transition: "transform 0.1s ease-in-out",
        }}
      >
        P is for BPM: {bpm}
      </div>

      <Tiktok bpm={bpm} />
    </div>
  );
};
