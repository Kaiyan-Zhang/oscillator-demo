import { getFrequency } from "./musicUtils";

// 管理振荡器和增益节点
class AudioManager {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.oscillators = {};
    this.gainNodes = {};
  }

  // 初始化所有振荡器
  initOscillators(keyToNoteMap, semitoneShift = 0) {
    Object.keys(keyToNoteMap).forEach((key) => {
      const keyNoteInt = keyToNoteMap[key]; // 将noteValue改为keyNoteInt
      const frequency = getFrequency(keyNoteInt, semitoneShift);

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime); // 初始音量为0

      oscillator.start();

      this.oscillators[key] = oscillator;
      this.gainNodes[key] = gainNode;
    });
  }

  // 更新振荡器频率（半音偏移改变时）
  updateFrequencies(keyToNoteMap, semitoneShift) {
    Object.keys(this.oscillators).forEach((key) => {
      const keyNoteInt = keyToNoteMap[key]; // 将noteValue改为keyNoteInt
      const frequency = getFrequency(keyNoteInt, semitoneShift);
      this.oscillators[key].frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
    });
  }

  // 播放音符
  playNote(key) {
    if (!this.gainNodes[key]) return;
    this.gainNodes[key].gain.setValueAtTime(0.1, this.audioContext.currentTime);
  }

  // 停止音符
  stopNote(key) {
    if (!this.gainNodes[key]) return;
    this.gainNodes[key].gain.setValueAtTime(0, this.audioContext.currentTime);
  }

  // 清理所有振荡器
  cleanup() {
    Object.keys(this.oscillators).forEach((key) => {
      this.oscillators[key]?.stop();
    });
    this.oscillators = {};
    this.gainNodes = {};
  }
}

export default AudioManager;
