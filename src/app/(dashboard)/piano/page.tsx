"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { VirtualPiano } from "@/components/piano";

const SOUND_HINT = [
  { range: "C1–C2", key: null },
  { range: "C3",    key: "Z–M  +  S D G H J" },
  { range: "C4",    key: "Q–U  +  2 3 5 6 7" },
  { range: "C5",    key: "I" },
  { range: "D5–C6", key: null },
];

export default function PianoPage() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <DashboardLayout>
      <div className="min-h-full flex flex-col gap-6">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎹</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Virtual Piano</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Powered by&nbsp;
                  <span className="font-semibold text-primary-600">Tone.js</span>
                  &nbsp;·&nbsp;C1 – C6&nbsp;·&nbsp;61 keys
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setFullscreen((f) => !f)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200
                       text-sm font-medium text-gray-600 bg-white
                       hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50
                       transition-colors shadow-sm"
          >
            {fullscreen ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
                Thu nhỏ
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                Toàn màn hình
              </>
            )}
          </button>
        </div>

        {/* ── Fullscreen overlay ── */}
        {fullscreen && (
          <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col items-center justify-center gap-6 p-8">
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-white text-xl font-bold tracking-wide flex items-center gap-2">
              <span>🎹</span> Virtual Piano
            </h2>
            <div className="overflow-x-auto w-full flex justify-center">
              <VirtualPiano />
            </div>
          </div>
        )}

        {/* ── Main piano card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-x-auto">
          <VirtualPiano />
        </div>

        {/* ── Info cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Keyboard shortcuts */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:col-span-2">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-base">⌨️</span> Keyboard shortcuts
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Range</th>
                  <th className="text-left pb-2 font-medium">Keys</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {SOUND_HINT.map(({ range, key }) => (
                  <tr key={range}>
                    <td className="py-2 text-gray-600 font-mono text-xs w-24">{range}</td>
                    <td className="py-2">
                      {key ? (
                        <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">{key}</span>
                      ) : (
                        <span className="text-gray-400 italic text-xs">click / touch only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-base">💡</span> Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                Giữ phím để sustain — thả để release
              </li>
              <li className="flex gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                Chơi nhiều phím cùng lúc (polyphonic)
              </li>
              <li className="flex gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                Đổi loại tiếng bằng dropdown góc trên
              </li>
              <li className="flex gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                Dùng touch screen trên mobile
              </li>
              <li className="flex gap-2">
                <span className="text-primary-500 mt-0.5">•</span>
                Click &ldquo;Toàn màn hình&rdquo; để chơi tập trung
              </li>
            </ul>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

