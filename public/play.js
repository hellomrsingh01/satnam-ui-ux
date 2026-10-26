// Ship It: a full-screen platformer in the Side Quest sticker style.
// The designer (the cobalt blob from the homepage runner) runs through one
// level. Idea blocks hide chai and teammates, who follow you and take a hit
// for you. A "Level up" block grows the hero. Every blocker acts out its
// name: Scope creep grows, One more round comes back, Design by committee
// splits up, Late feedback turns up behind you, Vague brief is blurry,
// Missing specs guards a bridge that is still TBD, Pixel pushing shoves.
// Physics runs on a fixed 120 Hz step in px/s, so it plays the same on every
// screen. Sound effects are synthesised with Web Audio; the background music
// is local/audio/8-bit-adventure.mp3 (FesliyanStudios.com), loaded on start.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ?peek: the sneak peek embedded on the homepage and 404. No UI; the hero
  // plays the level on autopilot, forever.
  const peek = new URLSearchParams(location.search).has('peek');
  const coarse = !peek && matchMedia('(pointer: coarse)').matches;
  if (coarse) document.documentElement.classList.add('coarse');
  if (peek) document.documentElement.classList.add('peek');
  // Slow connection or data saver (Chromium reports it): skip the 3.3 MB music
  // unless the player asks for it, and keep the homepage peek a still frame.
  const conn = navigator.connection;
  const slow = !!conn && (conn.saveData || /2g|3g/.test(conn.effectiveType || ''));
  // Colors come from the design tokens. Read them again once styles.css has
  // applied, since a deferred script can run before the stylesheet does.
  const C = {};
  const tokens = () => {
    const root = getComputedStyle(document.documentElement);
    ['cream', 'cream-2', 'ink', 'ink-2', 'muted', 'cobalt', 'tomato', 'sun', 'mint', 'lilac', 'pink'].forEach((k) => (C[k] = root.getPropertyValue(`--${k}`).trim()));
    return !!C.ink;
  };
  tokens();

  const canvas = $('.world');
  const ctx = canvas.getContext('2d');
  const FONT = '700 15px "Bricolage Grotesque", sans-serif';
  const HAND = '600 16px "Shantell Sans", cursive';

  // World units: one tile is 40px. The level is 15 rows tall; ground starts at row 13.
  const T = 40, ROWS = 15, GY = 13, COLS = 224;
  const GRAV = 2400, JUMP = 1000, CUT = 0.45, RUN = 240, ACC = 1500, AIR = 1000, FRIC = 1900, FALL = 1000;
  const COYOTE = 0.1, BUFFER = 0.13, STEP = 1 / 120;
  const SMALL = 34, BIG = 48, PW = 28;
  const FLAGX = 200, CHECKX = 112, HOUSEX = 205;
  const LABEL = { scope: 'Scope creep', vague: 'Vague brief', committee: 'Design by committee', specs: 'Missing specs', late: 'Late feedback', push: 'Pixel pushing', round: 'One more round' };
  const TINT = { scope: 'tomato', vague: 'lilac', committee: 'mint', specs: 'pink', late: 'sun', push: 'lilac', round: 'pink', minion: 'mint' };
  const MATES = ['mint', 'pink', 'sun', 'lilac'];
  const MAX_TEAM = 4, GAP = 9; // teammates follow 9 trail points (about 27px) apart
  const SIGNS = [[1, 'Pixels need a business case'], [50, 'Level up the team, not the title'], [95, 'AI for speed, humans for taste'],
    [124, 'Prototypes speak every language'], [171, 'If it can’t be measured, it’s a mood board'], [212, 'Powered by chai and user interviews']];
  // D is a "TBD" tile: drawn dashed, and not solid. R hides a teammate (it looks like "?").
  const SOLID = new Set(['#', 'B', '?', 'L', 'R', 'U', 'S', 'T', 't', 'P', 'p']);

  let grid, enemies, chais, powerups, popups, parts, bumps, team = [], trail = [], lost = [];
  let p, camX = 0, scale = 1, offY = 0, viewW = 0, viewH = 0, dpr = 1;
  let state = 'start', time = 0, clock = 0, last = 0, raf = 0;
  let chai = 0, shipped = 0, lives = 3, check = null, saved = { chai: 0, shipped: 0, team: 0 };
  let deadT = 0, endT = 0, flagY = 0, checkHit = false, shake = 0, freeze = 0, tbdSeen = false;
  let best = 0;
  try { best = +localStorage.getItem('sq-platform-best') || 0; } catch {}

  // ---------- Sound: tiny chiptune effects, synthesised on the fly ----------
  // Effects run through their own bus. The background music sits well under
  // them and ducks for a moment whenever an effect plays, so effects always read.
  const MUSIC_VOL = 0.2, MUSIC_DUCK = 0.07;
  const music = $('[data-music]');
  let actx = null, muted = false, sfxBus = null, musicGain = null, fading = false, musicOn = !slow, musicSaved = false;
  try {
    muted = localStorage.getItem('sq-sound') === 'off';
    const m = localStorage.getItem('sq-music');
    if (m) { musicOn = m === 'on'; musicSaved = true; }
  } catch {}
  const audio = () => {
    if (peek || muted) return null;
    if (!actx) {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return null;
      actx = new A();
      sfxBus = actx.createGain(); sfxBus.gain.value = 1; sfxBus.connect(actx.destination);
    }
    if (actx.state === 'suspended') actx.resume();
    return actx;
  };
  const duck = (a, dur) => {
    if (!musicGain || fading) return;
    const g = musicGain.gain, t = a.currentTime;
    g.cancelScheduledValues(t);
    g.setTargetAtTime(MUSIC_DUCK, t, 0.015);
    g.setTargetAtTime(MUSIC_VOL, t + dur + 0.08, 0.18);
  };
  // Music goes through Web Audio too: iOS ignores <audio>.volume, a gain node it respects.
  const playMusic = (restart) => {
    if (peek || muted || !musicOn || !music) return;
    const a = audio(); if (!a) return;
    fading = false;
    if (!musicGain) {
      try {
        musicGain = a.createGain(); musicGain.gain.value = MUSIC_VOL;
        a.createMediaElementSource(music).connect(musicGain).connect(a.destination);
      } catch { musicGain = null; music.volume = MUSIC_VOL; }
    }
    if (musicGain) { musicGain.gain.cancelScheduledValues(a.currentTime); musicGain.gain.setValueAtTime(MUSIC_VOL, a.currentTime); }
    if (restart) music.currentTime = 0;
    music.play().catch(() => {});
  };
  const stopMusic = (fade = 0) => {
    if (!music || music.paused) return;
    if (fade && musicGain && actx) {
      fading = true;
      musicGain.gain.cancelScheduledValues(actx.currentTime);
      musicGain.gain.setTargetAtTime(0.0001, actx.currentTime, fade / 4);
      setTimeout(() => { if (fading) music.pause(); }, fade * 1000);
    } else music.pause();
  };
  const tone = (f0, f1, dur, type = 'square', vol = 0.08, delay = 0) => {
    const a = audio(); if (!a) return;
    const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(sfxBus);
    o.start(t); o.stop(t + dur + 0.02);
    duck(a, delay + dur);
  };
  const noise = (dur, vol = 0.12) => {
    const a = audio(); if (!a) return;
    const buf = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = a.createBufferSource(), g = a.createGain();
    src.buffer = buf; g.gain.value = vol;
    src.connect(g).connect(sfxBus); src.start();
    duck(a, dur);
  };
  const notes = (fs, step, type = 'square', vol = 0.06, dur = 0.1) => fs.forEach((f, i) => tone(f, f, dur, type, vol, i * step));
  const SFX = {
    jump: () => tone(320, 640, 0.13, 'square', 0.05),
    chai: () => { tone(988, 988, 0.07, 'square', 0.05); tone(1319, 1319, 0.16, 'square', 0.05, 0.07); },
    stomp: () => { tone(220, 70, 0.14, 'square', 0.08); noise(0.07, 0.1); },
    bump: () => tone(150, 90, 0.08, 'triangle', 0.14),
    brick: () => noise(0.2, 0.16),
    grow: () => notes([523, 659, 784, 1047], 0.07),
    recruit: () => notes([392, 494, 587, 784, 988], 0.06, 'triangle', 0.12),
    lose: () => { tone(660, 660, 0.1, 'triangle', 0.1); tone(440, 440, 0.2, 'triangle', 0.1, 0.1); },
    hurt: () => tone(420, 140, 0.25, 'sawtooth', 0.05),
    die: () => notes([523, 415, 330, 262], 0.12, 'square', 0.06, 0.14),
    push: () => tone(170, 440, 0.2, 'sine', 0.16),
    ping: () => { tone(1568, 1568, 0.08, 'sine', 0.1); tone(2093, 2093, 0.14, 'sine', 0.08, 0.09); },
    creep: () => tone(110, 70, 0.3, 'square', 0.05),
    revive: () => { tone(330, 330, 0.12, 'square', 0.05); tone(247, 247, 0.22, 'square', 0.05, 0.14); },
    split: () => notes([880, 660, 440], 0.05, 'square', 0.05, 0.06),
    check: () => notes([659, 988], 0.08, 'triangle', 0.1, 0.12),
    flag: () => notes([523, 659, 784, 1047, 784, 1047], 0.11, 'square', 0.05, 0.14),
  };
  const buzz = (ms) => { if (coarse && !reduce) navigator.vibrate?.(ms); };

  // ---------- Level ----------
  const build = () => {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill('.'));
    const set = (x, y, ch) => { if (x >= 0 && x < COLS && y >= 0 && y < ROWS) grid[y][x] = ch; };
    const ground = (a, b) => { for (let x = a; x <= b; x++) for (let y = GY; y < ROWS; y++) set(x, y, '#'); };
    const row = (x, y, s) => [...s].forEach((ch, i) => ch !== ' ' && set(x + i, y, ch));
    const pipe = (x, h) => { for (let y = GY - h; y < GY; y++) { set(x, y, y === GY - h ? 'T' : 'P'); set(x + 1, y, y === GY - h ? 't' : 'p'); } };
    const stairs = (x, n, up = true) => { for (let i = 0; i < n; i++) for (let k = 0; k <= i; k++) set(up ? x + i : x + n - 1 - i, GY - 1 - k, 'S'); };

    ground(0, 66); ground(70, 96); ground(99, 118); ground(122, 146); ground(150, COLS - 1);
    set(97, GY, 'D'); set(98, GY, 'D'); // the bridge Missing specs never finished
    row(15, 9, 'R');
    row(20, 9, 'B?BLB');
    row(22, 5, '?');
    pipe(29, 2); pipe(39, 3); pipe(47, 4); pipe(58, 4);
    row(62, 9, 'BRB');
    row(77, 9, 'BBB'); row(81, 5, 'BBBBBBBB');
    row(91, 5, 'BB?B'); row(94, 9, '?');
    row(100, 9, 'BB'); row(105, 9, '?'); row(108, 9, 'R'); row(111, 9, '?'); row(108, 5, 'L');
    stairs(134, 4); stairs(140, 4, false);
    stairs(150, 4);
    row(158, 9, 'BBRB'); pipe(167, 2); row(174, 9, 'RB?'); pipe(182, 3);
    stairs(189, 8);
    set(FLAGX, GY - 1, 'S');

    // [column, kind, standing row]. Late feedback has no spot: it turns up
    // behind you once you pass its column.
    enemies = [[24, 'push'], [34, 'scope'], [43, 'vague'], [52, 'round'], [63, 'committee'], [75, 'scope'], [85, 'push', 5],
      [92, 'specs'], [104, 'round'], [115, 'committee'], [127, 'vague'], [131, 'scope'], [160, 'committee'], [164, 'round'], [177, 'push']]
      .map(([c, kind, r = GY]) => blocker(kind, c * T, r * T));
    [46, 124, 171].forEach((c) => enemies.push(Object.assign(blocker('late', 0, 0), { hidden: true, trigger: c * T })));

    chais = [];
    const coin = (cx, cy) => chais.push({ x: cx * T + T / 2, y: cy * T + T / 2, got: false });
    [[66, 10], [67, 9], [68, 8], [69, 9], [70, 10]].forEach(([a, b]) => coin(a, b));
    for (let x = 82; x <= 87; x++) coin(x, 4);
    [[118, 10], [119, 9], [120, 8], [121, 9], [122, 10]].forEach(([a, b]) => coin(a, b));
    [[146, 10], [147, 9], [148, 8], [149, 9]].forEach(([a, b]) => coin(a, b));
    for (let x = 9; x <= 12; x++) coin(x, 11);
    for (let x = 34; x <= 36; x++) coin(x, 8);
    for (let x = 52; x <= 54; x++) coin(x, 7);
    for (let x = 101; x <= 103; x++) coin(x, 7);
    for (let x = 137; x <= 139; x++) coin(x, 7);
    for (let x = 192; x <= 195; x++) coin(x, 3);

    powerups = []; popups = []; parts = []; bumps = new Map();
  };

  const blocker = (kind, x, bottom, label = LABEL[kind]) => {
    ctx.font = FONT;
    const lines = kind === 'committee' ? ['Design', 'by', 'committee'] : [label];
    const w = Math.round(Math.max(...lines.map((l) => ctx.measureText(l).width)) + 24);
    const h = kind === 'committee' ? 78 : 34;
    return { kind, label, lines, x, y: bottom - h, w, h, bw: w, bh: h, vx: -48, vy: 0, c: TINT[kind], alive: true, active: false, squash: 0, flip: false,
      onGround: false, g: 1, gt: 0, lives: kind === 'round' ? 2 : 1, down: 0, hidden: false, alert: 0, cd: 0 };
  };

  const tileAt = (tx, ty) => (ty >= ROWS || ty < 0 ? '.' : tx < 0 || tx >= COLS ? '#' : grid[ty][tx]);
  const solid = (tx, ty) => SOLID.has(tileAt(tx, ty));

  // ---------- Collision: move one axis at a time against the tile grid ----------
  const moveX = (b, dx) => {
    b.x += dx;
    const y0 = Math.floor(b.y / T), y1 = Math.floor((b.y + b.h - 0.01) / T);
    if (dx > 0) {
      const tx = Math.floor((b.x + b.w) / T);
      for (let ty = y0; ty <= y1; ty++) if (solid(tx, ty)) { b.x = tx * T - b.w; return true; }
    } else if (dx < 0) {
      const tx = Math.floor(b.x / T);
      for (let ty = y0; ty <= y1; ty++) if (solid(tx, ty)) { b.x = (tx + 1) * T; return true; }
    }
    return false;
  };
  const moveY = (b, dy) => {
    b.y += dy;
    b.onGround = false;
    const x0 = Math.floor(b.x / T), x1 = Math.floor((b.x + b.w - 0.01) / T);
    if (dy > 0) {
      const ty = Math.floor((b.y + b.h) / T);
      for (let tx = x0; tx <= x1; tx++) if (solid(tx, ty)) { b.y = ty * T - b.h; b.vy = 0; b.onGround = true; return null; }
    } else if (dy < 0) {
      const ty = Math.floor(b.y / T);
      let hit = null, bestD = Infinity;
      for (let tx = x0; tx <= x1; tx++) {
        if (!solid(tx, ty)) continue;
        const d = Math.abs(tx * T + T / 2 - (b.x + b.w / 2));
        if (d < bestD) { bestD = d; hit = tx; }
      }
      if (hit !== null) { b.y = (ty + 1) * T; b.vy = 0; return { tx: hit, ty }; }
    }
    return null;
  };
  const overlap = (a, b, pad = 0) => a.x + pad < b.x + b.w && a.x + a.w - pad > b.x && a.y + pad < b.y + b.h && a.y + a.h - pad > b.y;

  // ---------- Effects ----------
  const popup = (x, y, text) => popups.push({ x, y, text, t: 0 });
  const burst = (x, y, colors, n = 8) => {
    if (reduce) return;
    for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - 0.5) * 420, vy: -200 - Math.random() * 380, t: 0, c: colors[i % colors.length], s: 5 + Math.random() * 5 });
  };
  const dust = (x, y) => {
    if (reduce) return;
    [-1, 1].forEach((d) => parts.push({ dust: true, x: x + d * 10, y: y - 4, vx: d * 70, vy: -30, t: 0, s: 6 }));
  };
  const addChai = (x, y) => { chai++; popup(x, y, '+1 chai'); SFX.chai(); hud(); };

  const bump = (tx, ty) => {
    const ch = grid[ty][tx];
    if (!'B?LRU'.includes(ch)) return;
    bumps.set(`${tx},${ty}`, 0);
    if (ch === '?') { grid[ty][tx] = 'U'; addChai(tx * T + T / 2, ty * T - 6); burst(tx * T + T / 2, ty * T, [C.sun, C.cream]); }
    else if (ch === 'R') { grid[ty][tx] = 'U'; recruit(tx * T + T / 2, ty * T); }
    else if (ch === 'L') {
      grid[ty][tx] = 'U';
      if (p.big) addChai(tx * T + T / 2, ty * T - 6);
      else powerups.push({ x: tx * T + 6, y: ty * T, w: 28, h: 28, vx: 90, vy: 0, rise: T, onGround: false });
    } else if (ch === 'B' && p.big) {
      grid[ty][tx] = '.';
      bumps.delete(`${tx},${ty}`);
      burst(tx * T + T / 2, ty * T + T / 2, [C.tomato, C.ink, C.cream], 10);
      shake = 0.15; SFX.brick();
    } else SFX.bump();
    // A blocker standing on a bumped block gets knocked out, like the classics.
    enemies.forEach((e) => {
      if (e.alive && Math.abs(e.y + e.h - ty * T) < 2 && e.x < (tx + 1) * T && e.x + e.w > tx * T) knock(e);
    });
  };
  const knock = (e) => {
    if (e.kind === 'committee') return split(e);
    e.alive = false; e.flip = true; e.vy = -500; shipped++; popup(e.x + e.w / 2, e.y, '+1 stomped'); SFX.stomp(); hud();
  };
  // Design by committee breaks up into three small blockers that scatter.
  const split = (e) => {
    e.alive = false; e.squash = 1;
    popup(e.x + e.w / 2, e.y - 10, 'Committee split up');
    SFX.split();
    e.lines.forEach((word, i) => {
      const m = blocker('minion', e.x + i * (e.w / 3), e.y + e.h, word);
      m.c = MATES[i]; m.active = true; m.vx = [-80, 60, 90][i]; m.vy = -380 - i * 60;
      enemies.push(m);
    });
  };

  // ---------- Team ----------
  const recruit = (x, y) => {
    if (team.length >= MAX_TEAM) { addChai(x, y - 6); return; }
    const c = MATES[team.length % MATES.length];
    team.push({ c, join: 0, fx: x, fy: y, hop: 0 });
    popup(x, y - 16, team.length === 1 ? 'A teammate joined' : 'The team grows');
    burst(x, y, [C[c], C.cream, C.sun], 10);
    SFX.recruit(); hud();
  };
  const mateAt = (i) => trail[Math.min(trail.length - 1, (i + 1) * GAP)] || { x: p.x + p.w / 2, y: p.y + p.h, face: p.face };
  const loseMate = (quiet) => {
    const m = team.pop();
    const at = mateAt(team.length);
    lost.push({ c: m.c, x: at.x, y: at.y - 24, vx: -160 * p.face * (0.6 + Math.random() * 0.8), vy: -560, t: 0 });
    if (!quiet) { popup(p.x + p.w / 2, p.y - 14, 'Took one for the team'); SFX.lose(); }
    hud();
  };
  const track = () => {
    const lastT = trail[0];
    if (!lastT || Math.hypot(lastT.x - (p.x + p.w / 2), lastT.y - (p.y + p.h)) > 3) {
      trail.unshift({ x: p.x + p.w / 2, y: p.y + p.h, face: p.face });
      if (trail.length > (MAX_TEAM + 1) * GAP + 2) trail.pop();
    }
  };

  // ---------- Player ----------
  // Local testing only: ?at=COLUMN starts the run at that column.
  const startAt = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? +new URLSearchParams(location.search).get('at') || 0 : 0;
  const spawn = () => {
    const at = check || { x: (startAt || 3) * T };
    p = { x: at.x, y: GY * T - SMALL, w: PW, h: SMALL, vx: 0, vy: 0, kick: 0, onGround: true, face: 1, big: false, inv: 0, coyote: 0, buffer: 0, squash: 0, walk: 0, dead: false, hidden: false, idle: 0 };
    camX = Math.max(0, p.x - viewW / scale * 0.3);
    trail = []; lost = [];
    team = Array.from({ length: saved.team }, (_, i) => ({ c: MATES[i % MATES.length], join: 1, hop: 0 }));
  };
  const grow = () => { p.big = true; p.y -= BIG - SMALL; p.h = BIG; p.squash = -1; popup(p.x + p.w / 2, p.y - 10, 'Level up!'); burst(p.x + p.w / 2, p.y, [C.mint, C.sun, C.cream], 12); SFX.grow(); };
  // A teammate takes the hit first, then the level-up, then you.
  const hurt = () => {
    if (p.inv > 0 || p.dead) return;
    buzz(40);
    if (team.length) { loseMate(); p.inv = 1.4; shake = 0.15; }
    else if (p.big) { p.big = false; p.y += BIG - SMALL; p.h = SMALL; p.inv = 1.6; shake = 0.2; popup(p.x + p.w / 2, p.y - 10, 'Ouch'); SFX.hurt(); }
    else die(true);
  };
  const die = (hop) => {
    if (p.dead) return;
    // A fall is already off screen, so it respawns sooner than a knock-out.
    p.dead = true; p.vy = hop ? -820 : 0; p.vx = 0; deadT = 0; shake = 0.25; p.deadFor = hop ? 1.2 : 0.7;
    if (!hop) popup(p.x + p.w / 2, ROWS * T - 70, 'Mind the gap');
    while (team.length) loseMate(true);
    SFX.die();
    if (!peek) { lives--; hud(); }
  };

  // ---------- Input ----------
  const keys = { left: false, right: false, jump: false };
  let jumpPressed = false;
  const press = (k, on) => {
    if (k === 'jump' && on && !keys.jump) jumpPressed = true;
    keys[k] = on;
  };
  const KEYMAP = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'jump', ArrowUp: 'jump', KeyW: 'jump', KeyZ: 'jump' };
  addEventListener('keydown', (e) => {
    if (e.target.closest?.('input, textarea')) return; // typing feedback, not playing
    if (e.code === 'KeyP' || e.code === 'Escape') { if (state === 'play') pause(); else if (state === 'pause') resume(); return; }
    if (e.code === 'KeyF' && !e.metaKey && !e.ctrlKey) { full(); return; }
    if (e.code === 'KeyM' && !e.metaKey && !e.ctrlKey) { toggleSound(); return; }
    const k = KEYMAP[e.code];
    if (!k || state !== 'play') return;
    e.preventDefault();
    if (!e.repeat) press(k, true);
  });
  addEventListener('keyup', (e) => { const k = KEYMAP[e.code]; if (k) press(k, false); });
  $$('[data-hold]').forEach((btn) => {
    const k = btn.dataset.hold;
    const down = (e) => { e.preventDefault(); btn.setPointerCapture?.(e.pointerId); btn.classList.add('on'); press(k, true); };
    const up = () => { btn.classList.remove('on'); press(k, false); };
    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('lostpointercapture', up);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  // ---------- Simulation ----------
  const step = (dt) => {
    clock += dt;
    // Hit-stop: a few frozen frames sell the impact of a stomp.
    if (freeze > 0) { freeze -= dt; return; }
    if (state === 'play' && !p.dead) time += dt;
    shake = Math.max(0, shake - dt);
    bumps.forEach((v, k) => (v + dt > 0.22 ? bumps.delete(k) : bumps.set(k, v + dt)));

    if (state === 'flag') stepFlag(dt);
    else if (state === 'win') { /* hero is inside the launch pad */ }
    else if (p.dead) {
      deadT += dt;
      p.vy = Math.min(FALL, p.vy + GRAV * dt);
      p.y += p.vy * dt;
      if (deadT > p.deadFor) {
        if (lives <= 0) return gameOver();
        chai = saved.chai; shipped = saved.shipped; tbdSeen = false;
        build(); spawn(); hud();
      }
    } else stepPlayer(dt);

    stepEnemies(dt);
    stepPowerups(dt);
    popups.forEach((o) => (o.t += dt)); popups = popups.filter((o) => o.t < 0.9);
    parts.forEach((o) => { o.t += dt; if (!o.dust) o.vy += GRAV * 0.6 * dt; o.x += o.vx * dt; o.y += o.vy * dt; });
    parts = parts.filter((o) => o.t < 1.2);
    lost.forEach((o) => { o.t += dt; o.vy += GRAV * 0.8 * dt; o.x += o.vx * dt; o.y += o.vy * dt; });
    lost = lost.filter((o) => o.t < 1.5);
    team.forEach((m) => { m.join = Math.min(1, m.join + dt * 2); });

    // Camera leads the hero a little and never shows past the level edges.
    const vw = viewW / scale;
    const target = Math.min(Math.max(0, p.x - vw * 0.38), COLS * T - vw);
    camX += (target - camX) * Math.min(1, dt * 8);
  };

  // Autopilot for the peek: run right, jump at walls, gaps and blockers.
  let autoJump = 0;
  const autopilot = (dt) => {
    keys.right = true;
    autoJump = Math.max(0, autoJump - dt);
    if (p.onGround && autoJump <= 0) {
      const ahead = Math.floor((p.x + p.w + 14) / T), fy = Math.floor((p.y + p.h - 2) / T);
      const wall = solid(ahead, fy) || solid(ahead, fy - 1);
      const gap = !solid(Math.floor((p.x + p.w + 24) / T), fy + 1);
      const foe = enemies.some((e) => {
        const d = e.x - (p.x + p.w);
        return e.alive && e.active && d > -10 && d < 90 && Math.abs(e.y + e.h - (p.y + p.h)) < 30;
      });
      if (wall || gap || foe) { jumpPressed = true; autoJump = 0.45; }
    }
    keys.jump = autoJump > 0;
  };

  const stepPlayer = (dt) => {
    if (peek) autopilot(dt);
    const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    const a = p.onGround ? ACC : AIR;
    if (dir) { p.vx += dir * a * dt; p.face = dir; }
    else if (p.onGround) { const f = FRIC * dt; p.vx = Math.abs(p.vx) <= f ? 0 : p.vx - Math.sign(p.vx) * f; }
    p.vx = Math.max(-RUN, Math.min(RUN, p.vx));

    p.coyote = p.onGround ? COYOTE : Math.max(0, p.coyote - dt);
    p.buffer = jumpPressed ? BUFFER : Math.max(0, p.buffer - dt);
    jumpPressed = false;
    if (p.buffer > 0 && p.coyote > 0) { p.vy = -JUMP; p.buffer = 0; p.coyote = 0; p.squash = -0.8; SFX.jump(); }
    if (!keys.jump && p.vy < -JUMP * CUT) p.vy = -JUMP * CUT; // short hop on a quick tap

    p.vy = Math.min(FALL, p.vy + GRAV * dt);
    p.kick *= Math.pow(0.86, dt * 60);
    if (moveX(p, (p.vx + p.kick) * dt)) { p.vx = 0; p.kick = 0; }
    if (p.x < camX) { p.x = camX; p.vx = Math.max(0, p.vx); }
    const wasAir = !p.onGround, fall = p.vy;
    const head = moveY(p, p.vy * dt);
    if (head) bump(head.tx, head.ty);
    if (p.onGround && wasAir) {
      p.squash = 0.7;
      if (fall > 500) dust(p.x + p.w / 2, p.y + p.h);
    }
    track(); // the team walks the exact path you took, so they jump where you jumped
    p.idle = Math.abs(p.vx) < 5 && p.onGround ? p.idle + dt : 0;
    p.squash *= Math.pow(0.82, dt * 60);
    p.walk += Math.abs(p.vx) * dt;
    p.inv = Math.max(0, p.inv - dt);

    chais.forEach((c) => {
      if (!c.got && Math.abs(c.x - (p.x + p.w / 2)) < 22 && Math.abs(c.y - (p.y + p.h / 2)) < p.h / 2 + 12) { c.got = true; addChai(c.x, c.y - 14); }
    });

    if (!checkHit && p.x > CHECKX * T) {
      checkHit = true; check = { x: CHECKX * T + 8 }; saved = { chai, shipped, team: team.length };
      popup(CHECKX * T + 20, (GY - 3) * T, 'Checkpoint saved');
      SFX.check();
    }
    if (!tbdSeen && p.y + p.h > GY * T + 8 && p.x > 96 * T && p.x < 99 * T) { tbdSeen = true; popup(p.x + p.w / 2, GY * T - 30, 'That spec was TBD'); }
    if (p.x + p.w > FLAGX * T + T / 2 - 3) startFlag();
    if (p.y > ROWS * T + 60) die(false);
  };

  const stepEnemies = (dt) => {
    const vw = viewW / scale;
    enemies.forEach((e) => {
      if (e.hidden) {
        // Late feedback: arrives from above, behind you, once you think you're past it.
        if (state !== 'play' || p.dead || p.x < e.trigger) return;
        e.hidden = false; e.active = true; e.alert = 1.4;
        e.x = Math.max(camX + 20, p.x - 300); e.y = (GY - 9) * T; e.vy = 0; e.vx = 95;
        popup(e.x + e.w / 2, e.y - 16, 'Late feedback!');
        SFX.ping();
        return;
      }
      if (!e.active) { if (e.x < camX + vw + T * 2) e.active = true; else return; }
      e.alert = Math.max(0, e.alert - dt); e.cd = Math.max(0, e.cd - dt);
      if (e.flip) { e.vy += GRAV * dt; e.y += e.vy * dt; return; }
      if (!e.alive) { e.squash += dt; return; }
      if (e.down > 0) {
        // One more round: flattened, then back on its feet for another go.
        e.down -= dt;
        if (e.down <= 0) {
          e.h = e.bh; e.y -= e.bh - 12; e.vy = -420; e.c = 'tomato'; e.vx = 75 * (p.x < e.x ? -1 : 1);
          popup(e.x + e.w / 2, e.y - 14, '...one more round?');
          SFX.revive();
        }
        return;
      }
      // Scope creep grows a size every few seconds while it's on screen.
      if (e.kind === 'scope' && e.g < 1.9 && e.x < camX + vw) {
        e.gt += dt;
        if (e.gt > 2.6) {
          e.gt = 0; e.g = Math.min(1.9, e.g + 0.3);
          const nw = Math.round(e.bw * e.g), nh = Math.round(e.bh * e.g);
          e.x -= (nw - e.w) / 2; e.y -= nh - e.h; e.w = nw; e.h = nh;
          popup(e.x + e.w / 2, e.y - 14, 'Scope +30%');
          SFX.creep();
        }
      }
      e.vy = Math.min(FALL, e.vy + GRAV * dt);
      if (moveX(e, e.vx * dt)) e.vx = -e.vx;
      moveY(e, e.vy * dt);
      // Turn at ledges so blockers patrol their platform. Late feedback and the
      // committee's leftovers just walk off.
      if (e.onGround && e.kind !== 'late' && e.kind !== 'minion') {
        const fx = e.vx < 0 ? e.x - 2 : e.x + e.w + 2;
        if (!solid(Math.floor(fx / T), Math.floor((e.y + e.h + 4) / T))) e.vx = -e.vx;
      }
    });
    const live = enemies.filter((e) => e.alive && e.active);
    for (let i = 0; i < live.length; i++) for (let j = i + 1; j < live.length; j++) {
      const a = live[i], b = live[j];
      if (overlap(a, b)) { const s = Math.sign(a.x - b.x) || 1; a.vx = Math.abs(a.vx) * s; b.vx = -Math.abs(b.vx) * s; }
    }
    if (!p.dead && state === 'play') live.forEach((e) => {
      if (e.down > 0 || !overlap(p, e, 3)) return;
      const fromAbove = p.vy > 0 && p.y + p.h - e.y < 18 + (e.g - 1) * 10;
      if (fromAbove) {
        p.vy = -JUMP * (keys.jump ? 0.75 : 0.5);
        freeze = 0.06; buzz(25);
        burst(e.x + e.w / 2, e.y + e.h, [C[e.c], C.ink], 6);
        if (e.kind === 'committee') return split(e);
        if (e.lives > 1) {
          e.lives--; e.down = 0.9; e.y += e.h - 12; e.h = 12;
          popup(e.x + e.w / 2, e.y - 14, 'Done?');
          SFX.stomp();
          return;
        }
        e.alive = false; e.squash = 0; shipped++;
        popup(e.x + e.w / 2, e.y - 8, '+1 stomped');
        SFX.stomp(); hud();
      } else if (e.kind === 'push') {
        // Pixel pushing doesn't hurt. It just nudges you back a step.
        if (e.cd > 0) return;
        e.cd = 0.5;
        p.kick = (p.x + p.w / 2 < e.x + e.w / 2 ? -1 : 1) * 560; p.vy = -380;
        popup(p.x + p.w / 2, p.y - 12, 'Nudge');
        SFX.push(); buzz(15);
      } else hurt();
    });
    enemies = enemies.filter((e) => e.hidden || ((e.alive || (e.flip ? e.y < ROWS * T + 200 : e.squash < 0.45)) && e.y < ROWS * T + 200));
  };

  const stepPowerups = (dt) => {
    powerups.forEach((u) => {
      if (u.rise > 0) { const d = Math.min(u.rise, 60 * dt); u.y -= d; u.rise -= d; return; }
      u.vy = Math.min(FALL, u.vy + GRAV * dt);
      if (moveX(u, u.vx * dt)) u.vx = -u.vx;
      moveY(u, u.vy * dt);
      if (!p.dead && overlap(p, u)) { u.got = true; grow(); }
    });
    powerups = powerups.filter((u) => !u.got && u.y < ROWS * T + 100);
  };

  // ---------- Finish: slide down the launch flag, walk into the launch pad ----------
  const startFlag = () => {
    state = 'flag'; endT = 0;
    p.vx = 0; p.vy = 0; p.x = FLAGX * T + T / 2 - p.w + 2; p.face = 1;
    flagY = (GY - 10) * T + 8;
    popup(p.x, p.y - 20, 'Shipped!');
    stopMusic(0.5); // fade out so the launch fanfare has the stage
    SFX.flag();
  };
  const stepFlag = (dt) => {
    endT += dt;
    const base = (GY - 1) * T - p.h;
    const flagBase = (GY - 2) * T - 30;
    flagY = Math.min(flagBase, flagY + 420 * dt);
    track();
    if (p.y < base) { p.y = Math.min(base, p.y + 320 * dt); return; }
    // Hop off the base block and walk to the door.
    if (!p.onGround || p.x < FLAGX * T + T) {
      p.vx = 150; p.vy = Math.min(FALL, p.vy + GRAV * dt);
      moveX(p, p.vx * dt); moveY(p, p.vy * dt);
      p.walk += p.vx * dt;
      return;
    }
    const door = (HOUSEX + 2.5) * T - p.w / 2;
    if (p.x < door) { p.vx = 150; p.x = Math.min(door, p.x + 150 * dt); p.walk += 150 * dt; return; }
    if (!p.hidden) {
      p.hidden = true; endT = 0;
      for (let i = 0; i < 4; i++) setTimeout(() => burst((HOUSEX + 2.5) * T + (Math.random() - 0.5) * 200, (GY - 6) * T, [C.sun, C.tomato, C.mint, C.lilac, C.pink], 16), i * 220);
    }
    if (endT > 1.1) win();
  };

  // ---------- Drawing ----------
  const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
  const sticker = (x, y, w, h, r, fill, sh = 4) => {
    ctx.fillStyle = C.ink; rr(x + sh, y + sh, w, h, r); ctx.fill();
    ctx.fillStyle = fill; rr(x, y, w, h, r); ctx.fill(); ctx.stroke();
  };

  const drawSky = () => {
    ctx.fillStyle = C.cream;
    ctx.fillRect(0, 0, viewW, viewH);
    const s = scale;
    // Sun, fixed to the screen.
    ctx.save();
    ctx.translate(viewW - 110 * Math.min(1, s), 120 * Math.min(1, s) + 30 + (viewW <= 520 ? 80 : 0)); // below the phone HUD's second row
    ctx.scale(Math.min(1, s), Math.min(1, s));
    ctx.rotate(reduce ? 0 : clock * 0.25);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    for (let i = 0; i < 10; i++) { ctx.rotate(Math.PI / 5); ctx.beginPath(); ctx.moveTo(0, 50); ctx.lineTo(0, 64); ctx.stroke(); }
    ctx.fillStyle = C.sun; ctx.beginPath(); ctx.arc(0, 0, 40, 0, 7); ctx.fill(); ctx.stroke();
    ctx.restore();
  };

  // Parallax hills and clouds, drawn in world space with their own scroll factor.
  const drawBackdrop = () => {
    const hills = [C.lilac, C.pink, C.mint];
    const k = 0.35, off = camX * k;
    const top = (GY) * T;
    ctx.save();
    ctx.translate(camX - off, 0);
    ctx.lineWidth = 2.5; ctx.strokeStyle = C.ink;
    const first = Math.floor(off / 460) - 1;
    for (let i = first; i < first + Math.ceil(viewW / scale / 460) + 3; i++) {
      const x = i * 460, h = 110 + ((i * 53) % 3) * 40, w = 340 + ((i * 31) % 2) * 80;
      ctx.fillStyle = hills[((i % 3) + 3) % 3];
      ctx.beginPath();
      ctx.moveTo(x, top + 2);
      ctx.bezierCurveTo(x + w * 0.12, top - h, x + w * 0.88, top - h, x + w, top + 2);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.ink;
      ctx.globalAlpha = 0.18;
      ctx.beginPath(); ctx.arc(x + w * 0.38, top - h * 0.45, 4, 0, 7); ctx.arc(x + w * 0.56, top - h * 0.6, 3, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    const kc = 0.15, offc = camX * kc;
    ctx.save();
    ctx.translate(camX - offc, 0);
    const firstC = Math.floor(offc / 620) - 1;
    for (let i = firstC; i < firstC + Math.ceil(viewW / scale / 620) + 3; i++) {
      const x = i * 620 + ((i * 97) % 200), y = 90 + ((i * 41) % 3) * 50 + (reduce ? 0 : Math.sin(clock * 0.6 + i) * 4);
      // A flat, rounded base with three puffs on top. Outline every shape
      // thick, then fill them all: one clean silhouette with no seams.
      const puffs = () => {
        ctx.beginPath();
        ctx.roundRect(x, y, 124, 30, 15);
        [[32, 6, 22], [64, -6, 30], [96, 8, 20]].forEach(([cx, cy, r]) => { ctx.moveTo(x + cx + r, y + cy); ctx.arc(x + cx, y + cy, r, 0, Math.PI * 2); });
      };
      ctx.strokeStyle = C.ink; ctx.lineWidth = 5; puffs(); ctx.stroke();
      ctx.fillStyle = C.cream; puffs(); ctx.fill();
    }
    ctx.restore();
  };

  const drawSigns = () => {
    ctx.font = HAND; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    SIGNS.forEach(([c, text]) => {
      const w = ctx.measureText(text).width + 30, x = c * T, y = GY * T;
      if (x + w < camX - 50 || x > camX + viewW / scale + 50) return;
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5;
      ctx.fillStyle = C['ink-2']; ctx.fillRect(x + w / 2 - 4, y - 54, 8, 54); ctx.strokeRect(x + w / 2 - 4, y - 54, 8, 54);
      ctx.save(); ctx.translate(x + w / 2, y - 70); ctx.rotate(c % 2 ? -0.025 : 0.02);
      sticker(-w / 2, -20, w, 40, 10, C.cream, 3);
      ctx.fillStyle = C.ink; ctx.fillText(text, 0, 1);
      ctx.restore();
    });
  };

  // The soil's dots: one small tile drawn once, then a single pattern fill per
  // stretch of ground (it used to be ~2,000 separate dots every frame).
  let soilPat = null;
  const soil = () => {
    if (soilPat) return soilPat;
    const k = 4, c = document.createElement('canvas');
    c.width = 34 * k; c.height = 52 * k;
    const g = c.getContext('2d');
    g.scale(k, k); g.fillStyle = C.ink; g.globalAlpha = 0.14;
    [[9, 14], [26, 40]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill(); });
    soilPat = ctx.createPattern(c, 'repeat');
    soilPat.setTransform?.(new DOMMatrix([1 / k, 0, 0, 1 / k, 0, 0]));
    return soilPat;
  };
  const drawGround = () => {
    const x0 = Math.max(0, Math.floor(camX / T) - 1), x1 = Math.min(COLS - 1, Math.ceil((camX + viewW / scale) / T) + 1);
    ctx.lineWidth = 2.5; ctx.strokeStyle = C.ink;
    // One sticker per stretch of ground, with a mint grass band on top.
    let a = null;
    for (let x = x0; x <= x1 + 1; x++) {
      const g = x <= x1 && grid[GY][x] === '#';
      if (g && a === null) a = x;
      if (!g && a !== null) {
        const gx = a * T, gw = (x - a) * T, gy = GY * T;
        ctx.fillStyle = C['cream-2']; rr(gx, gy, gw, (ROWS - GY) * T + 600, 12); ctx.fill(); ctx.stroke();
        ctx.fillStyle = soil(); ctx.fillRect(gx + 4, gy + 18, gw - 8, (ROWS - GY) * T + 400);
        ctx.fillStyle = C.mint; rr(gx, gy, gw, 16, [12, 12, 6, 6]); ctx.fill(); ctx.stroke();
        a = null;
      }
    }
    // TBD tiles: a wireframe of the bridge nobody specced. Not solid.
    for (let x = x0; x <= x1; x++) {
      if (grid[GY][x] !== 'D') continue;
      ctx.save();
      ctx.setLineDash([6, 5]); ctx.strokeStyle = C.muted; ctx.lineWidth = 2;
      rr(x * T + 3, GY * T + 2, T - 6, T - 6, 6); ctx.stroke();
      ctx.fillStyle = C.muted; ctx.font = '700 10px "Space Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('TBD', x * T + T / 2, GY * T + T / 2 - 1);
      ctx.restore();
    }
  };

  const drawTiles = () => {
    const x0 = Math.max(0, Math.floor(camX / T) - 1), x1 = Math.min(COLS - 1, Math.ceil((camX + viewW / scale) / T) + 1);
    ctx.lineWidth = 2.5; ctx.strokeStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let ty = 0; ty < GY; ty++) for (let tx = x0; tx <= x1; tx++) {
      const ch = grid[ty][tx];
      if (ch === '.') continue;
      const b = bumps.size ? bumps.get(`${tx},${ty}`) : undefined;
      const lift = b !== undefined ? Math.sin((b / 0.22) * Math.PI) * 10 : 0;
      const x = tx * T, y = ty * T - lift;
      if (ch === 'B') {
        sticker(x + 1, y + 1, T - 2, T - 2, 7, C.tomato, 3);
        ctx.beginPath();
        ctx.moveTo(x + 3, y + T / 2); ctx.lineTo(x + T - 3, y + T / 2);
        ctx.moveTo(x + T / 2, y + 2); ctx.lineTo(x + T / 2, y + T / 2);
        ctx.moveTo(x + T / 4, y + T / 2); ctx.lineTo(x + T / 4, y + T - 2);
        ctx.moveTo(x + T * 0.75, y + T / 2); ctx.lineTo(x + T * 0.75, y + T - 2);
        ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 2.5;
      } else if (ch === '?' || ch === 'L' || ch === 'R') {
        const bob = reduce ? 0 : Math.sin(clock * 3 + tx) * 1.5;
        sticker(x + 1, y + 1 + bob, T - 2, T - 2, 8, C.sun, 3);
        ctx.fillStyle = C.ink; ctx.font = '800 24px "Bricolage Grotesque", sans-serif';
        ctx.fillText('?', x + T / 2, y + T / 2 + 2 + bob);
      } else if (ch === 'U') {
        sticker(x + 1, y + 1, T - 2, T - 2, 8, C['cream-2'], 3);
        ctx.fillStyle = C.muted;
        [[10, 10], [30, 10], [10, 30], [30, 30]].forEach(([a, c]) => { ctx.beginPath(); ctx.arc(x + a, y + c, 2, 0, 7); ctx.fill(); });
      } else if (ch === 'S') {
        sticker(x + 1, y + 1, T - 2, T - 2, 6, C.lilac, 3);
        ctx.beginPath(); ctx.moveTo(x + 8, y + 9); ctx.lineTo(x + T - 9, y + 9); ctx.lineWidth = 2; ctx.stroke(); ctx.lineWidth = 2.5;
      } else if (ch === 'T') {
        let h = 1; while (tileAt(tx, ty + h) === 'P') h++;
        sticker(x + 6, y + 14, 2 * T - 12, h * T - 14, 6, C.mint, 0);
        ctx.fillStyle = C.cream; ctx.globalAlpha = 0.55; ctx.fillRect(x + 14, y + 20, 8, h * T - 22); ctx.globalAlpha = 1;
        sticker(x, y, 2 * T, 22, 8, C.mint, 3);
        ctx.fillStyle = C.cream; ctx.globalAlpha = 0.55; ctx.fillRect(x + 8, y + 5, 10, 12); ctx.globalAlpha = 1;
      }
    }
  };

  const drawCup = (x, y, s = 1, t = 0) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.lineWidth = 2.2; ctx.strokeStyle = C.ink; ctx.lineJoin = 'round';
    if (!reduce) {
      ctx.beginPath();
      for (let i = -1; i <= 1; i += 2) { const o = Math.sin(clock * 4 + t + i) * 2; ctx.moveTo(i * 4, -14); ctx.quadraticCurveTo(i * 4 + o + 3, -18, i * 4, -22); }
      ctx.lineWidth = 1.6; ctx.stroke(); ctx.lineWidth = 2.2;
    }
    ctx.beginPath(); ctx.arc(10, 0, 5, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.fillStyle = C.cream;
    ctx.beginPath(); ctx.moveTo(-11, -10); ctx.lineTo(11, -10); ctx.lineTo(8, 11); ctx.lineTo(-8, 11); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.sun;
    ctx.beginPath(); ctx.moveTo(-10.2, -5); ctx.lineTo(10.2, -5); ctx.lineTo(9, 4); ctx.lineTo(-9, 4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-11, -10); ctx.lineTo(11, -10); ctx.lineTo(8, 11); ctx.lineTo(-8, 11); ctx.closePath(); ctx.stroke();
    ctx.restore();
  };

  const drawEyes = (ex, ey, look = -1, grumpy = true, r = 5) => {
    ctx.fillStyle = C.cream;
    ctx.beginPath(); ctx.arc(ex, ey, r, 0, 7); ctx.arc(ex + r * 2.4, ey, r, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.ink;
    ctx.beginPath(); ctx.arc(ex + look * 1.6, ey + 1, r * 0.42, 0, 7); ctx.arc(ex + r * 2.4 + look * 1.6, ey + 1, r * 0.42, 0, 7); ctx.fill();
    if (grumpy) { ctx.beginPath(); ctx.moveTo(ex - r, ey - r - 2); ctx.lineTo(ex + r * 0.6, ey - r + 0.5); ctx.moveTo(ex + r * 3.4, ey - r - 2); ctx.lineTo(ex + r * 1.8, ey - r + 0.5); ctx.stroke(); }
  };

  const drawEnemies = () => {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 2.5; ctx.strokeStyle = C.ink;
    enemies.forEach((e) => {
      if (e.hidden || e.x + e.w < camX - 20 || e.x > camX + viewW / scale + 20) return;
      const fill = C[e.c], s = e.g;
      ctx.save();
      if (e.flip) { ctx.translate(e.x + e.w / 2, e.y + e.h / 2); ctx.rotate(Math.PI); ctx.translate(-(e.x + e.w / 2), -(e.y + e.h / 2)); }
      if ((!e.alive && !e.flip) || e.down > 0) {
        sticker(e.x, e.y + e.h - 12, e.w, 12, 6, fill, 2);
        ctx.restore(); return;
      }
      // Vague brief: faint and blurry until you get close, label and all.
      let clear = 1;
      if (e.kind === 'vague') {
        const d = Math.abs(e.x + e.w / 2 - (p.x + p.w / 2));
        clear = Math.max(0, Math.min(1, 1 - (d - 110) / 240));
        ctx.globalAlpha = 0.22 + clear * 0.78;
        // A wobble instead of a canvas blur filter: blur is costly in Chrome.
        if (clear < 1 && !reduce) ctx.translate(Math.sin(clock * 9 + e.x) * (1 - clear) * 3, 0);
      }
      // little feet, stepping
      const st = e.active && !reduce ? Math.sin(clock * 12 + e.x * 0.05) * 3 * s : 0;
      ctx.fillStyle = C.ink;
      ctx.beginPath(); ctx.ellipse(e.x + 14 * s + st, e.y + e.h + 1, 7 * s, 4 * s, 0, 0, 7); ctx.ellipse(e.x + e.w - 14 * s - st, e.y + e.h + 1, 7 * s, 4 * s, 0, 0, 7); ctx.fill();
      ctx.font = `700 ${Math.round(15 * s)}px "Bricolage Grotesque", sans-serif`;
      if (e.kind === 'committee') {
        // Three opinions stacked on top of each other, never quite aligned.
        const ph = e.h / 3;
        e.lines.forEach((l, i) => {
          const wob = reduce ? 0 : Math.sin(clock * 4 + i * 2) * 3;
          const y = e.y - 2 + i * ph;
          sticker(e.x + wob, y, e.w, ph - 1, 9, C[MATES[i]], 2);
          ctx.fillStyle = C.ink; ctx.fillText(l, e.x + e.w / 2 + wob, y + ph / 2);
        });
      } else {
        if (e.kind === 'specs') ctx.setLineDash([6, 4]); // drawn in wireframe, like its specs
        sticker(e.x, e.y - 2, e.w, e.h, 10 * s, fill, 3);
        ctx.setLineDash([]);
        ctx.fillStyle = C.ink;
        ctx.fillText(e.kind === 'vague' && clear < 0.55 ? '? ? ?' : e.label, e.x + e.w / 2, e.y + e.h / 2 - 1);
      }
      const r = 5 * Math.min(s, 1.6);
      const ex = e.vx < 0 ? e.x + 12 : e.x + e.w - 12 - r * 2.4;
      drawEyes(ex, e.y - 3, Math.sign(e.vx) || -1, true, r);
      ctx.globalAlpha = 1;
      if (e.alert > 0) {
        // a notification bubble for Late feedback
        const bx = e.x + e.w / 2, by = e.y - 30 - (reduce ? 0 : Math.abs(Math.sin(clock * 10)) * 4);
        ctx.beginPath(); ctx.arc(bx, by, 13, 0, 7); ctx.fillStyle = C.tomato; ctx.fill(); ctx.stroke();
        ctx.fillStyle = C.ink; ctx.font = '800 16px "Bricolage Grotesque", sans-serif'; ctx.fillText('!', bx, by + 1);
      }
      ctx.restore();
    });
  };

  const drawTeam = () => {
    if (p.hidden) return;
    ctx.lineWidth = 2.2; ctx.strokeStyle = C.ink;
    const moving = Math.abs(p.vx) > 20 || state === 'flag';
    team.forEach((m, i) => {
      const at = mateAt(i);
      let x = at.x, y = at.y;
      if (m.join < 1) { const k = m.join; x = m.fx + (x - m.fx) * k; y = m.fy + (y - m.fy) * k - Math.sin(k * Math.PI) * 70; }
      const w = 22, h = 24, bob = moving && !reduce ? Math.abs(Math.sin(p.walk * 0.09 + i * 1.3)) * 2.5 : 0;
      const st = moving && !reduce ? Math.sin(p.walk * 0.09 + i * 1.3) * 3 : 0;
      ctx.fillStyle = C.ink;
      ctx.beginPath(); ctx.ellipse(x - 5 + st, y + 1, 4.5, 2.8, 0, 0, 7); ctx.ellipse(x + 5 - st, y + 1, 4.5, 2.8, 0, 0, 7); ctx.fill();
      sticker(x - w / 2, y - h - bob, w, h, 9, C[m.c], 2);
      const f = at.face || 1, ex = x + f * 3 - 5;
      ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(ex, y - h - bob + 9, 3.4, 0, 7); ctx.arc(ex + 8, y - h - bob + 9, 3.4, 0, 7); ctx.fill();
      ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(ex + f * 1.2, y - h - bob + 9.5, 1.6, 0, 7); ctx.arc(ex + 8 + f * 1.2, y - h - bob + 9.5, 1.6, 0, 7); ctx.fill();
    });
    lost.forEach((o) => {
      ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.t * 9);
      sticker(-11, -12, 22, 24, 9, C[o.c], 2);
      ctx.restore();
    });
  };

  const drawPowerups = () => {
    powerups.forEach((u) => {
      ctx.lineWidth = 2.5; ctx.strokeStyle = C.ink;
      sticker(u.x, u.y, u.w, u.h, 9, C.mint, 3);
      ctx.beginPath(); ctx.moveTo(u.x + 8, u.y + 17); ctx.lineTo(u.x + 14, u.y + 10); ctx.lineTo(u.x + 20, u.y + 17); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';
    });
  };

  const drawPlayer = () => {
    if (p.hidden) return;
    if (p.inv > 0 && Math.floor(p.inv * 14) % 2 === 0) return;
    const sq = p.squash;
    const w = p.w + sq * 8, h = p.h - sq * 8;
    const x = p.x + p.w / 2 - w / 2, y = p.y + p.h - h;
    const bob = p.onGround && Math.abs(p.vx) > 20 && !reduce ? Math.abs(Math.sin(p.walk * 0.09)) * 2.5 : 0;
    ctx.save();
    if (p.dead) { ctx.translate(x + w / 2, y + h / 2); ctx.rotate(Math.PI); ctx.translate(-(x + w / 2), -(y + h / 2)); }
    ctx.lineWidth = 2.5; ctx.strokeStyle = C.ink;
    // feet
    const st = p.onGround && Math.abs(p.vx) > 20 && !reduce ? Math.sin(p.walk * 0.09) * 4 : 0;
    ctx.fillStyle = C.ink;
    ctx.beginPath(); ctx.ellipse(x + 8 + st, p.y + p.h + 1, 6, 3.5, 0, 0, 7); ctx.ellipse(x + w - 8 - st, p.y + p.h + 1, 6, 3.5, 0, 0, 7); ctx.fill();
    sticker(x, y - bob, w, h, 13, C.cobalt, 3);
    // a sun-colored scarf when levelled up
    if (p.big) {
      ctx.fillStyle = C.sun; rr(x - 1, y - bob + h * 0.52, w + 2, 7, 3); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + (p.face > 0 ? 2 : w - 2), y - bob + h * 0.52 + 6);
      ctx.lineTo(x + (p.face > 0 ? -9 : w + 9), y - bob + h * 0.52 + 14 + (reduce ? 0 : Math.sin(clock * 10) * 2));
      ctx.lineWidth = 4; ctx.strokeStyle = C.sun; ctx.stroke(); ctx.lineWidth = 2.5; ctx.strokeStyle = C.ink;
    }
    const ex = p.face > 0 ? x + w - 22 : x + 8;
    ctx.fillStyle = C.cream;
    ctx.beginPath(); ctx.arc(ex + 3, y - bob + 13, 5, 0, 7); ctx.arc(ex + 15, y - bob + 13, 5, 0, 7); ctx.fill();
    ctx.fillStyle = C.ink;
    ctx.beginPath(); ctx.arc(ex + 3 + p.face * 1.8, y - bob + 14, 2.3, 0, 7); ctx.arc(ex + 15 + p.face * 1.8, y - bob + 14, 2.3, 0, 7); ctx.fill();
    ctx.restore();
    // Stand still for a few seconds and the designer takes a chai break.
    if (p.idle > 4 && !p.dead && state === 'play') {
      const sip = reduce ? 0 : Math.max(0, Math.sin((p.idle - 4) * 2.2)) * 6;
      drawCup(p.x + p.w / 2 + p.face * 22, p.y + p.h - 18 - sip, 0.55, 0);
    }
  };

  const drawFlags = () => {
    ctx.lineWidth = 2.5; ctx.strokeStyle = C.ink;
    // checkpoint
    const cx = CHECKX * T + T / 2, cy = GY * T;
    ctx.fillStyle = C.ink; ctx.fillRect(cx - 2, cy - 100, 4, 100);
    const up = checkHit ? 0 : 50;
    ctx.fillStyle = checkHit ? C.mint : C.lilac;
    ctx.beginPath(); ctx.moveTo(cx + 2, cy - 100 + up); ctx.lineTo(cx + 40, cy - 88 + up); ctx.lineTo(cx + 2, cy - 76 + up); ctx.closePath(); ctx.fill(); ctx.stroke();

    // launch flag
    const fx = FLAGX * T + T / 2, top = (GY - 10) * T;
    ctx.fillStyle = C.cream; ctx.fillRect(fx - 3, top, 6, (GY - 1) * T - top); ctx.strokeRect(fx - 3, top, 6, (GY - 1) * T - top);
    ctx.fillStyle = C.sun; ctx.beginPath(); ctx.arc(fx, top, 9, 0, 7); ctx.fill(); ctx.stroke();
    const fy = state === 'flag' || state === 'win' ? flagY : top + 8;
    const wave = reduce ? 0 : Math.sin(clock * 5) * 4;
    ctx.fillStyle = C.tomato;
    ctx.beginPath(); ctx.moveTo(fx - 3, fy); ctx.lineTo(fx - 92, fy + 6 + wave); ctx.lineTo(fx - 80, fy + 20); ctx.lineTo(fx - 92, fy + 34 - wave); ctx.lineTo(fx - 3, fy + 30); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.font = '800 13px "Bricolage Grotesque", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SHIP IT', fx - 44, fy + 16);
  };

  const drawHouse = () => {
    const x = HOUSEX * T, w = 5 * T, h = 4 * T, y = GY * T - h;
    ctx.lineWidth = 2.5; ctx.strokeStyle = C.ink;
    sticker(x, y, w, h, 8, C['cream-2'], 5);
    ctx.fillStyle = C.tomato;
    ctx.beginPath(); ctx.moveTo(x - 16, y + 6); ctx.lineTo(x + w / 2, y - 70); ctx.lineTo(x + w + 16, y + 6); ctx.closePath();
    ctx.save(); ctx.translate(5, 5); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore();
    ctx.fillStyle = C.tomato; ctx.fill(); ctx.stroke();
    sticker(x + w / 2 - 34, y - 34, 68, 26, 13, C.cream, 2);
    ctx.fillStyle = C.ink; ctx.font = '700 11px "Space Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('LAUNCH', x + w / 2, y - 20);
    sticker(x + w / 2 - 26, y + h - 76, 52, 76, [26, 26, 0, 0], C.ink, 0);
    sticker(x + 18, y + 26, 40, 34, 6, C.sun, 0);
    sticker(x + w - 58, y + 26, 40, 34, 6, C.sun, 0);
  };

  const drawText = () => {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = HAND;
    popups.forEach((o) => {
      ctx.globalAlpha = 1 - Math.max(0, (o.t - 0.5) / 0.4);
      ctx.fillStyle = C.ink; ctx.fillText(o.text, o.x, o.y - o.t * 50);
    });
    ctx.globalAlpha = 1;
    parts.forEach((o) => {
      if (o.dust) {
        if (o.t > 0.35) return;
        ctx.globalAlpha = 1 - o.t / 0.35; ctx.fillStyle = C.cream; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.s + o.t * 18, 0, 7); ctx.fill(); ctx.stroke(); ctx.globalAlpha = 1;
        return;
      }
      ctx.fillStyle = o.c; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; rr(o.x, o.y, o.s, o.s, 2); ctx.fill(); ctx.stroke();
    });
  };

  const draw = () => {
    if (!C.ink && !tokens()) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSky();
    const sx = shake > 0 && !reduce ? (Math.random() - 0.5) * 8 : 0;
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * (sx - camX * scale), dpr * offY);
    drawBackdrop();
    drawSigns();
    drawHouse();
    drawFlags();
    drawGround();
    drawTiles();
    chais.forEach((c, i) => { if (!c.got && c.x > camX - 30 && c.x < camX + viewW / scale + 30) drawCup(c.x, c.y + (reduce ? 0 : Math.sin(clock * 3 + i) * 3), 0.85, i); });
    drawPowerups();
    drawEnemies();
    drawTeam();
    drawPlayer();
    drawText();
  };

  // ---------- HUD and screens ----------
  const chaiEl = $('[data-chai]'), shipEl = $('[data-shipped]'), livesEl = $('[data-lives]'), teamEl = $('[data-team]'), soundBtn = $('[data-sound]');
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="heart{c}" d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.4 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/></svg>';
  const hud = () => {
    chaiEl.textContent = chai; shipEl.textContent = shipped; teamEl.textContent = team.length;
    livesEl.innerHTML = [0, 1, 2].map((i) => HEART.replace('{c}', i < lives ? '' : ' gone')).join('');
    livesEl.setAttribute('aria-label', `${lives} lives left`);
  };
  const toggleSound = (on = muted) => {
    muted = !on;
    try { localStorage.setItem('sq-sound', muted ? 'off' : 'on'); } catch {}
    soundBtn.setAttribute('aria-pressed', String(!muted));
    soundBtn.setAttribute('aria-label', muted ? 'Turn sound on' : 'Turn sound off');
    soundBtn.classList.toggle('off', muted);
    if (muted) stopMusic();
    else { SFX.chai(); if (state === 'play' || state === 'flag') playMusic(); }
  };
  const musicBtn = $('[data-music-btn]');
  const musicUI = () => {
    musicBtn.setAttribute('aria-pressed', String(musicOn));
    musicBtn.setAttribute('aria-label', musicOn ? 'Turn music off' : 'Turn music on');
    musicBtn.classList.toggle('off', !musicOn);
  };
  const toggleMusic = () => {
    musicOn = !musicOn; musicSaved = true;
    try { localStorage.setItem('sq-music', musicOn ? 'on' : 'off'); } catch {}
    musicUI();
    if (musicOn) { if (state === 'play' || state === 'flag') playMusic(); } else stopMusic();
  };
  const show = (name) => {
    $$('[data-screen]').forEach((s) => (s.hidden = s.dataset.screen !== name));
    if (name === 'win' || name === 'over' || name === 'pause') feedbackCard(name);
  };

  // ---------- Feedback: "more levels" votes and messages, sent by worker.js ----------
  const SHOW_COUNT_AT = 10; // below this a public count reads as a ghost town
  let votesTotal = null, voted = false, gift = false;
  try { voted = localStorage.getItem('sq-voted') === '1'; gift = localStorage.getItem('sq-w2') === '1'; } catch {} // sq-w2: set by world2.js after the email
  // World 2 is a gift for players who ask for it. Its own page asks for their email (worker.js keeps it).
  const countText = () => {
    if (voted && votesTotal) return votesTotal > 1 ? `You and ${votesTotal - 1} other${votesTotal === 2 ? '' : 's'} want World 2.` : 'You asked for World 2 first.';
    if (votesTotal >= SHOW_COUNT_AT) return `${votesTotal} players want World 2.`;
    return voted ? 'Vote counted. Thank you.' : 'Be one of the first to ask for World 2.';
  };
  // Asking for World 2 earns a gift: once World 1 is finished, the win screen offers it,
  // and World 2's page asks for the email. After that, every screen shows "Play World 2".
  const paint = () => $$('[data-fb]').forEach((f) => {
    const v = $('[data-fb-vote]', f), play = $('[data-fb-play]', f), wrap = $('[data-fb-gift]', f);
    const offer = voted && !gift && f.closest('[data-screen]')?.dataset.screen === 'win';
    v.disabled = voted;
    v.hidden = gift || offer; play.hidden = !(gift || offer); wrap.hidden = !offer;
    $('[data-fb-play-label]', f).textContent = offer ? 'Unwrap World 2' : 'Play World 2';
    v.lastChild.textContent = voted ? ' You want World 2' : ' Yes, build World 2';
    $('.fb-title', f).textContent = gift ? 'World 2 is unlocked' : offer ? 'You found a gift' : 'Want more levels?';
    $('[data-fb-ask]', f).firstChild.textContent = gift || offer ? 'How was World 1? Any feedback. ' : 'What should World 2 have? Or any feedback. ';
    const count = $('[data-fb-count]', f);
    count.hidden = offer; // the gift explains itself
    count.textContent = gift ? 'It\u2019s yours. Scale up.' : voted ? `${countText()} Finish World 1 for a surprise.` : countText();
  });
  const loadVotes = () => fetch('/api/votes').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) { votesTotal = d.votes; paint(); } }).catch(() => {});
  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.round(s) % 60).padStart(2, '0')}`;
  const post = (body) => fetch('/api/feedback', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, context: { where: state, time: fmtTime(time), team: String(team.length), stomped: String(shipped), chai: String(chai) } }),
  }).then(async (r) => ({ ok: r.ok, ...(await r.json().catch(() => ({}))) }));
  const feedbackCard = (name) => {
    const panel = $(`[data-screen="${name}"] .gpanel`);
    if (!$('[data-fb]', panel)) {
      panel.appendChild($('#feedback').content.cloneNode(true));
      const f = $('[data-fb]', panel), status = $('[data-fb-status]', f), msg = $('[data-fb-msg]', f);
      $('[data-fb-play]', f).addEventListener('click', () => window.track?.('game:world2_opened', { has_gift: gift }));
      $('[data-fb-vote]', f).addEventListener('click', async () => {
        if (voted) return;
        voted = true; paint();
        window.track?.('game:world2_voted');
        try { localStorage.setItem('sq-voted', '1'); } catch {}
        const r = await post({ vote: true, website: f.website.value }).catch(() => null);
        if (r && r.votes !== undefined) { votesTotal = r.votes; paint(); }
        else status.textContent = 'Saved here, but I couldn\u2019t reach the server. Try again later.';
      });
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = msg.value.trim();
        if (!text) { status.textContent = 'Type a line first, then send.'; msg.focus(); return; }
        status.textContent = 'Sending...';
        const r = await post({ vote: voted, message: text, website: f.website.value }).catch(() => null);
        if (r && r.ok) { msg.value = ''; status.textContent = 'Sent. Thank you, I read every one.'; if (r.votes !== undefined) { votesTotal = r.votes; paint(); } }
        else if (r && r.error === 'slow down') status.textContent = 'That\u2019s a lot of feedback. Give it a minute.';
        else status.textContent = 'Couldn\u2019t send it. Email me at rishabhyadav0807@gmail.com instead.';
      });
    }
    paint();
    loadVotes();
  };

  const start = () => {
    chai = 0; shipped = 0; lives = 3; time = 0; check = null; checkHit = false; tbdSeen = false; saved = { chai: 0, shipped: 0, team: 0 };
    build(); spawn(); hud();
    state = 'play'; show(null);
    if (!peek) window.track?.('game:run_started', { world_number: 1 });
    audio(); // start the audio system inside the click, not on the first jump mid-run
    playMusic(true);
    if (!peek) canvas.focus({ preventScroll: true });
  };
  const pause = () => { state = 'pause'; show('pause'); stopMusic(); if (!peek) $('[data-resume]').focus(); };
  const resume = () => { state = 'play'; show(null); last = performance.now(); playMusic(); if (!peek) canvas.focus({ preventScroll: true }); };
  const gameOver = () => { state = 'over'; window.track?.('game:run_lost', { world_number: 1, duration_seconds: Math.round(time), reached_checkpoint: !!check }); show('over'); stopMusic(0.6); $('[data-screen="over"] [data-go]').focus(); };
  const win = () => {
    if (peek) return start();
    state = 'win';
    const t = Math.round(time);
    const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    $('[data-r-time]').textContent = `Time ${fmt(t)}`;
    $('[data-r-chai]').textContent = `${chai} chai`;
    $('[data-r-ship]').textContent = `${shipped} stomped`;
    $('[data-r-team]').textContent = team.length ? `You shipped it with a team of ${team.length + 1}.` : 'You shipped it solo. Next time, find the team in the idea blocks.';
    const isBest = !best || t < best;
    if (isBest) { best = t; try { localStorage.setItem('sq-platform-best', t); } catch {} }
    $('[data-r-best]').textContent = isBest ? 'New best time.' : `Best time ${fmt(best)}. Beat it?`;
    window.track?.('game:run_won', { world_number: 1, duration_seconds: t, team_size: team.length + 1, chai_collected: chai, blockers_stomped: shipped, is_best_time: isBest });
    show('win');
    $('[data-screen="win"] .btn').focus();
  };
  const full = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  $$('[data-go]').forEach((b) => b.addEventListener('click', start));
  // mailto does nothing on machines with no mail app set up, so the click
  // also copies the address and says so. The link still opens a mail app if there is one.
  $$('[data-mail]').forEach((a) => a.addEventListener('click', async () => {
    const note = $('[data-mail-note]');
    try { await navigator.clipboard.writeText(a.dataset.mail); note.textContent = `${a.dataset.mail} is copied. Paste it into any email.`; }
    catch { note.textContent = a.dataset.mail; }
  }));
  $('[data-resume]').addEventListener('click', resume);
  $('[data-pause]').addEventListener('click', () => (state === 'play' ? pause() : state === 'pause' && resume()));
  $('[data-full]').addEventListener('click', full);
  soundBtn.addEventListener('click', () => toggleSound());
  musicBtn.addEventListener('click', toggleMusic);
  musicUI();
  if (slow && !musicSaved) $('[data-slow-note]').hidden = false;
  soundBtn.setAttribute('aria-pressed', String(!muted)); soundBtn.classList.toggle('off', muted);
  // The homepage tells the peek when it scrolls out of view, so it stops drawing.
  let offscreen = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'play') pause();
    else if (!document.hidden && peek && state === 'pause' && !offscreen) resume();
  });
  if (peek) addEventListener('message', (e) => {
    if (e.origin !== location.origin || !e.data || !e.data.peek) return;
    offscreen = e.data.peek === 'pause';
    if (offscreen && state === 'play') pause();
    else if (!offscreen && !document.hidden && state === 'pause') resume();
  });
  addEventListener('blur', () => { keys.left = keys.right = keys.jump = false; });

  // ---------- Size and loop ----------
  const size = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    viewW = innerWidth; viewH = innerHeight;
    canvas.width = Math.round(viewW * dpr); canvas.height = Math.round(viewH * dpr);
    // Phones keep a strip at the bottom for the thumb pad, so thumbs never cover the hero.
    const pad = coarse ? (viewH > viewW ? 170 : 64) : 0;
    const availH = viewH - pad;
    scale = Math.min(availH / (12 * T), viewW / (12 * T));
    if (viewW > availH && viewW / scale / T < 26) scale = Math.max(availH / (ROWS * T), viewW / (26 * T));
    if (peek) scale = availH / (7.5 * T); // a short strip: ground plus the action above it
    offY = availH - ROWS * T * scale;
  };
  let still = false;
  addEventListener('resize', () => { size(); still = false; });

  // Every frame advances by the real time since the last one, split into
  // slices of at most 1/120 s. (A fixed-step accumulator left some frames
  // with no step and others with two: visible judder at running speed.)
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    if (state === 'play' || state === 'flag' || state === 'win') {
      const n = Math.max(1, Math.ceil(dt / STEP - 1e-6));
      for (let i = 0; i < n; i++) step(dt / n);
    } else if (state === 'start') clock += dt;
    // The peek draws one still frame when it isn't playing (paused offscreen,
    // reduced motion or a slow connection) instead of animating the scenery.
    if (!peek || state === 'play' || !still) { draw(); still = peek && state !== 'play'; }
    raf = requestAnimationFrame(loop);
  };

  size();
  build(); spawn(); hud();
  // Labels are measured with the real fonts. Before a game starts, rebuild the
  // level once they arrive; mid-game, only re-measure the blockers (a rebuild
  // there snapped the hero back to the start: the peek "glitch").
  const relabel = () => enemies.forEach((e) => {
    ctx.font = FONT;
    const bw = Math.round(Math.max(...e.lines.map((l) => ctx.measureText(l).width)) + 24);
    const w = Math.round(bw * e.g);
    e.x += (e.w - w) / 2; e.bw = bw; e.w = w;
  });
  const fontsReady = (document.fonts?.ready || Promise.resolve()).then(() => {
    if (state === 'start') { build(); spawn(); } else relabel();
    still = false;
  });
  last = performance.now();
  raf = requestAnimationFrame(loop);
  // The peek starts running at once, unless motion is reduced or the connection
  // is slow: then it stays a still frame.
  // The peek waits for the fonts (at most 2 s) so it never starts with stand-in labels.
  if (peek) {
    if (!reduce && !slow) Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2000))]).then(() => { if (state === 'start') start(); });
  } else $('[data-go]').focus();

  // Offline after the first visit: sw.js keeps the game, fonts and music.
  // Off on local dev servers (add ?sw to test it there).
  if (!peek && 'serviceWorker' in navigator && (!/^(localhost|127\.0\.0\.1)$/.test(location.hostname) || new URLSearchParams(location.search).has('sw'))) {
    addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }
})();
