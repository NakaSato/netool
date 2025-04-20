import React from "react";
import { Netmask } from "netmask";

interface RouterTabProps {
  ip: number[];
  netmask: Netmask;
}

const RouterTab: React.FC<RouterTabProps> = ({ ip, netmask }) => {
  // Helper function to convert IP array to string
  const _ipString = ip.join(".");
  // Calculate gateway (usually first usable IP in the subnet)
  const baseIpParts = netmask.base.split(".");
  const gatewayIp = [
    ...baseIpParts.slice(0, 3),
    (parseInt(baseIpParts[3]) + 1).toString(),
  ].join(".");
  // Calculate wildcard mask (inverse of netmask)
  const wildcardMask = netmask.mask
    .split(".")
    .map((octet) => (255 - parseInt(octet)).toString())
    .join(".");
  // Calculate DHCP range (second usable to last usable - 1)
  const dhcpStart = [
    ...baseIpParts.slice(0, 3),
    (parseInt(baseIpParts[3]) + 2).toString(),
  ].join(".");
  const lastIpParts = netmask.broadcast.split(".");
  const dhcpEnd = [
    ...lastIpParts.slice(0, 3),
    (parseInt(lastIpParts[3]) - 1).toString(),
  ].join(".");

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-2 sm:p-3 transition-all hover:border-gray-600">
      <h5 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 text-blue-300 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
        Router Configuration
      </h5>

      <div className="text-[10px] xs:text-xs space-y-3 sm:space-y-4">
        {/* Basic LAN Setup */}
        <div>
          <p className="mb-1 text-gray-300">Basic LAN Setup:</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-pre-wrap text-[9px] xs:text-[10px] sm:text-xs">
            {`# Router LAN Interface Configuration
interface LAN
ip address ${gatewayIp} ${netmask.mask}
description Local Area Network
no shutdown`}
          </div>
        </div>

        {/* DHCP Server Configuration */}
        <div>
          <p className="mb-1 text-gray-300">DHCP Server Configuration:</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-pre-wrap text-[9px] xs:text-[10px] sm:text-xs">
            {`ip dhcp pool LAN_POOL
network ${netmask.base} ${netmask.mask}
default-router ${gatewayIp}
dns-server 8.8.8.8 8.8.4.4
lease 7`}
          </div>
        </div>

        {/* Cisco IOS Route Entry */}
        <div>
          <p className="mb-1 text-gray-300">Cisco IOS Route Entry:</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-nowrap">
            ip route {netmask.base} {netmask.mask} [next-hop-ip]
          </div>
        </div>

        {/* Router Access Control List */}
        <div>
          <p className="mb-1 text-gray-300">Access Control List:</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-pre-wrap text-[9px] xs:text-[10px] sm:text-xs">
            {`access-list 10 permit ${netmask.base} ${wildcardMask}
!
interface LAN
 ip access-group 10 in`}
          </div>
        </div>

        {/* OSPF Configuration */}
        <div>
          <p className="mb-1 text-gray-300">OSPF Configuration (Area 0):</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-pre-wrap text-[9px] xs:text-[10px] sm:text-xs">
            {`interface LAN
ip address ${ip.join(".")} ${netmask.mask}
!
router ospf 1
network ${netmask.base} ${wildcardMask} area 0`}
          </div>
        </div>

        {/* Port Forwarding Example */}
        <div>
          <p className="mb-1 text-gray-300">Port Forwarding Example:</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-pre-wrap text-[9px] xs:text-[10px] sm:text-xs">
            {`ip nat inside source static tcp ${dhcpStart} 80 interface WAN 80
ip nat inside source static tcp ${dhcpStart} 443 interface WAN 443`}
          </div>
        </div>

        {/* VPN Configuration Example */}
        <div>
          <p className="mb-1 text-gray-300">VPN Configuration Example:</p>
          <div className="font-mono bg-black text-green-400 p-1.5 sm:p-2 md:p-3 rounded mb-1 sm:mb-2 border border-gray-700 overflow-x-auto whitespace-pre-wrap text-[9px] xs:text-[10px] sm:text-xs">
            {`crypto isakmp policy 10
encr aes 256
authentication pre-share
group 2
!
ip local pool VPN_POOL ${dhcpStart} ${dhcpEnd}
!
ip access-list extended VPN_TRAFFIC
permit ip ${netmask.base} ${wildcardMask} any`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouterTab;
