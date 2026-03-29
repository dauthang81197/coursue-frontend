export interface PianoNote {
  note: string;       // e.g. "C4", "D#4"
  label: string;      // display label on key
  isBlack: boolean;
  keyboardKey: string; // computer keyboard shortcut
}

export interface PianoKeyProps {
  note: PianoNote;
  isActive: boolean;
  onPress: (note: string) => void;
  onRelease: (note: string) => void;
}

export interface VirtualPianoProps {
  className?: string;
  defaultOctave?: number;
}

