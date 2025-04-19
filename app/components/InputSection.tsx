/* eslint-disable react/no-unescaped-entities, react-hooks/exhaustive-deps */
import React, { useRef, useEffect, Dispatch, SetStateAction } from "react";
import { getOctetTooltip } from "../utils/tooltips";

export interface InputSectionProps {
  ip: number[];
  cidr: number;
  setIpOctet: (i: number, val: number) => void;
  setCidr: Dispatch<SetStateAction<number>>;
  networkColors: {
    octets: string[];
    classes: {
      a: { bg: string; text: string };
      b: { bg: string; text: string };
      c: { bg: string; text: string };
      small: { bg: string; text: string };
    };
  };
  handleWheel: (
    event: React.WheelEvent<HTMLInputElement>,
    i: number,
    max: number
  ) => void;
  handleKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    i: number,
    max: number
  ) => void;
  handlePaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  bits: number[][];
}

export default function InputSection({
  ip,
  cidr,
  setIpOctet,
  setCidr,
  networkColors,
  handleWheel,
  handleKeyDown,
  handlePaste,
  bits,
}: InputSectionProps) {
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the first input on component mount
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  return (
    <div className="mb-8 relative">
      {/* Technical background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      {/* Main container with terminal-like border */}
      <div className="relative p-4 border-2 border-cyan-500/30 rounded-lg bg-gray-900/30 backdrop-blur-sm shadow-[0_0_15px_rgba(0,200,255,0.15)]">
        {/* IP Input Section with glowing effect */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {ip.map((octet, i) => (
          <div key={i} className={`flex items-center ${i < 3 ? "mr-0" : ""}`}>
            <div
                className={`relative ${networkColors.octets[i]} rounded-lg shadow-[0_0_8px_rgba(0,170,255,0.3)] transition-all duration-200 hover:shadow-[0_0_12px_rgba(0,170,255,0.5)]`}
            >
              <input
                ref={i === 0 ? firstInputRef : null}
                type="text"
                  className="w-16 font-mono text-center bg-transparent border-0 rounded-lg focus:ring-2 focus:ring-cyan-400 text-cyan-50 p-2"
                value={octet}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 0 && val <= 255) {
                    setIpOctet(i, val);
                  } else if (e.target.value === "") {
                    setIpOctet(i, 0);
                  }
                }}
                onWheel={(e) => handleWheel(e, i, 255)}
                onKeyDown={(e) => handleKeyDown(e, i, 255)}
                onPaste={handlePaste}
                maxLength={3}
                aria-label={`Octet ${i + 1}`}
                title={getOctetTooltip(i)}
              />
                <div className="absolute -top-2 -right-2 text-[10px] font-mono bg-gray-800 text-cyan-300 px-1 rounded-sm">
                  {i + 1}
                </div>
            </div>
              {i < 3 && <span className="text-xl mx-1 text-cyan-500">.</span>}
              {i === 3 && <span className="text-xl mx-1 text-cyan-500">/</span>}
          </div>
        ))}
        <div
            className={`relative ${networkColors.octets[4]} rounded-lg shadow-[0_0_8px_rgba(0,170,255,0.3)] transition-all duration-200 hover:shadow-[0_0_12px_rgba(0,170,255,0.5)]`}
        >
          <input
            type="text"
              className="w-12 font-mono text-center bg-transparent border-0 rounded-lg focus:ring-2 focus:ring-cyan-400 text-cyan-50 p-2"
            value={cidr}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 0 && val <= 32) {
                setCidr(val);
              } else if (e.target.value === "") {
                setCidr(0);
              }
            }}
            onWheel={(e) => handleWheel(e, 4, 32)}
            onKeyDown={(e) => handleKeyDown(e, 4, 32)}
            maxLength={2}
            aria-label={`Network bits`}
            title={`CIDR Prefix: Number of network bits (1-32). /${cidr} means ${cidr} bits are for the network portion.`}
          />
        </div>

        {/* Binary representation with improved network-like visualization */}
        <div className="relative p-2 bg-gray-900/70 rounded-md border border-gray-700 mb-4">
          <div className="absolute top-0 right-0 bg-gray-800 text-cyan-400 text-xs px-2 py-0.5 rounded-bl font-mono">
            BINARY
      </div>
          <div className="grid grid-cols-32 gap-1 mb-1 mt-3 overflow-x-auto py-2">
        {bits.flat().map((bit, i) => (
          <div
            key={i}
            className={`text-center text-xs font-mono ${
                  i < cidr
                    ? "bg-cyan-900/70 text-cyan-200 border border-cyan-700"
                    : "bg-gray-800/70 text-gray-400 border border-gray-700"
                } p-1 rounded transition-colors duration-150`}
          >
            {bit}
          </div>
        ))}
          </div>
          <div className="flex justify-between px-1 text-[10px] text-gray-500 font-mono">
            <span>0</span>
            <span>7</span>
            <span>15</span>
            <span>23</span>
            <span>31</span>
          </div>
      </div>

        {/* Enhanced controls hint with network terminal style */}
        <div className="text-sm text-cyan-400/70 text-center mb-2 bg-gray-800/50 py-2 rounded border-t border-b border-gray-700 font-mono">
          <span className="bg-gray-800 px-1 rounded">⬆⬇⬅➡</span> navigate &nbsp;
          <span className="bg-gray-800 px-1 rounded">⬆⬇</span> inc/dec &nbsp;
          <span className="bg-gray-800 px-1 rounded">.</span> next octet &nbsp;
          <span className="bg-gray-800 px-1 rounded">/</span> to CIDR
        </div>
      </div>
    </div>
  );
}
