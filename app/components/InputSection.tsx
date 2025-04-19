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

  // Define modern network engineering color palette with enhanced hover states
  const inputBgColors = [
    "bg-cyan-900 border-cyan-600 hover:bg-cyan-800", // First octet
    "bg-blue-900 border-blue-600 hover:bg-blue-800", // Second octet
    "bg-indigo-900 border-indigo-600 hover:bg-indigo-800", // Third octet
    "bg-violet-900 border-violet-600 hover:bg-violet-800", // Fourth octet
    "bg-slate-800 border-slate-600 hover:bg-slate-700", // CIDR
  ];

  return (
    <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 relative">
      {/* Technical background pattern with improved opacity */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5 pointer-events-none"></div>

      {/* Main container with enhanced terminal-like border and responsive padding */}
      <div className="relative p-2.5 xs:p-3 sm:p-4 md:p-5 lg:p-6 border-2 border-cyan-500/30 rounded-lg bg-gray-900/30 backdrop-blur-sm shadow-[0_0_15px_rgba(0,200,255,0.15)] transition-all duration-300">
        {/* Header with network status - improved spacing */}
        <div className="flex items-center mb-2 xs:mb-3 sm:mb-4 md:mb-5">
          <div className="w-1.5 h-3 xs:w-2 xs:h-4 sm:h-5 bg-green-400 mr-2 rounded-sm"></div>
          <h3 className="text-gray-300 font-mono text-[10px] xs:text-xs sm:text-sm md:text-base">
            IP ADDRESS INPUT
          </h3>
          <div className="ml-auto px-1.5 xs:px-2 py-0.5 bg-gray-800 rounded text-[10px] xs:text-xs font-mono text-green-500 border border-gray-700">
            IPv4
          </div>
        </div>

        {/* IP Input section with improved responsive gap */}
        <div className="flex flex-wrap justify-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-5 py-2 xs:py-3 sm:py-4 md:py-5">
          {ip.map((octet, i) => (
            <div key={`octet-${i}`} className="flex flex-col items-center">
              <span className="text-[8px] xs:text-[10px] sm:text-xs font-mono text-gray-400 mb-1">
                {`Octet ${i + 1}`}
              </span>
              <div className="flex items-center relative group">
                <input
                  ref={i === 0 ? firstInputRef : null}
                  key={`inp-${i}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
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
                  className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-center rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono ${inputBgColors[i]} text-white border-2 transition-all duration-300 group-hover:border-cyan-500 group-hover:shadow-cyan-900/30 transform group-hover:scale-105`}
                  maxLength={3}
                  aria-label={`Octet ${i + 1}`}
                  title={getOctetTooltip(i)}
                />
                {/* Up/Down arrows with improved hover effects */}
                <div className="absolute right-0 top-0 bottom-0 w-3 xs:w-4 sm:w-5 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="flex-1 text-gray-300 hover:text-white hover:bg-gray-700/80 flex items-center justify-center rounded-tr-md transition-colors duration-150"
                    onClick={() => octet < 255 && setIpOctet(i, octet + 1)}
                    aria-label="Increment value"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-1.5 w-1.5 xs:h-2 xs:w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <button
                    className="flex-1 text-gray-300 hover:text-white hover:bg-gray-700/80 flex items-center justify-center rounded-br-md transition-colors duration-150"
                    onClick={() => octet > 0 && setIpOctet(i, octet - 1)}
                    aria-label="Decrement value"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-1.5 w-1.5 xs:h-2 xs:w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
                <span
                  className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl mx-0.5 xs:mx-1 sm:mx-1.5 text-cyan-500 font-mono animate-pulse"
                  key={`sep-${i}`}
                >
                  {i == 3 ? "/" : "."}
                </span>
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <span className="text-[8px] xs:text-[10px] sm:text-xs font-mono text-gray-400 mb-1">
              Prefix
            </span>
            <div className="flex items-center relative group">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                key={`inp-cidr`}
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
                className={`w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-center rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono ${inputBgColors[4]} text-white border-2 transition-all duration-300 group-hover:border-cyan-500 group-hover:shadow-cyan-900/30 transform group-hover:scale-105`}
                maxLength={2}
                aria-label={`Network bits`}
                title={`CIDR Prefix: Number of network bits (1-32). /${cidr} means ${cidr} bits are for the network portion.`}
              />
              {/* Up/Down arrows */}
              <div className="absolute right-0 top-0 bottom-0 w-3 xs:w-4 sm:w-5 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="flex-1 text-gray-300 hover:text-white hover:bg-gray-700/80 flex items-center justify-center rounded-tr-md transition-colors duration-150"
                  onClick={() => cidr < 32 && setCidr(cidr + 1)}
                  aria-label="Increment CIDR"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-1.5 w-1.5 xs:h-2 xs:w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  className="flex-1 text-gray-300 hover:text-white hover:bg-gray-700/80 flex items-center justify-center rounded-br-md transition-colors duration-150"
                  onClick={() => cidr > 0 && setCidr(cidr - 1)}
                  aria-label="Decrement CIDR"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-1.5 w-1.5 xs:h-2 xs:w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced keyboard navigation hints with platform awareness and improved responsiveness */}
        <div className="text-center text-[8px] xs:text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 mb-2 bg-gray-800/80 p-1.5 xs:p-2 sm:p-2.5 rounded border border-gray-700 font-mono">
          <p>
            <span className="text-cyan-400">Keyboard:</span> Use{" "}
            <kbd className="px-0.5 xs:px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600 text-[7px] xs:text-[9px] sm:text-xs">
              ↑
            </kbd>
            /
            <kbd className="px-0.5 xs:px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600 text-[7px] xs:text-[9px] sm:text-xs">
              ↓
            </kbd>{" "}
            to change values,{" "}
            <kbd className="px-0.5 xs:px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600 text-[7px] xs:text-[9px] sm:text-xs">
              ←
            </kbd>
            /
            <kbd className="px-0.5 xs:px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600 text-[7px] xs:text-[9px] sm:text-xs">
              →
            </kbd>{" "}
            to navigate,{" "}
            <kbd className="px-0.5 xs:px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600 text-[7px] xs:text-[9px] sm:text-xs">
              .
            </kbd>
            /{" "}
            <kbd className="px-0.5 xs:px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600 text-[7px] xs:text-[9px] sm:text-xs">
              /
            </kbd>{" "}
            for next octet/CIDR
          </p>
        </div>

        {/* Binary representation with improved visualization and responsiveness */}
        <div className="overflow-x-auto mx-auto max-w-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 pb-2 mt-2 xs:mt-3 sm:mt-4 bg-gray-800/80 p-1.5 xs:p-2 sm:p-3 rounded-md border border-gray-700 shadow-inner">
          <div className="flex flex-col">
            <div className="text-[8px] xs:text-[10px] sm:text-xs font-mono text-gray-400 mb-1 sm:mb-2">
              Binary Representation:
            </div>
            <div className="flex flex-nowrap justify-center min-w-max">
              {bits.map((octet, i) => (
                <span
                  key={`octet-${i}`}
                  className="px-0.5 sm:px-1 my-0.5 sm:my-1"
                >
                  {octet.map((bit, j) => (
                    <span
                      key={`octet-${i}-bit-${j}`}
                      className={`font-mono border border-gray-700 px-0.5 py-0.5 text-[7px] xs:text-[9px] sm:text-xs ${
                        i * 8 + j < cidr
                          ? "bg-cyan-900 text-cyan-200 border-cyan-700"
                          : "bg-gray-900 text-gray-400"
                      } ${
                        (j + 1) % 4 === 0 ? "mr-0.5 sm:mr-1" : ""
                      } transition-colors duration-300 hover:bg-opacity-80`}
                    >
                      {bit}
                    </span>
                  ))}
                </span>
              ))}
            </div>
            <div className="flex flex-nowrap mt-0.5 xs:mt-1 sm:mt-2 w-full">
              <div className="flex justify-between w-full max-w-full px-1 md:px-1.5 lg:px-2 text-[0.5rem] xs:text-[0.55rem] sm:text-[0.6rem] md:text-xs lg:text-sm text-gray-500 font-mono">
                <span>0</span>
                <span>8</span>
                <span>16</span>
                <span>24</span>
                <span>31</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
