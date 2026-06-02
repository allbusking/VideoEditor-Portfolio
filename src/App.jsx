import { useState, useEffect, useRef, useCallback } from "react";

/* ════════════════════════════════════════════════
   GLOBAL CSS — Cinematic Awwwards-Level
════════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Poppins:wght@300;400;500;600&display=swap');

:root {
  --gold: #c9a84c;
  --gold-dim: #8a6a2a;
  --gold-glow: rgba(201,168,76,0.35);
  --cream: #f0e8d0;
  --charcoal: #0d0c0a;
  --dark: #111008;
  --mid: #1a1810;
  --glass: rgba(255,255,255,0.03);
  --glass-border: rgba(201,168,76,0.14);
  --font-display: 'Playfair Display', serif;
  --font-body: 'Poppins', sans-serif;
  --ease-out: cubic-bezier(0.16,1,0.3,1);
  --ease-elastic: cubic-bezier(0.34,1.56,0.64,1);
  --ease-cinema: cubic-bezier(0.77,0,0.175,1);
}

*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
/* TASK 4 & 5: Changed scroll-behavior from auto → smooth for native anchor fallback */
html { scroll-behavior: smooth; }
body { background:var(--dark) !important; color:var(--cream); font-family:var(--font-body); font-weight:300; overflow-x:hidden; cursor:none; }
#root { background:var(--dark); min-height:100vh; }
::selection { background:var(--gold); color:var(--dark); }

/* ── Scroll Progress ── */
#scroll-progress {
  position:fixed; top:0; left:0; height:2px; z-index:99999;
  background:linear-gradient(90deg,var(--gold-dim),var(--gold),#fff8e7);
  width:0%; box-shadow:0 0 12px var(--gold-glow);
  pointer-events:none;
}

/* ── Cursor ── */
#cursor { position:fixed; top:0; left:0; z-index:99998; pointer-events:none; }
#cursor-dot {
  width:5px; height:5px; background:var(--gold); border-radius:50%;
  position:absolute; transform:translate(-50%,-50%);
  will-change:transform; transition:opacity .2s;
}
#cursor-ring {
  width:34px; height:34px; border:1.5px solid rgba(201,168,76,.45);
  border-radius:50%; position:absolute; transform:translate(-50%,-50%);
  will-change:transform;
  transition:width .4s var(--ease-out),height .4s var(--ease-out),background .3s,border-color .3s;
  display:flex; align-items:center; justify-content:center;
}
#cursor-label { font-size:7px; letter-spacing:2px; text-transform:uppercase; color:var(--dark); font-family:var(--font-body); font-weight:600; opacity:0; transition:opacity .2s; white-space:nowrap; }
body.cur-hover #cursor-ring { width:68px; height:68px; background:var(--gold); border-color:var(--gold); }
body.cur-hover #cursor-dot  { opacity:0; }
body.cur-hover #cursor-label { opacity:1; }

/* ── Hide custom cursor in cinema mode ── */
body.cinema-active #cursor-dot  { opacity:0 !important; transition:opacity .2s; }
body.cinema-active #cursor-ring { opacity:0 !important; transition:opacity .2s; }

/* ── Cinema: restore system cursor on screen + controls ── */
.cinema-screen,
.cinema-screen * { cursor:auto; }
.cinema-controls,
.cinema-controls * { cursor:pointer; }
.cp-btn,
.cp-track,
.cp-vol,
.ct-close { cursor:pointer !important; }
.cinema-title { cursor:auto; }

/* ── Film grain ── */
#grain {
  position:fixed; inset:0; z-index:99990; pointer-events:none;
  opacity:.03; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation:grainAnim .1s steps(1) infinite;
}
@keyframes grainAnim {
  0%  { transform:translate(0,0); }
  20% { transform:translate(-3px,2px); }
  40% { transform:translate(2px,-2px); }
  60% { transform:translate(-2px,3px); }
  80% { transform:translate(3px,-1px); }
}

/* ── Light leak ── */
#light-leak {
  position:fixed; top:-30%; right:-20%; width:55vw; height:55vw;
  background:radial-gradient(ellipse,rgba(201,168,76,.038) 0%,transparent 70%);
  pointer-events:none; z-index:9989;
  animation:leakDrift 14s ease-in-out infinite alternate;
}
@keyframes leakDrift { from{transform:translate(0,0) scale(1)} to{transform:translate(-90px,70px) scale(1.35)} }

/* ── Loader ── */
.hole { width:10px; height:14px; background:var(--gold); border-radius:2px; opacity:0; animation:holeFlash 1.6s ease-in-out infinite; }
.hole:nth-child(2){animation-delay:.2s} .hole:nth-child(3){animation-delay:.4s} .hole:nth-child(4){animation-delay:.6s}
@keyframes holeFlash { 0%,100%{opacity:.15} 50%{opacity:1} }
.loader-name { font-family:var(--font-display); font-size:clamp(26px,5vw,50px); font-weight:700; color:var(--cream); letter-spacing:8px; opacity:0; animation:loaderIn 1s .4s var(--ease-out) forwards; }
@keyframes loaderIn { from{opacity:0;filter:blur(14px);letter-spacing:22px} to{opacity:1;filter:blur(0);letter-spacing:8px} }
.loader-bar { height:100%; width:0; background:linear-gradient(90deg,transparent,var(--gold),transparent); animation:lBar 2.4s var(--ease-cinema) forwards; }
@keyframes lBar { to{width:100%} }

/* ── Hero letter reveal ── */
.hero-letter { display:inline-block; opacity:0; filter:blur(10px); transform:translateY(18px); animation:lReveal .75s var(--ease-out) forwards; }
@keyframes lReveal { to{opacity:1;filter:blur(0);transform:translateY(0)} }
.hero-eyebrow { opacity:0; animation:fadeUp .9s 2.4s var(--ease-out) forwards; }
.hero-tagline  { opacity:0; animation:fadeUp .9s 3.6s var(--ease-out) forwards; }
.hero-bottom-bar { position:absolute; bottom:0; left:0; right:0; z-index:4; padding:0 60px 32px; display:flex; align-items:flex-end; justify-content:space-between; opacity:0; animation:fadeUp .9s 3.8s var(--ease-out) forwards; }
.hero-scroll-wrap { position:absolute; bottom:40px; left:50%; transform:translateX(-50%); z-index:4; display:flex; flex-direction:column; align-items:center; gap:10px; opacity:0; animation:fadeUp .9s 4s var(--ease-out) forwards; }
@keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

.scroll-line { width:1px; height:56px; background:linear-gradient(to bottom,var(--gold),transparent); animation:sPulse 2s ease-in-out infinite; }
@keyframes sPulse { 0%,100%{opacity:.3;transform:scaleY(.7)} 50%{opacity:1;transform:scaleY(1)} }

/* ── Hero spotlight ── */
.hero-spotlight { position:absolute; inset:0; z-index:3; pointer-events:none; }

/* ── Clapboard ── */
.clap-top { width:100%; height:28px; background:linear-gradient(135deg,#272727,#181818); border:1px solid #3a3a3a; border-radius:2px 2px 0 0; position:relative; overflow:hidden; transform-origin:bottom center; transform-style:preserve-3d; }
@keyframes clapFire { 0%{transform:rotateX(0) scaleX(1)} 18%{transform:rotateX(-72deg) scaleX(1.05)} 35%{transform:rotateX(-68deg) scaleX(.96)} 55%{transform:rotateX(14deg) scaleX(1.04)} 70%{transform:rotateX(-5deg) scaleX(.99)} 85%{transform:rotateX(2deg) scaleX(1.01)} 100%{transform:rotateX(0) scaleX(1)} }
.clap-fire { animation:clapFire .5s cubic-bezier(.22,1,.36,1) forwards; }
@keyframes clapShake { 0%{transform:translateX(0)} 20%{transform:translateX(-4px) rotate(-.6deg)} 40%{transform:translateX(4px) rotate(.6deg)} 60%{transform:translateX(-2px)} 80%{transform:translateX(1px)} 100%{transform:translateX(0)} }
.clap-shake { animation:clapShake .28s ease forwards; }

/* ── Reveal ── */
.reveal { opacity:0; transform:translateY(42px) scale(.98); transition:opacity .9s var(--ease-out),transform .9s var(--ease-out); }
.reveal.visible { opacity:1; transform:translateY(0) scale(1); }
.reveal-delay-1{transition-delay:.1s} .reveal-delay-2{transition-delay:.2s} .reveal-delay-3{transition-delay:.3s} .reveal-delay-4{transition-delay:.4s}

/* ── Nav ── */
.nav-link { font-size:11px; letter-spacing:3px; text-transform:uppercase; color:rgba(240,232,208,.4); text-decoration:none; position:relative; transition:color .3s; }
.nav-link::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:1px; background:var(--gold); transition:width .4s var(--ease-out); }
.nav-link:hover { color:var(--cream); }
.nav-link:hover::after { width:100%; }
.nav-cta { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); border:1px solid rgba(201,168,76,.28); padding:10px 26px; text-decoration:none; position:relative; overflow:hidden; transition:color .4s; }
.nav-cta::before { content:''; position:absolute; inset:0; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .45s var(--ease-out); }
.nav-cta:hover::before { transform:scaleX(1); }
.nav-cta:hover { color:var(--dark); }
.nav-cta span { position:relative; z-index:1; }

