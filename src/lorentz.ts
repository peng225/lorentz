// ----------------------------------------
// Lorentz transform
// ----------------------------------------

export function lorentzTransform(
  x: number,
  ct: number,
  beta: number,
) {
  const gamma = 1 / Math.sqrt(1 - beta * beta);

  return {
    x: gamma * (x - beta * ct),
    ct: gamma * (ct - beta * x),
  };
}
