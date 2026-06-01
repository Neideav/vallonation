import React, { useState, useEffect, useRef } from "react";
import {
  Database,
  Key,
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  Globe,
  Radio,
  Sliders,
} from "lucide-react";
import { DatabaseEntry, TerminalLog, ApiKey } from "../types";
import {
  initialDatabaseEntries,
  initialApiKeys,
  generateSecureApiKey,
  createLog,
} from "../utils";

interface InteractivePlaygroundProps {
  onDataSynced: () => void;
  id?: string;
}

export const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({
  onDataSynced,
  id = "sandbox",
}) => {
  // State
  const [database, setDatabase] = useState<DatabaseEntry[]>(initialDatabaseEntries);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [activeKeyId, setActiveKeyId] = useState<string>("key-odin-main");
  const [logs, setLogs] = useState<TerminalLog[]>([
    createLog("websocket", "Valkyrie websocket client listening on port :3000/realtime-feed..."),
    createLog("info", "Vallonation secure gateway initial connection established in Frankfurt, Germany."),
  ]);
  
  // Create Key Modals or simple inputs
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"javascript" | "python" | "php" | "go" | "curl">("javascript");
  const [isCreatingKey, setIsCreatingKey] = useState(false);

  // New item creators
  const [newItemKey, setNewItemKey] = useState("sensors:node:primary");
  const [newItemValue, setNewItemValue] = useState('{"status": "active", "temperature": 24.5}');
  const [newItemCategory, setNewItemCategory] = useState<DatabaseEntry["category"]>("users");

  // Selected API key object helper
  const selectedKey = apiKeys.find((k) => k.id === activeKeyId) || apiKeys[0];

  // Ref to automatically scroll terminal log down
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Clean data keys on mount to remove any flashy names
  useEffect(() => {
    setDatabase([
      {
        id: "db-row-1",
        key: "app:config:production",
        value: '{"debug": false, "version": "2.4.0", "maintenance": false}',
        category: "sessions",
        lastUpdated: "Just now",
        sizeBytes: 67,
        syncNode: "Frankfurt (Odin-Alpha)"
      },
      {
        id: "db-row-2",
        key: "sensors:node:primary",
        value: '{"status": "active", "temperature": 24.5}',
        category: "users",
        lastUpdated: "5s ago",
        sizeBytes: 45,
        syncNode: "Singapore (Odin-Delta)"
      },
      {
        id: "db-row-3",
        key: "billings:tier:premium",
        value: '{"allowance": "Unlimited", "verified": true}',
        category: "payment",
        lastUpdated: "1m ago",
        sizeBytes: 52,
        syncNode: "Oregon (Odin-Beta)"
      }
    ]);
  }, []);

  // Append logs helper
  const addLog = (
    type: TerminalLog["type"],
    message: string,
    method?: TerminalLog["method"],
    bytes?: number,
    latency?: number
  ) => {
    setLogs((prev) => [...prev, createLog(type, message, method, bytes, latency)]);
  };

  // Run validation checks based on active ApiKey
  const validateAccess = (requiredPermission: "read" | "write" | "subscribe"): { allowed: boolean; error?: string } => {
    if (!selectedKey) {
      return { allowed: false, error: "401 Unauthorized. Kunci API tidak ditemukan." };
    }
    if (selectedKey.status === "revoked") {
      return { allowed: false, error: `401 Unauthorized. Kunci [${selectedKey.name}] telah dicabut.` };
    }
    if (!selectedKey.permissions[requiredPermission]) {
      return {
        allowed: false,
        error: `403 Forbidden. Kunci lacks [${requiredPermission.toUpperCase()}] scope parameters.`,
      };
    }
    return { allowed: true };
  };

  // Secure API key creation trigger
  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const newK = generateSecureApiKey(newKeyName);
    setApiKeys((prev) => [...prev, newK]);
    setActiveKeyId(newK.id);
    setNewKeyName("");
    setIsCreatingKey(false);
    addLog(
      "success",
      `Gateway Key created: '${newK.name}' loaded. Initialized globally under JWT signature.`,
      undefined,
      undefined,
      1
    );
  };

  // API Key scope togglers
  const handleToggleScope = (keyId: string, scope: "read" | "write" | "subscribe") => {
    setApiKeys((prev) =>
      prev.map((k) => {
        if (k.id === keyId) {
          const updatedScopes = { ...k.permissions, [scope]: !k.permissions[scope] };
          addLog("warn", `Security scope updated for '${k.name}': [${scope.toUpperCase()}: ${updatedScopes[scope] ? "ENABLED" : "DISABLED"}]`);
          return { ...k, permissions: updatedScopes };
        }
        return k;
      })
    );
  };

  // Revoke toggle key
  const handleToggleKeyStatus = (keyId: string) => {
    setApiKeys((prev) =>
      prev.map((k) => {
        if (k.id === keyId) {
          const newStatus = k.status === "active" ? "revoked" : "active";
          addLog(
            newStatus === "revoked" ? "error" : "success",
            `Key '${k.name}' status changed to [${newStatus.toUpperCase()}]. Global endpoints refreshed.`
          );
          return { ...k, status: newStatus };
        }
        return k;
      })
    );
  };

  // Interactive Database Insert / Push
  const handleInsertRow = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Gateway validation check
    const validation = validateAccess("write");
    if (!validation.allowed) {
      addLog("error", `API Gagal Menulis: ${validation.error}`, "POST", 0, 1);
      return;
    }

    if (!newItemKey.trim() || !newItemValue.trim()) return;

    const rowSize = newItemKey.length + newItemValue.length;
    const latency = Math.floor(Math.random() * 8) + 2; // 2ms - 10ms

    // Check if key already exists
    const exists = database.some((item) => item.key === newItemKey);

    if (exists) {
      // Perform UPDATE
      setDatabase((prev) =>
        prev.map((item) => {
          if (item.key === newItemKey) {
            return {
              ...item,
              value: newItemValue,
              category: newItemCategory,
              lastUpdated: "Just now",
              sizeBytes: rowSize,
            };
          }
          return item;
        })
      );
      addLog(
        "success",
        `API Request OK (UPDATE): Key '${newItemKey}' synchronized securely to cluster nodes.`,
        "PUT",
        rowSize,
        latency
      );
    } else {
      // Perform NEW INSERT
      const newEntry: DatabaseEntry = {
        id: `db-${Math.random().toString(36).substring(2, 9)}`,
        key: newItemKey,
        value: newItemValue,
        category: newItemCategory,
        lastUpdated: "Just now",
        sizeBytes: rowSize,
        syncNode: "Frankfurt (Odin-Alpha)",
      };
      setDatabase((prev) => [newEntry, ...prev]);
      addLog(
        "success",
        `API Request OK (INSERT): Key '${newItemKey}' posted to Vallonation secure memory store.`,
        "POST",
        rowSize,
        latency
      );
    }

    onDataSynced();
  };

  // Interactive edit helper (changing directly in table)
  const handleEditValueDirectly = (id: string, valueStr: string) => {
    const validation = validateAccess("write");
    if (!validation.allowed) {
      addLog("error", `Blocked context: ${validation.error}`, "PUT", 0, 1);
      return;
    }

    setDatabase((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const rowSize = item.key.length + valueStr.length;
          addLog("success", `Real-time edit synchronized on row with key <${item.key}>`, "PUT", rowSize, 3);
          onDataSynced();
          return {
            ...item,
            value: valueStr,
            lastUpdated: "Just now",
            sizeBytes: rowSize,
          };
        }
        return item;
      })
    );
  };

  // Delete row helper
  const handleDeleteRow = (id: string, keyStr: string) => {
    const validation = validateAccess("write");
    if (!validation.allowed) {
      addLog("error", `API Blocked (DELETE): ${validation.error}`, "DELETE", 0, 1);
      return;
    }

    setDatabase((prev) => prev.filter((item) => item.id !== id));
    addLog("warn", `API Delete OK: Successfully deleted key '${keyStr}' from remote clusters.`, "DELETE", 0, 4);
    onDataSynced();
  };

  // Run active query sample (for Code Sandbox Run button)
  const handleTriggerRunCode = () => {
    // Generate simulated requests
    const readValidation = validateAccess("read");
    if (!readValidation.allowed) {
      addLog("error", `Query Gagal: ${readValidation.error}`, "GET", 0, 1);
      return;
    }

    const latency = Math.floor(Math.random() * 6) + 2;
    addLog(
      "success",
      `SDK Client fetched ${database.length} active documents successfully via secured TLS gateway.`,
      "GET",
      JSON.stringify(database).length,
      latency
    );
  };

  // Code generator blocks
  const codeBlocks = {
    javascript: `// npm install @vallonation/client
import { createClient } from "@vallonation/client";

// Initialize using active key: "${selectedKey?.name || "Production"}"
const db = createClient({
  endpoint: "https://api.vallonation.cloud/v1",
  apiKey: "${selectedKey?.permissions.read ? (selectedKey.status === "active" ? selectedKey.keyString : "REVOKED_API_KEY") : "LACKS_READ_PERMIT"}",
});

// Real-time Database subscription
const listener = db.table("config")
  .subscribe("sensors:*", (event, payload) => {
    console.log("WebSocket Sync Event:", event, payload);
  });
  
// Fetch active sessions
const { data, error } = await db.table("config")
  .query()
  .filter("category", "==", "users")
  .run();`,
    python: `# Install via pip install vallonation-sdk
from vallonation import SovereignCloud

# Authenticating securely using "${selectedKey?.name || "Production"}"
vallo_client = SovereignCloud(
    endpoint="https://api.vallonation.cloud/v1",
    api_key="${selectedKey?.status === "active" ? selectedKey.keyString : "REVOKED_KEY"}"
)

# Insert documents in real-time to Europe clusters
status = vallo_client.insert("sensors:node:primary", {
    "status": "active",
    "temperature": 24.5
})
print("Transaction commit result:", status.committed)`,
    php: `<?php
// composer require vallonation/sdk-php
require 'vendor/autoload.php';

use Vallonation\\SovereignCloud;

// Initializing using "${selectedKey?.name || "Production"}"
$client = new SovereignCloud([
    'endpoint' => 'https://api.vallonation.cloud/v1',
    'api_key' => '${selectedKey?.status === "active" ? selectedKey.keyString : "REVOKED_KEY"}'
]);

// Real-time synchronization
$result = $client->table('config')->insert([
    'key' => 'sensors:node:primary',
    'value' => ['status' => 'active', 'temperature' => 24.5]
]);

print_r($result);`,
    go: `package main

import (
	"context"
	"fmt"
	"github.com/vallonation/vallo-go"
)

func main() {
	// Initialize Go SDK using "${selectedKey?.name || "Production"}"
	client := vallo.NewClient(
		"https://api.vallonation.cloud/v1",
		"${selectedKey?.status === "active" ? selectedKey.keyString : "REVOKED_KEY"}",
	)

	// Fetch documents synchronously
	ctx := context.Background()
	res, err := client.Table("config").Get(ctx, "sensors:node:primary")
	if err != nil {
		panic(err)
	}
	fmt.Printf("Data synced successfully: %s\\n", res.Value)
}`,
    curl: `# Fetch database schema with direct Bearer headers safely
curl -X GET "https://api.vallonation.cloud/v1/database/main" \\
  -H "Authorization: Bearer ${selectedKey?.status === "active" ? selectedKey.keyString : "REVOKED_KEYS"}" \\
  -H "Content-Type: application/json"`
  };

  return (
    <section className="py-20 px-4 md:px-8 border-b border-orange-100 bg-[#fffcf9]" id={id}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-4" id="sandbox-header-desc">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-mono text-[10px] tracking-wider uppercase font-bold">
            <span>PRACTICAL CONSOLE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight" id="sandbox-title">
            Real-Time Sync & API Key Playground
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Use the interactive playground below to generate API Keys, modify document store payloads, and verify instantaneous system responsiveness.
          </p>
        </div>

        {/* IDE Cockpit Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch" id="sandbox-ide-layout">
          
          {/* Left / Middle Column (8 cols): Key Manager + Database Node editor */}
          <div className="xl:col-span-8 flex flex-col gap-8" id="sandbox-control-panel">
            
            {/* 1. API KEY GATEWAY MANAGER */}
            <div className="rounded-2xl border border-orange-100 bg-white p-6 flex flex-col gap-6 shadow-sm" id="sandbox-key-manager">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-50 pb-4" id="key-manager-head">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 border border-orange-100">
                    <Key className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <span>Secure API Key Access</span>
                      <span className="px-2 py-0.5 rounded bg-orange-150 text-orange-700 font-mono text-[9px] font-bold">SHA-384</span>
                    </h3>
                    <p className="text-xs text-slate-500">Configure permissions for Read, Write, or Subscription operations.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2" id="key-manager-actions">
                  {isCreatingKey ? (
                    <form onSubmit={handleCreateApiKey} className="flex gap-2 w-full max-w-xs animate-fadeIn">
                      <input
                        type="text"
                        placeholder="New key name..."
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-orange-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:border-orange-500 font-sans"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingKey(false)}
                        className="p-1 px-2 border border-slate-200 rounded-lg text-[10px] text-slate-400 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsCreatingKey(true)}
                      className="px-3.5 py-2 hover:bg-orange-600 rounded-xl bg-orange-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create New Key</span>
                    </button>
                  )}
                </div>
              </div>

              {/* API Keys Table */}
              <div className="overflow-x-auto" id="gatekey-keys-table">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-orange-50 text-slate-400 text-[10px] tracking-wider uppercase font-bold">
                      <th className="py-2.5 px-3">API KEY NAME</th>
                      <th className="py-2.5 px-3 text-center">READ</th>
                      <th className="py-2.5 px-3 text-center">WRITE</th>
                      <th className="py-2.5 px-3 text-center">SUBSCRIBE</th>
                      <th className="py-2.5 px-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-50">
                    {apiKeys.map((k) => {
                      const isActiveSelector = k.id === activeKeyId;
                      const isRevoked = k.status === "revoked";
                      return (
                        <tr
                          key={k.id}
                          className={`group hover:bg-orange-50/10 transition-colors ${
                            isActiveSelector ? "bg-orange-50/20" : ""
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="activeKey"
                                checked={isActiveSelector}
                                onChange={() => {
                                  setActiveKeyId(k.id);
                                  addLog("info", `Active Gateway Key switched to: '${k.name}'`);
                                }}
                                className="w-3.5 h-3.5 border-orange-300 accent-orange-600 focus:ring-0 cursor-pointer"
                              />
                              <div className="text-left font-sans">
                                <span className={`font-semibold text-xs ${isRevoked ? "text-slate-400 line-through" : "text-slate-850"}`}>
                                  {k.name}
                                </span>
                                <p className="text-[10px] font-mono text-slate-400 mt-0.5">{k.keyString}</p>
                              </div>
                            </div>
                          </td>
                          {/* Perms Column JS */}
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              disabled={isRevoked}
                              checked={k.permissions.read}
                              onChange={() => handleToggleScope(k.id, "read")}
                              className="w-4 h-4 rounded border-slate-300 text-orange-650 accent-orange-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              disabled={isRevoked}
                              checked={k.permissions.write}
                              onChange={() => handleToggleScope(k.id, "write")}
                              className="w-4 h-4 rounded border-slate-300 text-orange-650 accent-orange-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              disabled={isRevoked}
                              checked={k.permissions.subscribe}
                              onChange={() => handleToggleScope(k.id, "subscribe")}
                              className="w-4 h-4 rounded border-slate-300 text-orange-650 accent-orange-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2 text-[10px]">
                              {isRevoked ? (
                                <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-mono text-[9px] font-bold">
                                  REVOKED
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[9px] font-bold">
                                  ACTIVE
                                </span>
                              )}
                              <button
                                onClick={() => handleToggleKeyStatus(k.id)}
                                className={`px-2 py-1 rounded border border-slate-200 text-[9px] font-sans font-semibold transition-colors cursor-pointer ${
                                  isRevoked
                                    ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                                    : "bg-red-50 text-red-750 hover:bg-red-100"
                                }`}
                              >
                                {isRevoked ? "Activate" : "Revoke"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. REAL-TIME DATABASE VISUAL MEMORY EDITOR */}
            <div className="rounded-2xl border border-orange-100 bg-white p-6 flex flex-col gap-6 shadow-sm" id="sandbox-database-records">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-50 pb-4" id="db-records-head">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 border border-orange-100">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                      <span>Database Document Store</span>
                      <Radio className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                    </h3>
                    <p className="text-xs text-slate-500">Edit JSON values directly inside the table rows.</p>
                  </div>
                </div>

                {/* Insertion form inline */}
                <form onSubmit={handleInsertRow} className="flex flex-wrap items-center gap-2" id="sandbox-insert-form">
                  <input
                    type="text"
                    required
                    value={newItemKey}
                    onChange={(e) => setNewItemKey(e.target.value)}
                    placeholder="key_name..."
                    className="px-2.5 py-1.5 rounded-lg border border-orange-200 bg-white font-mono text-xs text-slate-800 focus:outline-hidden focus:border-orange-500 max-w-[150px]"
                  />
                  <input
                    type="text"
                    required
                    value={newItemValue}
                    onChange={(e) => setNewItemValue(e.target.value)}
                    placeholder="json content..."
                    className="px-2.5 py-1.5 rounded-lg border border-orange-200 bg-white font-mono text-xs text-orange-700 focus:outline-hidden focus:border-orange-500 max-w-[180px]"
                  />
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as DatabaseEntry["category"])}
                    className="px-2 py-1.5 border border-orange-200 bg-white text-slate-600 rounded-lg text-xs cursor-pointer focus:outline-hidden"
                  >
                    <option value="users">users</option>
                    <option value="sessions">sessions</option>
                    <option value="payment">payment</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 hover:bg-orange-600 bg-orange-500 text-white rounded-lg text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                  >
                    Sync Row
                  </button>
                </form>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto" id="sandbox-data-list">
                {database.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs" id="db-empty-state">
                    Database is empty. Please add a data row above!
                  </div>
                ) : (
                  <table className="w-full text-left font-mono text-xs">
                     <thead>
                      <tr className="border-b border-orange-50 text-slate-400 text-[10px] tracking-wider uppercase font-bold">
                        <th className="py-2.5 px-3">CATEGORY</th>
                        <th className="py-2.5 px-3">PRIMARY KEY</th>
                        <th className="py-2.5 px-3">PAYLOAD VALUE (DIRECTLY EDITABLE)</th>
                        <th className="py-2.5 px-3">SERVER CLUSTER</th>
                        <th className="py-2.5 px-3 text-right">SIZE</th>
                        <th className="py-2.5 px-3 text-right">DELETE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-orange-50">
                      {database.map((d) => (
                        <tr key={d.id} className="hover:bg-orange-50/10">
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-850 font-bold text-[9px]">
                              {d.category}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-slate-800 font-semibold text-xs">{d.key}</span>
                          </td>
                          <td className="py-2 px-3">
                            {/* Controlled Live Editable String field */}
                            <input
                              type="text"
                              value={d.value}
                              onChange={(e) => handleEditValueDirectly(d.id, e.target.value)}
                              className="px-2 py-1 rounded bg-white border border-orange-100 text-orange-700 font-semibold focus:outline-hidden focus:border-orange-500 w-full font-mono text-xs"
                            />
                          </td>
                          <td className="py-3 px-3 text-slate-450 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3 text-orange-400" />
                              <span>{d.syncNode}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-slate-405 text-[11px]">
                            {d.sizeBytes} B
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeleteRow(d.id, d.key)}
                              className="p-1 px-2 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Reset helpers */}
              <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 font-mono" id="sandbox-database-footer">
                <span>Security policies are automatically applied to every edge node.</span>
                <button
                  type="button"
                  onClick={() => {
                    setDatabase([
                      {
                        id: "db-row-1",
                        key: "app:config:production",
                        value: '{"debug": false, "version": "2.4.0", "maintenance": false}',
                        category: "sessions",
                        lastUpdated: "Just now",
                        sizeBytes: 67,
                        syncNode: "Frankfurt (Odin-Alpha)"
                      },
                      {
                        id: "db-row-2",
                        key: "sensors:node:primary",
                        value: '{"status": "active", "temperature": 24.5}',
                        category: "users",
                        lastUpdated: "5s ago",
                        sizeBytes: 45,
                        syncNode: "Singapore (Odin-Delta)"
                      }
                    ]);
                    addLog("warn", "Database rollback initiated: Resynchronized to default values.");
                  }}
                  className="flex items-center gap-1 text-slate-500 hover:text-orange-600 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              </div>

            </div>

          </div>

          {/* Right Column (4 cols): Code SDK Explorer + Live Real-time Terminal Logger */}
          <div className="xl:col-span-4 flex flex-col gap-8" id="sandbox-live-logger">
            
            {/* 3. CODE SDK GENERATOR */}
            <div className="rounded-2xl border border-orange-100 bg-white p-6 flex flex-col gap-4 overflow-hidden shadow-sm" id="sandbox-code-explorer">
              <div className="flex items-center justify-between border-b border-orange-50 pb-3" id="code-explorer-head">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Sliders className="w-4 h-4 text-orange-500" />
                  <span>SDK Playground</span>
                </div>
                
                {/* Language tab switcher */}
                <div className="flex gap-1 bg-orange-50/50 p-0.5 rounded-lg border border-orange-100" id="lang-switch-pills">
                  {(["javascript", "python", "php", "go", "curl"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2 py-0.5 rounded bg-transparent font-mono text-[9px] cursor-pointer uppercase ${
                        selectedLanguage === lang
                          ? "bg-white text-orange-700 font-bold shadow-xs"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {lang === "javascript" ? "JS" : lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Pre container */}
              <div className="relative bg-slate-900 p-4 rounded-xl text-left font-mono text-[10px]" id="sdk-code-editor-box">
                {/* Visual Accent */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5" id="code-editor-pill">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-[9px] text-slate-450 uppercase font-bold">Interactive</span>
                </div>
                
                <pre className="text-slate-250 overflow-x-auto whitespace-pre leading-relaxed select-text pr-2 max-h-56">
                  <code>{codeBlocks[selectedLanguage]}</code>
                </pre>
              </div>

              {/* Run Query Trigger API Button */}
              <button
                onClick={handleTriggerRunCode}
                className="w-full py-3 hover:bg-orange-50 hover:text-orange-700 rounded-xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] transition-all"
                id="sandbox-run-query-btn"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Run API Query Test</span>
              </button>
            </div>

            {/* 4. WEBSOCKET REAL-TIME LOG TERMINAL */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 flex flex-col xl:grow overflow-hidden shadow-2xl h-[380px]" id="sandbox-socket-terminal">
              
              {/* Terminal Head */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-[#0d0f13] p-3.5 px-4" id="terminal-head">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-slate-200 font-mono uppercase tracking-wider font-bold">Real-time WebSocket Feed</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 font-mono text-[9px] font-bold">
                  <span>ONLINE SECURE</span>
                </div>
              </div>

              {/* Log Stream Content */}
              <div className="grow p-4 overflow-y-auto font-mono text-[10px] space-y-2 bg-slate-950 text-left select-text" id="terminal-screen-container">
                {logs.map((log) => {
                  let badgeColor = "text-slate-400";
                  if (log.type === "success") badgeColor = "text-emerald-400 font-mono";
                  if (log.type === "warn") badgeColor = "text-amber-400";
                  if (log.type === "error") badgeColor = "text-rose-400";
                  if (log.type === "websocket") badgeColor = "text-cyan-400";

                  return (
                    <div key={log.id} className="border-b border-slate-900 pb-2 flex flex-col gap-1" id={`log-item-${log.id}`}>
                      {/* Meta header */}
                      <div className="flex items-center justify-between text-slate-600 text-[8.5px]" id="log-item-meta">
                        <span>[{log.timestamp}]</span>
                        <div className="flex items-center gap-1.5">
                          {log.method && (
                            <span className="px-1 py-0.2 bg-slate-900 text-orange-400 border border-slate-850 rounded font-bold">
                              {log.method}
                            </span>
                          )}
                          {log.latency && (
                            <span className="text-emerald-400 font-bold">{log.latency}ms</span>
                          )}
                        </div>
                      </div>

                      {/* Log text */}
                      <p className={`${badgeColor} whitespace-pre-wrap leading-relaxed`}>
                        {log.message}
                      </p>

                      {/* Transfer size */}
                      {log.bytes && log.bytes > 0 && (
                        <p className="text-[9px] text-slate-600 leading-none">
                          Sent: {log.bytes} B | TLSv1.3 SHA-384
                        </p>
                      )}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Footer Tickers */}
              <div className="border-t border-slate-900 bg-[#0d0f13] p-2.5 text-center flex items-center justify-between px-4" id="terminal-footer">
                <button
                  onClick={() => {
                    setLogs([createLog("info", "Console log buffer cleared.")]);
                  }}
                  className="text-slate-500 hover:text-slate-350 font-mono text-[9px] font-bold uppercase cursor-pointer"
                >
                  Clear Logs
                </button>
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                  <span>Port :3000 Active</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