/* ── Work cards ── */
.work-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
@media(max-width:900px){ .work-grid{ grid-template-columns:repeat(2,1fr) !important; } }
@media(max-width:560px){ .work-grid{ grid-template-columns:1fr !important; } }
.work-card {
  position:relative; overflow:hidden;
  border:1px solid rgba(201,168,76,.06);
  cursor:none; background:var(--mid);
  aspect-ratio:16/10; will-change:transform;
  transition:border-color .5s, box-shadow .5s;
  border-radius:3px;
}
.work-card:hover {
  border-color:rgba(201,168,76,.28);
  box-shadow:0 32px 80px rgba(0,0,0,.7), 0 0 60px rgba(201,168,76,.05);
}
.work-thumb {
  width:100%; height:100%; object-fit:cover; display:block;
  filter:saturate(.25) brightness(.5);
  transition:filter .8s var(--ease-out), transform .9s var(--ease-out);
  will-change:transform,filter;
}
.work-card:hover .work-thumb { filter:saturate(.85) brightness(.72); transform:scale(1.07); }
.work-overlay {
  position:absolute; inset:0;
  background:linear-gradient(to top, rgba(8,7,5,.97) 0%, rgba(8,7,5,.12) 55%, transparent 100%);
  display:flex; flex-direction:column; justify-content:flex-end; padding:26px;
}
.work-cat { font-size:9px; letter-spacing:4px; text-transform:uppercase; color:var(--gold); margin-bottom:7px; opacity:.85; }
.work-title { font-family:var(--font-display); font-size:20px; font-weight:700; color:var(--cream); line-height:1.2; }
.work-view {
  margin-top:12px; font-size:9px; letter-spacing:3px; text-transform:uppercase;
  color:rgba(240,232,208,.4); display:flex; align-items:center; gap:8px;
  transform:translateY(10px); opacity:0; transition:opacity .4s,transform .4s var(--ease-out);
}
.work-card:hover .work-view { opacity:1; transform:translateY(0); }
.work-glow {
  position:absolute; inset:0; opacity:0;
  background:radial-gradient(ellipse at 50% 110%, rgba(201,168,76,.08), transparent 65%);
  transition:opacity .5s; pointer-events:none;
}
.work-card:hover .work-glow { opacity:1; }
.work-shine { position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity .3s; }
.work-card:hover .work-shine { opacity:1; }

/* Play badge */
.work-play-badge {
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%) scale(0);
  width:56px; height:56px; border:1.5px solid rgba(201,168,76,.6);
  border-radius:50%; display:flex; align-items:center; justify-content:center;
  background:rgba(5,4,3,.55); backdrop-filter:blur(6px);
  transition:transform .4s var(--ease-elastic), border-color .3s, background .3s;
  pointer-events:none; z-index:3;
}.work-card:hover .work-play-badge { border-color:var(--gold); background:rgba(201,168,76,.15); }

/* TASK 1: Card entrance animation on page change */
@keyframes wFadeIn {
  from { opacity:0; transform:translateY(22px) scale(.98); }
  to   { opacity:1; transform:translateY(0)   scale(1); }
}
.work-card-enter {
  animation: wFadeIn .55s var(--ease-out) both;
}

/* TASK 1: Pagination buttons */
.pag-btn {
  width:38px; height:38px;
  border:1px solid rgba(201,168,76,.18);
  background:transparent;
  color:rgba(240,232,208,.38);
  font-family:var(--font-body); font-size:11px; letter-spacing:2px;
  cursor:none; display:flex; align-items:center; justify-content:center;
  transition:all .35s var(--ease-out);
  border-radius:2px;
}
.pag-btn:hover {
  border-color:rgba(201,168,76,.55);
  color:var(--gold);
  background:rgba(201,168,76,.06);
}
.pag-btn.pag-active {
  border-color:var(--gold);
  color:var(--dark);
  background:var(--gold);
}
.pag-btn:disabled {
  opacity:.22;
  cursor:default;
  pointer-events:none;
}

/* ── Cinema Theater ── */
.cinema-backdrop {
  position:fixed; inset:0; z-index:100000;
  pointer-events:none; overflow:hidden;
}
.cinema-backdrop.active { pointer-events:all; cursor:auto; }

.cinema-dark {
  position:absolute; inset:0;
  background:rgba(3,2,1,0);
  transition:background .65s var(--ease-cinema);
}
.cinema-backdrop.active .cinema-dark { background:rgba(3,2,1,.97); }

.cinema-ambient {
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%);
  width:80vw; height:50vh; border-radius:50%;
  background:radial-gradient(ellipse, rgba(201,168,76,.06) 0%, rgba(201,168,76,.02) 40%, transparent 70%);
  opacity:0; transition:opacity .8s .3s var(--ease-out);
  pointer-events:none;
}
.cinema-backdrop.active .cinema-ambient { opacity:1; }

.cinema-vignette {
  position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(0,0,0,.85) 100%);
  opacity:0; transition:opacity .6s .2s;
}
.cinema-backdrop.active .cinema-vignette { opacity:1; }

.cinema-grain {
  position:absolute; inset:0; pointer-events:none; opacity:0;
  mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.06'/%3E%3C/svg%3E");
  animation:grainAnim .08s steps(1) infinite;
  transition:opacity .4s;
}
.cinema-backdrop.active .cinema-grain { opacity:1; }

.cinema-screen {
  position:absolute;
  border-radius:4px;
  overflow:hidden;
  will-change:top,left,width,height;
  box-shadow:0 0 0 0 rgba(201,168,76,0);
}
.cinema-screen.zoom-out {
  transition:
    top    .62s cubic-bezier(0.16,1,0.3,1),
    left   .62s cubic-bezier(0.16,1,0.3,1),
    width  .62s cubic-bezier(0.16,1,0.3,1),
    height .62s cubic-bezier(0.16,1,0.3,1),
    border-radius .62s cubic-bezier(0.16,1,0.3,1),
    box-shadow .6s .3s;
  box-shadow:0 0 120px rgba(201,168,76,.12), 0 50px 160px rgba(0,0,0,.95);
}
.cinema-screen.zoom-in {
  transition:
    top    .5s cubic-bezier(0.77,0,0.175,1),
    left   .5s cubic-bezier(0.77,0,0.175,1),
    width  .5s cubic-bezier(0.77,0,0.175,1),
    height .5s cubic-bezier(0.77,0,0.175,1),
    border-radius .5s,
    opacity .3s,
    box-shadow .3s;
}

@keyframes cameraShake {
  0%  { transform:translate(0,0) rotate(0deg); }
  15% { transform:translate(-3px,2px) rotate(-.3deg); }
  30% { transform:translate(2px,-3px) rotate(.2deg); }
  45% { transform:translate(-2px,1px) rotate(-.1deg); }
  60% { transform:translate(1px,-1px) rotate(.1deg); }
  75% { transform:translate(-1px,1px) rotate(0deg); }
  100%{ transform:translate(0,0) rotate(0deg); }
}
.cinema-screen.shake { animation:cameraShake .45s ease forwards; }
.cinema-screen.zoom-out { filter:blur(0px); }

.screen-edge-glow {
  position:absolute; inset:-1px; border-radius:5px; pointer-events:none; z-index:10;
  box-shadow:inset 0 0 0 1px rgba(201,168,76,.18);
  opacity:0; transition:opacity .5s .4s;
}
.cinema-backdrop.active .screen-edge-glow { opacity:1; }

.screen-curtain {
  position:absolute; top:0; left:0; right:0; height:3px;
  background:linear-gradient(90deg, transparent 0%, rgba(201,168,76,.15) 30%, rgba(201,168,76,.3) 50%, rgba(201,168,76,.15) 70%, transparent 100%);
  opacity:0; transition:opacity .4s .5s; pointer-events:none; z-index:11;
}
.screen-curtain-b {
  position:absolute; bottom:0; left:0; right:0; height:3px;
  background:linear-gradient(90deg, transparent 0%, rgba(201,168,76,.15) 30%, rgba(201,168,76,.3) 50%, rgba(201,168,76,.15) 70%, transparent 100%);
  opacity:0; transition:opacity .4s .5s; pointer-events:none; z-index:11;
}
.cinema-backdrop.active .screen-curtain,
.cinema-backdrop.active .screen-curtain-b { opacity:1; }

.cinema-video {
  width:100%; height:100%; display:block; background:#000;
  cursor:auto;
}
.cinema-iframe { width:100%; height:100%; border:none; display:block; }

.cinema-controls {
  position:absolute; bottom:0; left:0; right:0; z-index:20;
  padding:12px 18px 16px;
  background:linear-gradient(to top, rgba(3,2,1,.96) 50%, transparent);
  display:flex; flex-direction:column; gap:9px;
  opacity:0; transform:translateY(6px);
  transition:opacity .3s, transform .3s;
}
.cinema-controls.show { opacity:1; transform:translateY(0); }

.cp-track {
  position:relative; height:3px; background:rgba(201,168,76,.16);
  border-radius:2px; cursor:pointer;
}
.cp-fill {
  height:100%; border-radius:2px;
  background:linear-gradient(90deg, var(--gold-dim), var(--gold));
  pointer-events:none;
}
.cp-thumb {
  position:absolute; top:50%; transform:translate(-50%,-50%) scale(0);
  width:13px; height:13px; background:var(--gold); border-radius:50%;
  pointer-events:none; transition:transform .2s var(--ease-elastic);
  box-shadow:0 0 10px var(--gold-glow);
}
.cp-track:hover .cp-thumb { transform:translate(-50%,-50%) scale(1); }

