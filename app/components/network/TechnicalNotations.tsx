import React, { memo, useState } from "react";
import { Netmask } from "netmask";
import toast from "react-hot-toast";

/**
 * Props interface for the TechnicalNotations component
 *
 * @property {number[]} ip - The IP address as an array of numbers
 * @property {number} cidr - The CIDR prefix length
 * @property {string} binaryIP - The binary representation of the IP
 * @property {string} hexIP - The hexadecimal representation of the IP
 * @property {Netmask} netmask - The netmask object
 */
interface TechnicalNotationsProps {
  ip: number[];
  cidr: number;
  binaryIP: string;
  hexIP: string;
  netmask: Netmask;
}

/**
 * Displays technical notations for an IP address in various formats
 *
 * @param props - Component props
 * @returns A component displaying different technical representations of an IP address
 */
const TechnicalNotations: React.FC<TechnicalNotationsProps> = ({
  ip,
  cidr,
  binaryIP,
  hexIP,
  netmask,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);

      // Show toast notification
      toast.success(
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>{label} copied to clipboard</span>
        </div>,
        {
          duration: 1500,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }
      );

      setTimeout(() => setCopiedField(null), 1500);
    });
  };

  // SVG for copy icon
  const CopyIcon = ({ copied }: { copied: boolean }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`ml-2 cursor-pointer transition-colors ${
        copied ? "text-green-500" : "text-gray-400 hover:text-gray-200"
      }`}
    >
      {copied ? (
        <>
          <polyline points="20 6 9 17 4 12" />
        </>
      ) : (
        <>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>
      )}
    </svg>
  );

  return (
    <section
      className="mb-3 p-3 bg-black border border-gray-700 mx-4 mt-4 rounded-md text-xs font-mono overflow-x-auto"
      aria-labelledby="technical-notations-heading"
    >
      <h3 id="technical-notations-heading" className="sr-only">
        Technical Notations
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center">
          <span className="text-green-400 inline-block w-16">Dotted:</span>
          <span className="text-gray-200">
            {ip.join(".")}/{cidr}
          </span>
          <CopyIcon copied={copiedField === "dotted"} />
          <button
            onClick={() =>
              copyToClipboard(`${ip.join(".")}/${cidr}`, "dotted", "Dotted notation")
            }
            className="sr-only"
            aria-label="Copy dotted notation"
          >
            Copy
          </button>
        </div>
        <div className="flex items-center">
          <span className="text-green-400 inline-block w-16">Binary:</span>
          <span className="text-gray-200 text-[10px] sm:text-xs break-all">
            {binaryIP}
          </span>
          <CopyIcon copied={copiedField === "binary"} />
          <button
            onClick={() =>
              copyToClipboard(binaryIP, "binary", "Binary notation")
            }
            className="sr-only"
            aria-label="Copy binary notation"
          >
            Copy
          </button>
        </div>
        <div className="flex items-center">
          <span className="text-green-400 inline-block w-16">Hex:</span>
          <span className="text-gray-200">{hexIP}</span>
          <CopyIcon copied={copiedField === "hex"} />
          <button
            onClick={() =>
              copyToClipboard(hexIP, "hex", "Hexadecimal notation")
            }
            className="sr-only"
            aria-label="Copy hexadecimal notation"
          >
            Copy
          </button>
        </div>
        <div className="flex items-center">
          <span className="text-green-400 inline-block w-16">Wildcard:</span>
          <span className="text-gray-200">{netmask.hostmask}</span>
          <CopyIcon copied={copiedField === "wildcard"} />
          <button
            onClick={() =>
              copyToClipboard(netmask.hostmask, "wildcard", "Wildcard notation")
            }
            className="sr-only"
            aria-label="Copy wildcard notation"
          >
            Copy
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(TechnicalNotations);
