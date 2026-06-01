/**
 * Types and interfaces for the Vallonation Real-Time Sovereign Cloud Database.
 */

export interface DatabaseEntry {
  id: string;
  key: string;
  value: string;
  category: "users" | "sessions" | "payment" | "iot_telemetry";
  lastUpdated: string;
  sizeBytes: number;
  syncNode: string; // e.g. "Odin-1: North-Europe", "Odin-2: US-East"
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warn" | "error" | "api_request" | "websocket";
  message: string;
  latency?: number; // millisecond latency
  method?: "GET" | "POST" | "PUT" | "DELETE" | "SUBSCRIBE";
  bytes?: number;
}

export interface ApiKey {
  id: string;
  name: string;
  keyString: string;
  created: string;
  status: "active" | "revoked";
  permissions: {
    read: boolean;
    write: boolean;
    subscribe: boolean;
  };
}

export interface NodeServer {
  id: string;
  name: string;
  region: string;
  status: "online" | "syncing" | "offline";
  pingMs: number;
  loadPercentage: number;
}
