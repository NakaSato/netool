// Router configuration types and interfaces
export type RouterVendor = "cisco" | "juniper" | "mikrotik" | "generic";

export type InterfaceType =
  | "ethernet"
  | "vlan"
  | "loopback"
  | "wireless"
  | "wan"
  | "lan";

export interface NetworkInterface {
  name: string;
  type: InterfaceType;
  ipAddress?: string;
  subnetMask?: string;
  enabled: boolean;
  description?: string;
  vlanId?: number;
  isWan?: boolean;
}

export interface DHCPConfig {
  enabled: boolean;
  poolName: string;
  networkAddress: string;
  subnetMask: string;
  defaultGateway: string;
  dnsServers: string[];
  leaseTime: number; // in days
  domainName?: string;
  startIp?: string;
  endIp?: string;
}

export interface NATConfig {
  enabled: boolean;
  type: "static" | "dynamic" | "pat";
  insideInterfaces: string[];
  outsideInterfaces: string[];
  accessListId?: string;
}

export interface FirewallRule {
  id: string;
  action: "permit" | "deny";
  protocol: "ip" | "tcp" | "udp" | "icmp" | "any";
  sourceAddress: string;
  sourceWildcard?: string;
  destinationAddress: string;
  destinationWildcard?: string;
  sourcePort?: string | number;
  destinationPort?: string | number;
  log?: boolean;
  description?: string;
}

export interface PortForwardingRule {
  id: string;
  description: string;
  protocol: "tcp" | "udp" | "both";
  externalPort: number;
  internalIp: string;
  internalPort: number;
  enabled: boolean;
}

export interface VPNConfig {
  enabled: boolean;
  type: "ipsec" | "ssl" | "l2tp" | "pptp";
  authentication: "psk" | "cert" | "both";
  presharedKey?: string;
  localNetworks: string[];
  remoteNetworks: string[];
}

export interface QoSConfig {
  enabled: boolean;
  policies: QoSPolicy[];
}

export interface QoSPolicy {
  name: string;
  priority: "high" | "medium" | "low";
  bandwidth?: number; // percentage or kbps
  applications?: string[];
  ports?: number[];
}

export interface RouterConfig {
  id: string;
  name: string;
  vendor: RouterVendor;
  firmwareVersion?: string;
  hostname: string;
  description?: string;
  interfaces: NetworkInterface[];
  dhcpServer: DHCPConfig;
  natConfig: NATConfig;
  firewallRules: FirewallRule[];
  portForwarding: PortForwardingRule[];
  vpnConfig: VPNConfig;
  qosConfig: QoSConfig;
  lastUpdated: Date;
  createdBy?: string;
}
