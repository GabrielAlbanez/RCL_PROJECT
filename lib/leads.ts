/**
 * LEAD PIPELINE — SERVER ONLY. Uses Node APIs, so importing this from a Client
 * Component breaks the browser build; the shared types and constants the form
 * needs live in `lib/lead-form.ts`.
 *
 * Validation, spam guards and delivery for the contact form.
 *
 * Delivery is pluggable so the prototype works end-to-end with zero
 * configuration, and goes live by setting ONE env var (see `.env.example`):
 *
 *   1. CONTACT_WEBHOOK_URL              → POSTs the lead as JSON (Zapier, Make,
 *                                         n8n, Slack workflow, CRM endpoint).
 *   2. RESEND_API_KEY + CONTACT_TO_EMAIL → emails the lead through the Resend
 *                                         REST API (no SDK dependency).
 *   3. nothing configured               → local prototype mode: the lead is
 *                                         logged and appended to
 *                                         `.data/leads.jsonl` so submissions
 *                                         can be demoed and inspected.
 *
 * The UI never claims an email was sent in local mode — it reports the request
 * as received and shows a developer note (see ContactForm).
 */
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import {
  CHALLENGE_VALUES,
  MAX_LENGTH,
  type ChallengeValue,
  type FieldErrors,
  type Lead,
  type LeadField,
  type LeadFormValues,
} from './lead-form';

export type { Lead, LeadFormState } from './lead-form';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function field(formData: FormData, key: LeadField): string {
  const raw = formData.get(key);
  return typeof raw === 'string' ? raw.trim() : '';
}

export type ParseResult = { ok: true; lead: Lead } | { ok: false; errors: FieldErrors; values: LeadFormValues };

/** Validates raw form input. Never trusts the client — the browser checks are a convenience only. */
export function parseLead(formData: FormData, locale: string): ParseResult {
  const values: LeadFormValues = {
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    company: field(formData, 'company'),
    industry: field(formData, 'industry'),
    challenge: field(formData, 'challenge'),
    message: field(formData, 'message'),
  };

  const errors: FieldErrors = {};

  if (!values.name) errors.name = 'required';
  else if (values.name.length > MAX_LENGTH.name) errors.name = 'tooLong';

  if (!values.email) errors.email = 'required';
  else if (!EMAIL_RE.test(values.email) || values.email.length > MAX_LENGTH.email) errors.email = 'email';

  if (!values.challenge) errors.challenge = 'required';
  else if (!CHALLENGE_VALUES.includes(values.challenge as ChallengeValue)) errors.challenge = 'invalidChoice';

  for (const key of ['company', 'industry', 'message'] as const) {
    if ((values[key] ?? '').length > MAX_LENGTH[key]) errors[key] = 'tooLong';
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors, values };

  return {
    ok: true,
    lead: {
      name: values.name!,
      email: values.email!,
      company: values.company!,
      industry: values.industry!,
      challenge: values.challenge as ChallengeValue,
      message: values.message!,
      locale,
      submittedAt: new Date().toISOString(),
      source: 'royalcitylabs.ca/contact',
    },
  };
}

/**
 * Fixed-window rate limit, in process memory.
 * Good enough for a prototype and for a single server instance; swap for a
 * shared store (Redis, Upstash, Vercel KV) if the site scales horizontally.
 */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  // Drop stale keys so the map cannot grow unbounded.
  for (const [k, times] of hits) if (times.every(t => now - t >= RATE_WINDOW_MS)) hits.delete(k);
  if (recent.length >= RATE_MAX) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export type Transport = 'webhook' | 'resend' | 'local';
export type DeliveryResult = { ok: true; transport: Transport } | { ok: false; transport: Transport; error: string };

const CHALLENGE_LABEL: Record<ChallengeValue, string> = {
  downtime: 'Reduce downtime',
  legacy: 'Modernize legacy systems',
  automation: 'Improve automation',
  data: 'Connect industrial data',
  energy: 'Reduce energy consumption',
  production: 'Optimize production',
  other: 'Other',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function leadRows(lead: Lead): [string, string][] {
  return [
    ['Name', lead.name],
    ['Email', lead.email],
    ['Company', lead.company || '—'],
    ['Industry', lead.industry || '—'],
    ['Goal', CHALLENGE_LABEL[lead.challenge]],
    ['Message', lead.message || '—'],
    ['Language', lead.locale],
    ['Submitted', lead.submittedAt],
  ];
}

function leadAsText(lead: Lead): string {
  return leadRows(lead)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

function leadAsHtml(lead: Lead): string {
  const rows = leadRows(lead)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#6b7d94;font:600 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;color:#2a3a47;font:400 14px/1.5 Arial,sans-serif">${escapeHtml(value).replace(/\n/g, '<br/>')}</td></tr>`,
    )
    .join('');
  return `<div style="font-family:Arial,sans-serif"><h2 style="color:#042D7B;margin:0 0 14px">New contact request</h2><table cellpadding="0" cellspacing="0">${rows}</table></div>`;
}

async function deliverWebhook(lead: Lead, url: string): Promise<DeliveryResult> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) return { ok: false, transport: 'webhook', error: `webhook responded ${res.status}` };
  return { ok: true, transport: 'webhook' };
}

async function deliverResend(lead: Lead, apiKey: string, to: string): Promise<DeliveryResult> {
  const from = process.env.CONTACT_FROM_EMAIL || 'Royal City Labs <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map(address => address.trim()).filter(Boolean),
      reply_to: lead.email,
      subject: `Contact request — ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
      text: leadAsText(lead),
      html: leadAsHtml(lead),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return { ok: false, transport: 'resend', error: `resend responded ${res.status} ${detail.slice(0, 200)}` };
  }
  return { ok: true, transport: 'resend' };
}

/** Local prototype mode: log the lead and append it to `.data/leads.jsonl`. */
async function deliverLocal(lead: Lead): Promise<DeliveryResult> {
  console.info('[contact] lead received (local prototype mode — no delivery endpoint configured)', leadAsText(lead));
  try {
    const dir = path.join(process.cwd(), '.data');
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, 'leads.jsonl'), `${JSON.stringify(lead)}\n`, 'utf8');
  } catch (error) {
    // Read-only filesystems (most serverless hosts) are expected — the console
    // record above is still a real, inspectable delivery for the prototype.
    console.warn('[contact] could not persist lead to .data/leads.jsonl', error);
  }
  return { ok: true, transport: 'local' };
}

export async function deliverLead(lead: Lead): Promise<DeliveryResult> {
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  try {
    if (webhook) return await deliverWebhook(lead, webhook);
    if (resendKey && to) return await deliverResend(lead, resendKey, to);
    return await deliverLocal(lead);
  } catch (error) {
    const transport: Transport = webhook ? 'webhook' : resendKey && to ? 'resend' : 'local';
    console.error('[contact] delivery failed', error);
    return { ok: false, transport, error: error instanceof Error ? error.message : 'unknown error' };
  }
}
