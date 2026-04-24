// Lichtgewicht in-memory rate limiter voor submit endpoint.
// Voor grotere schaal: vervang door Upstash Redis — dezelfde interface.
//
// Let op: Vercel-functions zijn serverless. In-memory werkt alleen binnen één
// lambda-instance. Voor basisbescherming tegen floods is dit voldoende;
// voor echte zekerheid zet je Upstash ervoor.

type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number } = { limit: 5, windowMs: 60_000 },
): { ok: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + options.windowMs });
    return { ok: true, remaining: options.limit - 1, resetMs: options.windowMs };
  }
  if (bucket.count >= options.limit) {
    return { ok: false, remaining: 0, resetMs: bucket.reset - now };
  }
  bucket.count += 1;
  return {
    ok: true,
    remaining: options.limit - bucket.count,
    resetMs: bucket.reset - now,
  };
}

// Housekeeping: ruimt verlopen buckets op.
setInterval(() => {
  const now = Date.now();
  for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k);
}, 60_000).unref?.();
