import React, { useState, FormEvent, useEffect } from "react";
import { OdinLogo } from "./components/OdinLogo";
import { HeroSection } from "./components/HeroSection";
import { BentoFeatures } from "./components/BentoFeatures";
import { InteractivePlayground } from "./components/InteractivePlayground";
import { PricingFaq } from "./components/PricingFaq";
import {
  Menu,
  X,
  Shield,
  Activity,
  CheckCircle2,
  Lock,
  MessageSquare,
  Send,
  Github,
  Globe,
  Database,
  Cpu,
  User,
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  UserPlus,
  Info,
  Phone,
  Check,
  Sliders,
  Settings2,
  Building2,
  HelpCircle,
  TrendingUp,
  Search,
  Zap,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Clock,
  Upload,
  RefreshCw,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// User profile interface
interface UserProfile {
  name: string;
  email: string;
  tier: string;
  specs: string;
  price: number;
  apiBalance: number; // in credits/writes
  maxKeys: number;
  avatarId: number;
  customAvatar?: string;
  region?: string;
}

const AVATAR_URLS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Anya",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Milo",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe"
];

export default function App() {
  // Navigation & Page State
  // "home" | "about" | "contact" | "profile" | "settings" | "domains"
  const [activeTab, setActiveTab] = useState<"home" | "about" | "contact" | "profile" | "settings" | "domains">("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [totalSyncedWrites, setTotalSyncedWrites] = useState(5124);

  // Domain search / purchase states
  const [domainSearchQuery, setDomainSearchQuery] = useState("");
  const [searchedDomainTerm, setSearchedDomainTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{
    tld: string;
    price: number;
    available: boolean;
    premium: boolean;
  }>>([]);
  const [selectedDomain, setSelectedDomain] = useState<{ tld: string; price: number; available: boolean; premium: boolean } | null>(null);
  const [purchaseCycle, setPurchaseCycle] = useState<"monthly" | "quarterly" | "semester" | "annual">("annual");
  const [purchasedDomains, setPurchasedDomains] = useState<Array<{
    domainName: string;
    cycle: string;
    purchaseDate: string;
    nextBilling: string;
    sslActive: boolean;
    bonusWritesCredited: number;
  }>>([
    {
      domainName: "sandbox-gateway.io",
      cycle: "Annual (Yearly)",
      purchaseDate: "May 12, 2026",
      nextBilling: "May 12, 2027",
      sslActive: true,
      bonusWritesCredited: 200000
    }
  ]);
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "configuring" | "processing" | "success">("idle");

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");

  // Customer Profile State (Highly interactive)
  const [profile, setProfile] = useState<UserProfile>({
    name: "Lead Developer",
    email: "developer@vallonation.cloud",
    tier: "Lite Sandbox",
    specs: "Default Sandbox Specifications",
    price: 0,
    apiBalance: 150000,
    maxKeys: 3,
    avatarId: 0,
    region: "asia-southeast1-a"
  });

  // Settings Configuration Panel State
  const [configSslOnly, setConfigSslOnly] = useState(true);
  const [configGzip, setConfigGzip] = useState(true);
  const [configWebhookRetries, setConfigWebhookRetries] = useState(3);
  const [configAnalyticsSync, setConfigAnalyticsSync] = useState(true);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // New interactive states for Rate Limiter & Additional Settings
  const [rateLimitThreshold, setRateLimitThreshold] = useState(6000);
  const [tlsVersion, setTlsVersion] = useState("TLSv1.3 Only");
  const [gzipLevel, setGzipLevel] = useState(6);
  const [dbProxyPort, setDbProxyPort] = useState(3306);
  const [directBindDomainInput, setDirectBindDomainInput] = useState("");

  const [rateLimitData, setRateLimitData] = useState([
    { time: "15:38:00", rps: 18, blocked: 0 },
    { time: "15:38:05", rps: 32, blocked: 0 },
    { time: "15:38:10", rps: 24, blocked: 1 },
    { time: "15:38:15", rps: 45, blocked: 0 },
    { time: "15:38:20", rps: 19, blocked: 2 },
    { time: "15:38:25", rps: 38, blocked: 0 },
    { time: "15:38:30", rps: 52, blocked: 3 },
    { time: "15:38:35", rps: 28, blocked: 0 },
  ]);

  useEffect(() => {
    if (activeTab !== "settings") return;
    const interval = setInterval(() => {
      setRateLimitData((prev) => {
        const nextTime = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const lastRps = prev[prev.length - 1]?.rps || 30;
        const change = Math.floor(Math.random() * 19) - 9;
        const newRps = Math.max(10, Math.min(80, lastRps + change));
        const newBlocked = Math.random() > 0.70 ? Math.floor(Math.random() * 4) : 0;
        return [...prev.slice(1), { time: nextTime, rps: newRps, blocked: newBlocked }];
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Appended Interactive states
  const [authSuccessJustHappened, setAuthSuccessJustHappened] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("ValloSuperSec_2026");
  const [newResetPassword, setNewResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);

  // General Notification Banner state
  const [notification, setNotification] = useState<string | null>(null);

  // Customer Service Mock Messenger State
  const [csOpen, setCsOpen] = useState(false);
  const [csMessages, setCsMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string }>>([
    {
      sender: "bot",
      text: "Hello! I am your Vallonation AI Assistant. How can I help you today regarding API keys, sovereign compliance, or configuring your custom Signature Packet?",
      time: "Just now"
    }
  ]);
  const [csInput, setCsInput] = useState("");

  // Contact page states
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  // Trigger when playground write commits
  const handleDataSynced = () => {
    setTotalSyncedWrites((prev) => prev + 1);
    // Add slightly to profile balance if logged in
    setProfile(prev => ({
      ...prev,
      apiBalance: prev.apiBalance + 1
    }));
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    setActiveTab("home");
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Auth Handlers
  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      showToast("Email and Password are required.");
      return;
    }

    if (authMode === "login") {
      setIsLoggedIn(true);
      setProfile((prev) => ({
        ...prev,
        email: authEmail,
        name: authName || prev.name,
      }));
      showToast(`Welcome back, ${authName || "Developer"}! Successfully logged in.`);
    } else {
      // Register
      if (!authName.trim()) {
        showToast("Username is required.");
        return;
      }
      setIsLoggedIn(true);
      setProfile((prev) => ({
        ...prev,
        name: authName,
        email: authEmail,
        apiBalance: 250000 // Bonus registration credits
      }));
      showToast(`Registration Successful! Welcome to Vallonation, ${authName}.`);
    }

    setAuthSuccessJustHappened(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast("Successfully logged out of your account.");
  };

  // Signature Packet Selector Listener from Pricing Page
  const handleSelectPricingPacket = (name: string, specsStr: string, priceNum: number, regionStr?: string) => {
    setProfile((prev) => ({
      ...prev,
      tier: name,
      specs: specsStr,
      price: priceNum,
      maxKeys: name.includes("Signature") ? 15 : 5,
      region: regionStr || prev.region
    }));
    showToast(`Successfully selected ${name}! Your outbound instance region configuration is synced active.`);
    setActiveTab("settings");
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CS Preset Quick Replies
  const csPresets = [
    {
      q: "What is a Signature Packet?",
      a: "A Signature Packet is Vallonation's customizable cloud database instance. Scale vCPU, RAM, storage, and cluster replica zones freely to match your precise requirements, and pay only for what you configure."
    },
    {
      q: "Is my data secure?",
      a: "Absolutely. Every transaction is guarded with military-grade TLS v1.3 transport encryption. You can also configure granular scope parameters (Read, Write, Subscribe) instantly inside your API sandbox gateway."
    },
    {
      q: "Can I migrate databases for free?",
      a: "Yes! Vallonation provides a 1-click automated migration tool supporting Postgres, SQLite, and JSON out of the box. Reach out to us through our contact form for a guided onboarding."
    }
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: "user" as const, text: textToSend, time: timeStr };

    setCsMessages((prev) => [...prev, newMsg]);

    const matchingPreset = csPresets.find(p => textToSend.toLowerCase().includes(p.q.toLowerCase()) || p.q.toLowerCase().includes(textToSend.toLowerCase()));

    setTimeout(() => {
      const responseText = matchingPreset 
        ? matchingPreset.a 
        : "Thank you for reaching out! Our support engineers have been notified and will reply to your registered email shortly if further assistance is needed.";
      
      setCsMessages((prev) => [...prev, { sender: "bot", text: responseText, time: timeStr }]);
    }, 600);
  };

  const handleCsSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!csInput.trim()) return;
    handleSendMessage(csInput);
    setCsInput("");
  };

  // Profile Save modifications
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    showToast("Your profile updates have been synchronized globally in real-time.");
  };

  // Generate dynamic Randomized 2D idle character avatar using external secure generation
  const handleGenerateRandomAvatar = () => {
    const seed = Math.floor(Math.random() * 99999);
    // Beautiful clean 2D hand-drawn character illustration
    const randomUrl = `https://api.dicebear.com/7.x/lorelei/svg?seed=vallo_${seed}`;
    setProfile((prev) => ({
      ...prev,
      customAvatar: randomUrl
    }));
    showToast("Generated a new unique randomized 2D idle character illustration!");
  };

  // Convert uploaded image file to system base64 data url
  const processAvatarFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Invalid file: Please upload a valid image (PNG, JPG, SVG).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("File size too large: Limit custom upload image size to under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setProfile((prev) => ({
          ...prev,
          customAvatar: e.target!.result as string
        }));
        showToast("Successfully set new custom uploaded photo avatar!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Change developer authentication credentials safely
  const handlePasswordResetSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newResetPassword.trim()) {
      showToast("Please input a valid reset key.");
      return;
    }
    if (newResetPassword !== confirmResetPassword) {
      showToast("Passwords do not match. Review input parameters.");
      return;
    }
    setTemporaryPassword(newResetPassword);
    setNewResetPassword("");
    setConfirmResetPassword("");
    showToast("Successfully updated local authentication password!");
  };

  // Diagnostics check mapping
  const runDiagnosticCheck = () => {
    if (diagnosticRunning) return;
    setDiagnosticRunning(true);
    setDiagnosticLogs([
      "[SYSTEM] Initializing sovereign database cloud replication diagnostic...",
      "[SYSTEM] Pinging active database zones..."
    ]);

    setTimeout(() => {
      setDiagnosticLogs(prev => [
        ...prev,
        "[OK] 12 parallel global replication pods synchronized successfully.",
        `[OK] Active storage: sqlite, mysql_sovereign pools verified.`,
        `[OK] Current quota balance: ${profile.apiBalance.toLocaleString()} Sandbox API Writes.`
      ]);
    }, 600);

    setTimeout(() => {
      const boundActiveNames = purchasedDomains.map(d => d.domainName).join(", ") || "none";
      setDiagnosticLogs(prev => [
        ...prev,
        `[DNS] Checking DNS resolved status for outbound mappings: [ ${boundActiveNames} ]`,
        "[DNS] Secure TLS v1.3 verification cert validated successfully as Let's Encrypt Wildcard."
      ]);
    }, 1200);

    setTimeout(() => {
      setDiagnosticLogs(prev => [
        ...prev,
        "[SUCCESS] Zero delays in replication queue. Sync speed evaluated under 12.4ms.",
        "[SUCCESS] Diagnostic test complete. System is 100% healthy!"
      ]);
      setDiagnosticRunning(false);
      showToast("Sovereign Network Diagnostic complete. State is green!");
    }, 1800);
  };

  // Settings Save modifications
  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    setSettingsSavedMessage(true);
    showToast("API Gateway configurations and rate limits updated securely.");
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  const handleDirectBindDomain = (e: FormEvent) => {
    e.preventDefault();
    if (!directBindDomainInput || !directBindDomainInput.includes(".")) {
      showToast("Please enter a valid domain address (e.g. site.com).");
      return;
    }
    const finalDomainName = directBindDomainInput.trim().toLowerCase();
    
    // Check if domain is already registered
    if (purchasedDomains.some(d => d.domainName === finalDomainName)) {
      showToast("This domain name is already bound to your instance.");
      return;
    }

    const todayStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextString = nextYear.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const newDomain = {
      domainName: finalDomainName,
      cycle: "Direct Bond Mapping",
      purchaseDate: todayStr,
      nextBilling: nextString,
      sslActive: true,
      bonusWritesCredited: 0
    };

    setPurchasedDomains(prev => [newDomain, ...prev]);
    setDirectBindDomainInput("");
    showToast(`Successfully bound customized domain "${finalDomainName}" directly to this instance!`);
  };

  const handleFeedbackSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!feedbackEmail.trim()) return;
    setIsFeedbackSubmitted(true);
    setTimeout(() => {
      setIsFeedbackSubmitted(false);
      setFeedbackEmail("");
      setFeedbackMessage("");
    }, 4500);
  };

  // Domain search / purchase handlers
  const handleDomainSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!domainSearchQuery.trim()) return;

    let sanitized = domainSearchQuery.trim().toLowerCase().replace(/\s+/g, "");
    sanitized = sanitized.replace(/\.(com|id|net|org|co\.id|tech|io)$/, "");

    if (sanitized.length < 2) {
      showToast("Domain term must be at least 2 characters long.");
      return;
    }

    setSearchedDomainTerm(sanitized);

    const tlds = [
      { tld: ".com", baseYrPrice: 12.00, premium: false },
      { tld: ".id", baseYrPrice: 15.50, premium: false },
      { tld: ".net", baseYrPrice: 9.99, premium: false },
      { tld: ".org", baseYrPrice: 11.50, premium: false },
      { tld: ".co.id", baseYrPrice: 13.99, premium: false },
      { tld: ".tech", baseYrPrice: 7.99, premium: false },
      { tld: ".io", baseYrPrice: 34.99, premium: true }
    ];

    const results = tlds.map((item) => {
      const hash = sanitized.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const isReserved = hash % 9 === 0 && item.tld === ".com";
      return {
        tld: item.tld,
        price: item.baseYrPrice,
        available: !isReserved,
        premium: item.premium || sanitized.length <= 3
      };
    });

    setSearchResults(results);
    setSelectedDomain(null);
    setCheckoutStep("idle");
    showToast(`Domain search complete for "${sanitized}"`);
  };

  const handleCompleteDomainCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedDomain || !searchedDomainTerm) return;

    setCheckoutStep("processing");

    setTimeout(() => {
      const finalDomainName = `${searchedDomainTerm}${selectedDomain.tld}`;
      let bonusWrites = 0;
      let cycleName = "Monthly";

      if (purchaseCycle === "quarterly") {
        cycleName = "Quarterly";
      } else if (purchaseCycle === "semester") {
        cycleName = "Semester (6 Months)";
        bonusWrites = 50000;
      } else if (purchaseCycle === "annual") {
        cycleName = "Annual (Yearly)";
        bonusWrites = 200000;
      }

      const today = new Date();
      const nextDate = new Date();
      if (purchaseCycle === "monthly") nextDate.setMonth(today.getMonth() + 1);
      else if (purchaseCycle === "quarterly") nextDate.setMonth(today.getMonth() + 3);
      else if (purchaseCycle === "semester") nextDate.setMonth(today.getMonth() + 6);
      else if (purchaseCycle === "annual") nextDate.setFullYear(today.getFullYear() + 1);

      const purchaseDateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const nextBillingStr = nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      const newDomainDetail = {
        domainName: finalDomainName,
        cycle: cycleName,
        purchaseDate: purchaseDateStr,
        nextBilling: nextBillingStr,
        sslActive: true,
        bonusWritesCredited: bonusWrites
      };

      setPurchasedDomains(prev => [newDomainDetail, ...prev]);

      if (bonusWrites > 0) {
        setProfile(prev => ({
          ...prev,
          apiBalance: prev.apiBalance + bonusWrites
        }));
        showToast(`Registered ${finalDomainName}! Granted +${bonusWrites.toLocaleString()} Sandbox API Writes!`);
      } else {
        showToast(`Registered ${finalDomainName} successfully!`);
      }

      setCheckoutStep("success");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fffcf9] text-slate-700 flex flex-col font-sans antialiased selection:bg-orange-200 selection:text-orange-900" id="vallonation-app">
      
      {/* GLOBAL TOAST Notification Indicator */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 p-4 bg-slate-900 text-white rounded-xl shadow-xl flex items-center gap-3 animate-slideDown max-w-sm border border-slate-800" id="app-global-notification">
          <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* 1. SOPHISTICATED RESPONSE NAVIGATION HEADER */}
      <header className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-md border-b border-orange-100 z-50 transition-all shadow-xs" id="main-header">
        <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between" id="header-container">
          
          {/* Logo Brand Title */}
          <div
            onClick={() => {
              setActiveTab("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 cursor-pointer group"
            id="header-brand-box"
          >
            <OdinLogo size={36} glowing={true} />
            <div className="text-left">
              <span className="font-display font-black text-lg tracking-wider text-slate-900 transition-colors">
                VALLONATION
              </span>
              <p className="text-[9px] font-mono tracking-widest text-orange-600 font-bold leading-none">
                CLOUD REPLICATOR
              </p>
            </div>
          </div>

          {/* Desktop Nav Actions links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-500" id="desktop-navbar">
            <button
              onClick={() => {
                setActiveTab("home");
                setTimeout(() => handleScrollTo("vallonation-app"), 50);
              }}
              className={`hover:text-orange-600 transition-colors cursor-pointer ${activeTab === "home" ? "text-orange-600" : ""}`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`hover:text-orange-600 transition-colors cursor-pointer ${activeTab === "about" ? "text-orange-600" : ""}`}
            >
              About Us
            </button>
            <button
              onClick={() => {
                setActiveTab("home");
                setTimeout(() => handleScrollTo("sandbox"), 50);
              }}
              className="hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
              <span>Gateway Sandbox</span>
            </button>
            <button
              onClick={() => setActiveTab("domains")}
              className={`hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-1 ${activeTab === "domains" ? "text-orange-600" : ""}`}
            >
              <Globe className="w-3.5 h-3.5 text-orange-500" />
              <span>Buy Domain</span>
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`hover:text-orange-600 transition-colors cursor-pointer ${activeTab === "profile" ? "text-orange-600" : ""}`}
            >
              Profile Account
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`hover:text-orange-600 transition-colors cursor-pointer ${activeTab === "settings" ? "text-orange-600" : ""}`}
            >
              Instance Console
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`hover:text-orange-600 transition-colors cursor-pointer ${activeTab === "contact" ? "text-orange-600" : ""}`}
            >
              Contact
            </button>
          </nav>

          {/* Authentication & Profile Status Widget */}
          <div className="hidden md:flex items-center gap-3.5" id="header-desktop-actions">
            {isLoggedIn ? (
              <div className="flex items-center gap-3 bg-orange-50/60 p-1.5 pl-3 pr-2.5 rounded-2xl border border-orange-100" id="user-info-widget">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 leading-none">{profile.name}</p>
                  <span className="text-[10px] text-orange-700 font-mono font-medium">{profile.tier}</span>
                </div>
                <img
                  src={profile.customAvatar || AVATAR_URLS[profile.avatarId]}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full border border-orange-200 cursor-pointer object-cover"
                  onClick={() => setActiveTab("profile")}
                />
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 hover:text-red-650 hover:bg-slate-100 rounded-lg text-slate-400 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 hover:bg-orange-50 rounded-xl text-orange-700 font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => {
                    setAuthMode("register");
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-bold text-xs cursor-pointer transition-all shadow-md shadow-orange-500/10 active:scale-95"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2" id="mobile-menu-toggle-btn">
            {isLoggedIn && (
              <img
                src={profile.customAvatar || AVATAR_URLS[profile.avatarId]}
                alt="Avatar Mobile"
                className="w-7 h-7 rounded-full border border-orange-200 cursor-pointer object-cover"
                onClick={() => {
                  setActiveTab("profile");
                  setMobileMenuOpen(false);
                }}
              />
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 px-2 border border-slate-200 rounded bg-white text-slate-600 focus:outline-hidden hover:text-orange-500 hover:bg-slate-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile slide-down navigation overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-orange-100 bg-white px-4 py-6 space-y-4 animate-slideDown text-left font-sans text-sm shadow-md" id="mobile-navigation-dropdown">
            <div className="flex flex-col gap-1.5 font-bold">
              <button
                onClick={() => {
                  setActiveTab("home");
                  setMobileMenuOpen(false);
                  setTimeout(() => handleScrollTo("vallonation-app"), 100);
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 text-slate-700 hover:text-orange-600"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setActiveTab("about");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 text-slate-700 hover:text-orange-600"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  setActiveTab("domains");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 text-slate-700 hover:text-orange-600 flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4 text-orange-500" />
                <span>Buy Domain</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("profile");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 text-slate-700 hover:text-orange-600"
              >
                Profile Account
              </button>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 text-slate-700 hover:text-orange-600"
              >
                Instance Console
              </button>
              <button
                onClick={() => {
                  setActiveTab("contact");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg hover:bg-orange-50 text-slate-700 hover:text-orange-600"
              >
                Contact
              </button>
            </div>
            
            <div className="pt-4 border-t border-orange-50 flex flex-col gap-3" id="mobile-menu-footer">
               {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="px-3">
                    <p className="text-xs font-bold text-slate-800">{profile.name}</p>
                    <p className="text-[10px] text-slate-400">{profile.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-red-50 text-red-700 font-bold rounded-xl text-xs text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setShowAuthModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-orange-50 text-orange-600 font-bold rounded-xl text-xs text-center cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("register");
                      setShowAuthModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-orange-500 text-white font-bold rounded-xl text-xs text-center cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* VIEW DETERMINATOR (Tabs render system) */}
      <main className="flex-grow">
        
        {/* TAB 1: HOME PAGE CONTAINER */}
        {activeTab === "home" && (
          <div className="animate-fadeIn" id="home-tab-view">
            {/* HER0 PORTAL */}
            <HeroSection
              onLearnMoreClick={() => handleScrollTo("features")}
              onExploreSandboxClick={() => handleScrollTo("sandbox")}
              totalSyncedWrites={totalSyncedWrites}
            />

            {/* FEATURES BENTO SECTION */}
            <BentoFeatures id="features" />

            {/* LIVE CONSOLE INTERACTIVE PLAYGROUND */}
            <InteractivePlayground
              onDataSynced={handleDataSynced}
              id="sandbox"
            />

            {/* PRICING AND INTEGRATED SIGNATURE PACKET SELECTOR */}
            <PricingFaq
              id="pricing"
              onSelectPacket={handleSelectPricingPacket}
            />
          </div>
        )}

        {/* TAB 2: ABOUT WEBPAGE SECTION */}
        {activeTab === "about" && (
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-32 text-left space-y-12 animate-fadeIn" id="about-tab-view">
            <div className="space-y-4" id="about-intro">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-mono text-[10px] font-bold">REPLICATION INFO</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">About Vallonation Database</h1>
              <p className="text-slate-600 text-base leading-relaxed">
                Vallonation was founded in 2026 on the vision of simplifying global cloud asynchronous data replication without requiring complex custom engineering. Named after the synthesis of Odin and Valhalla values, we dedicate this architecture to ultimate reliability, local information sovereignty, and instantaneous computing latency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="about-core-pillars">
              <div className="p-6 bg-white rounded-3xl border border-orange-50 shadow-xs space-y-3">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl w-fit">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Instant Edge Distribution</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We operate 12 physical edge clusters worldwide to ensure every read-write transaction is acknowledged with minimal latency guarantees for both local and international users.
                </p>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-orange-100 shadow-xs space-y-3">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl w-fit">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Secure Gateway Authorization</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our custom JWT key reservation shields client network access, restricting queries exclusively to verified row-level requests to preserve the secrets of your enterprise credentials.
                </p>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-orange-150 space-y-4" id="about-team">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                <span>Vallonation Sovereign Data Center</span>
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                As a pioneer in cloud replication architectures, Vallonation empowers organisations from micro-startups to global multinational enterprises to seamlessly migrate thousands of tables, monitor WebSocket stream latency, and run gateway test requests with zero unexpected operational overhead.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT SECTION */}
        {activeTab === "contact" && (
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-32 text-left space-y-12 animate-fadeIn" id="contact-tab-view">
            <div className="space-y-4" id="contact-intro">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-mono text-[10px] font-bold">HELP CENTER</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Contact Our Administrators</h1>
              <p className="text-slate-600 text-sm md:text-base">
                Have custom questions or need a customized enterprise quote? Get in touch with Vallonation's engineering support team today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch" id="contact-layout">
              {/* Info col (5 cols) */}
              <div className="md:col-span-5 bg-orange-50/50 p-8 rounded-3xl border border-orange-100 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">Official Contact</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    We are always available to help consult and optimize your database architecture in real-time.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-orange-500" />
                    <span>Operational Hub: Jakarta, Indonesia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>Hotline: +62 21-8930-112</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-orange-500" />
                    <span>Response SLA: Under 3 Hours</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400">
                  Vallonation Cloud Inc. supports secure internal SSL/TLS encrypted links.
                </p>
              </div>

              {/* Form col (7 cols) */}
              <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-orange-100 shadow-xs" id="contact-form-box">
                {isFeedbackSubmitted ? (
                  <div className="py-12 text-center space-y-3 animate-fadeIn" id="mail-sent-banner">
                    <CheckCircle2 className="w-10 h-10 text-orange-500 mx-auto" />
                    <h4 className="text-slate-800 font-bold text-base">Message Received Successfully</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Vallonation has successfully logged your support ticket. Our technical team will reach out to you via email shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Developer Email</label>
                      <input
                        type="email"
                        required
                        placeholder="developers@org.com"
                        value={feedbackEmail}
                        onChange={(e) => setFeedbackEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold focus:outline-hidden focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Inquiry / Message Details</label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Ask about key customizations, vCPU, memory allocations, replica clusters, or API latency..."
                        value={feedbackMessage}
                        onChange={(e) => setFeedbackMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:outline-hidden focus:border-orange-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 font-bold text-xs text-white rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTERACTIVE PROFILE SECTION */}
        {activeTab === "profile" && (
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-32 text-left space-y-12 animate-fadeIn" id="profile-tab-view">
            
            {/* Header intro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-orange-100" id="profile-intro-headline">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-mono text-[10px] font-bold">SOVEREIGN WORKSPACE CONTROL</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Profile & Account Settings</h1>
                <p className="text-slate-650 text-sm max-w-2xl">
                  Manage your developer credentials, configure custom digital 2D avatars, and reset system security access credentials.
                </p>
              </div>

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Swap Account (Sign Out)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="profile-panels-layout">
              
              {/* Left Column: Account info & password (6 cols) */}
              <div className="lg:col-span-6 space-y-8">
                
                {/* 1. Account Info Card */}
                <div className="bg-white p-7 rounded-3xl border border-orange-100 shadow-xs space-y-6">
                  <div className="flex items-center gap-2 text-slate-800">
                    <User className="w-5 h-5 text-orange-500" />
                    <h3 className="text-base font-extrabold">Developer Credentials Setup</h3>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">Developer Username</label>
                        <input
                          type="text"
                          required
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 focus:border-orange-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-hidden transition-all duration-150"
                          placeholder="Your username"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">Registered Email Address</label>
                        <input
                          type="email"
                          required
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 focus:border-orange-500 bg-slate-50/50 hover:bg-slate-50 focus:bg-white rounded-xl text-xs font-semibold text-slate-800 outline-hidden transition-all duration-150"
                          placeholder="developer@mail.com"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]"
                    >
                      Update Profile Metadata
                    </button>
                  </form>

                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <div className="flex items-center gap-2 text-slate-800">
                      <Lock className="w-4.5 h-4.5 text-orange-500" />
                      <h4 className="text-sm font-extrabold">Reset Account Password</h4>
                    </div>

                    <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 font-mono">NEW SECURE PASSWORD</label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={newResetPassword}
                            onChange={(e) => setNewResetPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 focus:border-orange-500 rounded-xl text-xs outline-hidden mt-1 bg-slate-50/40"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 font-mono">CONFIRM NEW PASSWORD</label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={confirmResetPassword}
                            onChange={(e) => setConfirmResetPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 focus:border-orange-500 rounded-xl text-xs outline-hidden mt-1 bg-slate-50/40"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer transition-all active:scale-[0.98]"
                        >
                          Save New Password Credentials
                        </button>
                        <p className="text-[10px] text-slate-400 italic">
                          Last change: Vallo Token encrypted local auth sync.
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

              </div>

              {/* Right Column: Custom 2D Avatar Suites (6 cols) */}
              <div className="lg:col-span-6 space-y-8">
                
                {/* 2. Interactive Premium Avatar Suite (Upload & Randomize) Sub-card */}
                <div className="bg-white p-7 rounded-3xl border border-orange-100 shadow-xs space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-extrabold text-slate-800">Customize Developer Avatar</h3>
                      <p className="text-xs text-slate-500 leading-snug">Choose from preset icons, upload an image file, or trigger robot generation.</p>
                    </div>
                  </div>

                  {/* Chosen avatar visualization */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                    <div className="relative shrink-0">
                      <img
                        src={profile.customAvatar || AVATAR_URLS[profile.avatarId]}
                        alt="Active Avatar"
                        className="w-20 h-20 rounded-full border-2 border-orange-500 object-cover shadow-md shadow-orange-500/10"
                      />
                      <span className="absolute bottom-0 right-0 px-1.5 py-0.5 bg-emerald-500 border border-white text-white rounded font-mono text-[8px] font-black uppercase">
                        Active
                      </span>
                    </div>

                    <div className="text-center sm:text-left space-y-3 flex-grow">
                      <div>
                        <h4 className="text-xs font-bold text-slate-700">Visual Identification Profile</h4>
                        <p className="text-[11px] text-slate-500 font-mono leading-none mt-1">
                          Type: {profile.customAvatar ? (profile.customAvatar.startsWith("data:") ? "Custom Image Upload" : "Dicebear 2D Illustration Custom") : `System Preset Option #${profile.avatarId + 1}`}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <button
                          onClick={handleGenerateRandomAvatar}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-orange-500 text-orange-600 hover:text-orange-700 font-bold text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1 hover:shadow-xs active:scale-95"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Generate Random 2D Idle Avatar</span>
                        </button>
                        
                        {profile.customAvatar && (
                          <button
                            onClick={() => {
                              setProfile(prev => ({ ...prev, customAvatar: undefined, avatarId: 0 }));
                              showToast("Avatar reset to standard preset option #1!");
                            }}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[10px] rounded-lg cursor-pointer"
                          >
                            Reset to Default
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Avatar Option Selectors */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Select Design Presets:</span>
                    <div className="flex flex-wrap gap-3.5" id="profile-avatars-chooser">
                      {AVATAR_URLS.map((url, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setProfile(prev => ({ ...prev, avatarId: index, customAvatar: undefined }));
                            showToast(`Preset avatar changed to index option #${index + 1}`);
                          }}
                          className={`w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 transition-all p-0.5 ${
                            profile.avatarId === index && !profile.customAvatar
                              ? "border-orange-500 scale-105 shadow-md shadow-orange-500/10" 
                              : "border-transparent opacity-65 hover:opacity-100 bg-slate-50"
                          }`}
                        >
                          <img src={url} alt={`Preset Avatar ${index + 1}`} className="w-full h-full rounded-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Drag & Drop image file area */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Upload Custom Image Profile:</span>
                    
                    <input
                      type="file"
                      id="avatar-photo-uploader"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processAvatarFile(e.target.files[0]);
                        }
                      }}
                    />

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingAvatar(true);
                      }}
                      onDragLeave={() => setIsDraggingAvatar(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingAvatar(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          processAvatarFile(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => document.getElementById("avatar-photo-uploader")?.click()}
                      className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                        isDraggingAvatar
                          ? "border-orange-500 bg-orange-50/30"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100/50 hover:border-orange-300"
                      }`}
                      style={{ minHeight: "110px" }}
                    >
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                          <Upload className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-black text-slate-700">
                          {isDraggingAvatar ? "Drop image file here!" : "Click to select or drag image file here"}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Supports PNG, JPG, GIF or SVG. Maximum file size size limit 2MB.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM CONFIGURATION SETTINGS PANEL */}
        {activeTab === "settings" && (
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-32 text-left space-y-12 animate-fadeIn" id="settings-tab-view">
            
            {/* Header intro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-orange-100" id="settings-intro-headline">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-mono text-[10px] font-bold">ACTIVE EDGE ENGINE CONSOLE</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Instance Console</h1>
                <p className="text-slate-650 text-sm max-w-2xl">
                  Inspect cloud subscription specs, relocate physical compute hosting servers, bind domain addresses, trace real-time database replication clusters, and fine-tune response gateway parameters.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleScrollTo("pricing")}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  Scale Engine Specs / Tier
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="settings-panels-layout">
              
              {/* Left Column (7 cols): Resource board, relocation, and gateway settings */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* 1. Subscription & Resource Provisioning Board */}
                <div className="bg-gradient-to-br from-slate-900 to-[#1e1a14] p-7 rounded-3xl border border-slate-800 text-white space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-orange-500 text-white font-mono text-[8px] font-extrabold uppercase animate-pulse">Node Online</span>
                      <span className="text-[10px] text-slate-400 font-mono font-bold">Cloud Ingress Stable</span>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">ACTIVE DEPLOYMENT SERVICE:</span>
                    <h4 className="text-xl font-black text-orange-300">{profile.tier}</h4>
                    <p className="text-xs text-slate-300">{profile.specs}</p>
                  </div>

                  {/* 24 Combined Regions Relocate Dropdown list */}
                  <div className="border-t border-slate-800 pt-5 space-y-2">
                    <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-widest font-mono">
                      Compute Server Location (24 Combined Regions):
                    </label>
                    <select
                      value={profile.region || "asia-southeast1-a"}
                      onChange={(e) => {
                        const targetRegion = e.target.value;
                        setProfile(prev => ({ ...prev, region: targetRegion }));
                        showToast(`Relocating system packages and databases to ${targetRegion}... Server active in new zone!`);
                      }}
                      className="w-full text-xs font-mono font-black text-slate-200 bg-slate-800 focus:bg-slate-850 hover:bg-slate-800/80 border border-slate-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 outline-hidden cursor-pointer transition-all"
                    >
                      {[
                        "asia-southeast1-a", "asia-southeast1-b", "asia-southeast1-c",
                        "asia-east1-a", "asia-east1-b", "asia-east2-a", "asia-east2-b",
                        "europe-west1-a", "europe-west1-b", "europe-west2-a", "europe-west2-b", "europe-west3-a", "europe-west3-b",
                        "us-east1-a", "us-east1-b", "us-east4-a", "us-central1-a", "us-central1-b", "us-central1-c", "us-west1-a", "us-west2-a",
                        "australia-southeast1-a", "australia-southeast1-b", "southamerica-east1-a"
                      ].map((reg) => (
                        <option key={reg} value={reg} className="font-mono bg-slate-900 text-white">
                          Zone: {reg} (Active)
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-500 font-sans italic">
                      Swapping zones triggers multi-region database sync with zero downtime backup logic.
                    </p>
                  </div>

                  <div className="border-t border-slate-800 pt-5 space-y-3 text-xs font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-slate-400 font-sans">WebSocket Connection limit:</span>
                      <span className="font-bold text-slate-200">UNLIMITED</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-slate-400 font-sans">Quota Write Balance:</span>
                      <span className="font-bold text-orange-400 text-xs">{profile.apiBalance.toLocaleString()} Credits</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-slate-400 font-sans">Active SSL Keys limit:</span>
                      <span className="font-bold text-slate-200">{profile.maxKeys} Keys permitted</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-semibold text-slate-400 font-sans">Cost per Active Month:</span>
                      <span className="font-bold text-emerald-400 text-sm">${profile.price.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>

                {/* DB connection pools info sub card */}
                <div className="bg-white p-7 rounded-3xl border border-orange-100 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-orange-500" />
                    <h3 className="text-sm font-extrabold text-slate-800">Connection Pools & Replication Replica Shards</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Vallonation uses file-persistent SQLite sandbox modules combined with optional high-scale MySQL server architectures to enable offline-ready data flows.
                  </p>
                  <div className="space-y-2 text-xs font-mono bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-snug">
                    <p className="text-slate-700">
                      ● <span className="font-bold">SQLite Schema Target</span>: <span className="text-orange-600">/database/sandbox.sqlite</span> (Online)
                    </p>
                    <p className="text-slate-700">
                      ● <span className="font-bold">MySQL Sovereign Cluster</span>: <span className="text-orange-600">mysql://sovereign_replica_root@vallo:3306</span> (Synced)
                    </p>
                    <p className="text-slate-700">
                      ● <span className="font-bold">Migration Files Status</span>: <span className="text-gray-655">2 schemas synced via PHP index.php engine</span>
                    </p>
                  </div>
                </div>

                {/* 2. Gateway tuning checkboxes (Ssl, gzip, compression) */}
                <div className="bg-white rounded-3xl border border-orange-100 p-7 shadow-xs space-y-6 animate-slideDownDeep" id="settings-form-box">
                  <div className="flex items-center gap-2 pb-3 border-b border-orange-50">
                    <SettingsIcon className="w-5 h-5 text-orange-500" />
                    <h3 className="text-base font-extrabold text-slate-800">Gateway Network Parameter Tuning</h3>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    
                    {/* Preference row 1 */}
                    <div className="flex items-start justify-between gap-6 pb-5 border-b border-orange-50">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800">Enforce SSL Encryption (HTTPS / WSS)</h4>
                        <p className="text-xs text-slate-500">Prevent offline-to-online payloads from transmitting payload content without standard secure TLS handshakes.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfigSslOnly(!configSslOnly)}
                        className={`w-11 h-6 rounded-full border transition-all relative flex items-center p-0.5 cursor-pointer ${
                          configSslOnly ? "bg-orange-600 border-orange-600" : "bg-slate-200 border-slate-300"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-all ${configSslOnly ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* Preference row 2 */}
                    <div className="flex items-start justify-between gap-6 pb-5 border-b border-orange-50">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800">Enable Payload Gzip Compression</h4>
                        <p className="text-xs text-slate-500">Compress dynamic JSON data documents prior to edge distribution to save network egress bandwidth.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfigGzip(!configGzip)}
                        className={`w-11 h-6 rounded-full border transition-all relative flex items-center p-0.5 cursor-pointer ${
                          configGzip ? "bg-orange-600 border-orange-600" : "bg-slate-200 border-slate-300"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-all ${configGzip ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* Preference row 3 */}
                    <div className="flex items-start justify-between gap-6 pb-5 border-b border-orange-50">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800">Sync Gateway Analytics</h4>
                        <p className="text-xs text-slate-500">Automatically stream telemetry summaries of write activities to the master system health panel.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConfigAnalyticsSync(!configAnalyticsSync)}
                        className={`w-11 h-6 rounded-full border transition-all relative flex items-center p-0.5 cursor-pointer ${
                          configAnalyticsSync ? "bg-orange-600 border-orange-600" : "bg-slate-200 border-slate-300"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-all ${configAnalyticsSync ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* Preference row 4: Number picker input */}
                    <div className="flex items-center justify-between gap-6 pb-5 border-b border-orange-50">
                      <div className="space-y-1 text-left">
                        <h4 className="text-sm font-bold text-slate-800">Webhook Retry Limits</h4>
                        <p className="text-xs text-slate-500">Maximum delivery retries for out-of-sync triggers in case client webhooks are offline.</p>
                      </div>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={configWebhookRetries}
                        onChange={(e) => setConfigWebhookRetries(parseInt(e.target.value) || 3)}
                        className="w-16 px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-slate-800"
                      />
                    </div>

                    {/* Preference row 5: Rate Limit Threshold */}
                    <div className="flex flex-col gap-2 pb-5 border-b border-orange-50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 text-left">
                          <h4 className="text-sm font-bold text-slate-800">IP Rate Limiter Threshold (RPM)</h4>
                          <p className="text-xs text-slate-500">Maximum permitted API queries per IP address per minute before receiving HTTP 429.</p>
                        </div>
                        <span className="px-2.5 py-1 bg-orange-100 rounded text-orange-700 font-mono text-[11px] font-extrabold">{rateLimitThreshold.toLocaleString()} RPM</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="20000"
                        step="500"
                        value={rateLimitThreshold}
                        onChange={(e) => setRateLimitThreshold(parseInt(e.target.value) || 5000)}
                        className="w-full accent-orange-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Preference row 6: TLS Grade */}
                    <div className="flex items-center justify-between gap-6 pb-5 border-b border-orange-50">
                      <div className="space-y-1 text-left">
                        <h4 className="text-sm font-bold text-slate-800">TLS Encryption Cipher Grade</h4>
                        <p className="text-xs text-slate-500">Enforce strict transport layer certificates suite configurations for bound nodes.</p>
                      </div>
                      <select
                        value={tlsVersion}
                        onChange={(e) => setTlsVersion(e.target.value)}
                        className="text-xs font-mono font-bold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer outline-hidden bg-white hover:bg-slate-50"
                      >
                        <option value="TLSv1.3 Only">Strict TLS v1.3 Only (Recommended)</option>
                        <option value="TLSv1.2 & v1.3">TLS v1.2 & v1.3 Compatibility Mode</option>
                        <option value="Custom ECDH">ECC Curve 25519 Custom Ciphers</option>
                      </select>
                    </div>

                    {/* Preference row 7: Proxy Port Mapping */}
                    <div className="flex items-center justify-between gap-6 pb-5 border-b border-orange-50">
                      <div className="space-y-1 text-left">
                        <h4 className="text-sm font-bold text-slate-800">Replica Sync Ingress Port</h4>
                        <p className="text-xs text-slate-500">Listening hardware port for secure external replica feeds or SSH cluster tunnels.</p>
                      </div>
                      <select
                        value={dbProxyPort}
                        onChange={(e) => setDbProxyPort(parseInt(e.target.value) || 3306)}
                        className="text-xs font-mono font-bold text-slate-800 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer outline-hidden bg-white hover:bg-slate-50"
                      >
                        <option value="3306">Port 3306 (Standard MySQL/Replica)</option>
                        <option value="3307">Port 3307 (Isolated Replica Sync Pool)</option>
                        <option value="8080">Port 8080 (REST Database Proxy)</option>
                        <option value="5432">Port 5432 (Postgres Proxy Fallback)</option>
                      </select>
                    </div>

                    {/* Preference row 8: Gzip compression factor */}
                    <div className="flex flex-col gap-2 pb-5">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 text-left">
                          <h4 className="text-sm font-bold text-slate-800">GZip Payload Compression Level</h4>
                          <p className="text-xs text-slate-500">Balance compression ratio (bandwidth savings) against edge compute overhead.</p>
                        </div>
                        <span className="px-2.5 py-1 bg-orange-100 rounded text-orange-700 font-mono text-[11px] font-semibold">Level {gzipLevel} (Default)</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="9"
                        step="1"
                        value={gzipLevel}
                        disabled={!configGzip}
                        onChange={(e) => setGzipLevel(parseInt(e.target.value) || 6)}
                        className={`w-full accent-orange-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer ${!configGzip ? "opacity-50 cursor-not-allowed" : ""}`}
                      />
                    </div>

                    {settingsSavedMessage && (
                      <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-xs text-emerald-700 font-semibold" id="settings-saved-ticker">
                        Instance database gateway configuration saved to active node successfully!
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs transition-style active:scale-95 transition-all"
                      >
                        Save Compliance Parameters
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfigSslOnly(true);
                          setConfigGzip(true);
                          setConfigWebhookRetries(3);
                          setConfigAnalyticsSync(true);
                          showToast("Config cleared to system hardware node standards.");
                        }}
                        className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-lg cursor-pointer"
                      >
                        Default Tune
                      </button>
                    </div>

                  </form>
                      {/* Right Column (5 cols): Connected domain mapping and real-time trace log system */}
              <div className="lg:col-span-5 space-y-8 animate-fadeIn">
                
                {/* 1. Real-time Rate Limiter Monitoring Card */}
                <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-4" id="console-rate-limiter">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-orange-500 animate-pulse" />
                      <h3 className="text-sm font-extrabold tracking-tight">Rate Limiter Monitoring Plane</h3>
                    </div>
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-[9px] font-mono font-black uppercase tracking-wider animate-pulse">
                      Active Shield
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Real-time visual monitoring of ingress throughput (Requests/sec) and blocked malicious traffic at your active edge region load balancer.
                  </p>

                  {/* Micro dashboard counters */}
                  <div className="grid grid-cols-3 gap-3 pt-1 text-center border-t border-b border-slate-800/80 py-3 font-mono">
                    <div>
                      <span className="text-[9px] text-slate-500 block">THROUGHPUT</span>
                      <span className="text-sm font-black text-orange-400">
                        {rateLimitData[rateLimitData.length - 1]?.rps || 28} <span className="text-[9px] text-slate-400">req/s</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">BLOCKED Traffic</span>
                      <span className="text-sm font-black text-rose-500">
                        {rateLimitData.reduce((acc, curr) => acc + curr.blocked, 0)} <span className="text-[9px] text-slate-400">total</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">SHIELD STATUS</span>
                      <span className="text-[10px] font-bold text-emerald-400 block mt-0.5 font-sans">HEALTHY</span>
                    </div>
                  </div>

                  {/* Recharts Area/Line Chart */}
                  <div className="h-[180px] w-full mt-2 overflow-hidden rounded-xl pr-4 pl-0 py-2 bg-slate-950/40 border border-slate-800">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={rateLimitData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                          </linearGradient>
                          <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a251e" />
                        <XAxis 
                          dataKey="time" 
                          stroke="#64748b" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={9} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff", fontSize: 10, borderRadius: "8px" }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="rps" 
                          stroke="#f97316" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorRps)" 
                          name="Queries/sec"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="blocked" 
                          stroke="#ef4444" 
                          strokeWidth={1.5}
                          fillOpacity={1} 
                          fill="url(#colorBlocked)" 
                          name="Blocked/sec"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Bound domains card with direct-domain bind interface */}
                <div className="bg-white p-7 rounded-3xl border border-orange-100 shadow-xs space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-orange-500" />
                      <h3 className="text-sm font-extrabold text-slate-800">Active Bound Domains ({purchasedDomains.length})</h3>
                    </div>
                    <span className="px-2 py-0.5 bg-orange-100 rounded text-orange-700 text-[9px] font-mono font-bold">DNS MAPS</span>
                  </div>

                  {purchasedDomains.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 text-xs italic">
                      No domains registered under this database instance setup.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {purchasedDomains.map((domain, id) => (
                        <div key={id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-slideRight">
                          <div className="text-left font-sans">
                            <p className="font-bold text-slate-800 font-mono text-xs">{domain.domainName}</p>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              <span className="px-1.5 py-0.2 bg-orange-100 text-orange-850 rounded text-[9px] font-mono font-bold">
                                {domain.cycle}
                              </span>
                              {domain.sslActive ? (
                                <span className="text-[9px] text-emerald-650 font-bold flex items-center gap-0.5 font-mono">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                  TLS Secure
                                </span>
                              ) : (
                                <span className="text-[9px] text-yellow-600 font-bold">
                                  Insecure Path
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="sm:text-right text-[10px] text-slate-500 font-mono shrink-0">
                            <p>Bound: {domain.purchaseDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Direct Bind Domain UI Form */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest font-mono">
                      // DIRECT BIND DOMAIN BOUNDARY
                    </p>
                    <form onSubmit={handleDirectBindDomain} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. dynamic-node.yoursite.com"
                        value={directBindDomainInput}
                        onChange={(e) => setDirectBindDomainInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-hidden focus:border-orange-500 focus:ring-1 focus:ring-orange-200 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-850 hover:border-slate-850 text-white font-bold text-xs rounded-xl transition-all cursor-pointer truncate"
                      >
                        Bind Host
                      </button>
                    </form>
                    <p className="text-[9.5px] text-slate-500 leading-snug">
                      Instantly links arbitrary domain routing to this database node with automated TLS handshakes and zero configuration.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab("domains")}
                      className="w-full py-2 bg-orange-50 hover:bg-orange-100/80 text-orange-750 font-bold text-xs rounded-xl transition-all cursor-pointer text-center font-sans"
                    >
                      Browse & Buy Custom New Domains
                    </button>
                  </div>
                </div>

                {/* 3. Interactive diagnostic tracer log feed */}
                <div className="bg-slate-900 text-slate-300 p-6 rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-orange-400 animate-pulse" />
                      <h3 className="text-xs font-bold tracking-widest text-white uppercase font-mono">Live Replication Tracer</h3>
                    </div>

                    <button
                      disabled={diagnosticRunning}
                      onClick={runDiagnosticCheck}
                      className="px-2.5 py-1 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white font-mono text-[9px] font-bold rounded-lg transition-all cursor-pointer uppercase flex items-center gap-1"
                    >
                      {diagnosticRunning ? "Scanning..." : "Ping Active Tracers"}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Validate that your SQLite/MySQL database replica shards, sandbox operation writes, SSL handshakes, and bound domains are up and live.
                  </p>

                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10.5px] text-emerald-400 space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-thin">
                    {diagnosticLogs.length === 0 ? (
                      <p className="text-slate-500 italic text-center py-4 text-xs">
                        Click 'Ping Active Tracers' above to run compliance checks...
                      </p>
                    ) : (
                      diagnosticLogs.map((log, index) => {
                        let colorClass = "text-emerald-400";
                        if (log.startsWith("[SYSTEM]")) colorClass = "text-orange-300";
                        if (log.startsWith("[SUCCESS]")) colorClass = "text-emerald-500 font-bold";
                        if (log.startsWith("[DNS]")) colorClass = "text-cyan-405";
                        return (
                          <p key={index} className={`${colorClass} leading-relaxed text-xs`}>
                             {log}
                          </p>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>          </div>

              </div>
              
            </div>
          </div>
        )}

        {/* TAB 5: DOMAINS HUB */}
        {activeTab === "domains" && (
          <div className="max-w-6xl mx-auto px-4 md:px-8 py-32 text-left space-y-12 animate-fadeIn" id="domains-tab-view">
            
            {/* Header intro of Domain Registry hub */}
            <div className="space-y-4" id="domains-headline">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-mono text-[10px] font-bold">VALLONATION NETWORK HOSTING</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Sovereign Domain Registry</h1>
              <p className="text-slate-600 text-sm md:text-base">
                Acquire premium domain mappings directly connected to your local database replica zones, with exclusive Sandbox write credit allocation bonuses on semester or annual billing plans.
              </p>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="domains-workspace-layout">
              
              {/* Left Column (7 cols): Search domain, search results table, or checkout area */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Search Box */}
                <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Search className="w-4 h-4 text-orange-500" />
                    <span>Search Domain Availability</span>
                  </h3>
                  
                  <form onSubmit={handleDomainSearch} className="flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        required
                        value={domainSearchQuery}
                        onChange={(e) => setDomainSearchQuery(e.target.value)}
                        placeholder="e.g. system-instance, company-db"
                        className="w-full pl-3 pr-16 py-3 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-orange-500 font-sans font-semibold text-slate-800"
                      />
                      <span className="absolute right-3 top-3 px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-mono text-[10px]">ANY TLD</span>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/10 active:scale-95 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Search</span>
                    </button>
                  </form>
                  <p className="text-[11px] text-slate-400">
                    Type a base name (e.g. <code className="font-mono bg-slate-50 px-1 text-slate-600">mycluster</code>) to query parallel TLD options instantly.
                  </p>
                </div>

                {/* 2. Results Section (Only displays if search term is active) */}
                {searchedDomainTerm && (
                  <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-xs space-y-4 animate-slideDown">
                    <div className="flex items-center justify-between border-b border-orange-50 pb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase font-mono">Query Results For:</h4>
                        <p className="text-sm font-extrabold text-slate-800">&ldquo;{searchedDomainTerm}&rdquo;</p>
                      </div>
                      <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg text-[10px] font-mono font-bold">7 Channels Evaluated</span>
                    </div>

                    <div className="divide-y divide-orange-50 overflow-hidden">
                      {searchResults.map((res) => {
                        const domainFullName = `${searchedDomainTerm}${res.tld}`;
                        const isSelected = selectedDomain?.tld === res.tld;
                        
                        return (
                          <div
                            key={res.tld}
                            onClick={() => {
                              if (res.available) {
                                setSelectedDomain({ tld: res.tld, price: res.price, available: res.available, premium: res.premium });
                                setCheckoutStep("configuring");
                                showToast(`Configuring billing details for ${domainFullName}`);
                              }
                            }}
                            className={`flex items-center justify-between py-3 px-2 rounded-xl transition-all ${
                              res.available 
                                ? "cursor-pointer hover:bg-orange-50/40" 
                                : "opacity-50 cursor-not-allowed bg-slate-50/50"
                            } ${isSelected ? "bg-orange-50/70 border border-orange-200 animate-fadeIn" : ""}`}
                          >
                            <div className="flex items-center gap-2.5 text-left">
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                              ) : (
                                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <div>
                                <p className="text-xs font-bold text-slate-800 font-mono">
                                  {domainFullName}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {res.available ? (
                                    <span className="text-[10px] text-emerald-650 font-bold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
                                      Available
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 block" />
                                      Taken
                                    </span>
                                  )}
                                  
                                  {res.premium && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 text-[8.5px] font-bold font-mono">
                                      PREMIUM TLD
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="text-right flex items-center gap-3">
                              <div className="text-left font-mono">
                                <p className="text-xs font-extrabold text-slate-800">${res.price.toFixed(2)}<span className="text-[10px] text-slate-400 font-normal">/yr</span></p>
                                <p className="text-[8.5px] text-slate-400 leading-none">base price</p>
                              </div>
                              {res.available && (
                                <button
                                  type="button"
                                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                                    isSelected 
                                      ? "bg-orange-500 text-white" 
                                      : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                                  }`}
                                >
                                  {isSelected ? "Selected" : "Select"}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Configure Billing Plan Workspace */}
                {selectedDomain && checkoutStep !== "idle" && (
                  <div className="bg-white p-7 rounded-3xl border border-orange-150 shadow-md space-y-6 animate-slideUp">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="text-left">
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded font-mono text-[8.5px] font-bold">CHECKOUT PREPARATION</span>
                        <h4 className="text-base font-extrabold text-slate-800 mt-1">
                          Configure {searchedDomainTerm}{selectedDomain.tld}
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDomain(null);
                          setCheckoutStep("idle");
                        }}
                        className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    {checkoutStep === "configuring" && (
                      <form onSubmit={handleCompleteDomainCheckout} className="space-y-6 text-left">
                        
                        {/* Interactive billing cycle choosing boxes */}
                        <div className="space-y-2.5">
                          <label className="block text-xs font-bold text-slate-500 uppercase font-mono tracking-wider">
                            Choose Billing Interval & Exclusive Rewards:
                          </label>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="billing-cycle-selectors">
                            
                            {/* Option 1: Monthly */}
                            <div
                              onClick={() => setPurchaseCycle("monthly")}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                purchaseCycle === "monthly" 
                                  ? "border-orange-500 bg-orange-50/10 shadow-xs" 
                                  : "border-slate-100 bg-white hover:border-orange-100"
                              }`}
                            >
                              <div>
                                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Standard Roll</span>
                                <h5 className="text-sm font-bold text-slate-800 mt-0.5">Monthly</h5>
                              </div>
                              <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-lg font-bold text-slate-800 font-mono">${(selectedDomain.price / 12).toFixed(2)}</span>
                                <span className="text-[10px] text-slate-400 font-mono">/mo</span>
                              </div>
                              <div className="mt-2 text-[10px] text-slate-500">
                                Standard pricing DNS route. No write multipliers.
                              </div>
                            </div>

                            {/* Option 2: Quarterly */}
                            <div
                              onClick={() => setPurchaseCycle("quarterly")}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                purchaseCycle === "quarterly" 
                                  ? "border-orange-500 bg-orange-50/10 shadow-xs" 
                                  : "border-slate-100 bg-white hover:border-orange-100"
                              }`}
                            >
                              <div>
                                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Saves 10% on setup</span>
                                <h5 className="text-sm font-bold text-slate-800 mt-0.5 font-sans">Quarterly</h5>
                              </div>
                              <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-lg font-bold text-slate-800 font-mono">${(selectedDomain.price / 4).toFixed(2)}</span>
                                <span className="text-[10px] text-slate-400 font-mono">/quarter</span>
                              </div>
                              <div className="mt-2 text-[10px] text-slate-500">
                                3-month cycle. Regular Sandbox allocations apply.
                              </div>
                            </div>

                            {/* Option 3: Semester (6-Month) -> BONUS */}
                            <div
                              onClick={() => setPurchaseCycle("semester")}
                              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                purchaseCycle === "semester" 
                                  ? "border-orange-500 bg-orange-50/20 shadow-xs ring-1 ring-orange-500/20 text-left" 
                                  : "border-orange-100 bg-white hover:border-orange-300 text-left"
                              }`}
                            >
                              <span className="absolute -top-2.5 right-3 bg-orange-500 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                Semester Bonus
                              </span>
                              
                              <div>
                                <span className="text-[10px] font-bold text-orange-600 uppercase font-mono">Best For Projects</span>
                                <h5 className="text-sm font-bold text-slate-800 mt-0.5 font-sans">Semester (6 Months)</h5>
                              </div>
                              <div className="mt-4">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-lg font-bold text-slate-800 font-mono">${((selectedDomain.price / 2) * 0.9).toFixed(2)}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">/semester</span>
                                </div>
                                <span className="text-[9.5px] text-emerald-600 font-bold font-mono">Includes 1 Month Free!</span>
                              </div>
                              <div className="mt-2.5 p-2 bg-orange-50 rounded-xl border border-orange-100 text-[10.5px] text-orange-850 font-medium">
                                <Sparkles className="w-3 h-3 text-orange-500 inline mr-1 mb-0.5 shrink-0" />
                                BONUS: <span className="font-semibold text-slate-800 font-mono">+50k API Writes</span> credits added.
                              </div>
                            </div>

                            {/* Option 4: Annual (Yearly) -> UNMATCHED BONUS */}
                            <div
                              onClick={() => setPurchaseCycle("annual")}
                              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                purchaseCycle === "annual" 
                                  ? "border-emerald-500 bg-emerald-55/10 shadow-xs ring-1 ring-emerald-500/20 text-left" 
                                  : "border-emerald-100 bg-white hover:border-emerald-300 text-left"
                              }`}
                            >
                              <span className="absolute -top-2.5 right-3 bg-emerald-500 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs animate-pulse">
                                Ultimate Bonus
                              </span>
                              
                              <div>
                                <span className="text-[10px] font-bold text-emerald-700 uppercase font-mono">Maximum Value Power</span>
                                <h5 className="text-sm font-bold text-slate-800 mt-0.5 font-sans">Annual (Yearly)</h5>
                              </div>
                              <div className="mt-4">
                                <div className="flex items-baseline gap-1 flex-wrap">
                                  <span className="text-lg font-bold text-slate-800 font-mono">${(selectedDomain.price * 0.8).toFixed(2)}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">/year</span>
                                </div>
                                <span className="text-[9.5px] text-emerald-600 font-bold font-mono">Includes 3 Months Free! (-20% Off)</span>
                              </div>
                              <div className="mt-2.5 p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-[10.5px] text-emerald-850 font-medium">
                                <Zap className="w-3 h-3 text-emerald-600 inline mr-1 mb-0.5 shrink-0" />
                                PREMIUM: <span className="font-semibold text-slate-800 font-mono">+200k DB Writes</span> + Wildcard TLS!
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Order Summary Checkout List */}
                        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs space-y-2 font-sans text-left">
                          <h4 className="font-bold text-slate-700 uppercase font-mono text-[9px] tracking-wider mb-2.5">ORDER SPECIFICATIONS SUMMARY</h4>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Selected Hub Mapping:</span>
                            <span className="font-mono text-slate-800 font-bold">{searchedDomainTerm}{selectedDomain.tld}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Service Interval Plan:</span>
                            <span className="font-mono text-slate-800 font-bold bg-slate-250 px-1.5 py-0.5 rounded uppercase text-[8.5px]">{purchaseCycle}</span>
                          </div>
                          
                          {/* Bonus display conditionally */}
                          {purchaseCycle === "semester" && (
                            <div className="flex justify-between text-orange-700 font-bold border-t border-dashed border-slate-200 pt-2 text-[11px]">
                              <span>Bonus Packet Claimed:</span>
                              <span className="flex items-center gap-1 font-sans">
                                <Sparkles className="w-3 h-3 text-orange-500" />
                                <span>+50,000 DB Writes (CLAIMED!)</span>
                              </span>
                            </div>
                          )}
                          {purchaseCycle === "annual" && (
                            <div className="flex justify-between text-emerald-700 font-bold border-t border-dashed border-slate-200 pt-2 text-[11px]">
                              <span>Bonus Packet Claimed:</span>
                              <span className="flex items-center gap-1 font-sans">
                                <Zap className="w-3 h-3 text-emerald-650" />
                                <span>+200,000 DB Writes + Wildcard TLS (CLAIMED!)</span>
                              </span>
                            </div>
                          )}
                          {purchaseCycle === "monthly" && (
                            <p className="text-[10px] text-slate-450 font-mono italic mt-1 text-right">No extra writes bonus for monthly term selections</p>
                          )}
                        </div>

                        {/* Terms checkbox & action button */}
                        <div className="space-y-4">
                          <p className="text-[10px] text-slate-400 leading-tight">
                            By placing this order, you authorize the mapping of this domain to Vallonation&rsquo;s global endpoint routing database nodes.
                          </p>
                          <button
                            type="submit"
                            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 font-display uppercase tracking-wider"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Authorize Instance Payment & Bind DNS</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {checkoutStep === "processing" && (
                      <div className="py-12 text-center space-y-4">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto animate-fadeIn" />
                        <div>
                          <h5 className="text-slate-800 font-bold text-sm">Binding Host Channels...</h5>
                          <p className="text-[11px] text-slate-500 font-mono mt-1">Generating TLS keys and routing mapping allocations</p>
                        </div>
                      </div>
                    )}

                    {checkoutStep === "success" && (
                      <div className="py-8 text-center space-y-5 animate-fadeIn">
                        <div className="p-3 bg-emerald-50 border border-emerald-200 w-fit rounded-full mx-auto text-emerald-600 animate-bounce">
                          <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-slate-800 font-extrabold text-base">Payment Authorized & Hosting Online!</h4>
                          <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                            The domain <code className="font-mono bg-slate-100 p-0.5 text-slate-700 font-bold">{searchedDomainTerm}{selectedDomain.tld}</code> has been bound to your API sandbox container list.
                          </p>
                        </div>

                        <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl text-xs space-y-1 text-left max-w-sm mx-auto">
                          <p className="font-bold text-slate-800 font-mono">CREDITS TRANSACTION LOG:</p>
                          <p className="text-slate-600 font-mono">
                            Status: <span className="text-emerald-600 font-bold">SUCCESS</span>
                          </p>
                          {purchaseCycle === "semester" && (
                            <p className="text-slate-600 font-mono">Bonus Added: <span className="text-orange-600 font-extrabold">+50,000 Sandbox Writes</span></p>
                          )}
                          {purchaseCycle === "annual" && (
                            <p className="text-slate-600 font-mono">Bonus Added: <span className="text-emerald-700 font-extrabold">+200,000 Sandbox Writes</span></p>
                          )}
                          <p className="text-slate-500 text-[10px] pt-1">
                            Your balance was credited in real-time. Check updated metrics in your Account Profile.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCheckoutStep("idle");
                            setSelectedDomain(null);
                          }}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                        >
                          Configure Another Domain
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </div>

              {/* Right Column (5 cols): Owned domains and quick technical info panel */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual Balance Quota Display card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 text-white relative overflow-hidden text-left shadow-lg" id="domains-balance-bill-board">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-white/10 text-orange-400 rounded font-mono text-[9px] font-bold">API WRITE POOL</span>
                      <Activity className="w-4 h-4 text-orange-400 animate-pulse" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CURRENT SANDBOX BALANCE:</h4>
                      <p className="text-2xl font-mono font-extrabold text-orange-400 leading-tight">
                        {profile.apiBalance.toLocaleString()} <span className="text-xs text-white">Writes</span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Sovereign replica writes allocated with zero rate limits.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 text-xs flex items-center justify-between text-slate-300">
                      <span>Mapped Profile Tiers:</span>
                      <span className="font-bold text-orange-400">{profile.tier}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Owned Domains Directory */}
                <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-xs space-y-4 text-left">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-500" />
                    <span>My Registered Domains ({purchasedDomains.length})</span>
                  </h3>
                  
                  <p className="text-xs text-slate-650">
                    Active domain maps bound as entry point nodes for WebSocket replication pipelines.
                  </p>

                  <div className="space-y-3 pt-2" id="owned-domains-rows">
                    {purchasedDomains.map((dom, index) => (
                      <div
                        key={index}
                        className="p-4 bg-orange-50/20 border border-orange-100/60 rounded-2xl space-y-2 hover:bg-orange-50/50 transition-all font-sans"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-xs font-extrabold text-slate-800 flex items-center gap-1.5 break-all">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 block" />
                            {dom.domainName}
                          </span>
                          <span className="px-1.5 py-0.5 bg-slate-150 text-slate-600 font-mono text-[8px] rounded uppercase font-bold shrink-0">
                            {dom.cycle}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                          <div>
                            <p className="text-[8px] text-slate-400 uppercase font-bold">Bound Date:</p>
                            <p className="font-semibold text-slate-700">{dom.purchaseDate}</p>
                          </div>
                          <div>
                            <p className="text-[8px] text-slate-400 uppercase font-bold">Next Invoice:</p>
                            <p className="font-semibold text-slate-700">{dom.nextBilling}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-orange-50/70 flex items-center justify-between text-[10px] gap-2">
                          <span className="text-emerald-700 font-semibold flex items-center gap-1 shrink-0">
                            <Lock className="w-3 h-3 text-emerald-600" />
                            SSL TLS v1.3 Verified
                          </span>
                          {dom.bonusWritesCredited > 0 && (
                            <span className="text-orange-700 font-bold text-[8.5px] bg-orange-100/80 px-1 py-0.5 rounded font-mono shrink-0">
                              +{(dom.bonusWritesCredited / 1000).toFixed(0)}k Writes
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate-400 leading-tight">
                    * Secondary mapping propagates around global replication cluster nodes instantly.
                  </p>
                </div>

                {/* Secure certificate info card */}
                <div className="bg-orange-50/30 p-5 rounded-3xl border border-orange-100 space-y-3 text-left">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Compliance & Wildcard SSL</span>
                  </h4>
                  <p className="text-[11px] text-slate-650 leading-relaxed">
                    Vallonation enforces automatic DNS certificate renewal for all bound domains. You don&rsquo;t need to manage configuration files, script certbots, or schedule manual renewals. All DNS mappings run safely behind edge load balancers securely.
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* 5. LIVE CHAT CS WIDGET FOR AUTH / SETTING QUESTIONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="cs-widget-anchor">
        {csOpen ? (
          <div className="w-80 sm:w-96 rounded-2xl bg-white border border-orange-100 shadow-2xl overflow-hidden flex flex-col h-96 animate-slideUp text-left" id="cs-widget-window">
            
            {/* CS Head */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-655 p-4 text-white flex items-center justify-between" id="cs-window-head">
              <div className="flex items-center gap-2.5">
                <OdinLogo size={28} glowing={false} />
                <div>
                  <h4 className="text-xs font-bold leading-none">Vallonation Live CS</h4>
                  <span className="text-[9px] text-orange-200 font-semibold uppercase">Odin Smart Agent</span>
                </div>
              </div>
              <button
                onClick={() => setCsOpen(false)}
                className="text-white hover:text-orange-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* CS Quick Recommendations List */}
            <div className="bg-orange-50/50 px-3.5 py-2 border-b border-orange-100 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none" id="cs-presets-suggestions">
              {csPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(preset.q)}
                  className="px-2.5 py-1 text-[9px] font-semibold bg-white rounded-full border border-orange-100 text-orange-700 hover:bg-orange-50 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  {preset.q}
                </button>
              ))}
            </div>

            {/* CS Messages Body Container */}
            <div className="grow p-4 overflow-y-auto space-y-3 font-sans text-xs bg-white" id="cs-window-body">
              {csMessages.map((m, idx) => {
                const isBot = m.sender === "bot";
                return (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${isBot ? "self-start align-left mr-auto text-left" : "self-end align-right ml-auto text-right"}`}
                  >
                    <span className="text-[8.5px] text-slate-400 mb-0.5 px-1">{isBot ? "Vallonation CS" : "You"}</span>
                    <div className={`p-3 rounded-2xl ${isBot ? "bg-slate-50 text-slate-700 rounded-tl-none" : "bg-orange-500 text-white rounded-tr-none font-medium text-xs text-left"}`}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CS Message Form Input */}
            <form onSubmit={handleCsSubmit} className="border-t border-orange-50 p-2.5 bg-white flex items-center gap-1.5" id="cs-form-window">
              <input
                type="text"
                required
                placeholder="Write a message or select a preset recommended button..."
                value={csInput}
                onChange={(e) => setCsInput(e.target.value)}
                className="grow px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-orange-500 font-sans"
              />
              <button
                type="submit"
                className="p-2.5 bg-orange-500 hover:bg-orange-655 text-white rounded-xl transition-all cursor-pointer shrink-0"
                aria-label="Send messenger"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        ) : (
          <button
            onClick={() => setCsOpen(true)}
            className="p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 hover:scale-105"
            id="cs-widget-open-btn"
          >
            <MessageSquare className="w-5 h-5 text-white" />
            <span className="font-bold text-xs pr-1 hidden sm:inline">Ask Support</span>
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-555 border-2 border-white animate-pulse" />
          </button>
        )}
      </div>

      {/* 6. DEV SUPPORT FEEDBACK & GLOBAL CLOUD STATUS HEALTH */}
      {activeTab === "home" && (
        <section className="py-16 px-4 md:px-8 border-b border-orange-100 bg-white" id="tech-support">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12" id="tech-support-layout">
            
            {/* Cloud Status Panel (6 cols) */}
            <div className="lg:col-span-6 space-y-6 text-left" id="cloud-status-health-panel">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-mono text-[9px] font-bold">REAL-TIME STATUS</span>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  <span>Global Service Health</span>
                </h3>
                <p className="text-slate-600 text-xs">
                  Vallonation's asynchronous health inspection network deployed uniformly across global edge nodes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="health-telemetry-boxes">
                {/* Ticker 1 */}
                <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50/20 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase font-bold">
                    <span>API Latency</span>
                    <Cpu className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-2xl font-mono font-bold text-slate-800">3.8 ms</h4>
                    <p className="text-[10px] text-emerald-600 font-mono mt-1 flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Optimal SLA (99.98%)</span>
                    </p>
                  </div>
                </div>

                {/* Ticker 2 */}
                <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50/20 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase font-bold">
                    <span>WebSocket Channels</span>
                    <Globe className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-2xl font-mono font-bold text-slate-800">1,482,903</h4>
                    <p className="text-[10px] text-orange-650 font-mono mt-1 font-bold">ACTIVE STREAM INTEGRATIONS</p>
                  </div>
                </div>

                {/* Ticker 3 */}
                <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50/20 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase font-bold">
                    <span>SSL Encryption</span>
                    <Lock className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-2xl font-mono text-slate-800 font-bold">SHA-384</h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-1 font-bold">TLS v1.3 ACTIVE MODE</p>
                  </div>
                </div>

                {/* Ticker 4 */}
                <div className="p-4 rounded-2xl border border-orange-100 bg-orange-50/20 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase font-bold">
                    <span>Replica Clusters</span>
                    <Database className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-2xl font-mono font-bold text-slate-800">12 / 12 Nodes</h4>
                    <p className="text-[10px] text-emerald-600 font-mono mt-1 font-bold">Fully Functional</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Support Feedback Form (6 cols) */}
            <div className="lg:col-span-6 bg-[#fffcf9] border border-orange-100 p-6 md:p-8 rounded-3xl text-left flex flex-col justify-between shadow-sm" id="feedback-form-panel">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" />
                  <h4 className="text-base font-bold text-slate-800">Reach Our Administrators</h4>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Have technical queries regarding data bindings, or need migration assistance? Send a message below and our engineers will reply shortly.
                </p>
              </div>

              {isFeedbackSubmitted ? (
                <div className="my-6 p-4 rounded-2xl bg-orange-50/50 border border-orange-150 text-center space-y-2 animate-fadeIn" id="submitted-success-banner">
                  <CheckCircle2 className="w-8 h-8 text-orange-500 mx-auto" />
                  <h5 className="text-slate-800 text-sm font-bold">Message Sent</h5>
                  <p className="text-slate-600 text-xs font-mono">
                    Ticket ID: #{Math.floor(Math.random() * 80000 + 10000)} | We will reply to your inbox as soon as possible. Thank you!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4 my-6" id="feedback-contact-form">
                  <div>
                    <label htmlFor="email-input" className="block text-slate-500 font-mono text-[9px] uppercase tracking-wider font-bold mb-1">
                      DEVELOPER EMAIL
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      required
                      placeholder="developer@company.com"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-orange-100 bg-white text-xs text-slate-800 focus:outline-hidden focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message-input" className="block text-slate-500 font-mono text-[9px] uppercase tracking-wider font-bold mb-1">
                      MESSAGE CONTENTS
                    </label>
                    <textarea
                      id="message-input"
                      required
                      rows={3}
                      placeholder="Detail your custom instance requirements or database migration queries here..."
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-orange-100 bg-white text-xs text-slate-850 focus:outline-hidden focus:border-orange-500 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/10 active:scale-95 transition-all"
                    id="contact-submit-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}

              <p className="text-[10px] text-slate-400">
                Data secured via encrypted SSL and restricted network credentials.
              </p>
            </div>

          </div>
        </section>
      )}

      {/* 7. SECURE CLOUD FOOTER */}
      <footer className="py-12 px-4 md:px-8 border-t border-orange-100 bg-white text-slate-500" id="main-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6" id="footer-container">
          
          <div className="flex items-center gap-3" id="footer-logo">
            <OdinLogo size={24} glowing={false} />
            <div className="text-left">
              <span className="font-display font-bold text-xs tracking-wider text-slate-700">
                VALLONATION CLOUD
              </span>
              <p className="text-[8px] font-mono text-slate-400 leading-none">High-availability cloud replication engine</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold" id="footer-links">
            <button onClick={() => setActiveTab("about")} className="hover:text-orange-600 transition-colors cursor-pointer">// ABOUT VALLONATION</button>
            <button onClick={() => setActiveTab("domains")} className="hover:text-orange-600 transition-colors cursor-pointer">// BUY DOMAIN</button>
            <button onClick={() => setActiveTab("profile")} className="hover:text-orange-600 transition-colors cursor-pointer">// MODULAR WORKSPACE</button>
            <button onClick={() => setActiveTab("settings")} className="hover:text-orange-600 transition-colors cursor-pointer">// INSTANCE SETTINGS</button>
            <button onClick={() => setActiveTab("contact")} className="hover:text-orange-600 transition-colors cursor-pointer">// GET IN TOUCH</button>
          </div>

          <div className="text-[10.5px] font-mono text-slate-400 text-center md:text-right" id="footer-copyright">
            <span>© 2026 Vallonation Cloud Inc. All rights reserved.</span>
          </div>

        </div>
      </footer>

      {/* Auth Register and Login Modal component */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn" id="auth-modal-overlay">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-orange-50 text-left space-y-6" id="auth-modal-box">
            
            <button
              onClick={() => {
                setShowAuthModal(false);
                setAuthSuccessJustHappened(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {authSuccessJustHappened ? (
              <div className="space-y-6 py-2 text-center animate-fadeIn" id="auth-success-redirect-screen">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900">Successfully Authorized!</h3>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                    Welcome developer, <span className="font-bold text-slate-800">{profile.name}</span>. Your sovereign cloud session has been initiated securely.
                  </p>
                </div>

                <div className="p-3.5 bg-orange-50/50 border border-orange-100 rounded-2xl text-left space-y-1 text-[11px]">
                  <p className="text-slate-500 font-mono text-[9px] font-bold">VALLONATION SESSION LOGS:</p>
                  <p className="text-slate-700 font-mono">🔑 Session: <span className="text-emerald-600 font-bold">ESTABLISHED</span></p>
                  <p className="text-slate-700 font-mono">⚡ Sandbox Quota: <span className="text-orange-600 font-bold">{profile.apiBalance.toLocaleString()} Writes</span></p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setActiveTab("profile");
                      setShowAuthModal(false);
                      setAuthSuccessJustHappened(false);
                      setAuthEmail("");
                      setAuthPassword("");
                      setAuthName("");
                    }}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Go to Profile Account Workspace</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(false);
                      setAuthSuccessJustHappened(false);
                      setAuthEmail("");
                      setAuthPassword("");
                      setAuthName("");
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Explore Homepage First
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800">
                    {authMode === "login" ? "Sign in to Vallonation" : "Register New Account"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {authMode === "login" 
                      ? "Access your secure sovereign database instance workspaces." 
                      : "Sign up today to claim bonus Sandbox write operation credits!"}
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === "register" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Developer Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Username"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Client Email</label>
                    <input
                      type="email"
                      required
                      placeholder="developer@vallo.io"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.98]"
                  >
                    {authMode === "login" ? "Sign In" : "Register Instance"}
                  </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-50 text-[11px] text-slate-500" id="auth-modal-footer">
                  {authMode === "login" ? (
                    <p>
                      Don't have an account?{" "}
                      <button
                        onClick={() => setAuthMode("register")}
                        className="text-orange-600 font-bold hover:underline cursor-pointer"
                      >
                        Sign up for free
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <button
                        onClick={() => setAuthMode("login")}
                        className="text-orange-600 font-bold hover:underline cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
