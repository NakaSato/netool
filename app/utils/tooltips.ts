/**
 * Get tooltip text for network details
 */
export const getDetailTooltip = (label: string) => {
  switch (label) {
    case "Netmask":
      return "Subnet mask in decimal notation. Defines which portion of the IP address is used for the network.";
    case "Wildcard Mask":
      return "Inverse of subnet mask (255.255.255.255 - subnet mask). Used in Cisco ACLs and route configurations.";
    case "CIDR Base IP":
      return "Network address (first address) of this subnet. This address identifies the network and cannot be assigned to a host.";
    case "Broadcast IP":
      return "Last address in the subnet. Used to send data to all hosts in the network and cannot be assigned to a specific host.";
    case "Count":
      return "Total number of IP addresses in this subnet, including network and broadcast addresses.";
    case "First Usable IP":
      return "First IP address that can be assigned to a host on this network.";
    case "Last Usable IP":
      return "Last IP address that can be assigned to a host on this network.";
    default:
      return "";
  }
};

/**
 * Get tooltip text for octet inputs
 */
export const getOctetTooltip = (index: number) => {
  switch (index) {
    case 0:
      return "First octet (0-255): Traditionally defines the network class (A: 1-127, B: 128-191, C: 192-223)";
    case 1:
      return "Second octet (0-255): In classful networking, part of network ID for Class A, or subnet for Classes B and C";
    case 2:
      return "Third octet (0-255): In classful networking, part of network ID for Classes A and B, or subnet for Class C";
    case 3:
      return "Fourth octet (0-255): Traditionally used for host identification in classful networking";
    default:
      return "IP address octet (0-255)";
  }
};
