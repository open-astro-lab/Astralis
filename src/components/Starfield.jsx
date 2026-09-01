function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function Starfield({ count = 60 }) {
  const rand = seededRandom(42);
  const stars = Array.from({ length: count }, (_, i) => ({
    x: rand() * 100,
    y: rand() * 100,
    r: 0.3 + rand() * 0.9,
    delay: rand() * 4,
    dur: 2.5 + rand() * 3,
  }));

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none opacity-70"
      style={{ zIndex: 0 }}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#EDEFF7">
          <animate
            attributeName="opacity"
            values="0.15;0.9;0.15"
            dur={`${s.dur}s`}
            begin={`${s.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}
