import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';
import { Milk, Settings, Truck, CheckCircle2 } from 'lucide-react';

const STAGES = [
  {
    id: 1,
    side: 'left' as const,
    icon: Milk,
    label: 'Этап 1',
    title: 'Своя ферма',
    subtitle: 'Рязанская область',
    body: 'Наши коровы пасутся на экологически чистых пастбищах. Здоровые животные — основа натурального молока без примесей.',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80',
    color: 'from-emerald-500 to-green-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    accent: 'text-emerald-600',
  },
  {
    id: 2,
    side: 'right' as const,
    icon: Settings,
    label: 'Этап 2',
    title: 'Натуральное производство',
    subtitle: 'Без консервантов и ГМО',
    body: 'Современное оборудование, проверенные рецепты. Каждая партия проходит многоступенчатый контроль качества.',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=800&q=80',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    accent: 'text-blue-600',
  },
  {
    id: 3,
    side: 'left' as const,
    icon: Truck,
    label: 'Этап 3',
    title: 'Быстрая доставка',
    subtitle: 'В день производства',
    body: 'От фермы до вашего стола за несколько часов. Свежесть и холодовая цепь сохраняются на всём пути.',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
    color: 'from-orange-500 to-amber-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    accent: 'text-orange-600',
  },
];

/* ── Micro-animation: floating icon ─────────────────────────────────── */
const FloatIcon = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

/* ── Micro-animation: spinning gear ─────────────────────────────────── */
const SpinIcon = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
  >
    {children}
  </motion.div>
);

/* ── Micro-animation: driving truck ─────────────────────────────────── */
const DriveIcon = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    animate={{ x: [0, 8, 0] }}
    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

const microAnimations: Array<({ children }: { children: React.ReactNode }) => React.JSX.Element> = [FloatIcon, SpinIcon, DriveIcon];

/* ── Single stage card ───────────────────────────────────────────────── */
interface StageCardProps {
  stage: (typeof STAGES)[number];
  index: number;
  isActive: boolean;
}

const StageCard = ({ stage, index, isActive }: StageCardProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px 0px -80px 0px' });
  const fromLeft = stage.side === 'left';
  const MicroWrap = microAnimations[index] ?? FloatIcon;
  const Icon = stage.icon;

  return (
    <div
      ref={ref}
      className={`relative flex items-center gap-0 lg:gap-8 ${fromLeft ? 'lg:flex-row flex-col' : 'lg:flex-row-reverse flex-col'
        }`}
    >
      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, x: fromLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: fromLeft ? -60 : 60 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full lg:w-[calc(50%-2.5rem)]"
      >
        <div
          className={`group relative rounded-3xl overflow-hidden border-2 transition-all duration-500 shadow-sm ${isActive
              ? `${stage.border} shadow-xl scale-[1.02]`
              : 'border-gray-100 hover:border-gray-200 hover:shadow-lg hover:scale-[1.01]'
            }`}
        >
          {/* Image */}
          <div className="relative h-52 sm:h-60 overflow-hidden">
            <motion.img
              src={stage.image}
              alt={stage.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Stage label pill */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${stage.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {stage.label}
              </span>
            </div>

            {/* Title on image */}
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white/70 text-xs font-medium mb-0.5">{stage.subtitle}</p>
              <h3 className="text-white text-lg sm:text-xl font-extrabold leading-tight">
                {stage.title}
              </h3>
            </div>
          </div>

          {/* Body */}
          <div className={`p-5 sm:p-6 ${stage.bg} flex items-start gap-4`}>
            <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-md`}>
              <MicroWrap>
                <Icon className="w-5 h-5 text-white" />
              </MicroWrap>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{stage.body}</p>
          </div>
        </div>
      </motion.div>

      {/* ── Center node dot (desktop) ── */}
      <div className="hidden lg:flex shrink-0 w-10 items-center justify-center z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={`w-6 h-6 rounded-full border-4 border-white shadow-md bg-gradient-to-br ${stage.color}`}
        />
      </div>

      {/* ── Spacer for opposite side ── */}
      <div className="hidden lg:block w-[calc(50%-2.5rem)]" />
    </div>
  );
};

/* ── Main section ────────────────────────────────────────────────────── */
export const HowWeProduceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.9', 'end 0.1'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.001,
  });

  const strokeOffset = useTransform(smoothProgress, [0, 1], [pathLength, 0]);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  /* track active stage from scroll */
  useEffect(() => {
    return scrollYProgress.on('change', (v: number) => {
      if (v < 0.33) setActiveStage(0);
      else if (v < 0.66) setActiveStage(1);
      else setActiveStage(2);
    });
  }, [scrollYProgress]);

  /* SVG path — zigzag curve, viewBox 0 0 200 900 */
  const svgPath = 'M 100 0 C 100 60, 30 80, 30 200 C 30 320, 100 340, 100 450 C 100 560, 170 580, 170 700 C 170 820, 100 840, 100 900';

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 sm:mb-24"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold text-sm px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Наш процесс
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Как мы{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">
              производим
            </span>{' '}
            продукцию
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            От фермы до вашего стола — каждый этап под строгим контролем качества
          </p>
        </motion.div>

        {/* Roadmap container */}
        <div className="relative">

          {/* ── SVG path (desktop) ───────────────────────────── */}
          <div className="absolute inset-0 hidden lg:block pointer-events-none" aria-hidden="true">
            <svg
              className="absolute left-1/2 -translate-x-1/2 h-full"
              width="200"
              viewBox="0 0 200 900"
              preserveAspectRatio="none"
              style={{ height: '100%' }}
            >
              <defs>
                <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Background ghost path */}
              <path
                d={svgPath}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Animated draw path */}
              <motion.path
                ref={pathRef}
                d={svgPath}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                style={{
                  strokeDasharray: pathLength,
                  strokeDashoffset: strokeOffset,
                }}
              />
            </svg>
          </div>

          {/* ── Mobile vertical line ─────────────────────────── */}
          <div
            className="lg:hidden absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-blue-400 to-amber-400 opacity-30"
            aria-hidden="true"
          />

          {/* ── Stages ──────────────────────────────────────── */}
          <div className="space-y-16 sm:space-y-20 lg:space-y-24 pl-10 lg:pl-0">
            {STAGES.map((stage, i) => (
              <StageCard
                key={stage.id}
                stage={stage}
                index={i}
                isActive={activeStage === i}
              />
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <p className="text-gray-500 text-sm sm:text-base">
            Контроль качества на каждом этапе — от{' '}
            <span className="font-semibold text-emerald-600">фермы</span> до{' '}
            <span className="font-semibold text-amber-600">вашего стола</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
