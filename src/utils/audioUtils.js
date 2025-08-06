import { getFrequency } from "./musicUtils";

class AudioManager {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.oscillators = {};
    this.gainNodes = {};
  }

  initOscillators(keyToNoteMap, semitoneShift = 0) {
    Object.keys(keyToNoteMap).forEach((key) => {
      const keyNoteInt = keyToNoteMap[key];
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
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

      oscillator.start();

      this.oscillators[key] = oscillator;
      this.gainNodes[key] = gainNode;
    });
  }

  updateFrequencies(keyToNoteMap, semitoneShift) {
    Object.keys(this.oscillators).forEach((key) => {
      const keyNoteInt = keyToNoteMap[key];
      const frequency = getFrequency(keyNoteInt, semitoneShift);
      this.oscillators[key].frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
    });
  }

  playNote(key) {
    if (!this.gainNodes[key]) return;
    this.gainNodes[key].gain.setValueAtTime(0.1, this.audioContext.currentTime);
  }

  stopNote(key) {
    if (!this.gainNodes[key]) return;
    this.gainNodes[key].gain.setValueAtTime(0, this.audioContext.currentTime);
  }

  cleanup() {
    Object.keys(this.oscillators).forEach((key) => {
      this.oscillators[key]?.stop();
    });
    this.oscillators = {};
    this.gainNodes = {};
  }
}

export default AudioManager;
