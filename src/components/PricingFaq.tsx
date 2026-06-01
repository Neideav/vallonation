import React, { useState } from "react";
import { Check, HelpCircle, ArrowRight, Cpu, Database, Network, Server } from "lucide-react";

interface PricingFaqProps {
  id?: string;
  onSelectPacket?: (packetName: string, specsStr: string, price: number, region: string) => void;
}

export const PricingFaq: React.FC<PricingFaqProps> = ({
  id = "pricing",
  onSelectPacket,
}) => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Cluster Region Setup Selector with 24 custom regions
  const [selectedRegion, setSelectedRegion] = useState("asia-southeast1-a");

  const regionsList = [
    "asia-southeast1-a",
    "asia-southeast1-b",
    "asia-southeast2-a",
    "asia-southeast2-b",
    "asia-northeast1-a",
    "asia-northeast1-b",
    "asia-northeast3-a",
    "asia-east1-a",
    "asia-south1-a",
    "australia-southeast1-a",
    "europe-west1-b",
    "europe-west2-a",
    "europe-west3-a",
    "europe-west4-b",
    "europe-north1-a",
    "europe-southwest1-a",
    "us-east1-a",
    "us-east4-b",
    "us-central1-a",
    "us-west1-b",
    "us-west2-a",
    "us-west3-a",
    "southamerica-east1-a",
    "me-central1-a"
  ];

  // Custom Signature Packet dynamic states
  const [cpu, setCpu] = useState<number>(4); // vCPU cores
  const [ram, setRam] = useState<number>(8); // GB RAM
  const [storage, setStorage] = useState<number>(100); // GB Storage
  const [clusters, setClusters] = useState<number>(3); // Locations

  // Calculate Signature Packet Monthly base
  // baseline: $12.00
  // cpu: $6.00/core
  // ram: $1.80/GB
  // storage: $0.12/GB
  // clusters multiplier
  const baselineCost = 12;
  const signatureRawCost = (baselineCost + (cpu * 6) + (ram * 1.8) + (storage * 0.12)) * (1 + (clusters - 1) * 0.18);
  const signatureFinalMonthlyPrice = Math.round(signatureRawCost);
  const signatureFinalYearlyPrice = Math.round(signatureFinalMonthlyPrice * 0.75); // 25% discount

  const activeSignaturePrice = billingCycle === "monthly" ? signatureFinalMonthlyPrice : signatureFinalYearlyPrice;

  const faqItems = [
    {
      q: "How does Vallonation's real-time replication work?",
      a: "Vallonation uses a high-speed WebSocket-based Valkyrie PubSub Router. When you perform a write operation, the nearest gateway node local-commits that write, then synchronously and securely distributes encrypted changes to the remaining global edge clusters instantly."
    },
    {
      q: "Are Vallonation API Keys safe to use directly on the client side?",
      a: "Completely secure. Vallonation integrates Row-Level Security (RLS) where each API Key ties back to specific JWT claims. You can expose read-only encrypted keys on your client apps while strictly locking write operations exclusively behind server-authenticated networks."
    },
    {
      q: "Can I change my Signature Packet configuration at any time?",
      a: "Absolutely. You can dynamically adjust your vCPU allocation, RAM size, SSD storage capacity, and region cluster nodes directly from this dashboard or your profile settings. Billing adjusts on a clean pro-rata basis."
    }
  ];

  const pricingTiers = [
    {
      name: "Lite Sandbox",
      priceMonthly: 0,
      priceYearly: 0,
      desc: "Perfect for initial exploration, free prototyping, and building sandbox tests.",
      features: [
        "100,000 read operations / month",
        "50,000 write operations / month",
        "Up to 150 concurrent WebSockets",
        "3 Active API Gateway Keys",
        "Secure encrypted SSL/TLS tunnel",
      ],
      ctaLabel: "Start For Free",
      badge: null,
      color: "border-slate-150 bg-white"
    },
    {
      name: "Sovereign Fast",
      priceMonthly: 29,
      priceYearly: 22,
      desc: "Designed for production apps, independent developers, and active integrations.",
      features: [
        "Unlimited read/write operations",
        "Up to 15,000 active WebSockets",
        "Row-Level Security (RLS) policies",
        "Edge clusters across 2 continents",
        "Priority technical assistance",
      ],
      ctaLabel: "Select Sovereign Fast",
      badge: "POPULAR CHOICE",
      color: "border-orange-200 bg-orange-50/15"
    }
  ];

  const handleSelectSignatureClick = () => {
    const specStr = `vCPU: ${cpu} Cores, RAM: ${ram} GB, SSD: ${storage} GB, Nodes: ${clusters} Region Clusters`;
    if (onSelectPacket) {
      onSelectPacket("Signature Packet", specStr, activeSignaturePrice, selectedRegion);
    }
  };

  const handleSelectStaticClick = (name: string, price: number) => {
    if (onSelectPacket) {
      onSelectPacket(name, "Default specifications, East Zone replication clusters", price, "asia-southeast1-a");
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 border-b border-orange-100 bg-[#fffcf9]" id={id}>
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Tier Section Main Description */}
        <div className="space-y-12" id="pricing-tiers-blocks-container">
          <div className="text-center max-w-2xl mx-auto space-y-4" id="pricing-info-heading">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-mono text-[10px] tracking-wider uppercase font-bold">
              <span>Vallonation Subscription Packages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Pay As You Go. No Hidden Fees.
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Start for free with the Sandbox tier, and upgrade as your application's user base grows.
            </p>

            {/* Billing switcher toggle */}
            <div className="pt-2 flex items-center justify-center gap-3" id="billing-switcher-pills">
              <span className={`text-xs font-mono font-bold ${billingCycle === "monthly" ? "text-slate-800" : "text-slate-400"}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"))}
                className="w-11 h-6 rounded-full bg-slate-200 border border-slate-300 p-0.5 transition-all relative flex items-center cursor-pointer"
                id="pricing-toggle-switch-comp"
                aria-label="Toggle pricing cycle"
              >
                <div
                  className={`w-4 h-4 rounded-full bg-orange-500 transition-all ${
                    billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-orange-600" : "text-slate-400"}`}>
                <span>Yearly Billing</span>
                <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 text-[8px] font-extrabold">SAVE 25%</span>
              </span>
            </div>
          </div>

          {/* Pricing cards grid including custom Signature Packet */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch" id="pricing-grid-list">
            
            {/* Standard Static Tiers */}
            {pricingTiers.map((tier, idx) => {
              const basePrice = billingCycle === "monthly" ? tier.priceMonthly : tier.priceYearly;
              return (
                <div
                  key={idx}
                  className={`relative rounded-3xl border p-8 flex flex-col justify-between transition-all duration-355 hover:scale-[1.01] shadow-xs ${tier.color}`}
                  id={`pricing-card-c-${idx}`}
                >
                  {tier.badge && (
                    <span className="absolute -top-3.5 left-6 px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-mono font-extrabold text-[9px] tracking-wider rounded-full shadow-xs">
                      {tier.badge}
                    </span>
                  )}

                  <div className="space-y-6 text-left">
                    <div id="pricing-card-header">
                      <h4 className="text-lg font-bold text-slate-900">{tier.name}</h4>
                      <p className="text-slate-600 text-xs mt-2 leading-relaxed min-h-[40px]">{tier.desc}</p>
                    </div>

                    <div className="flex items-baseline gap-1" id="pricing-card-price">
                      <span className="text-3xl md:text-4xl font-mono font-extrabold text-slate-800">
                        ${basePrice}
                      </span>
                      <span className="text-slate-400 font-mono text-xs">/ month</span>
                    </div>

                    {/* Features checklist */}
                    <div className="border-t border-orange-105 pt-6 space-y-3" id="pricing-card-features">
                      <p className="text-[10px] font-mono font-bold tracking-wider text-slate-450 uppercase">WHAT'S INCLUDED:</p>
                      <ul className="space-y-2 text-xs text-slate-600">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions Button call to action */}
                  <div className="mt-8 pt-4 border-t border-orange-50" id="pricing-card-footer-cta">
                    <button
                      onClick={() => handleSelectStaticClick(tier.name, basePrice)}
                      className={`w-full py-3 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        idx === 1
                          ? "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/10"
                          : "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span>{tier.ctaLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Custom Interactive Settings: SIGNATURE PACKET Card */}
            <div
              className="relative rounded-3xl border-2 border-orange-500 bg-white p-8 flex flex-col justify-between transition-all duration-300 shadow-lg orange-glow-box lg:col-span-1"
              id="pricing-card-signature-comp"
            >
              <span className="absolute -top-3.5 left-6 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-mono font-extrabold text-[9px] tracking-wider rounded-full shadow-xs">
                CUSTOM DEPLOYMENT
              </span>

              <div className="space-y-6 text-left">
                <div id="signature-card-header">
                  <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                    Signature Packet
                  </h4>
                  <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                    Configure your modular cloud instance with precise specifications tailored to your exact computing needs.
                  </p>
                </div>

                {/* SLIDERS FOR CUSTOM SETTING PACKET */}
                <div className="space-y-4 pt-1 bg-orange-50/45 p-4 rounded-2xl border border-orange-100" id="signature-sliders">
                  {/* vCPU */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-orange-500" />
                        <span>vCPU Cores</span>
                      </span>
                      <span className="text-orange-600">{cpu} Cores</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="16"
                      step="1"
                      value={cpu}
                      onChange={(e) => setCpu(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>

                  {/* RAM memory */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Server className="w-3.5 h-3.5 text-orange-500" />
                        <span>Memory RAM</span>
                      </span>
                      <span className="text-orange-600">{ram} GB</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="64"
                      step="1"
                      value={ram}
                      onChange={(e) => setRam(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Storage disk */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-orange-500" />
                        <span>SSD Storage</span>
                      </span>
                      <span className="text-orange-600">{storage} GB</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      value={storage}
                      onChange={(e) => setStorage(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Cluster locations */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Network className="w-3.5 h-3.5 text-orange-500" />
                        <span>Cluster Nodes</span>
                      </span>
                      <span className="text-orange-600">{clusters} Region Nodes</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="1"
                      value={clusters}
                      onChange={(e) => setClusters(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Region selector field (24 Zones) */}
                  <div className="space-y-1.5 border-t border-orange-100/50 pt-3.5">
                    <label className="flex items-center justify-between text-[11px] font-bold text-slate-700 font-sans">
                      <span>Primary Edge Node Host (24 Zones)</span>
                      <span className="text-[9px] bg-orange-100 text-orange-850 px-1.5 py-0.2 rounded font-mono font-bold select-none">TLS v1.3</span>
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full text-xs font-mono font-extrabold text-slate-800 bg-white border border-slate-250 focus:border-orange-500 rounded-xl px-3 py-2 outline-hidden cursor-pointer hover:bg-slate-50 transition-all shadow-2xs"
                    >
                      {regionsList.map((reg) => (
                        <option key={reg} value={reg} className="font-mono text-slate-700 font-semibold">
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-baseline justify-between border-t border-orange-100 pt-4" id="signature-active-price">
                  <span className="text-slate-500 font-bold text-xs">Monthly Cost:</span>
                  <div className="text-right">
                    <span className="text-3xl font-mono font-extrabold text-orange-600">
                      ${activeSignaturePrice}
                    </span>
                    <span className="text-slate-400 font-mono text-xs">/ month</span>
                  </div>
                </div>
              </div>

              {/* Actions Button check */}
              <div className="mt-8 pt-4 border-t border-orange-100" id="pricing-card-footer-cta-signature">
                <button
                  onClick={handleSelectSignatureClick}
                  className="w-full py-3.5 font-bold text-xs rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-500/10 active:scale-95"
                >
                  <span>Select Signature Packet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Accordion FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-12 border-t border-orange-100" id="faq-section-block">
          
          <div className="lg:col-span-4 text-left space-y-4" id="faq-heading-col">
            <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-orange-500" />
              <span>Frequently Asked Questions</span>
            </h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
              Get answers to common questions about Vallonation cloud database scalability, multi-cluster integrations, API key safety, and custom instances.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-4 text-left" id="faq-accordion-rows">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-orange-100 bg-white overflow-hidden transition-all duration-300 shadow-2xs"
                  id={`faq-accordion-card-c-${idx}`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between text-left text-slate-800 font-bold text-sm md:text-base cursor-pointer hover:bg-orange-50/10"
                  >
                    <span className="select-none pr-4">{item.q}</span>
                    <span className={`text-orange-500 font-mono transition-transform duration-300 transform font-bold ${isOpen ? "rotate-45" : "rotate-0"}`}>
                      +
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-600 border-t border-orange-50 leading-relaxed font-sans animate-fadeIn">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
