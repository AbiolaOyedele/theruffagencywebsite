/**
 * Method:   POST
 * Path:     /api/v1/talent
 * Auth:     none (public), same-origin only
 * Request:  application/json or form-encoded — see `talentSchema`
 * Response: 200 { ok: true, message } | { error: { code, message }, fieldErrors? }
 */
import { toErrorResponse, toSuccessResponse } from '@/lib/errors';
import { clientIp, enforceRateLimit } from '@/lib/rate-limit';
import { assertSameOrigin, readBody } from '@/services/contact';
import { submitTalent } from '@/services/talent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    enforceRateLimit(`talent:${clientIp(request)}`);
    await submitTalent(await readBody(request));
    return toSuccessResponse(
      'Thanks — you are in the talent pool. We will be in touch when something fits.',
    );
  } catch (error) {
    return toErrorResponse(error);
  }
}
