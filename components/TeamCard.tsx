'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { ResolvedMember } from '@/lib/team';

export type TeamCardLabels = { hint: string; hintBack: string };

/** Branded fallback used until a real portrait is supplied. */
function PlaceholderPortrait({ label }: { label: string }) {
  return (
    <span className="team-portrait-empty" role="img" aria-label={label}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="44" r="20" />
        <path d="M18 116c0-23.2 18.8-42 42-42s42 18.8 42 42" />
      </svg>
      <span>PHOTO</span>
    </span>
  );
}

export default function TeamCard({ member, labels }: { member: ResolvedMember; labels: TeamCardLabels }) {
  const [flipped, setFlipped] = useState(false);
  const headline = member.name || member.role;
const stringImg =
  'https://images.pexels.com/photos/36088133/pexels-photo-36088133.jpeg';  return (
    <button
      type="button"
      className={`team-card${flipped ? ' is-flipped' : ''}`}
      aria-expanded={flipped}
      aria-label={`${headline} — ${flipped ? labels.hintBack : labels.hint}`}
      onClick={() => setFlipped(v => !v)}
      onPointerEnter={e => { if (e.pointerType === 'mouse') setFlipped(true); }}
      onPointerLeave={e => { if (e.pointerType === 'mouse') setFlipped(false); }}
    >
      <span className="team-card-inner">
        <span className="team-face team-face-front" aria-hidden={flipped}>
          <span className="team-photo">

              <Image src={stringImg} alt={headline} fill sizes="(max-width:700px) 100vw, 380px" style={{ objectFit: 'cover' }} />

          </span>
          <span className="team-front-copy">
            <span className="team-years">{member.years}</span>
            {member.name && <strong className="team-name">{member.name}</strong>}
            <span className="team-role">{member.role}</span>
            <span className="team-creds">{member.credentials}</span>
          </span>
          <span className="team-flip-hint">{labels.hint} <i aria-hidden="true">↻</i></span>
        </span>

        <span className="team-face team-face-back" aria-hidden={!flipped}>
          <span className="team-back-head">
            {member.name && <strong className="team-name">{member.name}</strong>}
            <span className="team-role">{member.role}</span>
            <span className="team-creds">{member.credentials}</span>
          </span>
          <span className="team-bio">{member.bio}</span>
          <span className="team-tags">
            {member.tags.map(tag => <span className="team-tag" key={tag}>{tag}</span>)}
          </span>
          <span className="team-flip-hint team-flip-hint-back">{labels.hintBack} <i aria-hidden="true">↺</i></span>
        </span>
      </span>
    </button>
  );
}
