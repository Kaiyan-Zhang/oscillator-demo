import React, { useState, useEffect, useRef } from 'react';

export const Keyboard = ({ audioContext }) => {
  // Define note names and frequencies
  const baseScale = [
    { name: "Do", frequency: 261.63 }, // C4 (Do)
    { name: "Re", frequency: 293.66 }, // D4 (Re)
    { name: "Mi", frequency: 329.63 }, // E4 (Mi)
    { name: "Fa", frequency: 349.23 }, // F4 (Fa)
    { name: "Sol", frequency: 392.0 }, // G4 (Sol)
    { name: "La", frequency: 440.0 }, // A4 (La)
    { name: "Si", frequency: 493.88 }, // B4 (Si)
  ];

  // Manage key states with useState
  const [activeKey, setActiveKey] = useState(null); // Currently pressed key
  const [semitoneShift, setSemitoneShift] = useState(0); // Semitone transposition amount

  const oscillators = useRef({}); // Store all oscillators
  const gainNodes = useRef({}); // Store gain nodes for each oscillator

  // Initialize all oscillators when component mounts
  useEffect(() => {
    // Create oscillators for all 7 notes
    for (let i = 1; i <= 7; i++) {
      const noteIndex = i - 1;
      const frequency = getTransposedFrequency(noteIndex);

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Start with volume 0

      oscillator.start();

      oscillators.current[i] = oscillator;
      gainNodes.current[i] = gainNode;
    }

    // Cleanup function to stop all oscillators when component unmounts
    return () => {
      for (let i = 1; i <= 7; i++) {
        oscillators.current[i]?.stop();
      }
    };
  }, [audioContext]);

  // Update oscillator frequencies when semitoneShift changes
  useEffect(() => {
    for (let i = 1; i <= 7; i++) {
      const noteIndex = i - 1;
      const frequency = getTransposedFrequency(noteIndex);
      oscillators.current[i].frequency.setValueAtTime(frequency, audioContext.currentTime);
    }
  }, [semitoneShift, audioContext]);

  // Calculate note frequency (considering semitone shifts)
  const getTransposedFrequency = (noteIndex) => {
    let frequency = baseScale[noteIndex].frequency;
    frequency *= Math.pow(2, semitoneShift / 12); // Semitone change (includes octave shifts)
    return frequency;
  };

  // Get note name from key
  const getNoteName = (key) => {
    if (!key) return null;
    const noteIndex = parseInt(key) - 1;
    return baseScale[noteIndex]?.name || null;
  };

  // Function to play a note
  const playNote = (key) => {
    if (!gainNodes.current[key]) return;
    gainNodes.current[key].gain.setValueAtTime(0.1, audioContext.currentTime); // Set volume
    setActiveKey(key);
  };

  // Function to stop a note
  const stopNote = (key) => {
    if (!gainNodes.current[key]) return;
    gainNodes.current[key].gain.setValueAtTime(0, audioContext.currentTime); // Mute
    setActiveKey(null); // Clear active key when released
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if (key >= "1" && key <= "7") {
        playNote(key);
      }

      // Semitone controls (12 semitones = 1 octave)
      if (event.key === "ArrowUp") setSemitoneShift(semitoneShift + 12); // Up one octave
      if (event.key === "ArrowDown") setSemitoneShift(semitoneShift - 12); // Down one octave
      if (event.key === "+" || event.key === "=")
        setSemitoneShift(semitoneShift + 1); // Up one semitone
      if (event.key === "-") setSemitoneShift(semitoneShift - 1); // Down one semitone
    };

    const handleKeyUp = (event) => {
      const key = event.key;
      if (key >= "1" && key <= "7") {
        stopNote(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [semitoneShift]);

  // Calculate current octave shift for display
  const octaveShift = Math.floor(semitoneShift / 12);
  // Calculate remaining semitones after accounting for octaves
  const remainingSemitones = semitoneShift % 12;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Press keys 1-7 to play C major scale</h1>
      <p>Use ↑ and ↓ to change octaves, and + and - to transpose semitones.</p>

      <div style={{ marginTop: '20px' }}>
        <p>Currently pressed key: {activeKey}</p>
        <p>Note: {getNoteName(activeKey)}</p>
        <p>Octave Shift: {octaveShift}</p>
        <p>Semitone Shift: {remainingSemitones}</p>
        <p>Total Semitone Shift: {semitoneShift}</p>
      </div>
    </div>
  );
};
