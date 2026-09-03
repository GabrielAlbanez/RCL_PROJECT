'use server';

/**
 * Contact form Server Action.
 *
 * Runs as a POST against the page, so every input is treated as untrusted:
 * validated server-side, rate limited per client IP and screened with a
 * honeypot field before anything is delivered. Only the async action is
 * exported: the shared form contract lives in `lib/lead-form.ts` and the
 * server-only pipeline in `lib/leads.ts`.
 */
import { headers } from 'next/headers';
import { deliverLead, parseLead, rateLimit } from '@/lib/leads';
import type { LeadFormState } from '@/lib/lead-form';

async function clientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
}

export async function submitLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  // The locale rides along as a hidden field rather than a bound argument: a
  // bound action serializes as an `$ACTION_REF` payload, which does not survive
  // a JavaScript-free form POST. Untrusted like every other input, so clamp it.
  const raw = formData.get('locale');
  const locale = raw === 'fr' ? 'fr' : 'en';

  // Honeypot: a hidden field no human ever fills. Report success so bots do not
  // learn they were filtered, but deliver nothing.
  if (typeof formData.get('website') === 'string' && formData.get('website') !== '') {
    return { status: 'success' };
  }

  if (!rateLimit(await clientKey())) {
    return { status: 'error', reason: 'rate' };
  }

  const parsed = parseLead(formData, locale);
  if (!parsed.ok) {
    return { status: 'error', errors: parsed.errors, values: parsed.values };
  }

  const delivery = await deliverLead(parsed.lead);
  if (!delivery.ok) {
    return { status: 'error', reason: 'generic', values: parsed.lead };
  }

  return { status: 'success', storedLocally: delivery.transport === 'local' };
}
