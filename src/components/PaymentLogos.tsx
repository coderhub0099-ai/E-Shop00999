import React from 'react';

export const BkashLogo: React.FC<{ className?: string }> = ({ className = "h-6" }) => (
  <svg className={className} viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="60" rx="8" fill="#E2136E" />
    {/* Target circle */}
    <circle cx="35" cy="30" r="16" fill="#FFFFFF" />
    <circle cx="35" cy="30" r="11" fill="#E2136E" />
    <circle cx="35" cy="30" r="6" fill="#FFFFFF" />
    {/* Clean typographic bKash */}
    <text x="64" y="38" fill="#FFFFFF" fontFamily="'Space Grotesk', sans-serif" fontSize="24" fontWeight="800" letterSpacing="-1">
      bKash
    </text>
  </svg>
);

export const NagadLogo: React.FC<{ className?: string }> = ({ className = "h-6" }) => (
  <svg className={className} viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="60" rx="8" fill="#F26422" />
    {/* Dynamic wave representing Nagad bird logo */}
    <path d="M22 35C22 35 28 20 38 20C48 20 52 35 52 35C52 35 44 42 37 42C30 42 22 35 22 35Z" fill="#FFFFFF" />
    <circle cx="37" cy="28" r="4" fill="#F26422" />
    {/* Typographic brand text */}
    <text x="64" y="38" fill="#FFFFFF" fontFamily="'Space Grotesk', sans-serif" fontSize="24" fontWeight="800" letterSpacing="-1">
      nagad
    </text>
  </svg>
);

export const StripeLogo: React.FC<{ className?: string }> = ({ className = "h-5" }) => (
  <svg className={className} viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="60" rx="8" fill="#635BFF" />
    <text x="35" y="38" fill="#FFFFFF" fontFamily="'Space Grotesk', sans-serif" fontSize="26" fontWeight="800" letterSpacing="-1.5">
      stripe
    </text>
    {/* Subtle card emblem next to stripe */}
    <g transform="translate(108, 18)">
      <rect width="24" height="16" rx="2" fill="#FFFFFF" opacity="0.3" />
      <line x1="2" y1="5" x2="22" y2="5" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
      <rect x="3" y="9" width="4" height="3" rx="0.5" fill="#FFFFFF" opacity="0.6" />
    </g>
  </svg>
);

export const PaypalLogo: React.FC<{ className?: string }> = ({ className = "h-5" }) => (
  <svg className={className} viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="60" rx="8" fill="#003087" />
    <g transform="translate(25, 15)" scale="1.1">
      {/* PayPal Overlapping Ps */}
      <path d="M4.6 1.1H11.2c2.8 0 4.9.6 6.1 1.8 1.1 1.1 1.6 2.7 1.4 4.8-.3 3.3-2.3 5.3-5.2 5.3H8.7L7.6 19.8c-.1.5-.5.8-1 .8H2.1c-.6 0-1-.5-.9-1.1L2.8 4.6c.4-1.9 1.4-3.5 1.5-3.5z" fill="#0079C1" opacity="0.85" />
      <path d="M7.3 6H13.9c2 0 3.5.4 4.3 1.3.8.8 1.1 2 1 3.5-.2 2.4-1.6 4-3.7 4H9.5L8.7 19.8c-.1.4-.4.7-.8.7H2.8c-.4 0-.7-.4-.6-.8L3.1 11c.2-1.4 1.1-2.5 1.1-2.5l3.1-2.5z" fill="#00457C" />
      <path d="M7.3 6H13.9c2 0 3.5.4 4.3 1.3.8.8 1.1 2 1 3.5-.2 2.4-1.6 4-3.7 4H9.5c-.4 0-.7.3-.8.7l-.8 5.1c-.1.4-.4.7-.8.7H4.4c-.4 0-.7-.4-.6-.8L5.7 11c.2-1.4 1.1-2.5 1.1-2.5L7.3 6z" fill="#0079C1" />
    </g>
    <text x="64" y="38" fill="#FFFFFF" fontFamily="'Space Grotesk', sans-serif" fontSize="22" fontWeight="800" letterSpacing="-1">
      PayPal
    </text>
  </svg>
);

