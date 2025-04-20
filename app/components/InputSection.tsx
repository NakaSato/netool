/* eslint-disable react/no-unescaped-entities, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-expressions */
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
  handleWheel,
  handleKeyDown,
  handlePaste,
  bits,
}: InputSectionProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([
    null,
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    // Auto-focus the first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Enhanced keyboard navigation handler
  const handleEnhancedKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    i: number,
    max: number
  ) => {
    // Call the original handler for basic functionality
    handleKeyDown(event, i, max);

    // Additional keyboard shortcuts
    const value = i < 4 ? ip[i] : cidr;

    switch (event.key) {
      case "ArrowUp":
        // Increase value (with bounds check)
        if (value < max) {
          i < 4 ? setIpOctet(i, value + 1) : setCidr(value + 1);
        }
        event.preventDefault();
        break;
      case "ArrowDown":
        // Decrease value (with bounds check)
        if (value > 0) {
          i < 4 ? setIpOctet(i, value - 1) : setCidr(value - 1);
        }
        event.preventDefault();
        break;
      case "ArrowLeft":
        // Navigate to previous octet
        if (i > 0) {
          const prevInput = inputRefs.current[i - 1];
          if (prevInput) {
            prevInput.focus();
            event.preventDefault();
          }
        }
        break;
      case "ArrowRight":
        // Navigate to next octet
        if (i < 4) {
          const nextInput = inputRefs.current[i + 1];
          if (nextInput) {
            nextInput.focus();
            event.preventDefault();
          }
        }
        break;
      case ".":
        // Navigate to next octet on dot key
        if (i < 3) {
          const nextInput = inputRefs.current[i + 1];
          if (nextInput) {
            nextInput.focus();
            event.preventDefault();
          }
        }
        break;
      case "/":
        // Navigate to CIDR input on slash key
        if (i < 4) {
          const cidrInput = inputRefs.current[4];
          if (cidrInput) {
            cidrInput.focus();
            event.preventDefault();
          }
        }
        break;
    }
  };

  // Define modern network engineering color palette
  const inputBgColors = [
    "bg-cyan-900 border-cyan-600", // First octet
    "bg-blue-900 border-blue-600", // Second octet
    "bg-indigo-900 border-indigo-600", // Third octet
    "bg-violet-900 border-violet-600", // Fourth octet
    "bg-slate-800 border-slate-600", // CIDR
  ];

  return (
    <div className="mb-8 relative">
      {/* Technical background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      {/* Main container with terminal-like border */}
      <div className="relative p-4 border-2 border-cyan-500/30 rounded-lg bg-gray-900/30 backdrop-blur-sm shadow-[0_0_15px_rgba(0,200,255,0.15)]">
        {/* Header with network status */}
        <div className="flex items-center mb-4">
          <div className="w-2 h-5 bg-green-400 mr-2"></div>
          <h3 className="text-gray-300 font-mono text-sm">IP ADDRESS INPUT</h3>
          <div className="ml-auto px-2 py-0.5 bg-gray-800 rounded text-xs font-mono text-green-500">
            IPv4
          </div>
        </div>

        {/* IP Input section */}
        <div className="flex flex-wrap justify-center gap-1 xs:gap-2 sm:gap-3 md:gap-4 py-4 sm:py-5">
          {ip.map((octet, i) => (
            <div key={`octet-${i}`} className="flex flex-col items-center">
              <span className="text-xs font-mono text-gray-400 mb-1">{`Octet ${
                i + 1
              }`}</span>
              <div className="flex items-center relative group">
                <input
                  ref={(el) => {
                    if (el) {
                      inputRefs.current[i] = el;
                    }
                  }}
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
                  onKeyDown={(e) => handleEnhancedKeyDown(e, i, 255)}
                  onPaste={handlePaste}
                  className={`w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 text-lg xs:text-xl sm:text-2xl text-center rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono ${inputBgColors[i]} text-white border-2 transition-all duration-200 group-hover:border-cyan-500`}
                  maxLength={3}
                  aria-label={`Octet ${i + 1}`}
                  title={getOctetTooltip(i)}
                />
                {/* Up/Down arrows */}
                <div className="absolute right-0 top-0 bottom-0 w-5 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="flex-1 text-gray-300 hover:text-white hover:bg-gray-700 flex items-center justify-center rounded-tr-md"
                    onClick={() => octet < 255 && setIpOctet(i, octet + 1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
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
                    className="flex-1 text-gray-300 hover:text-white hover:bg-gray-700 flex items-center justify-center rounded-br-md"
                    onClick={() => octet > 0 && setIpOctet(i, octet - 1)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
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
                  className="text-xl xs:text-2xl sm:text-3xl mx-0.5 xs:mx-1 sm:mx-1.5 text-cyan-500"
                  key={`sep-${i}`}
                >
                  {i == 3 ? "/" : "."}
                </span>
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono text-gray-400 mb-1">Prefix</span>
            <div className="flex items-center relative group">
              <input
                ref={(el) => {
                  if (el) {
                    inputRefs.current[4] = el;
                  }
                }}
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
                onKeyDown={(e) => handleEnhancedKeyDown(e, 4, 32)}
                className={`w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 text-lg xs:text-xl sm:text-2xl text-center rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono ${inputBgColors[4]} text-white border-2 transition-all duration-200 group-hover:border-cyan-500`}
                maxLength={2}
                aria-label={`Network bits`}
                title={`CIDR Prefix: Number of network bits (1-32). /${cidr} means ${cidr} bits are for the network portion.`}
              />
              {/* Up/Down arrows */}
              <div className="absolute right-0 top-0 bottom-0 w-5 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="flex-1 text-gray-300 hover:text-white hover:bg-gray-700 flex items-center justify-center rounded-tr-md"
                  onClick={() => cidr < 32 && setCidr(cidr + 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
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
                  className="flex-1 text-gray-300 hover:text-white hover:bg-gray-700 flex items-center justify-center rounded-br-md"
                  onClick={() => cidr > 0 && setCidr(cidr - 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
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

        {/* Enhanced keyboard navigation hints with platform awareness */}
        <div className="text-center text-xs text-gray-400 mt-3 mb-2 bg-gray-800 p-2 rounded border border-gray-700 font-mono">
          <p>
            <span className="text-cyan-400">Keyboard:</span> Use{" "}
            <kbd className="px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600">
              ↑
            </kbd>
            /
            <kbd className="px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600">
              ↓
            </kbd>{" "}
            to change values,{" "}
            <kbd className="px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600">
              ←
            </kbd>
            /
            <kbd className="px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600">
              →
            </kbd>{" "}
            to navigate,{" "}
            <kbd className="px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600">
              .
            </kbd>
            /{" "}
            <kbd className="px-1 py-0.5 bg-gray-700 rounded text-cyan-300 border border-gray-600">
              /
            </kbd>{" "}
            for next octet/CIDR
          </p>
        </div>

        {/* Binary representation with improved visualization */}
        <div className="overflow-x-auto mx-auto max-w-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 pb-2 mt-4 bg-gray-800 p-3 rounded-md border border-gray-700">
          <div className="flex flex-col">
            <div className="text-xs font-mono text-gray-400 mb-2">
              Binary Representation:
            </div>
            <div className="flex flex-nowrap justify-center min-w-max">
              {bits.map((octet, i) => (
                <span key={`octet-${i}`} className="px-0.5 sm:px-1 my-1">
                  {octet.map((bit, j) => (
                    <span
                      key={`octet-${i}-bit-${j}`}
                      className={`font-mono border border-gray-700 px-0.5 sm:px-1 py-0.5 text-xs ${
                        i * 8 + j < cidr
                          ? "bg-cyan-900 text-cyan-200"
                          : "bg-gray-900 text-gray-400"
                      } ${(j + 1) % 4 === 0 ? "mr-1" : ""}`}
                    >
                      {bit}
                    </span>
                  ))}
                </span>
              ))}
            </div>
            <div className="flex flex-nowrap mt-2 w-full">
              <div className="flex justify-between w-full px-1 text-[0.6rem] sm:text-xs text-gray-500 font-mono">
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
