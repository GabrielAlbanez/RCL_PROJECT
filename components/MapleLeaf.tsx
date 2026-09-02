/**
 * The official 11-point maple leaf geometry, lifted from the Flag of Canada (the flag's
 * design is a public-domain national symbol) and re-framed into a square viewBox so it can
 * be sized in `em` next to a label. Hand-drawn approximations read as a spiky star at large
 * sizes — this one holds up from an 11px eyebrow mark to a 250px watermark.
 *
 * Decorative only: every place it is used already carries the word "Canadian"/"canadienne"
 * in text, so it stays hidden from screen readers.
 */
export default function MapleLeaf({ className }: { className?: string }) {
  return <svg className={`maple-leaf${className ? ` ${className}` : ''}`} viewBox="385 400 4030 4030" aria-hidden="true" focusable="false"><path d="M0 0m2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"/></svg>;
}
