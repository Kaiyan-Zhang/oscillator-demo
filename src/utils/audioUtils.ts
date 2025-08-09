import { eventKeyToSemitone, getFrequency } from "./musicUtils";

export const GLOBAL_GAIN: number = 0.1;

export class AudioManager {
  private audioContext: AudioContext;
  private oscillators: Record<string, OscillatorNode>;
  private gainNodes: Record<string, GainNode>;

  constructor(audioContext: AudioContext) {
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

  updateSemitoneShift(semitoneShift: number): void {
    Object.keys(this.oscillators).forEach((eventKey) => {
      const semitone = eventKeyToSemitone[eventKey];
      const frequency = getFrequency(semitone, semitoneShift);
      this.oscillators[eventKey].frequency.setValueAtTime(
        frequency,
        this.audioContext.currentTime
      );
    });
  }

  playNote(eventKey: string): void {
    if (!this.gainNodes[eventKey]) return;
    this.gainNodes[eventKey].gain.setValueAtTime(
      GLOBAL_GAIN,
      this.audioContext.currentTime
    );
  }

  stopNote(eventKey: string): void {
    if (!this.gainNodes[eventKey]) return;
    this.gainNodes[eventKey].gain.setValueAtTime(
      0,
      this.audioContext.currentTime
    );
  }

  cleanup(): void {
    Object.keys(this.oscillators).forEach((eventKey) => {
      this.oscillators[eventKey]?.stop();
    });
    this.oscillators = {};
    this.gainNodes = {};
  }
}
