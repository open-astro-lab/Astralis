// Small distinct SVG glyph per module — gives each Home card a unique visual
// identity instead of just a number, using the app's existing glow palette.
export default function ModuleGlyph({ kind }) {
  const common = "w-9 h-9";
  switch (kind) {
    case "universe_explorer":
      return (
        <svg viewBox="0 0 32 32" className={common}>
          <circle cx="16" cy="16" r="10" fill="none" stroke="#7C6CF0" strokeWidth="1.5" />
          <ellipse cx="16" cy="16" rx="14" ry="5" fill="none" stroke="#F2C572" strokeWidth="1.2" transform="rotate(-20 16 16)" />
        </svg>
      );
    case "sky_explorer":
      return (
        <svg viewBox="0 0 32 32" className={common}>
          <path d="M16 4 C 10 4 6 10 6 16 C 6 22 10 28 16 28 C 12 24 12 8 16 4 Z" fill="#F2C572" opacity="0.9" />
          <circle cx="24" cy="9" r="1.3" fill="#EDEFF7" />
          <circle cx="26" cy="15" r="0.9" fill="#EDEFF7" />
          <circle cx="22" cy="20" r="1" fill="#EDEFF7" />
        </svg>
      );
    case "asteroid_hunter":
      return (
        <svg viewBox="0 0 32 32" className={common}>
          <path d="M10 8 L20 6 L26 12 L24 20 L18 26 L9 23 L6 15 Z" fill="#8B93AE" stroke="#3FD6B0" strokeWidth="1" />
          <circle cx="14" cy="14" r="1.4" fill="#0B0E1A" />
          <circle cx="19" cy="17" r="1" fill="#0B0E1A" />
        </svg>
      );
    case "exoplanet_hunter":
      return (
        <svg viewBox="0 0 32 32" className={common}>
          <circle cx="16" cy="16" r="7" fill="#F2C572" />
          <circle cx="6" cy="16" r="1.6" fill="#7C6CF0" />
          <line x1="0" y1="16" x2="12" y2="16" stroke="#3FD6B0" strokeWidth="1" strokeDasharray="1 1.5" />
        </svg>
      );
    case "stellar_detective":
      return (
        <svg viewBox="0 0 32 32" className={common}>
          <circle cx="16" cy="16" r="6" fill="#A79AF5" />
          <path d="M16 2 L16 8 M16 24 L16 30 M2 16 L8 16 M24 16 L30 16" stroke="#A79AF5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "physics_lab":
      return (
        <svg viewBox="0 0 32 32" className={common}>
          <rect x="7" y="4" width="4" height="20" rx="2" fill="#7C6CF0" transform="rotate(15 9 14)" />
          <circle cx="20" cy="22" r="6" fill="none" stroke="#F2C572" strokeWidth="1.3" />
          <text x="20" y="25" fontSize="7" fill="#F2C572" textAnchor="middle" fontFamily="monospace">v</text>
        </svg>
      );
    default:
      return null;
  }
}
