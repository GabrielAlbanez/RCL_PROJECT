'use client';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitLead } from '@/lib/actions/contact';
import { MAX_LENGTH, initialLeadState, type FieldErrorCode, type LeadField, type LeadFormState } from '@/lib/lead-form';
import type { Locale } from '@/lib/content';
import { getContent } from '@/lib/content';

/** Submit button lives in its own component so `useFormStatus` can read the pending state. */
function SubmitButton({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="button" type="submit" disabled={pending} aria-busy={pending}>
      {pending ? busy : idle}
      <span aria-hidden="true">{pending ? '…' : '↗'}</span>
    </button>
  );
}

/** Inline validation message, wired to its input through `aria-describedby`. */
function FieldError({ field, message }: { field: LeadField; message?: string }) {
  if (!message) return null;
  return <span className="field-msg" id={`${field}-error`}>{message}</span>;
}

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = getContent(locale);
  const [state, formAction] = useActionState(submitLead, initialLeadState);

  // After a success the panel replaces the form; "send another" brings the form
  // back. We remember *which* result was dismissed, so the next submission —
  // a new state object — shows its own confirmation without needing an effect.
  const [dismissedState, setDismissedState] = useState<LeadFormState | null>(null);

  const errors = state.errors ?? {};
  const values = state.values ?? {};
  const errorFor = (field: LeadField): FieldErrorCode | undefined => errors[field];
  const messageFor = (field: LeadField): string | undefined => {
    const code = errorFor(field);
    return code ? t.forms.errors[code] : undefined;
  };

  /** Shared props for an input/select/textarea so error wiring stays consistent. */
  const fieldProps = (field: LeadField) => ({
    id: field,
    name: field,
    'aria-invalid': errorFor(field) ? true : undefined,
    'aria-describedby': errorFor(field) ? `${field}-error` : undefined,
  });

  const cls = (field: LeadField) => `field${errorFor(field) ? ' field-invalid' : ''}`;

  if (state.status === 'success' && state !== dismissedState) {
    return (
      <div className="contact-form form-success" role="status" aria-live="polite">
        <div className="eyebrow">{t.forms.successEyebrow}</div>
        <h2>{t.forms.successTitle}</h2>
        <p>{t.forms.successText}</p>
        <button className="button button-outline" type="button" onClick={() => setDismissedState(state)}>
          {t.forms.successAgain}<span aria-hidden="true">↺</span>
        </button>
        {state.storedLocally && <p className="access-note">{t.forms.localNote}</p>}
      </div>
    );
  }

  return (
    <form className="contact-form" action={formAction} noValidate>
      <input type="hidden" name="locale" value={locale} />

      {state.status === 'error' && state.reason && (
        <p className="form-alert" role="alert">{t.forms.errors[state.reason]}</p>
      )}

      <div className="form-row">
        <div className={cls('name')}>
          <label htmlFor="name">{t.forms.name}</label>
          <input {...fieldProps('name')} required autoComplete="name" maxLength={MAX_LENGTH.name} defaultValue={values.name} />
          <FieldError field="name" message={messageFor('name')} />
        </div>
        <div className={cls('email')}>
          <label htmlFor="email">{t.forms.email}</label>
          <input {...fieldProps('email')} required type="email" autoComplete="email" maxLength={MAX_LENGTH.email} defaultValue={values.email} />
          <FieldError field="email" message={messageFor('email')} />
        </div>
      </div>

      <div className={cls('company')}>
        <label htmlFor="company">{t.forms.company} <em>{t.forms.optional}</em></label>
        <input {...fieldProps('company')} autoComplete="organization" maxLength={MAX_LENGTH.company} defaultValue={values.company} />
        <FieldError field="company" message={messageFor('company')} />
      </div>

      <div className={cls('industry')}>
        <label htmlFor="industry">{t.forms.industry} <em>{t.forms.optional}</em></label>
        <input {...fieldProps('industry')} maxLength={MAX_LENGTH.industry} defaultValue={values.industry} />
        <FieldError field="industry" message={messageFor('industry')} />
      </div>

      <div className={cls('challenge')}>
        <label htmlFor="challenge">{t.forms.challenge}</label>
        <select {...fieldProps('challenge')} required defaultValue={values.challenge ?? ''}>
          <option value="" disabled>{t.forms.selectOne}</option>
          {t.challengeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <FieldError field="challenge" message={messageFor('challenge')} />
      </div>

      <div className={cls('message')}>
        <label htmlFor="message">{t.forms.message} <em>{t.forms.optional}</em></label>
        <textarea {...fieldProps('message')} maxLength={MAX_LENGTH.message} defaultValue={values.message} />
        <FieldError field="message" message={messageFor('message')} />
      </div>

      {/* Honeypot — hidden from users and assistive tech, filled only by bots. */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton idle={t.forms.send} busy={t.forms.sending} />
      <p className="access-note">{t.forms.note}</p>
    </form>
  );
}
