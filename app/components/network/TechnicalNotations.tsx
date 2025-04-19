import React from "react";
import { Netmask } from "netmask";

interface TechnicalNotationsProps {
  ip: number[];
  cidr: number;
  binaryIP: string;
  hexIP: string;
  netmask: Netmask;
}

const TechnicalNotations: React.FC<TechnicalNotationsProps> = ({
  ip,
  cidr,
  binaryIP,
  hexIP,
  netmask,
}) => {
  return (
    <div className="mb-3 p-3 bg-black border border-gray-700 mx-4 mt-4 rounded-md text-xs font-mono overflow-x-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className="text-green-400 inline-block w-16">Dotted:</span>
          <span className="text-gray-200">
            {ip.join(".")}/{cidr}
          </span>
        </div>
        <div>
          <span className="text-green-400 inline-block w-16">Binary:</span>
          <span className="text-gray-200 text-[10px] sm:text-xs break-all">
            {binaryIP}
          </span>
        </div>
        <div>
          <span className="text-green-400 inline-block w-16">Hex:</span>
          <span className="text-gray-200">{hexIP}</span>
        </div>
        <div>
          <span className="text-green-400 inline-block w-16">Wildcard:</span>
          <span className="text-gray-200">{netmask.hostmask}</span>
        </div>
      </div>
    </div>
  );
};

export default TechnicalNotations;
