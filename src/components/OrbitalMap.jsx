import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSound } from "../context/SoundContext.jsx";

const NODES = [
  { key: "universe_explorer", labelKey: "modules.universe_explorer", ring: 1, angle: -30, color: "#7C6CF0" },
  { key: "sky_explorer", labelKey: "modules.sky_explorer", ring: 1, angle: 90, color: "#F2C572" },
  { key: "physics_lab", labelKey: "modules.physics_lab", ring: 1, angle: 210, color: "#3FD6B0" },
  { key: "asteroid_hunter", labelKey: "modules.asteroid_hunter", ring: 2, angle: 20, color: "#8B93AE" },
  { key: "exoplanet_hunter", labelKey: "modules.exoplanet_hunter", ring: 2, angle: 145, color: "#A79AF5" },
  { key: "stellar_detective", labelKey: "modules.stellar_detective", ring: 2, angle: 270, color: "#FF9F6B" },
  { key: "system_builder", labelKey: "modules.system_builder", ring: 2, angle: 315, color: "#FFFFFF" },
];

const RING_R = { 1: 100, 2: 165 };

function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export default function OrbitalMap({ setView }) {
  const { t } = useTranslation();
  const { playClick } = useSound();
  const [hovered, setHovered] = useState(null);
  const [launching, setLaunching] = useState(null);
  const cx = 200, cy = 200;

  function travel(key) {
    playClick();
    setLaunching(key);
    setTimeout(() => setView(key), 320);
  }

  return (
    <div className="relative w-full max-w-md mx-auto select-none">
      <svg viewBox="0 0 400 400" className="w-full h-auto">
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#F2C572" />
            <stop offset="100%" stopColor="#0B0E1A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Orbit rings */}
        {Object.values(RING_R).map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#7C6CF0" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 4" />
        ))}

        {/* Traveling glints along each ring — purely decorative, gives the map a living feel */}
        {Object.entries(RING_R).map(([ring, r]) => (
          <circle key={`glint-${ring}`} r="2.2" fill="#EDEFF7" opacity="0.8">
            <animateMotion
              dur={ring === "1" ? "14s" : "22s"}
              repeatCount="indefinite"
              path={`M ${cx + r},${cy} A ${r},${r} 0 1,1 ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`}
            />
          </circle>
        ))}

        {/* Central core */}
        <circle cx={cx} cy={cy} r="34" fill="url(#coreGlow)" />
        <circle cx={cx} cy={cy} r="10" fill="#F2C572" />

        {/* Module nodes */}
        {NODES.map((node) => {
          const { x, y } = polar(cx, cy, RING_R[node.ring], node.angle);
          const isHovered = hovered === node.key;
          const isLaunching = launching === node.key;
          return (
            <g
              key={node.key}
              onMouseEnter={() => setHovered(node.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => travel(node.key)}
              className="cursor-pointer"
              style={{
                transition: "transform 0.25s ease",
                transform: isHovered || isLaunching ? "scale(1.25)" : "scale(1)",
                transformOrigin: `${x}px ${y}px`,
              }}
            >
              <circle
                cx={x}
                cy={y}
                r="20"
                fill={node.color}
                opacity={isLaunching ? 1 : 0.85}
              />
              <circle cx={x} cy={y} r="20" fill="none" stroke={node.color} strokeOpacity="0.5" strokeWidth={isHovered ? 3 : 1.5} />
            </g>
          );
        })}
      </svg>

      {/* Labels rendered as an HTML overlay so text stays crisp and upright */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
        {NODES.map((node) => (
          <button
            key={node.key}
            onClick={() => travel(node.key)}
            onMouseEnter={() => setHovered(node.key)}
            onMouseLeave={() => setHovered(null)}
            className={`text-left px-3 py-2 rounded-lg text-xs border transition ${
              hovered === node.key ? "border-nebula bg-panelLight text-text" : "border-white/10 bg-panel/60 text-muted"
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: node.color }} />
            {t(node.labelKey)}
          </button>
        ))}
      </div>

      <p className="text-center text-muted text-xs mt-4">{t("home.map_instruction")}</p>
    </div>
  );
}
