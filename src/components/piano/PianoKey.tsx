import React from "react";
import { PianoKeyProps } from "./types";

export const PianoKey: React.FC<PianoKeyProps> = ({
  note,
  isActive,
  onPress,
  onRelease,
}) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onPress(note.note);
  };

  const handleMouseUp = () => onRelease(note.note);
  const handleMouseLeave = () => { if (isActive) onRelease(note.note); };
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    onPress(note.note);
  };
  const handleTouchEnd = () => onRelease(note.note);

  if (note.isBlack) {
    return (
      <div
        className={`
          absolute z-10 cursor-pointer select-none
          transition-all duration-75 ease-in-out
          rounded-b-md border border-gray-900
          flex items-end justify-center pb-2
          ${isActive
            ? "bg-linear-to-b from-gray-500 to-gray-700 shadow-inner translate-y-0.5"
            : "bg-linear-to-b from-gray-800 to-gray-950 hover:from-gray-700 hover:to-gray-900 shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
          }
        `}
        style={{ width: "16px", height: "54px" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <span className="text-gray-400 text-[6px] font-mono leading-none">
          {note.keyboardKey}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`
        relative cursor-pointer select-none
        transition-all duration-75 ease-in-out
        rounded-b-lg border border-gray-300
        flex flex-col items-center justify-end pb-2 gap-0.5
        ${isActive
          ? "bg-linear-to-b from-primary-100 to-primary-200 shadow-inner translate-y-0.5 border-primary-300"
          : "bg-linear-to-b from-white to-gray-50 hover:from-primary-50 hover:to-primary-100 shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
        }
      `}
      style={{ width: "26px", height: "84px" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <span className={`text-[7px] font-mono font-semibold ${isActive ? "text-primary-600" : "text-gray-400"}`}>
        {note.keyboardKey}
      </span>
      <span className={`text-[8px] font-bold ${isActive ? "text-primary-700" : "text-gray-500"}`}>
        {note.label}
      </span>
    </div>
  );
};



