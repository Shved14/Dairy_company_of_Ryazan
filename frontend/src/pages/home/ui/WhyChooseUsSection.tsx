import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import { Leaf, Clock, Award, Truck, ShieldCheck } from 'lucide-react';

const CARDS = [
  {
    id: 1,
    tag: 'Состав',
    title: 'Без консервантов',
    body: 'Только чистый натуральный состав — никаких химических добавок и стабилизаторов',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1600&q=85',
    gradient: 'from-emerald-950/70 via-emerald-900/40 to-transparent',
    accent: '#10b981',
    icon: Leaf,
    number: '01',
  },
  {
    id: 2,
    tag: 'Свежесть',
    title: 'Каждый день свежее',
    body: 'Производим ежедневно и доставляем в течение 24 часов прямо к вашей двери',
    image: 'https://images.unsplash.com/photo-1587572236558-a3751c6d42c0?w=1600&q=85',
    gradient: 'from-amber-950/70 via-amber-900/40 to-transparent',
    accent: '#f59e0b',
    icon: Clock,
    number: '02',
  },
  {
    id: 3,
    tag: 'Производство',
    title: 'Своя ферма',
    body: 'Полный цикл — от пастбища до упаковки под нашим контролем в Рязанской области',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=85',
    gradient: 'from-blue-950/70 via-blue-900/40 to-transparent',
    accent: '#3b82f6',
    icon: Award,
    number: '03',
  },
  {
    id: 4,
    tag: 'Доставка',
    title: 'Быстро до двери',
    body: 'Бесплатно по Рязани от 1 000 ₽. Доставляем в день заказа — без задержек',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1600&q=85',
    gradient: 'from-violet-950/70 via-violet-900/40 to-transparent',
    accent: '#8b5cf6',
    icon: Truck,
    number: '04',
  },
  {
    id: 5,
    tag: 'Ингредиенты',
    title: 'Натуральный состав',
    body: 'Молоко от собственных коров. Без ГМО, без порошковых заменителей, без обмана',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1600&q=85',
    gradient: 'from-rose-950/70 via-rose-900/40 to-transparent',
    accent: '#f43f5e',
    icon: ShieldCheck,
    number: '05',
  },
];

const N = CARDS.length;

export const WhyChooseUsSection = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  /* Horizontal track translation */
  const translateX = useTransform(
    smoothProgress,
    [0, 1],
    ['0vw', `-${(N - 1) * 100}vw`],
  );

  /* Active card tracking */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActiveIdx(Math.min(N - 1, Math.round(v * (N - 1))));
  });

  /* Per-card image parallax offsets */
  const imgParallaxOffsets = CARDS.map((_, i) => {
    const start = i / N;
    const end = (i + 1) / N;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(smoothProgress, [start, end], ['10%', '-10%']);
  });

  /* Text fade per card */
  const textOpacities = CARDS.map((_, i) => {
    const peak = i / (N - 1);
    const half = 0.5 / (N - 1);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(
      smoothProgress,
      [Math.max(0, peak - half), peak, Math.min(1, peak + half)],
      [0.3, 1, 0.3],
    );
  });

  const textTranslates = CARDS.map((_, i) => {
    const peak = i / (N - 1);
    const half = 0.5 / (N - 1);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(
      smoothProgress,
      [Math.max(0, peak - half), peak, Math.min(1, peak + half)],
      ['40px', '0px', '-40px'],
    );
  });

  const activeCard = (CARDS[activeIdx] ?? CARDS[0])!;

  return (
    /* ── Outer wrapper — sets scroll height ─────────────────────────── */
    <div
      ref={wrapperRef}
      style={{ height: `${(N + 0.5) * 100}vh` }}
      className="relative"
    >
      {/* ── Sticky viewport ──────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* ── Section label (top-left) ────────────────────────────── */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-30 flex items-center gap-3">
          <span className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
            Почему выбирают нас
          </span>
        </div>

        {/* ── Card counter (top-right) ────────────────────────────── */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-30 flex items-baseline gap-1">
          <motion.span
            key={activeCard.number}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-3xl sm:text-4xl font-extrabold tabular-nums"
          >
            {activeCard.number}
          </motion.span>
          <span className="text-white/30 text-base font-bold">/ 0{N}</span>
        </div>

        {/* ── Horizontal cards track ───────────────────────────────── */}
        <motion.div
          className="flex h-full"
          style={{ x: translateX, width: `${N * 100}vw` }}
        >
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="relative w-screen h-screen flex-shrink-0 overflow-hidden"
              >
                {/* Background image with parallax */}
                <motion.div
                  className="absolute inset-0 scale-110"
                  style={{ y: imgParallaxOffsets[i] }}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </motion.div>

                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${card.gradient}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Card content */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 px-6 pb-24 sm:px-14 sm:pb-28 lg:px-20 lg:pb-32 max-w-3xl"
                  style={{
                    opacity: textOpacities[i],
                    y: textTranslates[i],
                  }}
                >
                  {/* Tag pill */}
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-bold uppercase tracking-widest"
                    style={{ backgroundColor: `${card.accent}25`, color: card.accent, border: `1px solid ${card.accent}40` }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {card.tag}
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] mb-4 sm:mb-6">
                    {card.title}
                  </h2>

                  {/* Body */}
                  <p className="text-white/60 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl">
                    {card.body}
                  </p>

                  {/* Accent line */}
                  <div
                    className="mt-6 sm:mt-8 h-0.5 w-16 sm:w-24 rounded-full"
                    style={{ backgroundColor: card.accent }}
                  />
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* ── Progress dots ────────────────────────────────────────── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.id}
              animate={{
                width: i === activeIdx ? 24 : 6,
                opacity: i === activeIdx ? 1 : 0.3,
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-1.5 rounded-full"
              style={{ backgroundColor: i === activeIdx ? activeCard.accent : '#ffffff' }}
            />
          ))}
        </div>

        {/* ── Active card tag (bottom-right) ───────────────────────── */}
        <div className="absolute bottom-8 right-6 sm:right-10 z-30">
          <motion.span
            key={activeCard.tag}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-white/30 text-xs font-bold uppercase tracking-widest"
          >
            {activeCard.tag}
          </motion.span>
        </div>

        {/* ── Scroll hint (shown only for first card) ─────────────── */}
        <motion.div
          className="absolute bottom-8 left-6 sm:left-10 z-30 flex items-center gap-2"
          animate={{ opacity: activeIdx === 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
            <motion.div
              className="w-1 h-2 rounded-full bg-white/60"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="text-white/30 text-xs font-medium hidden sm:block">Листайте вниз</span>
        </motion.div>
      </div>
    </div>
  );
};
