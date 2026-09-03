/**
 * CONTACT FORM CONTRACT — shared by the client form and the Server Action.
 *
 * Types and plain constants only: this module is bundled for the browser, so
 * it must stay free of Node APIs. The server-side pipeline (validation, spam
 * guards, delivery) lives in `lib/leads.ts`, which must never be imported from
 * a Client Component.
 */

/** Locale-independent values for the "what do you want to improve" select. */
export const CHALLENGE_VALUES = ['downtime', 'legacy', 'automation', 'data', 'energy', 'production', 'other'] as const;
export type ChallengeValue = (typeof CHALLENGE_VALUES)[number];

export type LeadField = 'name' | 'email' | 'company' | 'industry' | 'challenge' | 'message';

/** Error codes returned by the action; the UI maps them to localized copy. */
export type FieldErrorCode = 'required' | 'email' | 'tooLong' | 'invalidChoice';
export type FieldErrors = Partial<Record<LeadField, FieldErrorCode>>;

/** Shared field limits: enforced on the server, mirrored as `maxLength` in the form. */
export const MAX_LENGTH: Record<LeadField, number> = {
  name: 120,
  email: 200,
  company: 160,
  industry: 160,
  challenge: 40,
  message: 4000,
};

export type Lead = {
  name: string;
  email: string;
  company: string;
  industry: string;
  challenge: ChallengeValue;
  message: string;
  locale: string;
  submittedAt: string;
  source: string;
};

export type LeadFormValues = Partial<Record<LeadField, string>>;

/** Shape returned by the Server Action and consumed by `useActionState`. */
export type LeadFormState = {
  status: 'idle' | 'success' | 'error';
  /** Per-field validation codes. */
  errors?: FieldErrors;
  /** Top-level failure reason (delivery failed / rate limited). */
  reason?: 'generic' | 'rate';
  /** True when the lead was only stored locally (no delivery endpoint configured). */
  storedLocally?: boolean;
  /** Echoed back so the form keeps what was typed when validation fails. */
  values?: LeadFormValues;
};

export const initialLeadState: LeadFormState = { status: 'idle' };
