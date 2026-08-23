import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import crypto from "node:crypto";

/**
 * Webhook endpoint hit by the WordPress plugin when an editor publishes
 * a post. The body is signed with HMAC-SHA256 using the shared secret
 * in WEANDME_REVALIDATION_SECRET; the request is rejected if the
 * signature doesn't match.
 *
 * Wire format:
 *   {
 *     type:   "story" | "call" | ...,
 *     id:     123,
 *     paths:  ["/", "/stories", "/stories/mila-hermisson"],
 *     ts:     1730000000,
 *     sig:    "hex of hmac-sha256(body-before-sig, secret)"
 *   }
 */

const Body = z.object({
  type: z.string(),
  id: z.number(),
  paths: z.array(z.string()),
  ts: z.number(),
  sig: z.string(),
});

export async function POST(req: NextRequest) {
  const secret = process.env.WEANDME_REVALIDATION_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATION_SECRET not set" },
      { status: 500 },
    );
  }

  let payload: z.infer<typeof Body>;
  try {
    payload = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 },
    );
  }

  // Constant-time signature check.
  const { sig, ...withoutSig } = payload;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(withoutSig))
    .digest("hex");

  const ok =
    sig.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!ok) {
    return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  }

  // Reject if the timestamp is too far in the past (replay protection).
  if (Math.abs(Date.now() / 1000 - payload.ts) > 300) {
    return NextResponse.json({ error: "Stale timestamp" }, { status: 401 });
  }

  // Revalidate each path AND the relevant tags.
  for (const path of payload.paths) {
    revalidatePath(path);
  }
  revalidateTag("homepage");
  if (payload.type) {
    revalidateTag(payload.type);
  }

  return NextResponse.json({ ok: true, revalidated: payload.paths });
}
