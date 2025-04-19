import React from "react";

export default function CidrExplanation() {
  return (
    <div className="my-8 bg-gray-900 rounded-lg shadow-md hover:shadow-lg border border-gray-700">
      <div className="border-b border-gray-700 px-6 py-4 flex items-center">
        <div className="w-2 h-5 bg-cyan-400 mr-3"></div>
        <h2 className="text-xl font-bold text-gray-200 font-mono flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-cyan-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          CIDR REFERENCE
        </h2>
        <div className="ml-auto px-2 py-0.5 bg-gray-800 rounded text-xs font-mono text-cyan-400">
          RFC 4632
        </div>
      </div>

      <div className="p-6 space-y-4 text-base leading-7 text-gray-300">
        <div className="flex">
          <div className="w-12 flex-shrink-0 flex justify-center">
            <div className="w-1 bg-cyan-700 h-full rounded"></div>
          </div>
          <div>
            <p className="mb-3">
              <span className="font-semibold text-cyan-400">CIDR</span>{" "}
              (Classless Inter-Domain Routing) notation is a compact method for
              specifying IP address ranges. It replaced the older class-based
              system (Class A, B, C) to allow for more efficient IP address
              allocation and routing.
            </p>

            <div className="bg-gray-800 border-l-4 border-cyan-600 p-4 rounded-r-md mb-4">
              <div className="font-medium mb-1 text-cyan-300 font-mono">
                CIDR Format:
              </div>
              <code className="font-mono bg-gray-900 px-3 py-1.5 rounded text-green-400 border border-gray-700 inline-block">
                192.168.1.0/24
              </code>
              <div className="mt-2 text-sm text-gray-400">
                IP address (192.168.1.0) followed by prefix length (24 bits)
              </div>
            </div>

            <p className="mb-4">
              An IPv4 address consists of 4 octets (32 bits total), each
              containing values from 0-255. The{" "}
              <span className="font-medium text-cyan-300">/</span> followed by a
              number (1-32) indicates how many bits are used for the network
              portion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 font-mono">
          <div className="bg-gray-800 p-3 rounded-md border border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-900 opacity-20 rounded-bl-full"></div>
            <h3 className="font-semibold text-cyan-300 mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
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
              Network Bits (/24)
            </h3>
            <div className="text-sm">
              <p className="text-gray-300 mb-1">
                The first 24 bits (3 octets) identify the network
              </p>
              <div className="flex items-center mt-3 text-gray-400">
                <code className="bg-gray-900 px-2 py-0.5 rounded border border-gray-700">
                  192.168.1.0/24
                </code>
                <span className="ml-2">→ Network ID</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-3 rounded-md border border-gray-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-900 opacity-20 rounded-bl-full"></div>
            <h3 className="font-semibold text-indigo-300 mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
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
              Host Bits (32-24=8)
            </h3>
            <div className="text-sm">
              <p className="text-gray-300 mb-1">
                The remaining 8 bits identify hosts
              </p>
              <div className="mt-3 text-gray-400">
                <code className="bg-gray-900 px-2 py-0.5 rounded border border-gray-700">
                  2^8-2 = 254
                </code>
                <span className="ml-2">→ Usable addresses</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex mt-5">
          <div className="w-12 flex-shrink-0 flex justify-center">
            <div className="w-1 bg-cyan-700 h-full rounded"></div>
          </div>
          <div>
            <p className="mb-4">
              The{" "}
              <span className="font-medium text-cyan-400">wildcard mask</span>{" "}
              (inverse of subnet mask) is used in Cisco ACLs and route
              configurations. For a /24 network with subnet mask 255.255.255.0,
              the wildcard mask would be 0.0.0.255.
            </p>

            <div className="text-sm bg-gray-800 p-4 rounded-md border border-amber-700 flex items-start relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-700 opacity-10 rounded-full"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <strong className="text-amber-400 font-mono">CONSOLE:</strong>{" "}
                The network address (first IP) and broadcast address (last IP)
                cannot be assigned to hosts, which is why a /24 network has 254
                usable addresses instead of 256.
              </div>
            </div>

            <div className="mt-5 bg-gray-800 border border-gray-700 rounded-md overflow-hidden font-mono text-sm">
              <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 text-gray-400 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-cyan-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>Common CIDR Blocks</span>
              </div>
              <div className="p-3 text-gray-300 font-mono text-xs grid grid-cols-2 gap-2">
                <div>
                  <span className="text-cyan-400">/32</span> - Single host
                </div>
                <div>
                  <span className="text-cyan-400">/31</span> - Point-to-point
                  link (2 hosts)
                </div>
                <div>
                  <span className="text-cyan-400">/30</span> - 4 addresses (2
                  usable)
                </div>
                <div>
                  <span className="text-cyan-400">/29</span> - 8 addresses (6
                  usable)
                </div>
                <div>
                  <span className="text-cyan-400">/28</span> - 16 addresses (14
                  usable)
                </div>
                <div>
                  <span className="text-cyan-400">/24</span> - 256 addresses
                  (254 usable)
                </div>
                <div>
                  <span className="text-cyan-400">/16</span> - 65,536 addresses
                </div>
                <div>
                  <span className="text-cyan-400">/8</span> - 16,777,216
                  addresses
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
