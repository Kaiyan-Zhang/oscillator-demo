import React, { useCallback, useState } from "react";
import { useWhenKeyDown } from "./utils/useWhenKeyDown";
import { getFullNoteNameV2, playNoteAsync } from "./utils/musicUtils";
import { useAudioContext } from "./AudioContextWrapper";

const Boomer = ({
  semitoneStackWithInterval,
}: {
  semitoneStackWithInterval: {
    semitone: number;
    timeStampWhenPressed: number;
  }[];
}) => {
  const audioContext = useAudioContext();
  const onClick = async () => {
    for (let i = 0; i < semitoneStackWithInterval.length; i++) {
      if (i === semitoneStackWithInterval.length - 1) {
        await playNoteAsync(
          audioContext,
          semitoneStackWithInterval[i].semitone,
          1
        );
      } else {
        const [thisItem, nextItem] = [
          semitoneStackWithInterval[i],
          semitoneStackWithInterval[i + 1],
        ];
        const interval =
          nextItem?.timeStampWhenPressed - thisItem.timeStampWhenPressed;
        const duration = interval / 1000;
        await playNoteAsync(audioContext, thisItem.semitone, duration);
      }
    }
  };
  return <button onClick={onClick}>Play</button>;
};

export const Beemer = ({ semitoneStack }: { semitoneStack: number[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [semitoneStackWithInterval, setSemitoneStackWithInterval] = useState<
    {
      semitone: number;
      timeStampWhenPressed: number;
    }[]
  >([]);
  const audioContext = useAudioContext();
  const onI = useCallback(() => {
    if (currentIndex >= semitoneStack.length) return;
    setSemitoneStackWithInterval((prev) => [
      ...prev,
      {
        semitone: semitoneStack[currentIndex],
        timeStampWhenPressed: new Date().getTime(),
      },
    ]);
    playNoteAsync(audioContext, semitoneStack[currentIndex], 0.2);
    setCurrentIndex(currentIndex + 1);
  }, [currentIndex, semitoneStack, audioContext]);
  useWhenKeyDown("i", onI);
  return (
    <div>
      <div>
        {currentIndex}: {getFullNoteNameV2(semitoneStack[currentIndex])}
      </div>
      <div>
        {semitoneStackWithInterval
          .map(
            (item) =>
              `${getFullNoteNameV2(item.semitone)}: ${item.timeStampWhenPressed}`
          )
          .join(",")}
      </div>
      <Boomer semitoneStackWithInterval={semitoneStackWithInterval} />
    </div>
  );
};
