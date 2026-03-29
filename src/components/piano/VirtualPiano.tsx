"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as Tone from "tone";
import { PianoKey } from "./PianoKey";
import { MidiPlayer } from "./MidiPlayer";
import { PianoNote, VirtualPianoProps } from "./types";

// ── Piano key layout: C1 – C6  (36 white + 25 black = 61 keys) ────────
const NOTES: PianoNote[] = [
  // ── Octave 1 – click / touch only ────────────────────────────────
  { note: "C1",  label: "C1", isBlack: false, keyboardKey: "" },
  { note: "C#1", label: "C#", isBlack: true,  keyboardKey: "" },
  { note: "D1",  label: "D",  isBlack: false, keyboardKey: "" },
  { note: "D#1", label: "D#", isBlack: true,  keyboardKey: "" },
  { note: "E1",  label: "E",  isBlack: false, keyboardKey: "" },
  { note: "F1",  label: "F",  isBlack: false, keyboardKey: "" },
  { note: "F#1", label: "F#", isBlack: true,  keyboardKey: "" },
  { note: "G1",  label: "G",  isBlack: false, keyboardKey: "" },
  { note: "G#1", label: "G#", isBlack: true,  keyboardKey: "" },
  { note: "A1",  label: "A",  isBlack: false, keyboardKey: "" },
  { note: "A#1", label: "A#", isBlack: true,  keyboardKey: "" },
  { note: "B1",  label: "B",  isBlack: false, keyboardKey: "" },
  // ── Octave 2 – click / touch only ────────────────────────────────
  { note: "C2",  label: "C2", isBlack: false, keyboardKey: "" },
  { note: "C#2", label: "C#", isBlack: true,  keyboardKey: "" },
  { note: "D2",  label: "D",  isBlack: false, keyboardKey: "" },
  { note: "D#2", label: "D#", isBlack: true,  keyboardKey: "" },
  { note: "E2",  label: "E",  isBlack: false, keyboardKey: "" },
  { note: "F2",  label: "F",  isBlack: false, keyboardKey: "" },
  { note: "F#2", label: "F#", isBlack: true,  keyboardKey: "" },
  { note: "G2",  label: "G",  isBlack: false, keyboardKey: "" },
  { note: "G#2", label: "G#", isBlack: true,  keyboardKey: "" },
  { note: "A2",  label: "A",  isBlack: false, keyboardKey: "" },
  { note: "A#2", label: "A#", isBlack: true,  keyboardKey: "" },
  { note: "B2",  label: "B",  isBlack: false, keyboardKey: "" },
  // ── Octave 3 – Z row white  |  S D G H J black ───────────────────
  { note: "C3",  label: "C3", isBlack: false, keyboardKey: "Z" },
  { note: "C#3", label: "C#", isBlack: true,  keyboardKey: "S" },
  { note: "D3",  label: "D",  isBlack: false, keyboardKey: "X" },
  { note: "D#3", label: "D#", isBlack: true,  keyboardKey: "D" },
  { note: "E3",  label: "E",  isBlack: false, keyboardKey: "C" },
  { note: "F3",  label: "F",  isBlack: false, keyboardKey: "V" },
  { note: "F#3", label: "F#", isBlack: true,  keyboardKey: "G" },
  { note: "G3",  label: "G",  isBlack: false, keyboardKey: "B" },
  { note: "G#3", label: "G#", isBlack: true,  keyboardKey: "H" },
  { note: "A3",  label: "A",  isBlack: false, keyboardKey: "N" },
  { note: "A#3", label: "A#", isBlack: true,  keyboardKey: "J" },
  { note: "B3",  label: "B",  isBlack: false, keyboardKey: "M" },
  // ── Octave 4 – QWERTY white  |  2 3 5 6 7 black ─────────────────
  { note: "C4",  label: "C4", isBlack: false, keyboardKey: "Q" },
  { note: "C#4", label: "C#", isBlack: true,  keyboardKey: "2" },
  { note: "D4",  label: "D",  isBlack: false, keyboardKey: "W" },
  { note: "D#4", label: "D#", isBlack: true,  keyboardKey: "3" },
  { note: "E4",  label: "E",  isBlack: false, keyboardKey: "E" },
  { note: "F4",  label: "F",  isBlack: false, keyboardKey: "R" },
  { note: "F#4", label: "F#", isBlack: true,  keyboardKey: "5" },
  { note: "G4",  label: "G",  isBlack: false, keyboardKey: "T" },
  { note: "G#4", label: "G#", isBlack: true,  keyboardKey: "6" },
  { note: "A4",  label: "A",  isBlack: false, keyboardKey: "Y" },
  { note: "A#4", label: "A#", isBlack: true,  keyboardKey: "7" },
  { note: "B4",  label: "B",  isBlack: false, keyboardKey: "U" },
  // ── Octave 5 – I = C5, rest click only ───────────────────────────
  { note: "C5",  label: "C5", isBlack: false, keyboardKey: "I" },
  { note: "C#5", label: "C#", isBlack: true,  keyboardKey: "" },
  { note: "D5",  label: "D",  isBlack: false, keyboardKey: "" },
  { note: "D#5", label: "D#", isBlack: true,  keyboardKey: "" },
  { note: "E5",  label: "E",  isBlack: false, keyboardKey: "" },
  { note: "F5",  label: "F",  isBlack: false, keyboardKey: "" },
  { note: "F#5", label: "F#", isBlack: true,  keyboardKey: "" },
  { note: "G5",  label: "G",  isBlack: false, keyboardKey: "" },
  { note: "G#5", label: "G#", isBlack: true,  keyboardKey: "" },
  { note: "A5",  label: "A",  isBlack: false, keyboardKey: "" },
  { note: "A#5", label: "A#", isBlack: true,  keyboardKey: "" },
  { note: "B5",  label: "B",  isBlack: false, keyboardKey: "" },
  // ── C6 – click only ───────────────────────────────────────────────
  { note: "C6",  label: "C6", isBlack: false, keyboardKey: "" },
];

