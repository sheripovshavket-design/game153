/* Atmospheric soundtrack addon — no external audio files required. */
(() => {
  'use strict';
  if (window.__atmosphereMusicInstalled) return;
  window.__atmosphereMusicInstalled = true;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  let ctx, master, timer, step = 0, playing = false;
  let mode = 'menu';
  const notes = {
    menu: [220, 261.63, 329.63, 293.66, 196, 246.94, 293.66, 261.63],
    adventure: [196, 246.94, 293.66, 392, 349.23, 293.66, 246.94, 220],
    boss: [164.81, 196, 174.61, 146.83, 164.81, 220, 196, 146.83]
  };
  const stored = (() => { try { return localStorage.getItem('gameAtmosphereMuted') === '1'; } catch { return false; } })();
  let muted = stored;

  function init() {
    if (ctx) return;
    ctx = new AudioContextClass();
    master = ctx.createGain();
    master.gain.value = 0.15;
    master.connect(ctx.destination);
  }
  function tone(freq, duration, volume, wave = 'sine', delay = 0) {
    if (!ctx || !master) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), now + 0.09);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain); gain.connect(master);
    osc.start(now); osc.stop(now + duration + 0.02);
  }
  function tick() {
    if (!playing || muted || !ctx) return;
    const seq = notes[mode] || notes.menu;
    const n = seq[step % seq.length];
    tone(n, mode === 'boss' ? 0.42 : 1.15, mode === 'boss' ? 0.09 : 0.075, 'sine');
    tone(n / 2, 1.25, 0.04, 'triangle');
    if (step % 4 === 0) tone(n / 4, 2.6, 0.035, 'sine');
    step++;
  }
  function interval() { return mode === 'boss' ? 350 : mode === 'adventure' ? 640 : 850; }
  function schedule() {
    clearInterval(timer);
    if (!playing || muted) return;
    tick(); timer = setInterval(tick, interval());
  }
  function updateButton() {
    const b = document.getElementById('atmosphere-music-toggle');
    if (b) {
      b.textContent = muted ? '🔇 Музыка выкл.' : '🔊 Музыка вкл.';
      b.setAttribute('aria-pressed', String(!muted));
    }
  }
  async function start() {
    init();
    try { await ctx.resume(); } catch { return; }
    playing = true;
    schedule(); updateButton();
  }
  function setMode(next) {
    if (!notes[next] || next === mode) return;
    mode = next; step = 0; schedule();
  }
  function toggle() {
    muted = !muted;
    try { localStorage.setItem('gameAtmosphereMuted', muted ? '1' : '0'); } catch {}
    if (!muted) start(); else { clearInterval(timer); updateButton(); }
  }
  function makeButton() {
    if (document.getElementById('atmosphere-music-toggle')) return;
    const b = document.createElement('button');
    b.id = 'atmosphere-music-toggle'; b.type = 'button';
    b.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:2147483647;background:#19243c;color:white;border:1px solid #7c8db5;border-radius:12px;padding:10px 14px;font:600 14px system-ui;cursor:pointer;box-shadow:0 4px 15px #0006';
    b.addEventListener('click', toggle);
    document.body.appendChild(b); updateButton();
  }
  // Browser audio can only start after a user interaction.
  function firstInteraction() {
    if (!muted) start();
    document.removeEventListener('pointerdown', firstInteraction);
    document.removeEventListener('keydown', firstInteraction);
  }
  document.addEventListener('pointerdown', firstInteraction);
  document.addEventListener('keydown', firstInteraction);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', makeButton);
  else makeButton();
  // Optional integration with existing game: call gameAtmosphereMusic.setMode('menu'|'adventure'|'boss').
  window.gameAtmosphereMusic = { start, setMode, toggle, getMode: () => mode };
  // Best-effort mode detection without changing any game logic.
  const observer = new MutationObserver(() => {
    const text = (document.body?.innerText || '').slice(0, 4500).toLowerCase();
    if (/битва с боссом|boss fight|босс атакует|сражение с боссом/.test(text)) setMode('boss');
    else if (/выбери героя|выбор героя|главное меню|начать игру/.test(text)) setMode('menu');
    else if (/уровень|вопрос|локация|level/.test(text)) setMode('adventure');
  });
  const observe = () => { if (document.body) observer.observe(document.body, { childList: true, subtree: true }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observe);
  else observe();
})();
