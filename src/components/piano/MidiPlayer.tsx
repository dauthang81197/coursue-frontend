"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import * as Tone from "tone";
import { Midi } from "@tonejs/midi";

// ── Types ───────────────────────────────────────────────────────────────────
export interface MidiPlayerProps {
  /** Ref to the PolySynth used by VirtualPiano */
  synthRef: React.RefObject<Tone.PolySynth | null>;
  /** Called once before first playback to initialise Tone audio context */
  onEnsureAudio: () => Promise<void>;
  /** Called (via Tone.Draw) when a note should light up on the piano */
  onNoteOn: (note: string) => void;
  /** Called (via Tone.Draw) when a note should go dark on the piano */
  onNoteOff: (note: string) => void;
}

type PlaybackState = "idle" | "playing" | "paused";

interface TrackInfo {
  index:     number;
  name:      string;
  instrument: string;
  noteCount: number;
  enabled:   boolean;
}

interface NoteEvent {
  name:       string;   // normalised note name, e.g. "C4", "C#4"
  time:       number;   // seconds from start of piece
  duration:   number;   // seconds
  velocity:   number;   // 0-1
  trackIndex: number;   // index in the filtered (non-empty) track list
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const FLAT_TO_SHARP: Record<string, string> = {
  Cb: "B",  Db: "C#", Eb: "D#", Fb: "E",
  Gb: "F#", Ab: "G#", Bb: "A#",
};

/** Convert flat notation → sharp, e.g. "Db4" → "C#4" */
function normalizeNote(name: string): string {
  return name.replace(/^([A-G]b)/, (m) => FLAT_TO_SHARP[m] ?? m);
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

// ── Component ────────────────────────────────────────────────────────────────
export const MidiPlayer: React.FC<MidiPlayerProps> = ({
  synthRef,
  onEnsureAudio,
  onNoteOn,
  onNoteOff,
}) => {
  // ── File / parse state ───────────────────────────────────────────────
  const [fileName,      setFileName]      = useState("");
  const [tracks,        setTracks]        = useState<TrackInfo[]>([]);
  const [allNotes,      setAllNotes]      = useState<NoteEvent[]>([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [midiInfo,      setMidiInfo]      = useState<{ bpm: number; timeSignature: string } | null>(null);
  const [parseError,    setParseError]    = useState("");

  // ── Playback state ────────────────────────────────────────────────────
  const [pbState,  setPbState]  = useState<PlaybackState>("idle");
  const [elapsed,  setElapsed]  = useState(0);
  const [speed,    setSpeed]    = useState(1.0);

  const partRef            = useRef<Tone.Part<NoteEvent> | null>(null);
  const rafRef             = useRef<number>(0);
  const scaledDurationRef  = useRef<number>(0);
  const isPlayingRef       = useRef<boolean>(false);
  const activeTimeoutsRef  = useRef<ReturnType<typeof setTimeout>[]>([]);
  const fileInputRef       = useRef<HTMLInputElement>(null);

  // ── Parse MIDI file ──────────────────────────────────────────────────
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError("");
    setPbState("idle");
    setElapsed(0);

    try {
      const buf  = await file.arrayBuffer();
      const midi = new Midi(buf);

      // Build track list (only tracks that contain notes)
      const parsedTracks: TrackInfo[] = [];
      let ti = 0;
      for (const t of midi.tracks) {
        if (t.notes.length === 0) continue;
        parsedTracks.push({
          index:      ti,
          name:       t.name || `Track ${ti + 1}`,
          instrument: t.instrument.name || "Unknown",
          noteCount:  t.notes.length,
          enabled:    true,
        });
        ti++;
      }

      // Collect all note events
      const noteEvents: NoteEvent[] = [];
      let trackIdx = 0;
      for (const t of midi.tracks) {
        if (t.notes.length === 0) continue;
        for (const n of t.notes) {
          noteEvents.push({
            name:       normalizeNote(n.name),
            time:       n.time,
            duration:   Math.max(n.duration, 0.03), // min 30 ms
            velocity:   n.velocity,
            trackIndex: trackIdx,
          });
        }
        trackIdx++;
      }

      const maxEnd = noteEvents.reduce((m, n) => Math.max(m, n.time + n.duration), 0);
      const bpm    = midi.header.tempos[0]?.bpm ?? 120;
      const ts     = midi.header.timeSignatures[0];
      const timeSignature = ts ? `${ts.timeSignature[0]}/${ts.timeSignature[1]}` : "4/4";

      setFileName(file.name);
      setTracks(parsedTracks);
      setAllNotes(noteEvents);
      setTotalDuration(maxEnd);
      setMidiInfo({ bpm: Math.round(bpm), timeSignature });
    } catch (err) {
      setParseError("Failed to parse MIDI file. Please use a valid .mid/.midi file.");
      console.error(err);
    }

    // Allow re-selecting the same file
    e.target.value = "";
  }, []);

  // ── Toggle track enabled/disabled ────────────────────────────────────
  const toggleTrack = useCallback((idx: number) => {
    setTracks((prev) =>
      prev.map((t) => (t.index === idx ? { ...t, enabled: !t.enabled } : t))
    );
  }, []);

  // ── Stop playback ─────────────────────────────────────────────────────
  const stopPlayback = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    // Cancel all pending visual timeouts
    isPlayingRef.current = false;
    activeTimeoutsRef.current.forEach(clearTimeout);
    activeTimeoutsRef.current = [];
    partRef.current?.dispose();
    partRef.current = null;
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    setPbState("idle");
    setElapsed(0);
  }, []);

