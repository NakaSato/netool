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
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {ip.map((octet, i) => (
          <div key={i} className={`flex items-center ${i < 3 ? "mr-0" : ""}`}>
            <div
              className={`relative ${networkColors.octets[i]} rounded-lg shadow-sm`}
            >
              <input
                ref={i === 0 ? firstInputRef : null}
                type="text"
                className="w-16 font-mono text-center bg-transparent border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 p-2"
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
            </div>
            {i < 3 && <span className="text-xl mx-1">.</span>}
            {i === 3 && <span className="text-xl mx-1">/</span>}
          </div>
        ))}
        <div
          className={`relative ${networkColors.octets[4]} rounded-lg shadow-sm`}
        >
          <input
            type="text"
            className="w-12 font-mono text-center bg-transparent border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 p-2"
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
      </div>

      {/* Binary representation */}
      <div className="grid grid-cols-32 gap-1 mb-4 overflow-x-auto">
        {bits.flat().map((bit, i) => (
          <div
            key={i}
            className={`text-center text-xs font-mono ${
              i < cidr ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"
            } p-1 rounded`}
          >
            {bit}
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-400 text-center mb-2">
        <span className="font-mono">Arrow keys</span> to navigate,{" "}
        <span className="font-mono">Up/Down</span> to increment/decrement,{" "}
        <span className="font-mono">.</span> to jump to next octet,{" "}
        <span className="font-mono">/</span> to jump to CIDR
      </div>
    </div>
  );
}