// KEY_MAP: skip notes with no keyboard shortcut ("")
const KEY_MAP: Record<string, string> = Object.fromEntries(
  NOTES
    .filter((n) => n.keyboardKey !== "")
    .map((n) => [n.keyboardKey.toLowerCase(), n.note])
);

const WHITE_NOTES = NOTES.filter((n) => !n.isBlack);
// 36 white keys × 26 px = 936 px + 24 px padding = 960 px  (fits max-w-5xl)
const KEY_WIDTH  = 26;
const HALF_BLACK =  8; // half of 16 px black key

// ── Black key offset ──────────────────────────────────────────────────
// The container div is placed at `left = offset`, PianoKey fills 36 px inside it.
// We want the key center at the boundary between its two white neighbours:
//   center = (whiteIdx + 1) * KEY_WIDTH
//   → left edge of 36-px key = center − 18 = (whiteIdx+1)*KEY_WIDTH − 18
function getBlackKeyOffset(note: PianoNote): number {
  const naturalNote = note.note.replace("#", "");
  const whiteIdx    = WHITE_NOTES.findIndex((n) => n.note === naturalNote);
  return (whiteIdx + 1) * KEY_WIDTH - HALF_BLACK;
}

// ── Octave positions (for labels on the piano lid) ────────────────────
const OCTAVE_STARTS = ["C1", "C2", "C3", "C4", "C5", "C6"].map((cn) => ({
  label: cn,
  left:  WHITE_NOTES.findIndex((n) => n.note === cn) * KEY_WIDTH,
}));

// ── Sound presets ─────────────────────────────────────────────────────
interface SoundPreset {
  id: string;
  label: string;
  emoji: string;
  oscillatorType: string;
  envelope: { attack: number; decay: number; sustain: number; release: number };
  reverbDecay: number;
  reverbWet: number;
  volume: number;
}

const PRESET_LIST: SoundPreset[] = [
  {
    id: "piano",   label: "Piano",   emoji: "🎹",
    oscillatorType: "triangle",
    envelope: { attack: 0.02, decay: 0.3,  sustain: 0.4,  release: 1.2 },
    reverbDecay: 1.5, reverbWet: 0.25, volume: -6,
  },
  {
    id: "organ",   label: "Organ",   emoji: "🎵",
    oscillatorType: "square",
    envelope: { attack: 0.01, decay: 0.01, sustain: 1.0,  release: 0.2 },
    reverbDecay: 1.0, reverbWet: 0.1,  volume: -10,
  },
  {
    id: "strings", label: "Strings", emoji: "🎻",
    oscillatorType: "sawtooth",
    envelope: { attack: 0.4,  decay: 0.1,  sustain: 0.8,  release: 1.5 },
    reverbDecay: 2.5, reverbWet: 0.4,  volume: -8,
  },
  {
    id: "flute",   label: "Flute",   emoji: "🪈",
    oscillatorType: "sine",
    envelope: { attack: 0.15, decay: 0.1,  sustain: 0.7,  release: 0.8 },
    reverbDecay: 1.2, reverbWet: 0.2,  volume: -5,
  },
  {
    id: "bell",    label: "Bell",    emoji: "🔔",
    oscillatorType: "fmsine",
    envelope: { attack: 0.005,decay: 1.8,  sustain: 0.05, release: 2.5 },
    reverbDecay: 3.0, reverbWet: 0.45, volume: -4,
  },
  {
    id: "brass",   label: "Brass",   emoji: "🎺",
    oscillatorType: "sawtooth",
    envelope: { attack: 0.06, decay: 0.1,  sustain: 0.85, release: 0.4 },
    reverbDecay: 0.8, reverbWet: 0.15, volume: -8,
  },
];

