// Every entry references a real, already-verified question already in the
// app's translation files — no new content is invented here, just reused
// and remixed into a fast-replay pool.
function q(promptKey, optsPrefix, correctIndex, explainKey) {
  return {
    promptKey,
    optionKeys: [`${optsPrefix}.opt1`, `${optsPrefix}.opt2`, `${optsPrefix}.opt3`],
    correctIndex,
    explainKey,
  };
}

export const TRIVIA_POOL = [
  q("physics_lab.escape_velocity.quiz.q1.prompt", "physics_lab.escape_velocity.quiz.q1", 1, "physics_lab.escape_velocity.quiz.q1.explain"),
  q("physics_lab.orbital_velocity.quiz.q1.prompt", "physics_lab.orbital_velocity.quiz.q1", 0, "physics_lab.orbital_velocity.quiz.q1.explain"),
  q("physics_lab.kepler.quiz.q1.prompt", "physics_lab.kepler.quiz.q1", 2, "physics_lab.kepler.quiz.q1.explain"),
  q("physics_lab.inverse_square.quiz.q1.prompt", "physics_lab.inverse_square.quiz.q1", 1, "physics_lab.inverse_square.quiz.q1.explain"),
  q("physics_lab.wien.quiz.q1.prompt", "physics_lab.wien.quiz.q1", 0, "physics_lab.wien.quiz.q1.explain"),
  q("physics_lab.stefan_boltzmann.quiz.q1.prompt", "physics_lab.stefan_boltzmann.quiz.q1", 2, "physics_lab.stefan_boltzmann.quiz.q1.explain"),
  q("physics_lab.doppler_shift.quiz.q1.prompt", "physics_lab.doppler_shift.quiz.q1", 0, "physics_lab.doppler_shift.quiz.q1.explain"),
  q("physics_lab.angular_size.quiz.q1.prompt", "physics_lab.angular_size.quiz.q1", 0, "physics_lab.angular_size.quiz.q1.explain"),
  q("physics_lab.surface_gravity.quiz.q1.prompt", "physics_lab.surface_gravity.quiz.q1", 0, "physics_lab.surface_gravity.quiz.q1.explain"),
  q("physics_lab.density.quiz.q1.prompt", "physics_lab.density.quiz.q1", 0, "physics_lab.density.quiz.q1.explain"),
  q("physics_lab.schwarzschild_radius.quiz.q1.prompt", "physics_lab.schwarzschild_radius.quiz.q1", 0, "physics_lab.schwarzschild_radius.quiz.q1.explain"),
  q("physics_lab.hubble_law.quiz.q1.prompt", "physics_lab.hubble_law.quiz.q1", 0, "physics_lab.hubble_law.quiz.q1.explain"),
  q("physics_lab.parallax.quiz.q1.prompt", "physics_lab.parallax.quiz.q1", 0, "physics_lab.parallax.quiz.q1.explain"),
  q("physics_lab.photon_energy.quiz.q1.prompt", "physics_lab.photon_energy.quiz.q1", 0, "physics_lab.photon_energy.quiz.q1.explain"),
  q("physics_lab.synodic_period.quiz.q1.prompt", "physics_lab.synodic_period.quiz.q1", 0, "physics_lab.synodic_period.quiz.q1.explain"),
  q("physics_lab.rocket_equation.quiz.q1.prompt", "physics_lab.rocket_equation.quiz.q1", 0, "physics_lab.rocket_equation.quiz.q1.explain"),
  q("universe_explorer.quiz.q1.prompt", "universe_explorer.quiz.q1", 1, "universe_explorer.quiz.q1.explain"),
  q("universe_explorer.quiz.q2.prompt", "universe_explorer.quiz.q2", 2, "universe_explorer.quiz.q2.explain"),
  q("universe_explorer.quiz.q3.prompt", "universe_explorer.quiz.q3", 0, "universe_explorer.quiz.q3.explain"),
  q("universe_explorer.quiz.q4.prompt", "universe_explorer.quiz.q4", 0, "universe_explorer.quiz.q4.explain"),
  q("sky_explorer.constellations.ursa_major.quiz.q1.prompt", "sky_explorer.constellations.ursa_major.quiz.q1", 0, "sky_explorer.constellations.ursa_major.quiz.q1.explain"),
  q("sky_explorer.constellations.orion.quiz.q1.prompt", "sky_explorer.constellations.orion.quiz.q1", 0, "sky_explorer.constellations.orion.quiz.q1.explain"),
  q("sky_explorer.constellations.cassiopeia.quiz.q1.prompt", "sky_explorer.constellations.cassiopeia.quiz.q1", 0, "sky_explorer.constellations.cassiopeia.quiz.q1.explain"),
  q("sky_explorer.constellations.ursa_minor.quiz.q1.prompt", "sky_explorer.constellations.ursa_minor.quiz.q1", 0, "sky_explorer.constellations.ursa_minor.quiz.q1.explain"),
  q("sky_explorer.constellations.leo.quiz.q1.prompt", "sky_explorer.constellations.leo.quiz.q1", 0, "sky_explorer.constellations.leo.quiz.q1.explain"),
  q("sky_explorer.constellations.scorpius.quiz.q1.prompt", "sky_explorer.constellations.scorpius.quiz.q1", 0, "sky_explorer.constellations.scorpius.quiz.q1.explain"),
  q("sky_explorer.constellations.taurus.quiz.q1.prompt", "sky_explorer.constellations.taurus.quiz.q1", 0, "sky_explorer.constellations.taurus.quiz.q1.explain"),
  q("sky_explorer.constellations.cygnus.quiz.q1.prompt", "sky_explorer.constellations.cygnus.quiz.q1", 0, "sky_explorer.constellations.cygnus.quiz.q1.explain"),
  q("sky_explorer.constellations.sagittarius.quiz.q1.prompt", "sky_explorer.constellations.sagittarius.quiz.q1", 0, "sky_explorer.constellations.sagittarius.quiz.q1.explain"),
  q("asteroid_hunter.quiz.q1.prompt", "asteroid_hunter.quiz.q1", 0, "asteroid_hunter.quiz.q1.explain"),
  q("asteroid_hunter.classify.quiz.q1.prompt", "asteroid_hunter.classify.quiz.q1", 0, "asteroid_hunter.classify.quiz.q1.explain"),
  q("asteroid_hunter.rotation.quiz.q1.prompt", "asteroid_hunter.rotation.quiz.q1", 0, "asteroid_hunter.rotation.quiz.q1.explain"),
  q("exoplanet_hunter.quiz.q1.prompt", "exoplanet_hunter.quiz.q1", 1, "exoplanet_hunter.quiz.q1.explain"),
  q("exoplanet_hunter.radial_velocity.quiz.q1.prompt", "exoplanet_hunter.radial_velocity.quiz.q1", 0, "exoplanet_hunter.radial_velocity.quiz.q1.explain"),
  q("exoplanet_hunter.habitable_zone.quiz.q1.prompt", "exoplanet_hunter.habitable_zone.quiz.q1", 0, "exoplanet_hunter.habitable_zone.quiz.q1.explain"),
  q("stellar_detective.quiz.q1.prompt", "stellar_detective.quiz.q1", 2, "stellar_detective.quiz.q1.explain"),
];

export function shuffledPool(seed) {
  const arr = [...TRIVIA_POOL];
  let s = seed;
  function rand() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
