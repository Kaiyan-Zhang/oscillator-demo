export const MIDDLE_C_FREQUENCY = 261.63;

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
};

export const keyboardLayouts = [
  ["1", "2", "3", "4", "5", "6", "7"],
  ["q", "w", "e", "r", "t", "y", "u"],
  ["a", "s", "d", "f", "g", "h", "j"],
];

export const getFrequency = (semitone, semitoneShift = 0) => {
  const totalSemitones = semitone + semitoneShift;
  return MIDDLE_C_FREQUENCY * Math.pow(2, totalSemitones / 12);
};

export const getSemitone = (key, semitoneShift = 0) => {
  const baseSemitone = eventKeyToSemitone[key];
  return baseSemitone + semitoneShift;
};

export const getFullNoteName = (key, semitoneShift = 0) => {
  if (!isNoteKey(key)) return null;
  const totalSemitone = getSemitone(key, semitoneShift);
  const octave = 4 + Math.floor(totalSemitone / 12);
  const noteIndex = totalSemitone % 12;
  return `${noteNames[noteIndex]}${octave}`;
};

export const isAlpha = (char) => {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
};

export const isNoteKey = (key) => {
  const lowerKey = key.toLowerCase();
  return lowerKey in eventKeyToSemitone;
};
