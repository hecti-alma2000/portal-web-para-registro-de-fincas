'use client';

// Página 404 interactiva: "El girasol perdido".
// - El cursor (o el dedo) es el sol: el girasol (el "0" del 404) gira hacia él
//   y el cielo cambia del mediodía al atardecer según la altura del sol.
// - Clic en la tierra = sembrar. Con HARVEST_GOAL semillas llega la cosecha.
// - Un tractor perdido recorre el campo; si lo tocas, salta y pregunta el camino.

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Home, Leaf, MapPinned, RotateCcw, Sprout, Tractor as TractorIcon } from 'lucide-react';

const HARVEST_GOAL = 8;
const MAX_SPROUTS = 24;
const SKY_HEIGHT = 72; // % de la escena ocupada por el cielo

// Ida y vuelta del tractor (posición y volteo comparten el mismo ritmo)
const TRACTOR_LOOP = {
  duration: 30,
  repeat: Infinity,
  ease: 'linear' as const,
  times: [0, 0.48, 0.5, 0.98, 1],
};

type SproutItem ={ id: number; x: number; y: number; scale: number; hue: number; tilt: number };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

// ---------------------------------------------------------------------------
// Girasol (el "0")
// ---------------------------------------------------------------------------
function Sunflower({
  faceX,
  faceY,
  tilt,
  night,
}: {
  faceX: ReturnType<typeof useSpring>;
  faceY: ReturnType<typeof useSpring>;
  tilt: ReturnType<typeof useSpring>;
  night: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="-100 -100 200 200"
      className="w-[clamp(6rem,20vw,13rem)] h-[clamp(6rem,20vw,13rem)] drop-shadow-xl"
      style={{ rotate: tilt }}
      aria-hidden
    >
      {/* Pétalos: dos capas, la exterior "respira" */}
      <motion.g
        animate={reduce ? undefined : { rotate: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <ellipse
            key={`o${i}`}
            cx="0"
            cy="-66"
            rx="15"
            ry="34"
            fill={night ? '#ca8a04' : '#facc15'}
            stroke={night ? '#a16207' : '#eab308'}
            strokeWidth="2"
            transform={`rotate(${i * 22.5})`}
          />
        ))}
      </motion.g>
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse
          key={`i${i}`}
          cx="0"
          cy="-56"
          rx="11"
          ry="26"
          fill={night ? '#eab308' : '#fde047'}
          transform={`rotate(${i * 22.5 + 11.25})`}
        />
      ))}
      {/* Centro con semillas */}
      <circle r="46" fill="#78350f" />
      <circle r="46" fill="url(#seeds)" opacity="0.55" />
      <defs>
        <pattern id="seeds" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="2" fill="#451a03" />
        </pattern>
      </defs>
      {/* Cara que mira hacia el sol */}
      <motion.g style={{ x: faceX, y: faceY }}>
        {night ? (
          <>
            {/* Dormido */}
            <path d="M-22 -8 q8 6 16 0" stroke="#fef3c7" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M6 -8 q8 6 16 0" stroke="#fef3c7" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M-8 16 q8 4 16 0" stroke="#fef3c7" strokeWidth="4" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <motion.g
              animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }}
            >
              <circle cx="-14" cy="-8" r="7" fill="#fef3c7" />
              <circle cx="14" cy="-8" r="7" fill="#fef3c7" />
              <circle cx="-12" cy="-8" r="3.5" fill="#1c1917" />
              <circle cx="16" cy="-8" r="3.5" fill="#1c1917" />
            </motion.g>
            <circle cx="-26" cy="10" r="6" fill="#f97316" opacity="0.45" />
            <circle cx="26" cy="10" r="6" fill="#f97316" opacity="0.45" />
            <path d="M-14 12 q14 14 28 0" stroke="#fef3c7" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          </>
        )}
      </motion.g>
    </motion.svg>
  );
}

