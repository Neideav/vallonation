import React, { useState, useEffect } from "react";
import { OdinLogo } from "./OdinLogo";
import { Database, CheckCircle, Flame, Sparkles, HelpCircle } from "lucide-react";
import { initialEdgeNodes } from "../utils";
import { NodeServer } from "../types";

interface HeroSectionProps {
  onLearnMoreClick: () => void;
  onExploreSandboxClick: () => void;
  totalSyncedWrites: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLearnMoreClick,
  onExploreSandboxClick,
  totalSyncedWrites,
}) => {
  const [nodes, setNodes] = useState<NodeServer[]>(initialEdgeNodes);
  const [lastUpdatedTime, setLastUpdatedTime] = useState("");

  useEffect(() => {
    // Generate simple time for verification
    const updateTime = () => {
      const now = new Date();
      setLastUpdatedTime(now.toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-4 md:px-8 bg-gradient-to-br from-[#fffcf9] via-[#fffcf9] to-[#fef3c7]" id="hero-section">
      
      {/* Delicate circular gradient backgrounds for ultimate eye comfort */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none opacity-40 mix-blend-multiply" id="hero-bg-glows">
        <div className="absolute top-24 left-1/3 w-[350px] h-[350px] bg-orange-200 rounded-full blur-[100px]" />
        <div className="absolute top-12 right-1/4 w-[300px] h-[300px] bg-amber-200 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10" id="hero-container-box">
        
        {/* Left column: Clear copy and action points */}
        <div className="lg:col-span-7 space-y-8 text-left" id="hero-copy-column">
          
          {/* Gentle, non-dramatic announcement label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-xs text-orange-700 font-semibold" id="hero-badge-intro">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>Real-time Database and API Control Panel</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900 leading-[1.12]" id="hero-main-title">
              Intelligent Database & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
                Secure API Access
              </span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg font-normal leading-relaxed max-w-2xl" id="hero-description-paragraph">
              Welcome to Vallonation, an intelligent real-time database storage platform with an elegant, eye-friendly design. Build, synchronize, and manage your cloud computing instances with secure, advanced authorization.
            </p>
          </div>

          {/* Simple and friendly statistics bar */}
          <div className="grid grid-cols-3 gap-6 py-5 border-y border-orange-100/80 text-left" id="hero-simple-stats">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Server Latency</p>
              <h3 className="text-xl md:text-2xl font-mono font-bold text-orange-600 mt-1">~3.8 ms</h3>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Synced</p>
              <h3 className="text-xl md:text-2xl font-mono font-bold text-slate-800 mt-1">
                {totalSyncedWrites} times
              </h3>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Since</p>
              <h3 className="text-xl md:text-2xl font-mono font-bold text-amber-600 mt-1">2026 UTC</h3>
            </div>
          </div>

          {/* Clean Call To Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-1" id="hero-actions-container">
            <button
              onClick={onExploreSandboxClick}
              className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold text-sm transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              id="hero-launch-action-btn"
            >
              <Database className="w-5 h-5 text-white fill-orange-200" />
              <span>Open Database Console</span>
            </button>
            <button
              onClick={onLearnMoreClick}
              className="px-6 py-3.5 rounded-xl border border-orange-200 bg-white/80 text-orange-700 font-semibold text-sm hover:bg-orange-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="hero-specs-action-btn"
            >
              <span>Learn Features</span>
            </button>
          </div>

        </div>

        {/* Right column: Friendly representation banner (No chaotic network terminal slang) */}
        <div className="lg:col-span-5 relative" id="hero-illustration-column">
          <div className="relative rounded-3xl border border-orange-100 bg-white p-6 shadow-xl orange-glow-box overflow-hidden" id="illustration-card-container">
            
            {/* Visual gradient accent on top of the card */}
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-orange-400 to-amber-300" />
            
            {/* Soft background shape */}
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-orange-50 rounded-full opacity-60" />

            {/* Simulated Clean Server Panel Node list */}
            <div className="space-y-4 text-left relative z-10" id="illustration-inner">
              <div className="flex items-center justify-between border-b border-orange-50 pb-3" id="inner-panel-head">
                <div className="flex items-center gap-2.5">
                  <OdinLogo size={32} glowing={false} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Vallonation Nodes</h4>
                    <span className="text-[10px] text-slate-400 font-mono">SYNC NOTIFICATIONS</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-mono text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span>Normal</span>
                </span>
              </div>

              {/* Server Items list representing active simple locations */}
              <div className="space-y-3" id="nodes-lightweight-card-list">
                {nodes.slice(0, 3).map((node) => (
                  <div
                    key={node.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-orange-50/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{node.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{node.region}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-semibold text-orange-600">{node.pingMs} ms</span>
                      <p className="text-[9px] text-slate-400 mt-0.5">Load: {node.loadPercentage}%</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Clock */}
              <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between" id="illustration-timestamp">
                <span>Last evaluated at:</span>
                <span className="text-orange-600 font-bold">{lastUpdatedTime || "14:16:40"}</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
