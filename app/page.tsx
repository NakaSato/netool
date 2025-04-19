"use client";

import React, { useEffect, useState } from "react";
import { Netmask } from "netmask";
import InputSection from "./components/InputSection";
import RangeVisualizer from "./components/RangeVisualizer";
import SubnetMaskBinary from "./components/SubnetMaskBinary";
import SubnetDivision from "./components/SubnetDivision";
import NetworkDetails from "./components/NetworkDetails";
import ActionButtons from "./components/ActionButtons";
import CidrExplanation from "./components/CidrExplanation";
import Footer from "./components/Footer";

// Tailwind CSS grid columns utility for 32 columns
const gridCols32Style = `
  .grid-cols-32 {
    grid-template-columns: repeat(32, minmax(0, 1fr));
  }
`;

export default function Cidr() {
  const [ip, setIp] = useState([192, 168, 1, 0]);
  const [cidr, setCidr] = useState(24);
  const [networkColors] = useState({
    octets: [
      "bg-purple-200", // First octet
      "bg-blue-200", // Second octet
      "bg-green-200", // Third octet
      "bg-amber-200", // Fourth octet
      "bg-slate-200", // CIDR
    ],
    // Colors for network classes in visualization
    classes: {
      a: { bg: "bg-purple-400", text: "text-purple-800" },
      b: { bg: "bg-blue-400", text: "text-blue-800" },
      c: { bg: "bg-green-400", text: "text-green-800" },
      small: { bg: "bg-amber-400", text: "text-amber-800" },
    },
  });
  const [isCopied, setIsCopied] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  const bits = ip.map((octet) =>
    Array.from({ length: 8 }, (_, i) => (octet >> (7 - i)) & 1)
  );

  const setIpOctet = (i: number, val: number) => {
    const newIp = [...ip];
    newIp[i] = val;
    setIp(newIp);
  };

  const handleWheel = (
    event: React.WheelEvent<HTMLInputElement>,
    i: number,
    max: number
  ) => {
    event.preventDefault();
    const min = 0;
    const target = event.currentTarget as HTMLInputElement;
    let value = parseInt(target.value);

    if (event.deltaY > 0 && value > min) {
      value -= 1;
    }
    if (event.deltaY < 0 && value < max) {
      value += 1;
    }

    if (i == 4) {
      setCidr(value);
    } else {
      setIpOctet(i, value);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    i: number,
    max: number
  ) => {
    const min = 0;
    const target = event.currentTarget as HTMLInputElement;
    let value = parseInt(target.value);

    // Navigation and value adjustment with arrow keys
    if (event.key === "ArrowDown" && value > min) {
      value -= 1;
    } else if (event.key === "ArrowUp" && value < max) {
      value += 1;
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      const parent = (event.target as Node).parentNode;
      const next = parent?.nextSibling?.firstChild;
      if (next instanceof HTMLInputElement) {
        next.select();
        next.focus();
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const parent = (event.target as Node).parentNode;
      const prev = parent?.previousSibling?.firstChild;
      if (prev instanceof HTMLInputElement) {
        prev.select();
        prev.focus();
      }
    } else if (event.key === ".") {
      event.preventDefault();
      const parent = (event.target as Node).parentNode;
      const next = parent?.nextSibling?.firstChild;
      if (next instanceof HTMLInputElement) {
        next.select();
        next.focus();
      }
    } else if (event.key === "/") {
      event.preventDefault();
      // Find the CIDR input field regardless of where the user currently is
      const inputs = document.querySelectorAll('input[type="text"]');
      const cidrInput = inputs[inputs.length - 1] as HTMLInputElement;
      if (cidrInput) {
        cidrInput.select();
        cidrInput.focus();
      }
    }
    // Shortcuts for copy operations
    else if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "c"
    ) {
      event.preventDefault();
      handleCopy();
    } else if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "s"
    ) {
      event.preventDefault();
      handleShare();
    }

    if (i == 4) {
      setCidr(value);
    } else {
      setIpOctet(i, value);
    }
  };

  const updateCidrString = (val: string) => {
    const parts = val.split("/");
    const ip = parts[0].split(".").map(Number);
    const cidr = Number(parts[1]);

    if (ip.length != 4) {
      return;
    }

    ip.forEach((octet) => {
      if (Number.isNaN(octet) || octet < 0 || octet > 255) {
        return;
      }
    });
    setIp(ip);

    if (Number.isNaN(cidr) || cidr < 0 || cidr > 32) {
      return;
    }
    setCidr(cidr);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const clipboardData = e.clipboardData.getData("text");
    const ipMatch = clipboardData.match(
      /(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(\/(\d{1,2}))?/
    );

    if (ipMatch) {
      const [, o1, o2, o3, o4, , cidrVal] = ipMatch;

      // Safely parse and set octets
      const safeParseOctet = (val: string) =>
        Math.min(255, Math.max(0, parseInt(val, 10) || 0));

      setIp([
        safeParseOctet(o1),
        safeParseOctet(o2),
        safeParseOctet(o3),
        safeParseOctet(o4),
      ]);

      if (cidrVal) {
        const parsedCidr = parseInt(cidrVal, 10);
        if (!isNaN(parsedCidr) && parsedCidr >= 0 && parsedCidr <= 32) {
          setCidr(parsedCidr);
        }
      }
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(pretty);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    const frag = "#" + ip.join(".") + "/" + cidr;
    window.location.hash = frag;
    await navigator.clipboard.writeText(window.location.toString());
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  const handleFieldCopy = async (value: string, fieldName: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  useEffect(() => {
    const fragment = window.location.hash.slice(1);
    if (fragment) {
      updateCidrString(fragment);
    }
  }, []);

  // Add useEffect to inject the CSS for grid-cols-32 since it's not in default Tailwind
  useEffect(() => {
    // Check if the style already exists
    if (!document.getElementById("grid-cols-32-style")) {
      const styleElement = document.createElement("style");
      styleElement.id = "grid-cols-32-style";
      styleElement.innerHTML = gridCols32Style;
      document.head.appendChild(styleElement);
    }

    return () => {
      // Clean up on component unmount
      const styleElement = document.getElementById("grid-cols-32-style");
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  const pretty = ip.join(".") + "/" + cidr;
  const netmask = new Netmask(pretty);

  // Calculate Wildcard mask (inverse of Subnet mask)
  const calculateWildcardMask = (subnetMask: string): string => {
    return subnetMask
      .split(".")
      .map((octet) => 255 - parseInt(octet))
      .join(".");
  };

  const wildcardMask = calculateWildcardMask(netmask.mask);

  const details = {
    Netmask: netmask.mask,
    "Wildcard Mask": wildcardMask,
    "CIDR Base IP": netmask.base,
    "Broadcast IP": netmask.broadcast || "None",
    Count: netmask.size.toLocaleString(),
    "First Usable IP": netmask.first,
    "Last Usable IP": netmask.last,
  };

  const totalIPv4Space = 4294967296; // 2^32
  const networkSizePercentage = (netmask.size / totalIPv4Space) * 100;

  return (
    // MAIN CONTAINER
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 overflow-x-hidden">
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-[95rem] mx-auto">
        <div className="border border-gray-700 rounded-lg shadow-xl bg-gray-800/95 p-4 sm:p-5 md:p-6 lg:p-8 backdrop-blur-sm">
          {/* Terminal-like header */}
          <div className="mb-4 md:mb-6 p-2 bg-gray-900 border border-gray-700 rounded-md flex items-center">
            <div className="flex space-x-1.5 sm:space-x-2 mr-2 sm:mr-4">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="font-mono text-xs sm:text-sm text-gray-400 flex-grow text-center truncate">
              CIDR Calculator - Network Engineering Toolkit
            </div>
            <div className="px-1.5 sm:px-2 py-0.5 bg-gray-700 rounded text-xs font-mono text-green-400 ml-2 hidden sm:block">
              v1.0.0
            </div>
          </div>

          {/* IP Input section */}
          <InputSection
            ip={ip}
            cidr={cidr}
            setIpOctet={setIpOctet}
            setCidr={setCidr}
            networkColors={networkColors}
            handleWheel={handleWheel}
            handleKeyDown={handleKeyDown}
            handlePaste={handlePaste}
            bits={bits}
          />

          <RangeVisualizer
            netmask={netmask}
            ip={ip}
            cidr={cidr}
            networkColors={networkColors}
            networkSizePercentage={networkSizePercentage}
            handleFieldCopy={handleFieldCopy}
          />

          {/* Create responsive gap between sections */}
          <div className="my-4 md:my-6"></div>

          <SubnetMaskBinary
            netmask={netmask}
            cidr={cidr}
            wildcardMask={wildcardMask}
          />

          <SubnetDivision cidr={cidr} setCidr={setCidr} netmask={netmask} />

          <NetworkDetails
            details={details}
            handleFieldCopy={handleFieldCopy}
            copiedField={copiedField}
          />

          <ActionButtons
            handleCopy={handleCopy}
            handleShare={handleShare}
            isCopied={isCopied}
            isShared={isShared}
          />
        </div>

        <CidrExplanation />
      </div>

      <Footer />
    </div>
  );
}