  // ── Start / Resume ────────────────────────────────────────────────────
  const handlePlay = useCallback(async () => {
    if (!allNotes.length) return;
    await onEnsureAudio();

    // Resume from pause
    if (pbState === "paused") {
      isPlayingRef.current = true;
      Tone.getTransport().start();
      setPbState("playing");
      const sd = scaledDurationRef.current;
      const tick = () => {
        const t = Tone.getTransport().seconds;
        setElapsed(t * speed);
        if (t >= sd + 0.5) { stopPlayback(); return; }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    // Fresh start — stop any previous playback first
    stopPlayback();

    const enabledIdx = new Set(tracks.filter((t) => t.enabled).map((t) => t.index));
    const scaledDuration = totalDuration / speed;
    scaledDurationRef.current = scaledDuration;

    const notes: NoteEvent[] = allNotes
      .filter((n) => enabledIdx.has(n.trackIndex))
      .map((n) => ({
        ...n,
        time:     n.time     / speed,
        duration: n.duration / speed,
      }))
      .sort((a, b) => a.time - b.time);

    if (!notes.length) return;

    // Build Tone.Part — audio scheduling
    const part = new Tone.Part<NoteEvent>((time, note) => {
      if (!synthRef.current) return;
      synthRef.current.triggerAttackRelease(note.name, note.duration, time, note.velocity);

      // ── Visual sync via setTimeout ──────────────────────────────────
      // `time`  = absolute audio-context seconds when note starts
      // `Tone.now()` = current audio-context time at the moment this callback fires
      const nowAudio   = Tone.now();
      const delayOnMs  = Math.max(0, (time - nowAudio) * 1000);
      const delayOffMs = Math.max(0, (time + note.duration - nowAudio) * 1000);

      const t1 = setTimeout(() => {
        if (isPlayingRef.current) onNoteOn(note.name);
      }, delayOnMs);

      const t2 = setTimeout(() => {
        if (isPlayingRef.current) onNoteOff(note.name);
      }, delayOffMs);

      activeTimeoutsRef.current.push(t1, t2);
    }, notes);

    // ── FIX: schedule Part THEN start transport — do NOT cancel() in between ──
    part.start(0);
    partRef.current = part;

    isPlayingRef.current = true;
    Tone.getTransport().start("+0.1");

    setPbState("playing");

    // rAF loop for progress bar
    const tick = () => {
      const t = Tone.getTransport().seconds;
      setElapsed(t * speed);
      if (t >= scaledDuration + 0.5) { stopPlayback(); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [allNotes, tracks, speed, totalDuration, pbState, synthRef, onEnsureAudio, onNoteOn, onNoteOff, stopPlayback]);

  // ── Pause ─────────────────────────────────────────────────────────────
  const handlePause = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    Tone.getTransport().pause();
    setPbState("paused");
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────────────────────
  useEffect(() => () => { stopPlayback(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived values ─────────────────────────────────────────────────────
  const hasFile        = !!fileName;
  const progress       = totalDuration > 0 ? Math.min(elapsed / totalDuration, 1) : 0;
  const enabledNotes   = allNotes.filter((n) => tracks.find((t) => t.index === n.trackIndex)?.enabled);
  const uniqueNoteNames = new Set(enabledNotes.map((n) => n.name)).size;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-base">🎼</span>
          <span className="font-bold text-sm text-gray-700">MIDI Player</span>
          {hasFile && (
            <>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium truncate max-w-[180px]">
                {fileName}
              </span>
              {midiInfo && (
                <span className="text-[10px] text-gray-400 hidden sm:inline">
                  {midiInfo.bpm} BPM · {midiInfo.timeSignature}
                </span>
              )}
            </>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Import MIDI
        </button>
        <input ref={fileInputRef} type="file" accept=".mid,.midi" className="hidden" onChange={handleFileChange} />
      </div>

      {/* ── Error ── */}
      {parseError && (
        <div className="px-4 py-2 bg-red-50 text-red-600 text-xs border-b border-red-100">
          ⚠️ {parseError}
        </div>
      )}

      {/* ── Empty state ── */}
      {!hasFile && !parseError && (
        <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
          <span className="text-4xl">🎵</span>
          <p className="text-sm font-medium text-gray-500">Import a MIDI file to play</p>
          <p className="text-xs text-gray-400">Supports <code>.mid</code> / <code>.midi</code></p>
        </div>
      )}

      {/* ── File loaded ── */}
      {hasFile && (
        <div className="p-4 flex flex-col gap-3">

          {/* Track list */}
          {tracks.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Tracks — click to toggle
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tracks.map((t) => (
                  <button
                    key={t.index}
                    onClick={() => toggleTrack(t.index)}
                    title={t.instrument}
                    className={`
                      flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      border transition-all
                      ${t.enabled
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                        : "bg-gray-100 border-gray-200 text-gray-400 line-through hover:bg-gray-200"
                      }
                    `}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${t.enabled ? "bg-indigo-500" : "bg-gray-300"}`} />
                    <span>{t.name}</span>
                    <span className="opacity-50 font-normal">{t.noteCount}n</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <span>🎹 {enabledNotes.length} events</span>
            <span>·</span>
            <span>🎵 {uniqueNoteNames} unique notes</span>
            <span>·</span>
            <span>⏱ {fmtTime(totalDuration)}</span>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-mono">{fmtTime(elapsed)}</span>
              <span className="font-mono">{fmtTime(totalDuration)}</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${progress * 100}%`, transition: "width 0.1s linear" }}
              />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2">
            {/* Stop */}
            <button
              onClick={stopPlayback}
              disabled={pbState === "idle"}
              title="Stop"
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1.5" />
              </svg>
            </button>

            {/* Play / Pause */}
            {pbState === "playing" ? (
              <button
                onClick={handlePause}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6"  y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
                Pause
              </button>
            ) : (
              <button
                onClick={handlePlay}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
                {pbState === "paused" ? "Resume" : "Play"}
              </button>
            )}

            {/* Playing indicator */}
            {pbState === "playing" && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs text-indigo-600 font-medium">Playing</span>
              </div>
            )}

            {/* Speed selector */}
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Speed</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                disabled={pbState !== "idle"}
                className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 cursor-pointer"
              >
                {SPEEDS.map((s) => (
                  <option key={s} value={s}>{s}×</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


