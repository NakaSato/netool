import React from "react";
import { Netmask } from "netmask";

interface AdvancedInfoProps {
  summarizableNetwork: string;
  summarizableCidr: number;
  netmask: Netmask;
}

const AdvancedInfo: React.FC<AdvancedInfoProps> = ({
  summarizableNetwork,
  summarizableCidr,
  netmask,
}) => {
  return (
    <div className="mt-6 border-t border-gray-700 pt-4">
      <h4 className="font-semibold text-base mb-3 text-blue-300">
        Advanced Networking Information
      </h4>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
          <h5 className="text-sm font-semibold mb-2 flex items-center text-blue-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 4a1 1 0 10-2 0v6a1 1 0 102 0V7zm-3 2a1 1 0 10-2 0v4a1 1 0 102 0V9zm-3 3a1 1 0 10-2 0v1a1 1 0 102 0v-1z"
                clipRule="evenodd"
              />
            </svg>
            Route Summarization
          </h5>

          <div className="text-xs space-y-2">
            <p className="text-gray-300">
              This network could be part of a larger summarized route:
            </p>
            <div className="font-mono bg-black p-2 rounded text-green-400 border border-gray-700">
              {summarizableNetwork} (
              {Math.pow(2, 32 - summarizableCidr).toLocaleString()} addresses)
            </div>
            <p className="text-gray-400">
              Summary routes help reduce routing table size by combining
              multiple smaller routes into a single route advertisement.
            </p>
          </div>
        </div>

        <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
          <h5 className="text-sm font-semibold mb-2 flex items-center text-blue-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Network Boundary
          </h5>

          <div className="text-xs space-y-1.5">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-gray-400">Network ID:</div>
              <div className="font-mono text-blue-300">{netmask.base}</div>

              <div className="text-gray-400">Broadcast IP:</div>
              <div className="font-mono text-red-300">{netmask.broadcast}</div>

              <div className="text-gray-400">First Host IP:</div>
              <div className="font-mono text-green-300">{netmask.first}</div>

              <div className="text-gray-400">Last Host IP:</div>
              <div className="font-mono text-green-300">{netmask.last}</div>
            </div>

            <p className="text-gray-400 mt-2">
              These boundary addresses define the network range and are critical
              for proper network configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedInfo;
