import React from "react";

interface OdinLogoProps {
  className?: string;
  size?: number;
  glowing?: boolean;
}

export const OdinLogo: React.FC<OdinLogoProps> = ({
  className = "",
  size = 40,
  glowing = true,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      id="odin-logo-container"
    >
      {/* Soft warm gold background halo */}
      {glowing && (
        <div
          className="absolute inset-0 rounded-full bg-orange-500/10 blur-md"
          style={{ width: size * 1.3, height: size * 1.3, transform: "translate(-12%, -12%)" }}
          id="odin-logo-glow"
        />
      )}

      {/* Modern, friendly orange cloud & circle logo */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-all duration-300 hover:scale-105"
        id="odin-logo-svg"
      >
        {/* Soft orange outline circle */}
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#vallo-orange-grad)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Inner clean geometry (Symmetric stylized V-shape resembling mountains or data spikes) */}
        <path
          d="M32 42 L50 68 L68 42"
          stroke="url(#vallo-orange-grad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Minimalist Wise Eye circle inside representing Odin's core focal point of the platform */}
        <circle
          cx="50"
          cy="34"
          r="8"
          fill="#f97316"
          className="animate-pulse"
          style={{ animationDuration: "2.5s" }}
        />

        {/* Definitions of beautiful warm gradients */}
        <defs>
          <linearGradient id="vallo-orange-grad" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#fb923c" /> {/* Light orange */}
            <stop offset="50%" stopColor="#f97316" /> {/* Brand orange */}
            <stop offset="100%" stopColor="#ea580c" /> {/* Deep amber orange */}
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