.cp-row { display:flex; align-items:center; gap:8px; }
.cp-btn {
  width:32px; height:32px; border:none; background:transparent;
  color:rgba(240,232,208,.65); cursor:pointer; display:flex; align-items:center;
  justify-content:center; border-radius:50%; flex-shrink:0;
  transition:background .2s, color .2s, transform .2s var(--ease-elastic);
}
.cp-btn:hover { background:rgba(201,168,76,.14); color:var(--gold); transform:scale(1.18); }
.cp-vol {
  height:3px; background:rgba(201,168,76,.18); border-radius:2px;
  cursor:pointer; width:66px; flex-shrink:0; position:relative;
}
.cp-vol-fill { height:100%; background:var(--gold); border-radius:2px; pointer-events:none; }
.cp-time { font-size:10px; letter-spacing:1.5px; color:rgba(240,232,208,.38); font-family:var(--font-body); margin-left:2px; }
.cp-spacer { flex:1; }

.cinema-title {
  position:absolute; top:0; left:0; right:0; z-index:20;
  padding:16px 18px;
  background:linear-gradient(to bottom, rgba(3,2,1,.92), transparent);
  display:flex; align-items:flex-start; justify-content:space-between;
  opacity:0; transform:translateY(-6px);
  transition:opacity .3s, transform .3s;
}
.cinema-title.show { opacity:1; transform:translateY(0); }
.ct-cat { font-size:9px; letter-spacing:4px; text-transform:uppercase; color:var(--gold); opacity:.8; }
.ct-name { font-family:var(--font-display); font-size:16px; font-weight:700; color:var(--cream); margin-top:2px; }
.ct-close {
  width:34px; height:34px; border:1px solid rgba(201,168,76,.2);
  border-radius:50%; background:rgba(3,2,1,.65); cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  color:rgba(240,232,208,.5); flex-shrink:0;
  transition:all .3s var(--ease-out);
}
.ct-close:hover { border-color:var(--gold); color:var(--gold); background:rgba(201,168,76,.1); transform:scale(1.1) rotate(90deg); }

.cinema-big-play {
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%) scale(0);
  width:72px; height:72px; border:2px solid rgba(201,168,76,.55);
  border-radius:50%; display:flex; align-items:center; justify-content:center;
  background:rgba(3,2,1,.6); backdrop-filter:blur(8px);
  transition:transform .35s var(--ease-elastic), opacity .2s;
  pointer-events:none; z-index:15;
}
.cinema-big-play.show { transform:translate(-50%,-50%) scale(1); }

.cinema-coming {
  position:absolute; inset:0; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:14px; background:#030201;
}

.cinema-hint {
  position:absolute; bottom:70px; left:50%; transform:translateX(-50%);
  font-size:9px; letter-spacing:3px; text-transform:uppercase;
  color:rgba(201,168,76,.3); white-space:nowrap;
  opacity:0; transition:opacity .4s .8s; pointer-events:none; z-index:20;
}
.cinema-backdrop.active .cinema-hint { opacity:1; }

/* ── Service cards ── */
.service-card { background:var(--glass); border:1px solid var(--glass-border); backdrop-filter:blur(18px); padding:36px 32px; position:relative; overflow:hidden; transition:transform .5s var(--ease-out),box-shadow .5s,border-color .4s; will-change:transform; }
.service-card::before { content:''; position:absolute; top:0; left:-120%; right:120%; height:1px; background:linear-gradient(90deg,transparent,var(--gold),transparent); transition:left .6s var(--ease-out),right .6s var(--ease-out); }
.service-card:hover::before { left:0; right:0; }
.service-card:hover { box-shadow:0 28px 60px rgba(0,0,0,.5),0 0 40px rgba(201,168,76,.05); border-color:rgba(201,168,76,.22); }
.service-icon-wrap { font-size:28px; margin-bottom:20px; display:inline-block; transition:transform .5s var(--ease-elastic); }
.service-card:hover .service-icon-wrap { transform:scale(1.25) rotate(-10deg); }
.service-glow { position:absolute; width:150px; height:150px; background:radial-gradient(circle,rgba(201,168,76,.1),transparent 70%); opacity:0; transition:opacity .5s; pointer-events:none; border-radius:50%; }
.service-card:hover .service-glow { opacity:1; }

/* ── Timeline ── */
.tl-line-bg { position:absolute; left:14px; top:0; bottom:0; width:1px; background:rgba(201,168,76,.07); }
.tl-line-fill { position:absolute; left:14px; top:0; width:1px; height:0; background:linear-gradient(to bottom,var(--gold),rgba(201,168,76,.05)); transition:height 1.4s var(--ease-cinema); }
.tl-line-fill.drawn { height:100%; }
.tl-dot { width:14px; height:14px; border:1.5px solid var(--gold); border-radius:50%; background:var(--dark); box-shadow:0 0 14px rgba(201,168,76,.28); transition:box-shadow .4s,transform .4s var(--ease-elastic); position:absolute; left:-53px; top:6px; }
.timeline-item:hover .tl-dot { box-shadow:0 0 28px rgba(201,168,76,.65); transform:scale(1.35); }
.tl-num { font-family:var(--font-display); font-size:72px; font-weight:900; color:transparent; -webkit-text-stroke:1px rgba(201,168,76,.1); position:absolute; left:-120px; top:-20px; line-height:1; }

/* ── About glare ── */
.about-glare { position:absolute; inset:0; pointer-events:none; opacity:0; transition:opacity .25s; }

/* ── Skill tags ── */
.skill-tag { font-size:10px; letter-spacing:2px; text-transform:uppercase; padding:7px 16px; border:1px solid rgba(201,168,76,.17); color:rgba(240,232,208,.42); transition:all .35s; display:inline-block; }
.skill-tag:hover { border-color:var(--gold); color:var(--gold); background:rgba(201,168,76,.06); transform:translateY(-2px); }

/* ── Testimonials ── */
.ttest-track { display:flex; gap:24px; width:max-content; animation:tScroll 32s linear infinite; margin-top:60px; }
.ttest-track:hover { animation-play-state:paused; }
@keyframes tScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.ttest-card { width:400px; flex-shrink:0; background:var(--glass); border:1px solid var(--glass-border); backdrop-filter:blur(18px); padding:36px; position:relative; overflow:hidden; transition:border-color .4s,transform .4s var(--ease-out),box-shadow .4s; }
.ttest-card::before { content:'"'; font-family:var(--font-display); font-size:120px; font-weight:900; position:absolute; top:-20px; right:16px; color:rgba(201,168,76,.04); line-height:1; }
.ttest-card:hover { border-color:rgba(201,168,76,.28); transform:translateY(-6px) scale(1.01); box-shadow:0 20px 50px rgba(0,0,0,.4); }

/* ── Contact ── */
.contact-link { display:flex; align-items:center; gap:16px; color:rgba(240,232,208,.42); text-decoration:none; font-size:14px; letter-spacing:1px; border-bottom:1px solid rgba(201,168,76,.07); padding-bottom:20px; transition:color .3s,padding-left .35s; }
.contact-link:last-child { border-bottom:none; }
.contact-link:hover { color:var(--gold); padding-left:8px; }

.f-group { position:relative; margin-bottom:32px; }
.f-input { width:100%; background:transparent; border:0; border-bottom:1px solid rgba(201,168,76,.16); padding:16px 0 10px; color:var(--cream); font-family:var(--font-body); font-size:15px; outline:none; transition:border-color .3s; display:block; }
.f-input:focus { border-bottom-color:var(--gold); }
.f-input::placeholder { color:transparent; }
.f-label { position:absolute; top:16px; left:0; font-size:9px; letter-spacing:4px; text-transform:uppercase; color:rgba(201,168,76,.45); transition:top .3s,font-size .3s,color .3s; pointer-events:none; }
.f-input:focus ~ .f-label, .f-input:not(:placeholder-shown) ~ .f-label { top:-8px; font-size:8px; color:var(--gold); }
.f-bar { position:absolute; bottom:0; left:0; height:1px; width:0; background:linear-gradient(90deg,var(--gold),rgba(201,168,76,.2)); transition:width .45s var(--ease-out); }
.f-input:focus ~ .f-bar { width:100%; }

.submit-btn { width:100%; padding:18px; background:transparent; border:1px solid rgba(201,168,76,.35); color:var(--gold); font-family:var(--font-body); font-size:11px; letter-spacing:4px; text-transform:uppercase; cursor:none; position:relative; overflow:hidden; transition:color .4s,box-shadow .4s; }
.submit-btn::before { content:''; position:absolute; inset:0; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .5s var(--ease-out); }
.submit-btn:hover::before { transform:scaleX(1); }
.submit-btn:hover { color:var(--dark); box-shadow:0 0 40px rgba(201,168,76,.22); }
.submit-btn span { position:relative; z-index:1; }
.wa-icon { display:inline-block; transition:transform .4s var(--ease-elastic); }
.submit-btn:hover .wa-icon { transform:scale(1.3) rotate(15deg); }

