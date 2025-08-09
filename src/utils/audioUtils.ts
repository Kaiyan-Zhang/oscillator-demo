import { getFrequency } from "./musicUtils";
import { eventKeyToSemitone } from "./musicUtils";

export const GLOBAL_GAIN = 0.1;

export class AudioManager {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.oscillators = {};
    this.gainNodes = {};
    Object.keys(eventKeyToSemitone).forEach((eventKey) => {
      const semitone = eventKeyToSemitone[eventKey];
      const frequency = getFrequency(semitone, 0);

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

      this.oscillators[eventKey] = oscillator;
      this.gainNodes[eventKey] = gainNode;
    });
  }

  updateSemitoneShift(semitoneShift) {
    Object.keys(this.oscillators).forEach((eventKey) => {
      const semitone = eventKeyToSemitone[eventKey];
      const frequency = getFrequency(semitone, semitoneShift);
      this.oscillators[eventKey].frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
    });
  }

  playNote(eventKey) {
    if (!this.gainNodes[eventKey]) return;
    this.gainNodes[eventKey].gain.setValueAtTime(
      GLOBAL_GAIN,
      this.audioContext.currentTime
    );
  }

  stopNote(eventKey) {
    if (!this.gainNodes[eventKey]) return;
    this.gainNodes[eventKey].gain.setValueAtTime(
      0,
      this.audioContext.currentTime
    );
  }

  cleanup() {
    Object.keys(this.oscillators).forEach((eventKey) => {
      this.oscillators[eventKey]?.stop();
    });
    this.oscillators = {};
    this.gainNodes = {};
  }
}
