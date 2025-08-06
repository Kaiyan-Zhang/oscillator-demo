// 中央 C (C4) 的频率
export const MIDDLE_C_FREQUENCY = 261.63;

// 音符名称
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
];

// 键到音符的映射关系 (C4=0，半音为1)
export const keyToNoteMap = {
  1: 24, // C6
  2: 26, // D6
  3: 28, // E6
  4: 29, // F6
  5: 31, // G6
  6: 33, // A6
  7: 35, // B6
  q: 12, // C5
  w: 14, // D5
  e: 16, // E5
  r: 17, // F5
  t: 19, // G5
  y: 21, // A5
  u: 23, // B5
  a: 0, // C4 (中央C)
  s: 2, // D4
  d: 4, // E4
  f: 5, // F4
  g: 7, // G4
  h: 9, // A4
  j: 11, // B4
};

// 键盘布局配置
export const keyboardLayouts = [
  ["1", "2", "3", "4", "5", "6", "7"], // C6, D6, E6, F6, G6, A6, B6
  ["q", "w", "e", "r", "t", "y", "u"], // C5, D5, E5, F5, G5, A5, B5
  ["a", "s", "d", "f", "g", "h", "j"], // C4, D4, E4, F4, G4, A4, B4
];

// 计算音符频率
export const getFrequency = (noteValue, semitoneShift = 0, baseFrequency = MIDDLE_C_FREQUENCY) => {
  // C4=0，每半音增加1，公式：频率 = 基准频率 * 2^(总半音数/12)
  const totalSemitones = noteValue + semitoneShift;
  return baseFrequency * Math.pow(2, totalSemitones / 12);
};

// 获取音符名称 (1-7级数)
export const getNoteName = (key, keyMap = keyToNoteMap) => {
  if (!keyMap[key]) return null;
  const noteValue = keyMap[key];
  // 计算在自然大调音阶中的位置 (C=1, D=2, ..., B=7)
  const scaleDegree = [1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 7][noteValue % 12] || 1;
  return scaleDegree.toString();
};

// 获取完整音符名称（包含八度）
export const getFullNoteName = (key, keyMap = keyToNoteMap, names = noteNames) => {
  if (!keyMap[key]) return null;
  const noteValue = keyMap[key];
  const octave = 4 + Math.floor(noteValue / 12); // C4=0，每12个半音升一个八度
  const noteIndex = noteValue % 12;
  return `${names[noteIndex]}${octave}`;
};

// 判断字符是否为英文字母
export const isAlpha = (char) => {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};