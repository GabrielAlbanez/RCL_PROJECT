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
