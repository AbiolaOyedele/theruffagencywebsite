/**
 * The campaign email itself.
 *
 * Three things are not configurable, because they are what separates a
 * marketing email from spam and each of them is a legal requirement in most
 * of the places the studio writes to: the recipient can see who sent it,
 * where that sender is, and how to stop. They are assembled here rather than
 * left to whoever writes the campaign, so a template cannot omit them.
 */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ESCAPES[char] as string);
}

/**
 * A deliberately small subset of Markdown: headings, bold, italic, links,
 * and paragraphs. Everything is escaped first, so the patterns below are the
 * only markup that can reach the message — a campaign body is written by an
 * admin, but it is still text arriving from a form.
 */
export function renderBody(markdown: string, replacements: Record<string, string>): string {
  let text = markdown;

  // Merge tags first, so a name containing a bracket is escaped with the rest.
  for (const [token, value] of Object.entries(replacements)) {
    text = text.split(`{{${token}}}`).join(value);
  }

  return escapeHtml(text)
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';

      const heading = /^(#{1,3})\s+(.*)$/.exec(trimmed);
      if (heading) {
        const level = heading[1]?.length ?? 1;
        return `<h${level} style="font-family:Helvetica,Arial,sans-serif;color:#250200;margin:24px 0 8px">${inline(heading[2] ?? '')}</h${level}>`;
      }

      return `<p style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#250200;margin:0 0 16px">${inline(trimmed).replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
}

/** Bold, italic and links, applied to already-escaped text. */
function inline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" style="color:#e92038">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\W)\*([^*]+)\*/g, '$1<em>$2</em>');
}

/** The same body as plain text, for clients that will not render HTML. */
export function renderPlain(
  markdown: string,
  replacements: Record<string, string>,
  footer: string,
): string {
  let text = markdown;
  for (const [token, value] of Object.entries(replacements)) {
    text = text.split(`{{${token}}}`).join(value);
  }
  return `${text}\n\n---\n${footer}`;
}

export interface CampaignEmailInput {
  readonly bodyMarkdown: string;
  readonly preheader?: string | null;
  readonly recipientName: string | null;
  readonly recipientEmail: string;
  readonly unsubscribeUrl: string;
  readonly studioName: string;
  readonly studioAddress: string;
}

export interface RenderedEmail {
  readonly html: string;
  readonly text: string;
}

export function renderCampaignEmail(input: CampaignEmailInput): RenderedEmail {
  const replacements = {
    name: input.recipientName ?? 'there',
    email: input.recipientEmail,
  };

  const identification =
    `You are receiving this because you contacted ${input.studioName} or asked to hear from us. ` +
    `${input.studioName}, ${input.studioAddress}.`;

  const body = renderBody(input.bodyMarkdown, replacements);

  const html = `<!doctype html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f6f1ee">
${input.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(input.preheader)}</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1ee;padding:24px 12px">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:2px solid #250200;border-radius:20px;padding:32px">
      <tr><td>${body}</td></tr>
      <tr><td style="padding-top:24px;border-top:1px solid rgba(37,2,0,0.12)">
        <p style="font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#6b5a55;margin:0 0 8px">${escapeHtml(identification)}</p>
        <p style="font-family:Helvetica,Arial,sans-serif;font-size:12px;margin:0">
          <a href="${input.unsubscribeUrl}" style="color:#6b5a55">Unsubscribe</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const text = renderPlain(
    input.bodyMarkdown,
    replacements,
    `${identification}\n\nUnsubscribe: ${input.unsubscribeUrl}`,
  );

  return { html, text };
}
