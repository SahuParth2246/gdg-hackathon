// Sprint indicator: shows a ⚡ SPRINT badge while Ctrl+W is held.
// Reads from window.__home.player.mode and the input state each frame.
// No engine files modified.

export function initSprintIndicator() {
  // Create the badge element
  const el = document.createElement('div');
  el.id = 'sprintBadge';
  el.setAttribute('aria-live', 'off');
  el.setAttribute('aria-hidden', 'true');
  el.textContent = '⚡ SPRINT';
  el.hidden = true;
  document.body.appendChild(el);

  // Inject CSS
  const style = document.createElement('style');
  style.textContent = `
#sprintBadge {
  position: fixed;
  left: max(16px, env(safe-area-inset-left));
  bottom: calc(max(16px, env(safe-area-inset-bottom)) + 76px);
  z-index: 15;
  padding: 4px 10px 4px 8px;
  background: rgba(10, 12, 10, 0.82);
  border: 2px solid #4cd137;
  box-shadow: 0 0 0 1px #000, 0 0 10px rgba(76, 209, 55, 0.35);
  color: #4cd137;
  font: 700 12px/1.4 'Silkscreen', 'Press Start 2P', monospace;
  letter-spacing: 1px;
  text-shadow: 0 0 8px rgba(76, 209, 55, 0.7);
  pointer-events: none;
  user-select: none;
  animation: sprint-pulse 0.5s ease-in-out infinite alternate;
}
#sprintBadge[hidden] { display: none; }
@keyframes sprint-pulse {
  from { border-color: #4cd137; box-shadow: 0 0 0 1px #000, 0 0 8px rgba(76, 209, 55, 0.3); }
  to   { border-color: #6be855; box-shadow: 0 0 0 1px #000, 0 0 16px rgba(76, 209, 55, 0.6); }
}
body.plain #sprintBadge,
body.hero-on #sprintBadge { display: none; }
@media (max-width: 720px), (max-height: 520px) {
  #sprintBadge { bottom: calc(max(12px, env(safe-area-inset-bottom)) + 72px); font-size: 11px; }
}
  `;
  document.head.appendChild(style);

  let visible = false;

  function update() {
    requestAnimationFrame(update);
    const h = window.__home;
    if (!h?.player || document.body.classList.contains('hero-on') || document.body.classList.contains('plain')) {
      if (visible) { el.hidden = true; visible = false; }
      return;
    }
    // Sprint = ground mode + speed above walk threshold (player is sprinting)
    const sprinting = h.player.mode === 'ground' && h.player.moving &&
      !h.player.travelling && h.player.sprinting;
    if (sprinting !== visible) {
      el.hidden = !sprinting;
      visible = sprinting;
    }
  }

  requestAnimationFrame(update);
}

