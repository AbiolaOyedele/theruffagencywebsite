/**
 * Method:   POST
 * Path:     /api/v1/contact
 * Auth:     none (public marketing site), same-origin only
 * Request:  application/json or form-encoded — see `contactSchema`
 * Response: 200 { ok: true, message } | { error: { code, message }, fieldErrors? }
 */
import { toErrorResponse, toSuccessResponse } from '@/lib/errors';
import { clientIp, enforceRateLimit } from '@/lib/rate-limit';
import { assertSameOrigin, readBody, submitContact } from '@/services/contact';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    enforceRateLimit(`contact:${clientIp(request)}`);
    await submitContact(await readBody(request));
    return toSuccessResponse('Thanks — your message is with us. We will reply shortly.');
  } catch (error) {
    return toErrorResponse(error);
  }
}
