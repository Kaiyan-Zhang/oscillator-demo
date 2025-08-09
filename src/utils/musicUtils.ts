// 添加缺失的MIDDLE_C_FREQUENCY常量
export const MIDDLE_C_FREQUENCY = 261.63 as const;

export const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export const eventKeyToSemitone = {
  1: 24,
  2: 26,
  3: 28,
  4: 29,
  5: 31,
  6: 33,
  7: 35,
  q: 12,
  w: 14,
  e: 16,
  r: 17,
  t: 19,
  y: 21,
  u: 23,
  a: 0,
  s: 2,
  d: 4,
  f: 5,
  g: 7,
  h: 9,
  j: 11,
} as const;

export const keyboardLayouts = [
  ["1", "2", "3", "4", "5", "6", "7"],
  ["q", "w", "e", "r", "t", "y", "u"],
  ["a", "s", "d", "f", "g", "h", "j"],
];

export type EventKey = keyof typeof eventKeyToSemitone;

export const getFrequency = (totalSemitones: number): number => {
  return MIDDLE_C_FREQUENCY * Math.pow(2, totalSemitones / 12);
};

export const getSemitone = (
  key: EventKey,
  semitoneShift: number = 0
): number => {
  const baseSemitone = eventKeyToSemitone[key];
  // 不再需要检查 undefined，因为 EventKey 类型保证了 key 的有效性
  return baseSemitone + semitoneShift;
};

export const getFullNoteName = (
  key: EventKey,
  semitoneShift: number = 0
): string => {
  // 不再需要检查 key 的有效性
  const totalSemitone = getSemitone(key, semitoneShift);
  const octave = 4 + Math.floor(totalSemitone / 12);
  const noteIndex = totalSemitone % 12;
  return `${noteNames[noteIndex]}${octave}`;
};

export const isAlpha = (char: string): boolean => {
  if (char.length !== 1) return false;
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};

export const isNoteKey = (key: string): key is EventKey => {
  return key in eventKeyToSemitone;
};
