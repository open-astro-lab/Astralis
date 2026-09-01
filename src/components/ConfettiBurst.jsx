function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const COLORS = ["#7C6CF0", "#F2C572", "#3FD6B0", "#A79AF5", "#FFFFFF"];

export default function ConfettiBurst({ seed = 1 }) {
  const rand = seededRandom(seed);
  const pieces = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * 2 * Math.PI + rand() * 0.3;
    const distance = 40 + rand() * 40;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      color: COLORS[i % COLORS.length],
      size: 4 + rand() * 4,
      delay: rand() * 0.15,
    };
  });

  return (
    <div className="relative w-0 h-0 pointer-events-none" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: 0,
            top: 0,
            animation: `confettiPop 0.7s ease-out ${p.delay}s forwards`,
            "--dx": `${p.x}px`,
            "--dy": `${p.y}px`,
          }}
        />
      ))}
    </div>
  );
}