// ---------------------------------------------------------------------------
// Tractor perdido
// ---------------------------------------------------------------------------
function LostTractor() {
  const reduce = useReducedMotion();
  const jump = useAnimationControls();
  const [talking, setTalking] = useState(false);

  const honk = async () => {
    setTalking(true);
    setTimeout(() => setTalking(false), 2200);
    await jump.start({ y: [0, -28, 0, -10, 0], transition: { duration: 0.7 } });
  };

  return (
    <motion.div
      className="absolute z-20 bottom-[calc(28%-6px)] w-24 md:w-28"
      initial={{ left: '-12%' }}
      animate={reduce ? { left: '8%' } : { left: ['-12%', '96%', '96%', '-12%', '-12%'] }}
      transition={reduce ? undefined : TRACTOR_LOOP}
    >
      <motion.button
        type="button"
        onClick={honk}
        animate={jump}
        className="relative block w-full cursor-pointer focus:outline-none"
        aria-label="Tractor perdido: haz clic para que pida indicaciones"
      >
        {/* Burbuja (no se refleja con el tractor) */}
        <AnimatePresence>
          {talking ? (
            <motion.span
              key="talk"
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-100 shadow-lg"
            >
              ¡Bip bip! ¿Dónde está la finca?
            </motion.span>
          ) : (
            <motion.span
              key="q"
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-sm font-black text-green-600 shadow-md"
            >
              ?
            </motion.span>
          )}
        </AnimatePresence>
        {/* Solo el dibujo se voltea al dar la vuelta, no la burbuja */}
        <motion.div
          animate={reduce ? undefined : { scaleX: [1, 1, -1, -1, 1] }}
          transition={reduce ? undefined : TRACTOR_LOOP}
        >
        <svg viewBox="0 0 120 80" className="w-full drop-shadow-lg" aria-hidden>
          {/* Humo */}
          {!reduce &&
            [0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx="38"
                cy="14"
                r="5"
                fill="#a1a1aa"
                initial={{ opacity: 0 }}
                animate={{ cy: [14, -6], cx: [38, 30], r: [4, 9], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6 }}
              />
            ))}
          <rect x="34" y="14" width="7" height="20" rx="2" fill="#3f3f46" />
          {/* Cabina */}
          <rect x="52" y="8" width="38" height="34" rx="5" fill="#16a34a" />
          <rect x="58" y="13" width="26" height="18" rx="3" fill="#bae6fd" />
          {/* Cuerpo */}
          <rect x="14" y="34" width="84" height="20" rx="6" fill="#22c55e" />
          <rect x="14" y="38" width="22" height="6" rx="2" fill="#fde047" />
          {/* Ruedas */}
          <motion.g
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '82px', originY: '56px' }}
          >
            <circle cx="82" cy="56" r="20" fill="#27272a" />
            <circle cx="82" cy="56" r="9" fill="#facc15" />
            <rect x="80" y="38" width="4" height="8" fill="#52525b" />
          </motion.g>
          <motion.g
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            style={{ originX: '28px', originY: '64px' }}
          >
            <circle cx="28" cy="64" r="12" fill="#27272a" />
            <circle cx="28" cy="64" r="5" fill="#facc15" />
            <rect x="26.5" y="53" width="3" height="5" fill="#52525b" />
          </motion.g>
        </svg>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Brote sembrado
// ---------------------------------------------------------------------------
function SproutPlant({ item }: { item: SproutItem }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -100%)' }}
    >
      {/* Tierra que salta */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 left-1/2 h-1.5 w-1.5 rounded-full bg-amber-900"
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: (i - 2.5) * 9, y: [0, -14 - (i % 3) * 6, 4], opacity: [1, 1, 0] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      <div
        className="origin-bottom"
        style={{ transform: `rotate(${item.tilt}deg) scale(${item.scale})` }}
      >
      <motion.svg
        viewBox="0 0 40 50"
        className="w-10 h-12 origin-bottom"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 12, delay: 0.1 }}
        aria-hidden
      >
        <path d="M20 50 C20 38 20 30 21 22" stroke={`hsl(${item.hue} 60% 30%)`} strokeWidth="3" fill="none" />
        <motion.path
          d="M21 26 C10 26 4 18 4 10 C14 10 21 16 21 26 Z"
          fill={`hsl(${item.hue} 70% 42%)`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ originX: '21px', originY: '26px' }}
          transition={{ type: 'spring', stiffness: 260, damping: 10, delay: 0.35 }}
        />
        <motion.path
          d="M21 22 C30 22 37 15 37 6 C27 6 21 12 21 22 Z"
          fill={`hsl(${item.hue} 75% 48%)`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ originX: '21px', originY: '22px' }}
          transition={{ type: 'spring', stiffness: 260, damping: 10, delay: 0.5 }}
        />
      </motion.svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Escena principal
