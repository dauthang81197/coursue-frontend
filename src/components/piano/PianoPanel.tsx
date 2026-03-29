"use client";

import React, { useState } from "react";
import { VirtualPiano } from "./VirtualPiano";

interface PianoPanelProps {
  defaultOpen?: boolean;
}

export const PianoPanel: React.FC<PianoPanelProps> = ({ defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center gap-2
          px-4 py-2.5 rounded-full
          font-semibold text-sm
          shadow-lg transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${isOpen
            ? "bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200"
            : "bg-white text-gray-800 border border-gray-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700"
          }
        `}
        title={isOpen ? "Close Virtual Piano" : "Open Virtual Piano"}
      >
        <span className="text-xl leading-none">🎹</span>
        <span>{isOpen ? "Close Piano" : "Virtual Piano"}</span>
        <span
          className={`
            ml-1 transition-transform duration-300
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
        >
          ▲
        </span>
      </button>

      {/* Slide-up piano panel */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-40
          flex justify-center
          transition-all duration-500 ease-in-out
          ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}
        `}
      >
        <div className="w-full max-w-5xl mx-auto">
          {/* Panel card */}
          <div className="bg-white/95 backdrop-blur-sm border-t border-x border-gray-200 rounded-t-2xl shadow-2xl">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Title row */}
            <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎹</span>
                <h3 className="font-bold text-gray-800 text-base">Virtual Piano</h3>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                  Tone.js
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Piano */}
            <div className="px-6 py-5 overflow-x-auto">
              <VirtualPiano />
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