/* ── Play indicator ── */
.play-indicator { width:62px; height:62px; border:1.5px solid rgba(201,168,76,.45); border-radius:50%; display:flex; align-items:center; justify-content:center; animation:playPulse 2.5s ease-in-out infinite; cursor:none; transition:transform .3s var(--ease-elastic),background .3s; }
.play-indicator:hover { transform:scale(1.18); background:rgba(201,168,76,.12); }
@keyframes playPulse { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,.38)} 50%{box-shadow:0 0 0 18px rgba(201,168,76,0)} }

/* ── Pulse dot ── */
.pulse-dot { width:6px; height:6px; background:var(--gold); border-radius:50%; display:inline-block; margin-right:8px; animation:pdot 1.5s ease-in-out infinite; }
@keyframes pdot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.7);opacity:.5} }

/* ── Social ── */
/* TASK 2: Added box-shadow glow on hover */
.social-link {
  width:40px; height:40px; border:1px solid rgba(201,168,76,.1);
  display:flex; align-items:center; justify-content:center;
  color:rgba(240,232,208,.32); text-decoration:none;
  transition:all .35s var(--ease-out);
}
.social-link:hover {
  border-color:var(--gold); color:var(--gold);
  background:rgba(201,168,76,.05); transform:translateY(-3px);
  box-shadow:0 0 18px rgba(201,168,76,.2), 0 6px 20px rgba(0,0,0,.4);
}

/* TASK 3: Footer brand button */
.footer-brand {
  font-family:var(--font-display); font-size:26px; font-weight:900;
  color:var(--cream); letter-spacing:4px;
  background:none; border:none; padding:0;
  cursor:none;
  transition:color .35s, text-shadow .35s;
}
.footer-brand:hover {
  color:var(--gold);
  text-shadow:0 0 32px rgba(201,168,76,.4);
}

/* ── Featured entrance ── */
@keyframes featIn { from{opacity:0;transform:scale(.97);filter:blur(8px)} to{opacity:1;transform:scale(1);filter:blur(0)} }
.feat-inner { opacity:0; }
.feat-inner.entered { animation:featIn .9s var(--ease-out) forwards; }

body::after { content:''; position:fixed; inset:0; z-index:9988; pointer-events:none; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); opacity:.3; mix-blend-mode:overlay; }

@media (max-width:900px) {
  .nav-desktop{display:none !important}
  .hero-bottom-bar{padding:0 24px 24px !important}
  .about-grid{grid-template-columns:1fr !important}
  .contact-grid{grid-template-columns:1fr !important}
  .form-row-grid{grid-template-columns:1fr !important}
  .tl-num{display:none !important}
}
`;

/* ══ DATA ══ */
const WORK = [
  {cat:"Short Film",   title:"Echoes of Tomorrow", img:"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=700", video:"https://www.w3schools.com/html/mov_bbb.mp4"},
  {cat:"Brand Film",   title:"Vision 2025",         img:"https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=700", video:"https://www.youtube.com/embed/dQw4w9WgXcQ"},
  {cat:"Music Video",  title:"Midnight Drive",      img:"https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=700", video:"https://www.w3schools.com/html/movie.mp4"},
  {cat:"Documentary",  title:"Faces of Courage",    img:"https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=700", video:""},
  {cat:"Commercial",   title:"The Golden Hour",     img:"https://www.nyfa.edu/wp-content/uploads/2023/12/producingresources-1024x683.jpg", video:"https://www.w3schools.com/html/mov_bbb.mp4"},
  {cat:"Social Media", title:"Viral Stories Reel",  img:"https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=700", video:""},
  
  
];

const SERVICES = [
  {icon:"🎬",title:"Video Editing",    desc:"From raw footage to polished masterpiece. Seamless cuts, rhythm-driven pacing, and narrative clarity that keeps audiences hooked from frame one."},
  {icon:"🎨",title:"Color Grading",    desc:"Cinematic color science. Custom LUTs, scene-by-scene correction, and atmospheric grade that transforms your footage into an emotional experience."},
  {icon:"✨",title:"Motion Graphics",  desc:"Kinetic typography, logo animations, and dynamic lower thirds. Every element moves with intention to amplify your message."},
  {icon:"📱",title:"Reels & Shorts",   desc:"Hook-driven, algorithm-ready short-form content for Instagram, YouTube Shorts & TikTok. Engineered to stop the scroll."},
  {icon:"🔊",title:"Sound Design",     desc:"Music synchronization, ambient layering, and foley mixing that completes the sensory experience your visuals deserve."},
  {icon:"🎥",title:"Thumbnail Design", desc:"Click-worthy, high-contrast thumbnails built with A/B tested visual psychology. More clicks. More views. More growth."},
];

const PROCESS = [
  {num:"01",step:"Step One",  title:"Discovery & Planning", desc:"We kick off with a deep dive into your vision — understanding your audience, tone, goals, and references. A clear creative brief ensures every edit is purposeful from the start."},
  {num:"02",step:"Step Two",  title:"Editing & Refinement", desc:"Raw footage transforms into a structured narrative. Color grading, sound design, and motion graphics are layered with intent. Revisions are handled swiftly with clear communication."},
  {num:"03",step:"Step Three",title:"Delivery & Beyond",    desc:"Final files delivered in platform-optimized formats. Post-delivery support for feedback rounds and versioning. Your satisfaction is the closing frame of every project."},
];

const TESTIMONIALS = [
  {stars:5,text:"Krish understood the vibe of my brand immediately. The reel he delivered was beyond what I imagined — it felt cinematic yet authentic. Views tripled within a week.",name:"Arjun Mehta", role:"Fitness Creator · 80K Followers",  init:"A"},
  {stars:5,text:"Our product launch video got 200K+ views organically. The color grading gave it a premium feel our team couldn't achieve before. Highly recommend Krish.",name:"Sneha Gupta", role:"E-Commerce Founder · D2C Brand",   init:"S"},
  {stars:5,text:"Extremely detail-oriented and communicative throughout. The music video he cut for us had tears in our eyes on first watch. Pure emotion.",name:"Rahul Iyer",  role:"Musician · Independent Artist",  init:"R"},
  {stars:4,text:"Fast turnaround, creative suggestions, always open to feedback. Krish is the kind of editor who actually cares about the story, not just the deadline.",name:"Priya Sharma",role:"Travel Vlogger · YouTube",          init:"P"},
  {stars:5,text:"Our corporate documentary needed to feel human, not corporate. Krish nailed it — warm tones, beautiful transitions, and a narrative that actually told our story.",name:"Vikram Nair", role:"Marketing Director · Tech Startup",init:"V"},
];

/* ── TASK 2: SOCIALS — shape changed to {path, href}
   href kept as "#" per your instruction (placeholder, opens new tab) ── */
const SOCIALS = {
  Instagram: {
    href: "https://www.instagram.com/",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  YouTube: {
    href: "#",
    path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  LinkedIn: {
    href: "#",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  Facebook: {
    href: "#",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
};

/* ══ SMOOTH SCROLL PROGRESS ══ */
function useSmoothScroll() {
  useEffect(() => {
    let raf;
    const tick = () => {
      const bar = document.getElementById("scroll-progress");
      if (bar) {
        const max = document.body.scrollHeight - window.innerHeight;
        bar.style.width = max > 0 ? (window.scrollY / max * 100) + "%" : "0%";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
}

/* ══ SCROLL REVEAL ══ */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.07 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ══ SHARED SECTION HEADER ══ */
function SH({ label, title, em }) {
  return (
    <>
      <div className="reveal">
        <p style={{fontSize:10,letterSpacing:6,textTransform:"uppercase",color:"var(--gold)",marginBottom:16,opacity:.7}}>{label}</p>
      </div>
      <div className="reveal reveal-delay-1">
        <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(36px,5vw,70px)",fontWeight:700,lineHeight:1.05,color:"var(--cream)",marginBottom:24}}>
          {title}<br/><em style={{fontStyle:"italic",color:"var(--gold)"}}>{em}</em>
        </h2>
      </div>
      <div className="reveal reveal-delay-2">
        <div style={{width:56,height:1,background:"linear-gradient(90deg,var(--gold),transparent)",marginBottom:56,opacity:.55}}/>
      </div>
    </>
  );
}

/* ══ CURSOR ══ */
function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const lblRef  = useRef(null);
  const m = useRef({mx:0,my:0,rx:0,ry:0});

  useEffect(() => {
    const onMove = e => { m.current.mx = e.clientX; m.current.my = e.clientY; };
    const onOver = e => {
      const el = e.target.closest("a,button,.work-card,.service-card,.ttest-card,.play-indicator,[data-cursor]");
      if (el) {
        document.body.classList.add("cur-hover");
        if (lblRef.current) lblRef.current.textContent = el.dataset.cursor || "VIEW";
      }
    };
    const onOut = () => document.body.classList.remove("cur-hover");
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);
    let raf;
    const tick = () => {
      const p = m.current;
      p.rx += (p.mx - p.rx) * 0.10;
      p.ry += (p.my - p.ry) * 0.10;
      if (dotRef.current)  { dotRef.current.style.left  = p.mx+"px"; dotRef.current.style.top  = p.my+"px"; }
      if (ringRef.current) { ringRef.current.style.left = p.rx+"px"; ringRef.current.style.top = p.ry+"px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div id="cursor">
      <div id="cursor-dot"  ref={dotRef}  />
      <div id="cursor-ring" ref={ringRef}><span id="cursor-label" ref={lblRef}/></div>
    </div>
  );
}

/* ══ LOADER ══ */
function Loader({onDone}) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(p + Math.random()*11, 100);
      setPct(Math.floor(p));
      if (p >= 100) { clearInterval(iv); setTimeout(onDone, 600); }
    }, 100);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{position:"fixed",inset:0,zIndex:99999,background:"var(--dark)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{display:"flex",gap:5,marginBottom:40}}>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {[0,1,2,3].map(i=><div key={i} className="hole" style={{animationDelay:`${i*.2}s`}}/>)}
        </div>
        <div style={{width:120,height:80,border:"2px solid var(--gold-dim)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{position:"absolute",inset:4,border:"1px solid rgba(201,168,76,.12)"}}/>
          <span style={{fontFamily:"var(--font-display)",fontSize:11,letterSpacing:4,color:"var(--gold)",opacity:.55}}>35MM</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {[0,1,2,3].map(i=><div key={i} className="hole" style={{animationDelay:`${i*.2}s`}}/>)}
        </div>
      </div>
      <div className="loader-name">KRISH AGARWAL</div>
      <div style={{width:240,height:1,background:"rgba(201,168,76,.1)",marginTop:32,position:"relative",overflow:"hidden"}}>
        <div className="loader-bar"/>
      </div>
      <div style={{fontSize:10,letterSpacing:4,color:"var(--gold)",marginTop:16,opacity:.45}}>{pct}%</div>
    </div>
  );
}

/* ══ NAV ══
   TASK 4: Replaced href anchor jumps with JS preventDefault + scrollIntoView
   Works for both scrolling DOWN and UP to any section ══ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, {passive:true});
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Smooth scroll helper — used by all nav links */
  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:"22px 60px",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled?"rgba(13,12,10,.9)":"linear-gradient(to bottom,rgba(13,12,10,.8),transparent)",backdropFilter:scrolled?"blur(22px)":"none",borderBottom:scrolled?"1px solid rgba(201,168,76,.06)":"none",transition:"all .4s"}}>
      <a
        href="#hero"
        onClick={e => scrollTo(e, "hero")}
        style={{fontFamily:"var(--font-display)",fontSize:21,fontWeight:700,color:"var(--cream)",textDecoration:"none",letterSpacing:2}}
      >
        CutNflow<span style={{color:"var(--gold)"}}></span>
      </a>

      <ul className="nav-desktop" style={{display:"flex",gap:40,listStyle:"none"}}>
        {["work","services","about","contact"].map(s=>(
          <li key={s}>
            <a
              href={`#${s}`}
              className="nav-link"
              onClick={e => scrollTo(e, s)}
            >
              {s[0].toUpperCase()+s.slice(1)}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="nav-cta"
        onClick={e => scrollTo(e, "contact")}
      >
        <span>Let's Talk</span>
      </a>
    </nav>
  );
}