// ---------------------------------------------------------------------------
export function NotFoundScene() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const night = mounted && resolvedTheme === 'dark';

  const sceneRef = useRef<HTMLDivElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);

  // Posición del sol (% de la escena), suavizada con resortes
  const sunXRaw = useMotionValue(78);
  const sunYRaw = useMotionValue(18);
  const sunX = useSpring(sunXRaw, { stiffness: 120, damping: 20 });
  const sunY = useSpring(sunYRaw, { stiffness: 120, damping: 20 });
  const sunLeft = useMotionTemplate`${sunX}%`;
  const sunTop = useMotionTemplate`${sunY}%`;

  // Cara e inclinación del girasol
  const faceXRaw = useMotionValue(0);
  const faceYRaw = useMotionValue(0);
  const tiltRaw = useMotionValue(0);
  const faceX = useSpring(faceXRaw, { stiffness: 150, damping: 15 });
  const faceY = useSpring(faceYRaw, { stiffness: 150, damping: 15 });
  const tilt = useSpring(tiltRaw, { stiffness: 80, damping: 12 });

  // Cielo: mediodía (sol alto) -> atardecer (sol bajo). Capa de día y capa de noche.
  const dayTop = useTransform(sunY, [5, 55], ['#38bdf8', '#fb923c']);
  const dayBottom = useTransform(sunY, [5, 55], ['#e0f2fe', '#fde68a']);
  const nightTop = useTransform(sunY, [5, 55], ['#0b1026', '#1e1b4b']);
  const nightBottom = useTransform(sunY, [5, 55], ['#1e293b', '#4c1d95']);
  const daySky = useMotionTemplate`linear-gradient(to bottom, ${dayTop}, ${dayBottom})`;
  const nightSky = useMotionTemplate`linear-gradient(to bottom, ${nightTop}, ${nightBottom})`;

  const [sprouts, setSprouts] = useState<SproutItem[]>([]);
  const [planted, setPlanted] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [harvestKey, setHarvestKey] = useState(0);
  const idRef = useRef(0);

  const lookAt = useCallback(
    (clientX: number, clientY: number) => {
      const flower = flowerRef.current?.getBoundingClientRect();
      if (!flower) return;
      const cx = flower.left + flower.width / 2;
      const cy = flower.top + flower.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      faceXRaw.set((dx / dist) * 14);
      faceYRaw.set((dy / dist) * 12);
      tiltRaw.set(clamp(dx / 25, -22, 22));
    },
    [faceXRaw, faceYRaw, tiltRaw]
  );

  const moveSun = (e: PointerEvent<HTMLDivElement>) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    sunXRaw.set(clamp(x, 4, 96));
    sunYRaw.set(clamp(y, 5, 55));
    lookAt(e.clientX, e.clientY);
    if (!interacted) setInteracted(true);
  };

  // Mirada inicial hacia la posición por defecto del sol
  useEffect(() => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (rect) lookAt(rect.left + rect.width * 0.78, rect.top + rect.height * 0.18);
  }, [lookAt]);

  const plant = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const item: SproutItem = {
      id: ++idRef.current,
      x: clamp(x, 2, 98),
      y: clamp(y, 18, 98),
      scale: 0.8 + Math.random() * 0.6,
      hue: 95 + Math.floor(Math.random() * 40),
      tilt: (Math.random() - 0.5) * 16,
    };
    setSprouts((s) => [...s, item].slice(-MAX_SPROUTS));
    setInteracted(true);
    setPlanted((n) => {
      const next = n + 1;
      if (next === HARVEST_GOAL) setHarvestKey((k) => k + 1);
      return next;
    });
  };

  const resetField = () => {
    setSprouts([]);
    setPlanted(0);
    setHarvestKey(0);
  };

  const harvested = planted >= HARVEST_GOAL;
  const progress = Math.min(planted / HARVEST_GOAL, 1) * 100;

  return (
    <section className="px-4 py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* ---------------- Escena ---------------- */}
        <div
          ref={sceneRef}
          onPointerMove={moveSun}
          onPointerDown={moveSun}
          className="relative h-[min(78vh,640px)] min-h-[440px] w-full select-none overflow-hidden rounded-3xl border border-white/40 dark:border-slate-700 shadow-2xl touch-pan-y"
        >
          {/* Cielo */}
          <motion.div className="absolute inset-0" style={{ background: daySky }} />
          <motion.div
            className="absolute inset-0 transition-opacity duration-700"
            style={{ background: nightSky, opacity: night ? 1 : 0 }}
          />

          {/* Estrellas (noche) */}
          {night &&
            Array.from({ length: 40 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-[2px] w-[2px] rounded-full bg-white"
                style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % SKY_HEIGHT * 0.8}%` }}
                animate={reduce ? undefined : { opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: (i % 7) * 0.3 }}
              />
            ))}

          {/* Sol / luna que sigue al cursor */}
          <motion.div
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: sunLeft, top: sunTop }}
          >
            {night ? (
              <div className="h-16 w-16 rounded-full bg-slate-100 shadow-[0_0_60px_20px_rgba(226,232,240,0.35)] relative">
                <span className="absolute left-3 top-4 h-3 w-3 rounded-full bg-slate-300" />
                <span className="absolute right-4 bottom-3 h-4 w-4 rounded-full bg-slate-300" />
              </div>
            ) : (
              <div className="relative h-20 w-20">
                <motion.div
                  className="absolute inset-0"
                  animate={reduce ? undefined : { rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute left-1/2 top-1/2 h-3 w-1.5 -translate-x-1/2 rounded-full bg-yellow-300"
                      style={{ transform: `rotate(${i * 30}deg) translateY(-44px)` }}
                    />
                  ))}
                </motion.div>
                <div className="absolute inset-2 rounded-full bg-yellow-300 shadow-[0_0_60px_25px_rgba(253,224,71,0.55)]" />
              </div>
            )}
          </motion.div>

          {/* Nubes */}
          {[
            { top: '10%', size: 'w-32', dur: 60, delay: 0 },
            { top: '24%', size: 'w-24', dur: 45, delay: -20 },
            { top: '6%', size: 'w-20', dur: 75, delay: -40 },
          ].map((c, i) => (
            <motion.div
              key={i}
              className={`absolute ${c.size} pointer-events-none ${night ? 'opacity-30' : 'opacity-90'}`}
              style={{ top: c.top }}
              initial={{ left: '-20%' }}
              animate={reduce ? { left: `${20 + i * 25}%` } : { left: ['-20%', '110%'] }}
              transition={
                reduce ? undefined : { duration: c.dur, repeat: Infinity, ease: 'linear', delay: c.delay }
              }
            >
              <svg viewBox="0 0 100 40" aria-hidden>
                <ellipse cx="30" cy="26" rx="26" ry="13" fill="white" />
                <ellipse cx="55" cy="18" rx="24" ry="17" fill="white" />
                <ellipse cx="75" cy="27" rx="20" ry="12" fill="white" />
              </svg>
            </motion.div>
          ))}

          {/* Colinas lejanas */}
          <svg
            className="absolute bottom-[26%] left-0 w-full h-[22%] pointer-events-none"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path d="M0 20 Q15 4 32 12 T65 8 T100 10 V20 Z" fill={night ? '#14532d' : '#4ade80'} opacity="0.7" />
            <path d="M0 20 Q22 10 45 15 T100 13 V20 Z" fill={night ? '#166534' : '#22c55e'} />
          </svg>

          {/* 404 con el girasol como "0" */}
          <div className="absolute inset-x-0 top-[12%] z-10 flex items-center justify-center gap-1 md:gap-4 pointer-events-none">
            {['4', '0', '4'].map((ch, i) =>
              ch === '0' ? (
                <motion.div
                  key={i}
                  ref={flowerRef}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.25 }}
                >
                  <Sunflower faceX={faceX} faceY={faceY} tilt={tilt} night={night} />
                </motion.div>
              ) : (
                <motion.span
                  key={i}
                  initial={{ y: -80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 140, damping: 11, delay: i * 0.15 }}
                  className="text-[clamp(6rem,22vw,14rem)] font-black leading-none text-green-700 dark:text-green-400 drop-shadow-[0_6px_0_rgba(0,0,0,0.15)]"
                >
                  {ch}
                </motion.span>
              )
            )}
          </div>

          {/* Tierra: clic para sembrar */}
          <div
            onClick={plant}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 z-10 h-[28%] w-full cursor-crosshair"
            style={{
              background: night
                ? 'repeating-linear-gradient(175deg, #3f2a14 0 14px, #2e1f0f 14px 28px)'
                : 'repeating-linear-gradient(175deg, #92400e 0 14px, #78350f 14px 28px)',
            }}
            role="button"
            aria-label="Campo: haz clic para sembrar una semilla"
          >
            <div className={`absolute top-0 left-0 h-3 w-full ${night ? 'bg-green-900' : 'bg-green-600'}`} />
            {sprouts.map((s) => (
              <SproutPlant key={s.id} item={s} />
            ))}
          </div>

          <div onPointerDown={(e) => e.stopPropagation()}>
            <LostTractor />
          </div>

          {/* Pista de interacción */}
          <AnimatePresence>
            {!interacted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-[31%] left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/55 px-4 py-2 text-center text-xs md:text-sm font-semibold text-white backdrop-blur-sm pointer-events-none"
              >
                ☀️ Mueve el cursor: ¡tú eres el sol! · 🌱 Haz clic en la tierra para sembrar
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cosecha: lluvia de hojas */}
          <AnimatePresence>
            {harvestKey > 0 && !reduce && (
              <motion.div
                key={harvestKey}
                className="absolute inset-0 z-40 pointer-events-none overflow-hidden"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {Array.from({ length: 26 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-green-500"
                    style={{ left: `${(i * 41) % 100}%`, top: '-8%' }}
                    initial={{ y: 0, rotate: 0, opacity: 1 }}
                    animate={{
                      y: ['0vh', '90vh'],
                      x: [0, (i % 2 ? 1 : -1) * (20 + (i % 5) * 10)],
                      rotate: [0, 360 * (i % 2 ? 1 : -1)],
                      opacity: [1, 1, 0],
                    }}
                    transition={{ duration: 2.6 + (i % 4) * 0.4, delay: (i % 6) * 0.12, ease: 'easeIn' }}
                  >
                    <Leaf className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" />
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ---------------- Mensaje y acciones ---------------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 mx-auto -mt-10 max-w-3xl rounded-3xl border border-zinc-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-6 md:p-8 text-center shadow-xl backdrop-blur"
        >
          <h1 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-white">
            ¡Te saliste del camino rural!
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
            La parcela{' '}
            <code className="rounded-md bg-zinc-100 dark:bg-slate-800 px-2 py-0.5 text-sm font-mono text-green-700 dark:text-green-400 break-all">
              {pathname}
            </code>{' '}
            no está sembrada en nuestro portal. Quizás la finca cambió de lugar o el enlace ya no existe.
          </p>

          {/* Progreso de siembra */}
          <div className="mx-auto mt-6 max-w-md">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5">
              <span className="inline-flex items-center gap-1.5">
                <Sprout className="h-4 w-4 text-green-600" />
                Semillas sembradas: {planted}
              </span>
              {planted > 0 && (
                <button
                  type="button"
                  onClick={resetField}
                  className="inline-flex items-center gap-1 hover:text-zinc-800 dark:hover:text-white transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Limpiar campo
                </button>
              )}
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-slate-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-lime-400 to-green-600"
                animate={{ width: `${progress}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={harvested ? 'done' : 'todo'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`mt-2 text-sm ${
                  harvested ? 'font-bold text-green-600 dark:text-green-400' : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {harvested
                  ? '🌾 ¡Cosecha completada! Ya tienes alma de agricultor. Ahora vamos a una finca de verdad.'
                  : `Siembra ${HARVEST_GOAL - planted} semilla${HARVEST_GOAL - planted === 1 ? '' : 's'} más para recoger la cosecha.`}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 hover:-translate-y-0.5"
            >
              <Home className="h-4 w-4" /> Volver al inicio
            </Link>
            <Link
              href="/fincas"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 font-semibold text-zinc-800 dark:text-zinc-100 transition hover:-translate-y-0.5 hover:border-green-500"
            >
              <TractorIcon className="h-4 w-4 text-green-600" /> Ver fincas
            </Link>
            <Link
              href="/explorar"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 font-semibold text-zinc-800 dark:text-zinc-100 transition hover:-translate-y-0.5 hover:border-green-500"
            >
              <MapPinned className="h-4 w-4 text-green-600" /> Explorar el mapa
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
