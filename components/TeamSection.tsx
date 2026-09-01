import Link from 'next/link';
import Reveal from '@/components/Reveal';
import TeamCard from '@/components/TeamCard';
import { getContent } from '@/lib/content';
import { getTeam, getFeaturedTeam } from '@/lib/team';

/**
 * People-first credibility block: photo on the front, credentials + bio on the back.
 * `variant="teaser"` shows the first three leads and links to /about;
 * `variant="full"` shows the whole team with no link out.
 */
export default function TeamSection({ locale, variant = 'full' }: { locale: string; variant?: 'teaser' | 'full' }) {
  const t = getContent(locale);
  const members = variant === 'teaser' ? getFeaturedTeam(locale, 3) : getTeam(locale);
  const labels = { hint: t.team.hint, hintBack: t.team.hintBack };

  return (
    <section className="section team-section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">{t.team.eyebrow}</div>
            <h2>{t.team.title}</h2>
          </div>
          <p>{t.team.text}</p>
        </div>

        <div className="trust-strip">
          {t.team.trust.map(([value, label]) => (
            <div className="trust-item" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="team-grid">
          {members.map(member => (
            <Reveal key={member.slug}>
              <TeamCard member={member} labels={labels} />
              {member.linkedin && (
                <a
                  className="team-linkedin"
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${member.name || member.role} — LinkedIn`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg>
                  <span>{t.team.linkedin}</span>
                </a>
              )}
            </Reveal>
          ))}
        </div>

        {variant === 'teaser' && (
          <div className="team-actions">
            <Link className="button button-outline" href={`/${locale}/about`}>{t.team.button}<span>↗</span></Link>
          </div>
        )}
      </div>
    </section>
  );
}
