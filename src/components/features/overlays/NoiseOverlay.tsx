/** Fine film grain laid over the whole page. Purely decorative. */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'url(/noise.png)',
        opacity: 0.02,
        pointerEvents: 'none',
        zIndex: 99_996,
      }}
    />
  );
}
