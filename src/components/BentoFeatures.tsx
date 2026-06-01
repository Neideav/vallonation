import React from "react";
import { Cpu, ShieldCheck, Flame, GitMerge, FileCode } from "lucide-react";

interface BentoFeaturesProps {
  id?: string;
}

export const BentoFeatures: React.FC<BentoFeaturesProps> = ({ id = "features" }) => {
  const coreFeatures = [
    {
      icon: <Cpu className="w-6 h-6 text-orange-600" />,
      tag: "COMPUTATION",
      title: "Intelligent Core Engine",
      desc: "Intelligent routing technology with dynamic memory pooling. Enables lightning-fast read operations instantly across the globe.",
      actionLabel: "View benchmark results ->",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
      tag: "SECURITY",
      title: "Encrypted API Keys",
      desc: "Utilize secure authentication tokens linked directly with Row-Level Security (RLS) policies. Protect your data integrity.",
      actionLabel: "Encryption specifications ->",
    },
    {
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      tag: "REAL-TIME",
      title: "Instant WebSockets",
      desc: "Connects client and server instantly to distribute real-time data changes with ultra-low latency.",
      actionLabel: "Data update schema ->",
    },
    {
      icon: <FileCode className="w-6 h-6 text-amber-500" />,
      tag: "DATA STRUCTURE",
      title: "Flexible Schema Documents",
      desc: "Interactive JSON support for responsive, modular queries. Add new attributes in seconds without friction.",
      actionLabel: "Data type guidelines ->",
    },
  ];

  return (
    <section className="py-20 px-4 md:px-8 bg-white border-b border-orange-100" id={id}>
      <div className="max-w-7xl mx-auto space-y-12" id="bento-container">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4" id="bento-header">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-mono text-[10px] tracking-wider uppercase font-bold">
            <span>CORE ADVANTAGES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight" id="bento-main-heading">
            Simple, Responsive, Entirely Secure
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
            Vallonation is designed to make it easy for developers to manage real-time data asynchronously without worrying about complex physical server administration.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="bento-grid">
          {coreFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-orange-100 bg-orange-50/20 p-8 hover:border-orange-300 transition-all duration-300 shadow-xs hover:shadow-md text-left flex flex-col justify-between"
              id={`bento-card-${idx}`}
            >
              <div className="space-y-4">
                {/* Icon & Tag */}
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-xl border border-orange-50 shadow-xs">
                    {feat.icon}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    {feat.tag}
                  </span>
                </div>

                {/* Info titles */}
                <h3 className="text-xl font-display font-bold text-slate-900 group-hover:text-orange-700 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              {/* Read benchmarks text link */}
              <div className="mt-6 pt-4 border-t border-orange-100/50 flex items-center justify-between text-xs font-mono" id="bento-card-action">
                <span className="text-slate-450 group-hover:text-orange-600 transition-colors font-medium">
                  {feat.actionLabel}
                </span>
                <span className="w-2 h-2 rounded-full bg-orange-200 group-hover:bg-orange-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Extra Mini-Integrations Visual */}
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50/40 to-slate-50 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left" id="integration-bar">
          <div className="space-y-1 max-w-xl">
            <h4 className="text-base font-display font-bold text-slate-800 flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-orange-500" />
              <span>Flexible & Connected Compatibility</span>
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Integrate directly with various modern programming languages. Use our REST API, webhooks, or official SDKs to trigger instant synchronization.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 max-w-md justify-start md:justify-end" id="tech-badges-list">
            {["Next.js", "React", "Node.js", "Python FastAPI", "REST Client", "Secured HTTP"].map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg border border-orange-100 bg-white text-slate-600 font-mono text-[10px] hover:border-orange-200 transition-colors"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
