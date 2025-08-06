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

// 键到keyNoteInt的映射关系 (C4=0，半音为1)

// 计算音符频率
export const getFrequency = (
  keyNoteInt, // 将noteValue改为keyNoteInt
  semitoneShift = 0,
  baseFrequency = MIDDLE_C_FREQUENCY
) => {
  // C4=0，每半音增加1，公式：频率 = 基准频率 * 2^(总半音数/12)
  // 修改注释中的术语
  // keyNoteInt表示C4=0，每半音增加1，公式：频率 = 基准频率 * 2^(总半音数/12)
  const totalSemitones = keyNoteInt + semitoneShift;
  return baseFrequency * Math.pow(2, totalSemitones / 12);
};

// 获取完整音符名称（包含八度）
export const getFullNoteName = (
  key,
  semitoneShift = 0,
  keyMap = keyToNoteMap,
  names = noteNames
) => {
  if (keyMap[key] === undefined) return null;
  const baseKeyNoteInt = keyMap[key]; // 将baseNoteValue改为baseKeyNoteInt
  const totalKeyNoteInt = baseKeyNoteInt + semitoneShift; // 将totalNoteValue改为totalKeyNoteInt
  const octave = 4 + Math.floor(totalKeyNoteInt / 12);
  const noteIndex = totalKeyNoteInt % 12;
  return `${names[noteIndex]}${octave}`;
};

// 判断字符是否为英文字母
export const isAlpha = (char) => {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};

// 检查是否为音符按键
export const isNoteKey = (key, keyMap = keyToNoteMap) => {
  // 转换为小写以忽略大小写
  const lowerKey = key.toLowerCase();
  // 检查键是否存在于映射中（不考虑值是否为0）
  return lowerKey in keyMap;
};
