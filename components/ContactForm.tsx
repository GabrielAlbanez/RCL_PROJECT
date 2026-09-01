'use client';
import { useState } from 'react';
import type { Locale } from '@/lib/content';
import { getContent } from '@/lib/content';

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = getContent(locale);
  const [sent, setSent] = useState(false);
  return <form className="contact-form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>{sent ? <div><div className="eyebrow">THANK YOU</div><h2>Request received.</h2><p className="access-note">This prototype does not send data to a backend yet. Connect your preferred form endpoint when integrating the production site.</p></div> : <><div className="form-row"><div className="field"><label>{t.forms.name}</label><input required name="name" /></div><div className="field"><label>{t.forms.email}</label><input required type="email" name="email" /></div></div><div className="field"><label>{t.forms.company}</label><input name="company" /></div><div className="field"><label>{t.forms.industry}</label><input name="industry" /></div><div className="field"><label>{t.forms.challenge}</label><select defaultValue=""><option value="" disabled>Select one</option>{t.challengeOptions.map(x => <option key={x}>{x}</option>)}</select></div><div className="field"><label>{t.forms.message}</label><textarea name="message" /></div><button className="button" type="submit">{t.forms.send}<span>↗</span></button><p className="access-note">Accessible form prototype · keyboard friendly · semantic labels.</p></>}</form>;
}