const PRESET_MAP = Object.fromEntries(PRESET_LIST.map((p) => [p.id, p]));

// ── Synth factory ─────────────────────────────────────────────────────
function buildSynth(preset: SoundPreset): { synth: Tone.PolySynth; reverb: Tone.Reverb } {
  const reverb = new Tone.Reverb({ decay: preset.reverbDecay, wet: preset.reverbWet }).toDestination();
  const synth  = new Tone.PolySynth(Tone.Synth, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    oscillator: { type: preset.oscillatorType as any },
    envelope:   preset.envelope,
    volume:     preset.volume,
  }).connect(reverb);
  return { synth, reverb };
}

// ── Component ─────────────────────────────────────────────────────────
export const VirtualPiano: React.FC<VirtualPianoProps> = ({ className = "" }) => {
  const synthRef        = useRef<Tone.PolySynth | null>(null);
  const reverbRef       = useRef<Tone.Reverb    | null>(null);
  const pressedKeysRef  = useRef<Set<string>>(new Set());
  const [activeNotes,    setActiveNotes]    = useState<Set<string>>(new Set());
  const [currentNote,    setCurrentNote]    = useState<string | null>(null);
  const [audioReady,     setAudioReady]     = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("piano");

  const ensureAudio = useCallback(async () => {
    if (!audioReady) {
      await Tone.start();
      const { synth, reverb } = buildSynth(PRESET_MAP[selectedPreset]);
      synthRef.current  = synth;
      reverbRef.current = reverb;
      setAudioReady(true);
    }
  }, [audioReady, selectedPreset]);

  // Rebuild synth when preset changes (only after audio is initialised)
  useEffect(() => {
    if (!audioReady) return;
    const preset = PRESET_MAP[selectedPreset];
    // Gracefully stop all notes on old synth
    synthRef.current?.releaseAll();
    setActiveNotes(new Set());
    setCurrentNote(null);
    const oldSynth  = synthRef.current;
    const oldReverb = reverbRef.current;
    // Build new
    const { synth, reverb } = buildSynth(preset);
    synthRef.current  = synth;
    reverbRef.current = reverb;
    // Dispose old after release tails fade
    setTimeout(() => { oldSynth?.dispose(); oldReverb?.dispose(); }, 3000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPreset]);

  const playNote = useCallback(async (note: string) => {
    await ensureAudio();
    if (!synthRef.current) return;
    synthRef.current.triggerAttack(note, Tone.now());
    setActiveNotes((p) => new Set(p).add(note));
    setCurrentNote(note);
  }, [ensureAudio]);

  const stopNote = useCallback((note: string) => {
    synthRef.current?.triggerRelease(note, Tone.now());
    setActiveNotes((p) => { const s = new Set(p); s.delete(note); return s; });
    setCurrentNote((c) => (c === note ? null : c));
  }, []);

  // ── MIDI Player callbacks (called from Tone.Draw, no audio init needed) ──
  const midiNoteOn = useCallback((note: string) => {
    setActiveNotes((p) => new Set(p).add(note));
    setCurrentNote(note);
  }, []);

  const midiNoteOff = useCallback((note: string) => {
    setActiveNotes((p) => { const s = new Set(p); s.delete(note); return s; });
    setCurrentNote((c) => (c === note ? null : c));
  }, []);

  // Keyboard events
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const note = KEY_MAP[e.key.toLowerCase()];
      if (note && !pressedKeysRef.current.has(e.key.toLowerCase())) {
        pressedKeysRef.current.add(e.key.toLowerCase());
        playNote(note);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      const note = KEY_MAP[e.key.toLowerCase()];
      if (note) { pressedKeysRef.current.delete(e.key.toLowerCase()); stopNote(note); }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, [playNote, stopNote]);

  useEffect(() => () => {
    synthRef.current?.dispose();
    reverbRef.current?.dispose();
  }, []);

  const pianoWidth = WHITE_NOTES.length * KEY_WIDTH; // 22 × 44 = 968 px

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>

      {/* ── Info bar ── */}
      <div className="flex items-center justify-between w-full px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎹</span>
          <span className="font-bold text-sm text-gray-700 tracking-wide">Virtual Piano</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">C1 – C6</span>

          {/* ── Sound preset dropdown ── */}
          <div className="relative">
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="
                appearance-none pl-2 pr-7 py-1
                text-xs font-medium text-gray-700
                bg-white border border-gray-200 rounded-lg
                hover:border-primary-300 hover:text-primary-700
                focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400
                cursor-pointer transition-colors
              "
            >
              {PRESET_LIST.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.emoji} {p.label}
                </option>
              ))}
            </select>
            {/* Chevron icon */}
            <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentNote ? (
            <div className="flex items-center gap-1.5 bg-primary-50 border border-primary-200 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-sm font-mono font-bold text-primary-700">{currentNote}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="text-xs text-gray-400 font-mono">—</span>
            </div>
          )}
          {!audioReady && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
              Click any key to activate
            </span>
          )}
        </div>
      </div>

      {/* ── Piano body ── */}
      <div
        className="relative bg-linear-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl"
        style={{ width: `${pianoWidth + 24}px`, padding: "10px 12px 16px" }}
      >
        {/* Glossy lid */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-linear-to-b from-gray-600 to-gray-800 rounded-t-xl" />

        {/* Octave markers on the lid */}
        <div className="absolute top-0 left-3 right-3 h-3 flex items-center pointer-events-none">
          {OCTAVE_STARTS.map(({ label, left }) => (
            <div
              key={label}
              className="absolute flex flex-col items-center"
              style={{ left: `${left + KEY_WIDTH / 2 - 8}px` }}
            >
              <span className="text-[8px] font-mono text-gray-300 leading-none">{label}</span>
            </div>
          ))}
        </div>

        {/* Keys container — no gap so offset math is exact */}
        <div className="relative mt-3 flex" style={{ height: "84px" }}>
          {/* White keys */}
          <div className="flex">
            {WHITE_NOTES.map((note) => (
              <PianoKey
                key={note.note}
                note={note}
                isActive={activeNotes.has(note.note)}
                onPress={playNote}
                onRelease={stopNote}
              />
            ))}
          </div>

          {/* Black keys (absolutely positioned) */}
          {NOTES.filter((n) => n.isBlack).map((note) => (
            <div
              key={note.note}
              className="absolute top-0"
              style={{ left: `${getBlackKeyOffset(note)}px` }}
            >
              <PianoKey
                note={note}
                isActive={activeNotes.has(note.note)}
                onPress={playNote}
                onRelease={stopNote}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Keyboard shortcuts legend ── */}
      <div className="flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">C1–C2:</span>
            <span className="text-[10px] text-gray-400 italic">click / touch only</span>
          </div>
          <div className="w-px h-3 bg-gray-200" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">C3:</span>
            <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[9px] font-mono">Z–M</kbd>
            <span className="text-[9px] text-gray-400">+</span>
            <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[9px] font-mono">S D G H J</kbd>
          </div>
          <div className="w-px h-3 bg-gray-200" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">C4:</span>
            <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[9px] font-mono">Q–U</kbd>
            <span className="text-[9px] text-gray-400">+</span>
            <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[9px] font-mono">2 3 5 6 7</kbd>
          </div>
          <div className="w-px h-3 bg-gray-200" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">C5:</span>
            <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-[9px] font-mono">I</kbd>
          </div>
          <div className="w-px h-3 bg-gray-200" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-gray-400">D5–C6:</span>
            <span className="text-[10px] text-gray-400 italic">click / touch only</span>
          </div>
        </div>
      </div>

      {/* ── MIDI Player ── */}
      <div style={{ width: `${pianoWidth + 24}px` }}>
        <MidiPlayer
          synthRef={synthRef}
          onEnsureAudio={ensureAudio}
          onNoteOn={midiNoteOn}
          onNoteOff={midiNoteOff}
        />
      </div>
    </div>
  );
};