/* ══ HERO ══ */
function Hero() {
  const b1=useRef(null), b2=useRef(null), b3=useRef(null);
  const spotRef=useRef(null), wrapRef=useRef(null), clapWrap=useRef(null);
  const [ck, setCk] = useState(0);

  useEffect(() => {
    const fn = () => {
      const sy = window.scrollY;
      if(b1.current) b1.current.style.transform=`translateY(${sy*.22}px)`;
      if(b2.current) b2.current.style.transform=`translateY(${sy*.13}px)`;
      if(b3.current) b3.current.style.transform=`translateY(${sy*.28}px)`;
    };
    window.addEventListener("scroll", fn, {passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    const fn = e => {
      if(!spotRef.current||!wrapRef.current) return;
      const r = wrapRef.current.getBoundingClientRect();
      const x = ((e.clientX-r.left)/r.width*100).toFixed(1);
      const y = ((e.clientY-r.top)/r.height*100).toFixed(1);
      spotRef.current.style.background = `radial-gradient(circle 340px at ${x}% ${y}%, rgba(201,168,76,.052), transparent 70%)`;
    };
    window.addEventListener("mousemove", fn);
    return ()=>window.removeEventListener("mousemove",fn);
  },[]);

  const fireClap = () => {
    setCk(k=>k+1);
    if(clapWrap.current){
      clapWrap.current.classList.remove("clap-shake");
      void clapWrap.current.offsetWidth;
      setTimeout(()=>{ if(clapWrap.current) clapWrap.current.classList.add("clap-shake"); }, 170);
    }
  };

  const bBase = {flex:1,backgroundSize:"cover",backgroundPosition:"center",willChange:"transform"};
  const letters = (str, startDelay, italic=false) => str.split("").map((c,i)=>(
    <span key={i} className="hero-letter" style={{animationDelay:`${startDelay+i*.058}s`, ...(italic?{fontStyle:"italic",color:"var(--gold)"}:{})}}>
      {c==" "?"\u00a0":c}
    </span>
  ));

  return (
    <section id="hero" ref={wrapRef} style={{position:"relative",height:"100vh",overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{position:"absolute",inset:0,display:"flex"}}>
        <div ref={b1} style={{...bBase,backgroundImage:"url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800')",opacity:.09,filter:"saturate(.2)"}}/>
        <div ref={b2} style={{...bBase,backgroundImage:"url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800')",opacity:.15,filter:"saturate(.28)"}}/>
        <div ref={b3} style={{...bBase,backgroundImage:"url('https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800')",opacity:.09,filter:"saturate(.18)"}}/>
      </div>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 80% at 50% 50%,transparent 10%,var(--dark) 82%)",zIndex:1}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"50%",background:"linear-gradient(to top,var(--dark),transparent)",zIndex:2}}/>
      <div ref={spotRef} className="hero-spotlight"/>
      <div style={{position:"relative",zIndex:4,textAlign:"center"}}>
        <p className="hero-eyebrow" style={{fontSize:11,letterSpacing:7,textTransform:"uppercase",color:"var(--gold)",marginBottom:28,opacity:.75}}>
          Video Editor &amp; Storyteller
        </p>
        <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(58px,10vw,126px)",fontWeight:900,lineHeight:.92,letterSpacing:-3,color:"var(--cream)"}}>
          <div>{letters("CutNFlow", 2.6)}</div>
          <div>{letters("Media", 2.9, true)}</div>
        </h1>
        <p className="hero-tagline" style={{fontSize:"clamp(11px,1.4vw,14px)",letterSpacing:5,textTransform:"uppercase",color:"rgba(240,232,208,.35)",marginTop:30}}>
          Crafting Stories Through Motion
        </p>
      </div>
      <div className="hero-bottom-bar">
        <div style={{fontFamily:"var(--font-display)",fontSize:"clamp(32px,7vw,94px)",fontWeight:900,lineHeight:1,color:"transparent",WebkitTextStroke:"1px rgba(201,168,76,.18)",letterSpacing:-3,userSelect:"none"}}>K.Agarwal</div>
        <div ref={clapWrap} onClick={fireClap} style={{width:88,cursor:"none",filter:"drop-shadow(0 0 22px rgba(201,168,76,.22))",perspective:200}} data-cursor="CLAP">
          <div key={ck} className={`clap-top${ck>0?" clap-fire":""}`}>
            <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(-45deg,#1d1d1d 0px,#1d1d1d 7px,#c9a84c 7px,#c9a84c 11px)",opacity:.82}}/>
          </div>
          <div style={{background:"#161616",border:"1px solid #282828",borderTop:"none",padding:"8px 7px",fontSize:7,letterSpacing:1,color:"var(--cream)",opacity:.72}}>
            {[["SCENE","01"],["TAKE","01"],["DIR","K.Agarwal"]].map(([l,v])=>(
              <div key={l} style={{marginBottom:2}}><span style={{color:"var(--gold)",fontWeight:600}}>{l}:</span> {v}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="hero-scroll-wrap">
        <span style={{fontSize:8,letterSpacing:5,textTransform:"uppercase",color:"rgba(201,168,76,.38)"}}>Scroll</span>
        <div className="scroll-line"/>
      </div>
    </section>
  );
}

/* ══ CINEMA HOOK ══ */
function useCinema() {
  const [active, setActive]   = useState(null);
  const [phase, setPhase]     = useState("closed");
  const backdropRef = useRef(null);
  const screenRef   = useRef(null);
  const videoRef    = useRef(null);
  const startRect   = useRef(null);
  const ctrlTimer   = useRef(null);

  const [playing,  setPlaying]  = useState(false);
  const [muted,    setMuted]    = useState(false);
  const [volume,   setVolume]   = useState(0.9);
  const [progress, setProgress] = useState(0);
  const [curTime,  setCurTime]  = useState(0);
  const [dur,      setDur]      = useState(0);
  const [ctrlShow, setCtrlShow] = useState(false);

  const isEmbed = url => url && (url.includes("youtube.com") || url.includes("vimeo.com") || url.includes("youtu.be"));

  const targetRect = () => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const maxW = vw * 0.90, maxH = vh * 0.88;
    let w = maxW, h = w * (9/16);
    if (h > maxH) { h = maxH; w = h * (16/9); }
    return { left:(vw-w)/2, top:(vh-h)/2, width:w, height:h };
  };

  const open = (item, cardEl) => {
    if (phase !== "closed") return;
    const cr = cardEl.getBoundingClientRect();
    startRect.current = { left:cr.left, top:cr.top, width:cr.width, height:cr.height };
    setActive(item);
    setPhase("opening");
    setPlaying(false); setProgress(0); setCurTime(0); setDur(0);
  };

  useEffect(() => {
    if (phase !== "opening" || !active || !screenRef.current || !backdropRef.current) return;
    const scr = screenRef.current;
    const sr  = startRect.current;
    scr.classList.remove("zoom-out","zoom-in","shake");
    Object.assign(scr.style, {
      left:   sr.left   + "px",
      top:    sr.top    + "px",
      width:  sr.width  + "px",
      height: sr.height + "px",
      opacity:"0",
      borderRadius: "3px",
    });
    backdropRef.current.classList.add("active");
    document.body.classList.add("cinema-active");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      scr.classList.add("zoom-out");
      scr.style.opacity = "1";
      const tr = targetRect();
      Object.assign(scr.style, {
        left:   tr.left   + "px",
        top:    tr.top    + "px",
        width:  tr.width  + "px",
        height: tr.height + "px",
        borderRadius: "4px",
      });
      setTimeout(() => {
        scr.classList.add("shake");
        setPhase("open");
        if (videoRef.current && !isEmbed(active.video)) {
          videoRef.current.muted = false;
          videoRef.current.play().then(() => { setPlaying(true); setMuted(false); }).catch(() => {});
        }
        showCtrl();
      }, 640);
    }));
  }, [phase, active]);

  const close = () => {
    if (phase === "closed" || !screenRef.current || !backdropRef.current) return;
    const scr = screenRef.current;
    const sr  = startRect.current;
    if (videoRef.current) videoRef.current.pause();
    scr.classList.remove("zoom-out","shake");
    scr.classList.add("zoom-in");
    Object.assign(scr.style, {
      left:        sr.left   + "px",
      top:         sr.top    + "px",
      width:       sr.width  + "px",
      height:      sr.height + "px",
      opacity:     "0",
      borderRadius:"3px",
    });
    backdropRef.current.classList.remove("active");
    document.body.classList.remove("cinema-active");
    setCtrlShow(false);
    setTimeout(() => {
      scr.classList.remove("zoom-in");
      document.body.classList.remove("cinema-active");
      setPhase("closed");
      setActive(null);
      setPlaying(false);
    }, 520);
  };

  useEffect(() => {
    const fn = e => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  });

  useEffect(() => {
    document.body.style.overflow = phase === "closed" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  const showCtrl = () => {
    setCtrlShow(true);
    clearTimeout(ctrlTimer.current);
    ctrlTimer.current = setTimeout(() => setCtrlShow(false), 3200);
  };

  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime, d = videoRef.current.duration || 0;
    setCurTime(t); setDur(d); setProgress(d > 0 ? (t/d)*100 : 0);
  };
  const onLoaded = () => { if (videoRef.current) setDur(videoRef.current.duration || 0); };
  const onEnded  = () => setPlaying(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
    else { videoRef.current.pause(); setPlaying(false); }
    showCtrl();
  };
  const toggleMute = () => {
    if (!videoRef.current) return;
    const m = !videoRef.current.muted;
    videoRef.current.muted = m; setMuted(m); showCtrl();
  };
  const seekTo = e => {
    if (!videoRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    videoRef.current.currentTime = p * (videoRef.current.duration || 0);
    showCtrl();
  };
  const changeVol = e => {
    if (!videoRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const v = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    videoRef.current.volume = v; setVolume(v);
    videoRef.current.muted = v === 0; setMuted(v === 0);
    showCtrl();
  };
  const goFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
  };
  const fmt = s => { if (!isFinite(s)) return "0:00"; return `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`; };

  return {
    active, phase, backdropRef, screenRef, videoRef,
    playing, muted, volume, progress, curTime, dur, ctrlShow,
    open, close, showCtrl, isEmbed,
    togglePlay, toggleMute, seekTo, changeVol, goFullscreen, fmt,
    onTimeUpdate, onLoaded, onEnded,
  };
}

/* ══ CINEMA PLAYER ══ */
function CinemaPlayer({ c }) {
  if (!c.active && c.phase === "closed") return null;
  const embed = c.active && c.isEmbed(c.active.video);
  const hasVideo = c.active && c.active.video;

  return (
    <div ref={c.backdropRef} className="cinema-backdrop" onClick={e => { if (e.target === e.currentTarget || e.target.classList.contains("cinema-dark")) c.close(); }}>
      <div className="cinema-dark" />
      <div className="cinema-ambient" />
      <div className="cinema-vignette" />
      <div className="cinema-grain" />
      <div className="cinema-hint">ESC to exit · SPACE to play / pause</div>
      {c.active && (
        <div ref={c.screenRef} className="cinema-screen" onMouseMove={c.showCtrl} style={{cursor:"auto"}}>
          <div className="screen-edge-glow" />
          <div className="screen-curtain" />
          <div className="screen-curtain-b" />
          {hasVideo ? (
            embed ? (
              <iframe
                className="cinema-iframe"
                src={`${c.active.video}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen title={c.active.title}
              />
            ) : (
              <video
                ref={c.videoRef}
                className="cinema-video"
                style={{cursor: c.ctrlShow ? "auto" : "none"}}
                onClick={c.togglePlay}
                onTimeUpdate={c.onTimeUpdate}
                onLoadedMetadata={c.onLoaded}
                onEnded={c.onEnded}
                playsInline
                loop
              />
            )
          ) : (
            <div className="cinema-coming">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,.35)" strokeWidth="1">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              <div style={{fontFamily:"var(--font-display)",fontSize:24,color:"var(--cream)",opacity:.4,letterSpacing:2}}>Coming Soon</div>
              <div style={{fontSize:9,letterSpacing:4,textTransform:"uppercase",color:"var(--gold)",opacity:.4}}>Video in Production</div>
            </div>
          )}
          {hasVideo && !embed && (
            <div className={`cinema-big-play${!c.playing && c.phase === "open" ? " show" : ""}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--gold)"><path d="M8 5v14l11-7z"/></svg>
            </div>
          )}
          <div className={`cinema-title${c.ctrlShow ? " show" : ""}`}>
            <div>
              <div className="ct-cat">{c.active.cat}</div>
              <div className="ct-name">{c.active.title}</div>
            </div>
            <button className="ct-close" onClick={c.close} title="Close (Esc)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          {hasVideo && !embed && (
            <div className={`cinema-controls${c.ctrlShow ? " show" : ""}`}>
              <div className="cp-track" onClick={c.seekTo}>
                <div className="cp-fill" style={{width:`${c.progress}%`}}/>
                <div className="cp-thumb" style={{left:`${c.progress}%`}}/>
              </div>
              <div className="cp-row">
                <button className="cp-btn" onClick={c.togglePlay} data-cursor={c.playing?"PAUSE":"PLAY"}>
                  {c.playing
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  }
                </button>
                <button className="cp-btn" onClick={c.toggleMute} data-cursor={c.muted?"UNMUTE":"MUTE"}>
                  {c.muted || c.volume === 0
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18V20.1c1.31-.33 2.5-.96 3.5-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                  }
                </button>
                <div className="cp-vol" onClick={c.changeVol}>
                  <div className="cp-vol-fill" style={{width:`${c.muted ? 0 : c.volume*100}%`}}/>
                </div>
                <span className="cp-time">{c.fmt(c.curTime)} / {c.fmt(c.dur)}</span>
                <div className="cp-spacer"/>
                <button className="cp-btn" onClick={c.goFullscreen} title="Fullscreen">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══ WORK SECTION ══
   TASK 1: Added pagination — cardsPerPage=6, hidden when totalPages <= 1
   Cards re-animate with staggered wFadeIn on page change via key prop ══ */
function Work() {
  const c = useCinema();

  /* ── TASK 1: Pagination state ── */
  const cardsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(WORK.length / cardsPerPage);

  /* Slice cards for current page */
  const visibleCards = WORK.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const onMove = useCallback((e, el) => {
    const r = el.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width  - 0.5;
    const cy = (e.clientY - r.top)  / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${cx*8}deg) rotateX(${-cy*6}deg) translateY(-6px) scale(1.015)`;
    const shine = el.querySelector(".work-shine");
    if (shine) {
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      shine.style.background = `radial-gradient(circle 200px at ${x}% ${y}%, rgba(255,255,255,.04), transparent 70%)`;
    }
  }, []);
  const onLeave = useCallback(el => { el.style.transform = ""; }, []);

  /* Inject video src lazily when active changes */
  useEffect(() => {
    if (!c.videoRef.current || !c.active || c.isEmbed(c.active.video)) return;
    c.videoRef.current.src = c.active.video || "";
  }, [c.active]);

  /* On page change: update page then scroll work section into view */
  const goToPage = (page) => {
    setCurrentPage(page);
    /* Slight delay so state updates before scroll */
    setTimeout(() => {
      document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <>
      <section id="work" style={{padding:"120px 60px", background:"var(--charcoal)"}}>
        <SH label="Selected Work" title="Stories I've" em="Shaped"/>

        {/* 3-col grid — responsive via CSS class */}
        <div className="work-grid">
          {visibleCards.map((item, i) => (
            <div
              key={`page${currentPage}-card${i}`}  /* key changes on page → triggers re-mount → re-animates */
              className="work-card work-card-enter"
              data-cursor="PLAY"
              style={{ animationDelay: `${i * 0.08}s` }}
              onClick={e => c.open(item, e.currentTarget)}
              onMouseMove={e => onMove(e, e.currentTarget)}
              onMouseLeave={e => onLeave(e.currentTarget)}
            >
              <img className="work-thumb" src={item.img} alt={item.cat}/>
              <div className="work-play-badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--gold)"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div className="work-overlay">
                <div className="work-cat">{item.cat}</div>
                <div className="work-title">{item.title}</div>
                <div className="work-view">
                  {item.video ? "Watch Film" : "Coming Soon"}
                  <span style={{color:"var(--gold)", marginLeft:4}}>{item.video ? "▶" : "○"}</span>
                </div>
              </div>
              <div className="work-glow"/>
              <div className="work-shine"/>
            </div>
          ))}
        </div>

        {/* Pagination — only renders when WORK has more than cardsPerPage items */}
        {totalPages > 1 && (
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"center",
            gap:8, marginTop:56,
          }}>
            {/* Prev */}
            <button
              className="pag-btn"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              data-cursor="PREV"
              aria-label="Previous page"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`pag-btn${currentPage === page ? " pag-active" : ""}`}
                onClick={() => goToPage(page)}
                data-cursor="PAGE"
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              className="pag-btn"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              data-cursor="NEXT"
              aria-label="Next page"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
        )}
      </section>

      <CinemaPlayer c={c}/>
    </>
  );
}

/* ══ FEATURED ══ */
function Featured() {
  const ref = useRef(null);
  const playBtnRef = useRef(null);
  const c = useCinema();

  /* Featured work item */
  const featuredItem = {
    cat: "Short Film",
    title: "The Art of Perception",
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1400",
    video: "https://www.w3schools.com/html/mov_bbb.mp4"
  };

  /* Inject video src lazily when cinema active changes */
  useEffect(() => {
    if (!c.videoRef.current || !c.active || c.isEmbed(c.active.video)) return;
    c.videoRef.current.src = c.active.video || "";
  }, [c.active]);

  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting&&ref.current) ref.current.classList.add("entered"); });
    },{threshold:.1});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);

  return (
    <>
      <section id="featured" style={{background:"var(--dark)",padding:0,overflow:"hidden"}}>
        <div ref={ref} className="feat-inner" style={{position:"relative",height:"90vh",overflow:"hidden"}}>
          <video style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.38) saturate(.4)"}} autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1400">
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4"/>
          </video>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,rgba(13,12,10,.93) 28%,rgba(13,12,10,.18) 68%,transparent)",display:"flex",alignItems:"center",padding:"0 80px"}}>
            <div style={{maxWidth:560}}>
              <div style={{display:"inline-flex",alignItems:"center",border:"1px solid rgba(201,168,76,.22)",padding:"6px 16px",fontSize:9,letterSpacing:4,textTransform:"uppercase",color:"var(--gold)",marginBottom:28,backdropFilter:"blur(8px)"}}>
                <span className="pulse-dot"/>Most Viewed · Featured Work
              </div>
              <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(34px,5vw,60px)",fontWeight:900,color:"var(--cream)",lineHeight:1,marginBottom:20}}>
                The Art of<br/>Perception
              </h2>
              <p style={{fontSize:15,lineHeight:1.75,color:"rgba(240,232,208,.48)",marginBottom:38}}>
                A cinematic short exploring the boundaries between reality and imagination. Crafted with precision color grading and seamless motion, this piece crossed 500K views organically across platforms.
              </p>
              <div style={{display:"flex",alignItems:"center",gap:24,marginBottom:40}}>
                <div 
                  ref={playBtnRef}
                  className="play-indicator" 
                  data-cursor="PLAY"
                  onClick={e => c.open(featuredItem, playBtnRef.current)}
                  style={{cursor:"none"}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--gold)" style={{marginLeft:3}}><path d="M8 5v14l11-7z"/></svg>
                </div>
                <span style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"rgba(240,232,208,.3)"}}>Play Showreel</span>
              </div>
              <div style={{display:"flex",gap:44}}>
                {[["500K+","Total Views"],["4.9★","Client Rating"],["8 Days","Delivery Time"]].map(([n,l])=>(
                  <div key={l}>
                    <div style={{fontFamily:"var(--font-display)",fontSize:34,fontWeight:700,color:"var(--gold)",lineHeight:1}}>{n}</div>
                    <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"rgba(240,232,208,.32)",marginTop:5}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CinemaPlayer c={c}/>
    </>
  );
}

/* ══ SERVICES ══ */
function Services() {
  const onMove=(e,el)=>{
    const r=el.getBoundingClientRect();
    const cx=(e.clientX-r.left)/r.width-.5, cy=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(700px) rotateY(${cx*11}deg) rotateX(${-cy*9}deg) translateY(-10px) scale(1.01)`;
    const g=el.querySelector(".service-glow");
    if(g){ g.style.left=(e.clientX-r.left-75)+"px"; g.style.top=(e.clientY-r.top-75)+"px"; g.style.bottom="auto"; }
  };
  const onLeave=el=>{ el.style.transform=""; };
  return (
    <section id="services" style={{padding:"120px 60px",background:"linear-gradient(160deg,var(--charcoal),var(--dark))"}}>
      <SH label="What I Offer" title="Crafted with" em="Precision"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18}}>
        {SERVICES.map((s,i)=>(
          <div key={i} className={`service-card reveal reveal-delay-${(i%3)+1}`}
            onMouseMove={e=>onMove(e,e.currentTarget)} onMouseLeave={e=>onLeave(e.currentTarget)} data-cursor="VIEW">
            <span className="service-icon-wrap">{s.icon}</span>
            <h3 style={{fontFamily:"var(--font-display)",fontSize:21,fontWeight:700,color:"var(--cream)",marginBottom:12}}>{s.title}</h3>
            <p style={{fontSize:14,lineHeight:1.8,color:"rgba(240,232,208,.38)"}}>{s.desc}</p>
            <div className="service-glow" style={{position:"absolute"}}/>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══ PROCESS ══ */
function Process() {
  const fillRef = useRef(null);
  useEffect(()=>{
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting&&fillRef.current) fillRef.current.classList.add("drawn"); });
    },{threshold:.05});
    if(fillRef.current) obs.observe(fillRef.current);
    return ()=>obs.disconnect();
  },[]);
  return (
    <section id="process" style={{padding:"120px 60px",background:"var(--dark)"}}>
      <SH label="How It Works" title="The Journey" em="Behind Every Frame"/>
      <div style={{marginTop:80,position:"relative",paddingLeft:60}}>
        <div className="tl-line-bg"/>
        <div ref={fillRef} className="tl-line-fill"/>
        {PROCESS.map((s,i)=>(
          <div key={i} className={`timeline-item reveal${i>0?" reveal-delay-"+i:""}`} style={{position:"relative",marginBottom:80}}>
            <div className="tl-dot"/>
            <div className="tl-num">{s.num}</div>
            <div style={{fontSize:9,letterSpacing:5,textTransform:"uppercase",color:"var(--gold)",marginBottom:12,opacity:.75}}>{s.step}</div>
            <h3 style={{fontFamily:"var(--font-display)",fontSize:30,fontWeight:700,color:"var(--cream)",marginBottom:14}}>{s.title}</h3>
            <p style={{fontSize:15,lineHeight:1.8,color:"rgba(240,232,208,.4)",maxWidth:520}}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ══ ABOUT ══ */
function About() {
  const cardRef=useRef(null), wrapRef=useRef(null);
  useEffect(()=>{
    const wrap=wrapRef.current; if(!wrap) return;
    const onMove=e=>{
      const card=cardRef.current; if(!card) return;
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(700px) rotateY(${x*17}deg) rotateX(${-y*13}deg) scale(1.02)`;
      const glare=card.querySelector(".about-glare");
      if(glare){
        const gx=((e.clientX-r.left)/r.width*100).toFixed(1);
        const gy=((e.clientY-r.top)/r.height*100).toFixed(1);
        glare.style.background=`radial-gradient(ellipse 70% 50% at ${gx}% ${gy}%, rgba(255,255,255,.09), transparent 70%)`;
        glare.style.opacity="1";
      }
    };
    const onLeave=()=>{
      if(cardRef.current){ cardRef.current.style.transform=""; const g=cardRef.current.querySelector(".about-glare"); if(g) g.style.opacity="0"; }
    };
    wrap.addEventListener("mousemove",onMove); wrap.addEventListener("mouseleave",onLeave);
    return ()=>{ wrap.removeEventListener("mousemove",onMove); wrap.removeEventListener("mouseleave",onLeave); };
  },[]);
  return (
    <section id="about" style={{padding:"120px 60px",background:"var(--charcoal)"}}>
      <div className="about-grid" style={{display:"grid",gridTemplateColumns:"0.7fr 1fr",gap:80,alignItems:"center"}}>
        <div ref={wrapRef} className="reveal" style={{position:"relative",perspective:700,maxWidth:300,margin:"0 auto",width:"100%"}}>
          <div ref={cardRef} style={{width:"100%",aspectRatio:"3/4",background:"linear-gradient(135deg,#1e1c14,#2a2516)",border:"1px solid rgba(201,168,76,.1)",overflow:"hidden",position:"relative",transition:"transform .07s",willChange:"transform",borderRadius:1}}>
            <img src="https://images.unsplash.com/photo-1574717025058-2f8737d2e2b7?w=600" alt="Krish Agarwal" style={{width:"100%",height:"100%",objectFit:"cover",filter:"saturate(.5) brightness(.72)"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(13,12,10,.75),transparent 55%)"}}/>
            <div className="about-glare" style={{position:"absolute",inset:0,pointerEvents:"none",transition:"opacity .22s",opacity:0}}/>
          </div>
          <div style={{position:"absolute",inset:-10,border:"1px solid rgba(201,168,76,.05)",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:-18,right:-18,background:"var(--mid)",border:"1px solid rgba(201,168,76,.16)",padding:"16px 22px",backdropFilter:"blur(12px)",zIndex:2}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:32,fontWeight:900,color:"var(--gold)",lineHeight:1}}>2+</div>
            <div style={{fontSize:8,letterSpacing:3,textTransform:"uppercase",color:"rgba(240,232,208,.32)",marginTop:4}}>Years of Passion</div>
          </div>
        </div>
        <div>
          <SH label="About Me" title="Frames Full of" em="Purpose"/>
          <p className="reveal reveal-delay-3" style={{fontSize:15,lineHeight:1.9,color:"rgba(240,232,208,.45)",marginBottom:24}}>
            Hey — I'm Krish. I started editing videos the way most great stories begin: with a feeling I couldn't ignore. What began as trimming family videos evolved into an obsession with pacing, light, and emotion — the invisible thread that holds every great film together.
          </p>
          <p className="reveal reveal-delay-4" style={{fontSize:15,lineHeight:1.9,color:"rgba(240,232,208,.45)",marginBottom:36}}>
            I'm still early in my journey, but I show up to every project with full creative energy and a learner's mindset. I believe great editing isn't about flashy effects — it's about making the viewer feel something real.
          </p>
          <div className="reveal reveal-delay-1" style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {["Premiere Pro","After Effects","DaVinci Resolve","CapCut","Storytelling","Pacing"].map(s=>(
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══ TESTIMONIALS ══ */
function Testimonials() {
  const doubled = [...TESTIMONIALS,...TESTIMONIALS];
  return (
    <section id="testimonials" style={{padding:"120px 0",background:"var(--dark)",overflow:"hidden"}}>
      <div style={{padding:"0 60px"}}>
        <div className="reveal"><p style={{fontSize:10,letterSpacing:6,textTransform:"uppercase",color:"var(--gold)",marginBottom:16,opacity:.7}}>Client Feedback</p></div>
        <div className="reveal reveal-delay-1">
          <h2 style={{fontFamily:"var(--font-display)",fontSize:"clamp(36px,5vw,70px)",fontWeight:700,lineHeight:1.05,color:"var(--cream)"}}>
            What They<br/><em style={{fontStyle:"italic",color:"var(--gold)"}}>Say</em>
          </h2>
        </div>
      </div>
      <div style={{overflow:"hidden"}}>
        <div className="ttest-track">
          {doubled.map((t,i)=>(
            <div key={i} className="ttest-card">
              <div style={{color:"var(--gold)",fontSize:12,letterSpacing:3,marginBottom:16}}>
                {"★".repeat(t.stars)}{"☆".repeat(5-t.stars)}
              </div>
              <p style={{fontSize:14,lineHeight:1.8,color:"rgba(240,232,208,.52)",marginBottom:24}}>{t.text}</p>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold-dim),var(--charcoal))",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-display)",fontSize:15,color:"var(--cream)",fontWeight:700,border:"1px solid rgba(201,168,76,.16)",flexShrink:0}}>
                  {t.init}
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:500,color:"var(--cream)"}}>{t.name}</div>
                  <div style={{fontSize:10,letterSpacing:1,color:"rgba(240,232,208,.28)",marginTop:2}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══ CONTACT ══ */
function Contact() {
  const [form, setForm] = useState({name:"", email:"", budget:"", msg:""});
  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));
  const [sent, setSent] = useState(false);

  const send = () => {
    const t = `Hello Krish! \n\nI found you through your portfolio.\n\n*Name:* ${form.name||"Not provided"}\n*Email:* ${form.email||"Not provided"}\n*Budget:* ${form.budget||"Not provided"}\n\n*Project Details:*\n${form.msg||"No message"}\n\nLooking forward to connecting!`;
    window.open(`https://wa.me/+919903145490?text=${encodeURIComponent(t)}`, "_blank");
    setSent(true);
  };

  return (
    <section id="contact" style={{padding:"120px 60px", background:"var(--charcoal)"}}>
      <div className="contact-grid" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:100, alignItems:"start"}}>
        <div>
          <SH label="Get In Touch" title="Let's Build" em="Something"/>
          <p className="reveal reveal-delay-3" style={{fontSize:15, lineHeight:1.8, color:"rgba(240,232,208,.4)", marginBottom:48}}>
            Have a project in mind? Whether it's a 15-second reel or a feature-length documentary — let's talk about what we can create together. I respond within 24 hours.
          </p>
          <div className="reveal reveal-delay-4" style={{display:"flex", flexDirection:"column"}}>
            {[
              {icon:"✉",  label:"Email",    val:"krish@cutnflow.com",         href:"mailto:krish@cutnflow.com"},
              {icon:"💬", label:"WhatsApp", val:"+919903145490",             href:"https://wa.me/+919903145490"},
              {icon:"📍", label:"Location", val:"India · Available Worldwide", href:"#"},
            ].map(l => (
              <a key={l.label} href={l.href} className="contact-link" target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                <span style={{fontSize:20}}>{l.icon}</span>
                <div>
                  <div style={{fontSize:9, letterSpacing:3, textTransform:"uppercase", color:"var(--gold)", marginBottom:4}}>{l.label}</div>
                  {l.val}
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="reveal reveal-delay-2">
          <div className="f-group">
            <input id="f-name" type="text" className="f-input" placeholder=" "
              value={form.name} onChange={set("name")} autoComplete="off"/>
            <label className="f-label" htmlFor="f-name">Your Name</label>
            <div className="f-bar"/>
          </div>
          <div className="form-row-grid" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20}}>
            <div className="f-group">
              <input id="f-email" type="email" className="f-input" placeholder=" "
                value={form.email} onChange={set("email")} autoComplete="off"/>
              <label className="f-label" htmlFor="f-email">Email Address</label>
              <div className="f-bar"/>
            </div>
            <div className="f-group">
              <input id="f-budget" type="text" className="f-input" placeholder=" "
                value={form.budget} onChange={set("budget")} autoComplete="off"/>
              <label className="f-label" htmlFor="f-budget">Budget (INR)</label>
              <div className="f-bar"/>
            </div>
          </div>
          <div className="f-group">
            <textarea id="f-msg" className="f-input" placeholder=" " rows={5}
              value={form.msg} onChange={set("msg")} style={{resize:"none", minHeight:110}}/>
            <label className="f-label" htmlFor="f-msg">Tell Me About Your Project</label>
            <div className="f-bar"/>
          </div>
          <button className="submit-btn" onClick={send} data-cursor="SEND">
            <span>
              <span className="wa-icon" style={{marginRight:8}}>💬</span>
              {sent ? "Message Sent! ✓" : "Send via WhatsApp →"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ══ FOOTER ══
   TASK 2: social links now open target="_blank" with gold glow hover
   TASK 3: CUTNFLOW brand scrolls to top on click ══ */
function Footer() {
  return (
    <footer style={{
      background:"var(--dark)",
      borderTop:"1px solid rgba(201,168,76,.06)",
      padding:"52px 60px",
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      flexWrap:"wrap",
      gap:24,
    }}>
      {/* TASK 3: Scroll to top on click */}
      <button
        className="footer-brand"
        data-cursor="TOP"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Back to top"
      >
        CUT<span style={{color:"var(--gold)"}}>N</span>FLOW
      </button>

      <p style={{fontSize:10,letterSpacing:2,color:"rgba(240,232,208,.16)",textAlign:"center"}}>
        © 2025 Krish Agarwal · All Rights Reserved<br/>Crafting Motion with Intention
      </p>

      {/* TASK 2: target="_blank" + hover glow via .social-link CSS */}
      <div style={{display:"flex",gap:14}}>
        {Object.entries(SOCIALS).map(([name, { path, href }]) => (
          <a
            key={name}
            href={href}
            className="social-link"
            title={name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d={path}/>
            </svg>
          </a>
        ))}
      </div>
    </footer>
  );
}

/* ══ APP ══ */
export default function App() {
  const [done,setDone]=useState(false);
  useSmoothScroll();
  useScrollReveal();
  return (
    <>
      <style dangerouslySetInnerHTML={{__html:GLOBAL_CSS}}/>
      <div id="scroll-progress"/>
      <div id="grain"/>
      <div id="light-leak"/>
      <Cursor/>
      {!done&&<Loader onDone={()=>setDone(true)}/>}
      <Nav/>
      <Hero/>
      <Work/>
      <Featured/>
      <Services/>
      <Process/>
      <About/>
      <Testimonials/>
      <Contact/>
      <Footer/>
    </>
  );
}