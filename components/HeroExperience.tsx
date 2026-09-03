'use client';

import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import MapleLeaf from '@/components/MapleLeaf';
import ThreeScene from '@/components/ThreeScene';
import type { Locale } from '@/lib/content';

type HeroCopy = {
  eyebrow: string;
  title: string;
  text: string;
  primary: string;
  secondary: string;
};

type StoryStage = {
  label: string;
  title: string;
  text: string;
};

const stages: Record<Locale, StoryStage[]> = {
  en: [
    { label: 'AUDIT', title: 'Reveal the legacy system', text: 'Recover documentation, map risk and expose what is limiting the operation.' },
    { label: 'DIAGNOSE', title: 'Find the real failure', text: 'Electrical, mechanical and hydraulic troubleshooting grounded in plant-floor evidence.' },
    { label: 'AUTOMATE', title: 'Engineer the control layer', text: 'Retrofit machinery and integrate instrumentation, PLC, HMI and process control.' },
    { label: 'CONNECT', title: 'Make the plant visible', text: 'Unify SCADA, industrial software and IIoT through useful, secure operational data.' },
    { label: 'OPTIMIZE', title: 'Turn data into performance', text: 'Advanced control, analytics and AI improve reliability, energy use and production.' },
  ],
  fr: [
    { label: 'AUDITER', title: 'Révéler le système existant', text: 'Récupérer la documentation, cartographier les risques et identifier les limites opérationnelles.' },
    { label: 'DIAGNOSTIQUER', title: 'Trouver la vraie défaillance', text: 'Diagnostic électrique, mécanique et hydraulique fondé sur les réalités du terrain.' },
    { label: 'AUTOMATISER', title: 'Concevoir la couche de contrôle', text: 'Moderniser les machines et intégrer instrumentation, PLC, IHM et contrôle de procédé.' },
    { label: 'CONNECTER', title: 'Rendre l’usine visible', text: 'Unifier SCADA, logiciels industriels et IIoT autour de données opérationnelles sécurisées.' },
    { label: 'OPTIMISER', title: 'Transformer les données en performance', text: 'Contrôle avancé, analytique et IA améliorent fiabilité, énergie et production.' },
  ],
};

const scrollCue: Record<Locale, string> = {
  en: 'Scroll to transform the process',
  fr: 'Faites défiler pour transformer le procédé',
};

const processLabel: Record<Locale, string> = {
  en: 'Royal City Labs engineering process',
  fr: "Processus d’ingénierie de Royal City Labs",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
export default function HeroExperience({ locale, hero }: { locale: Locale; hero: HeroCopy }) {
  const section = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const frame = useRef<number | null>(null);
  const stageIndex = useRef(0);
  const [activeStage, setActiveStage] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const storyStages = stages[locale];

  useEffect(() => {
    const update = () => {
      frame.current = null;
      const element = section.current;
      if (!element) return;

      const isCompact = window.matchMedia('(max-width: 700px)').matches;
      if (isCompact || prefersReducedMotion) {
        scrollProgress.current = 1;
        stageIndex.current = storyStages.length - 1;
        setActiveStage(stageIndex.current);
        return;
      }

      const rect = element.getBoundingClientRect();
      const distance = Math.max(element.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-rect.top / distance, 0, 1);
      scrollProgress.current = progress;

      const boundaries = [0.2, 0.4, 0.6, 0.8];
      const hysteresis = 0.018;
      let nextStage = stageIndex.current;
      while (nextStage < storyStages.length - 1 && progress > boundaries[nextStage] + hysteresis) nextStage += 1;
      while (nextStage > 0 && progress < boundaries[nextStage - 1] - hysteresis) nextStage -= 1;
      if (nextStage !== stageIndex.current) {
        stageIndex.current = nextStage;
        setActiveStage(nextStage);
      }
    };

    const requestUpdate = () => {
      if (frame.current !== null) return;
      frame.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [prefersReducedMotion, storyStages.length]);

  return (
    <section ref={section} className={`hero hero-scroll story-stage-${activeStage}`}>
      <div className="container hero-grid hero-grid-scroll">
        <div className="hero-story-copy">
          {/* The eyebrow already reads "CANADIAN…" in both locales — the leaf only marks it, silently. */}
          <div className="eyebrow eyebrow-canada"><MapleLeaf />{hero.eyebrow}</div>
          <h1>{hero.title}</h1>
          <p className="hero-copy">{hero.text}</p>
          <div className="hero-cta">
            <Link className="button" href={`/${locale}/contact`}>
              {hero.primary}<span>↗</span>
            </Link>
            <Link className="button button-outline" href={`/${locale}/solutions`}>
              {hero.secondary}<span>↓</span>
            </Link>
          </div>

          <div className="story-stage-list" aria-label={processLabel[locale]}>
            {storyStages.map((stage, index) => (
              <article className={`story-stage${index === activeStage ? ' is-active' : ''}`} key={stage.label}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <b>{stage.label}</b>
                  <h2>{stage.title}</h2>
                  <p>{stage.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="scroll-cue" aria-hidden="true">
            <i><span /></i>
            <span>{scrollCue[locale]}</span>
          </div>
        </div>

        <ThreeScene locale={locale} scrollProgress={scrollProgress} activeStage={activeStage} />
      </div>
    </section>
  );
}