export const VisaMastercardLogo: React.FC<{ className?: string }> = ({ className = "h-6" }) => (
  <svg className={className} viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="60" rx="8" fill="#1E293B" />
    
    {/* VISA (Left side) */}
    <g transform="translate(18, 18)">
      {/* V */}
      <path d="M12.5 2L7 17.5H3L0.5 2H4.5L6 12.5L10 2H12.5Z" fill="#2563EB" />
      {/* I */}
      <rect x="14.5" y="2" width="3" height="15.5" fill="#2563EB" />
      {/* S */}
      <path d="M26.5 5.5C26 3.5 24 2 21 2C18 2 16 3.5 16 5.5C16 8 19 8.5 20.5 9.5C22 10.5 22.5 11.5 22.5 12.5C22.5 14.5 20 16 17 16C15 16 13 15 12.5 13.5L15.5 11.5C16 12.5 17 13 18 13C19 13 19.5 12.5 19.5 12C19.5 11 18 10.5 16.5 9.5C15 8.5 13.5 7.5 13.5 5.5C13.5 3.5 15.5 1 19.5 1C22.5 1 24.5 2.5 25.5 4L26.5 5.5Z" fill="#F59E0B" />
      {/* A */}
      <path d="M33 2L37 17.5H33.5L32.2 13H28.8L27.5 17.5H24L28 2H33ZM31.5 10L30.5 5.5L29.5 10H31.5Z" fill="#2563EB" />
    </g>

    {/* Vertical separator */}
    <line x1="80" y1="12" x2="80" y2="48" stroke="#475569" strokeWidth="2" />

    {/* Mastercard (Right side) */}
    <g transform="translate(98, 16)">
      {/* Intersecting circles */}
      <circle cx="12" cy="14" r="14" fill="#EB001B" />
      <circle cx="30" cy="14" r="14" fill="#F79E1B" opacity="0.85" />
      {/* Intersection segment */}
      <path d="M18.15 7.21C20.65 9.04 22 11.5 22 14C22 16.5 20.65 18.96 18.15 20.79C20.65 18.96 22 16.5 22 14C22 11.5 20.65 9.04 18.15 7.21Z" fill="#F79E1B" />
    </g>
  </svg>
);

export const RocketLogo: React.FC<{ className?: string }> = ({ className = "h-6" }) => (
  <svg className={className} viewBox="0 0 160 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="60" rx="8" fill="#8C309E" />
    
    {/* Little Rocket Icon */}
    <path d="M35 15C35 15 45 25 45 35C45 42 38 45 35 45C32 45 25 42 25 35C25 25 35 15 35 15Z" fill="#FFFFFF" />
    <path d="M35 32V42" stroke="#8C309E" strokeWidth="3" strokeLinecap="round" />
    <path d="M30 38H40" stroke="#8C309E" strokeWidth="2" />
    
    <text x="64" y="38" fill="#FFFFFF" fontFamily="'Space Grotesk', sans-serif" fontSize="24" fontWeight="800" letterSpacing="-1">
      Rocket
    </text>
  </svg>
);

export const QuirkyFruityLogo: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="orangeGrad" cx="45%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FFA03A" />
          <stop offset="60%" stopColor="#FF6200" />
          <stop offset="100%" stopColor="#D52A00" />
        </radialGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>
      
      {/* Dynamic Twin Leaves */}
      <path d="M50 32 C45 15 20 20 32 38 C38 33 45 32 50 32 Z" fill="url(#leafGrad)" />
      <path d="M50 32 C55 15 80 20 68 38 C62 33 55 32 50 32 Z" fill="url(#leafGrad)" />
      
      {/* Organic Stem */}
      <path d="M48 32 C48 26 52 26 52 32 Z" fill="#60300A" stroke="#60300A" strokeWidth="2" strokeLinecap="round" />
      
      {/* Shiny Juicy Fruit sphere body */}
      <circle cx="50" cy="60" r="28" fill="url(#orangeGrad)" />
      
      {/* Cute Quirky Smiling Face Artistry */}
      {/* Eyes */}
      <path d="M39 53 Q43 49 45 54" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="59" cy="53" r="3.5" fill="#FFFFFF" />
      
      {/* Cheeks blush circles */}
      <circle cx="37" cy="62" r="3" fill="#D52A00" opacity="0.6" />
      <circle cx="63" cy="62" r="3" fill="#D52A00" opacity="0.6" />

      {/* Joyful mouth curve */}
      <path d="M46 64 Q50 69 54 64" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" strokeDasharray="none" />
    </svg>
  );
};
