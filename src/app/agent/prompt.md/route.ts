/**
 * Method:   GET
 * Path:     /agent/prompt.md
 * Auth:     none (public)
 * Response: text/markdown — instructions for an AI agent sending us an enquiry
 *
 * The site URL is interpolated rather than hard-coded so a preview deployment
 * points at itself instead of production.
 *
 * Deliberate choice: an agent-facing public POST endpoint was considered and
 * rejected. `/api/v1/contact` is same-origin only, and opening a public write
 * endpoint to save the visitor a paste would trade that for convenience. The
 * protocol here is paste-only — the agent drafts, the person approves and
 * pastes, the form fills itself in.
 */
import { publicEnv } from '@/config/env';
import { INQUIRY_MARKER } from '@/lib/agent-inquiry';
import { brand } from '@/content/site';

export const dynamic = 'force-static';

const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

const DOCUMENT = `<!-- ${INQUIRY_MARKER}-instructions v1 -->

# Send a project enquiry to ${brand.name}

You are helping your user contact ${brand.shortName} (${siteUrl}), a brand and
creative studio in Lagos working with clients worldwide. They do brand strategy,
identity, creative direction, design, motion and short-form content — the work
of turning a business into a brand people recognise. They are not a template
shop, they do not take on production-only jobs with no creative decision in
them, and they do not build software.

Only continue if your user actually asked you to contact ${brand.shortName}.

## 1. Understand what they need

If you have been working with this user on their business, their product or
their brand, use that to work the brief out. Otherwise ask. By the end you
should be able to state:

- what kind of work it is. One of: Brand identity, Brand strategy, Campaign,
  Content & motion, Packaging, or Something else
- what they are trying to launch, change, or fix
- what exists today: a brand, a logo, a site, nothing at all
- who it is for, and what they want those people to think or do
- when they need it. One of: As soon as possible, Within a month, This quarter,
  Later this year, or Not sure yet
- roughly what budget they have. ${brand.shortName}'s projects start from
  ₦150,000; the bands are Under ₦150,000, ₦150,000 – ₦500,000, ₦500,000 – ₦1.5m,
  ₦1.5m – ₦5m, and ₦5m+. If they genuinely do not know, that is a fine answer —
  say so rather than guessing a number on their behalf

${brand.shortName} is a creative studio, not a software house. They do brand
and campaign work — strategy, identity, creative direction, design, motion and
content. They do not build products, write code, or ship apps. If that is what
your user needs, say so plainly rather than reshaping their brief to fit.

Do not reshape the brief to match what ${brand.shortName} sells. Get the honest
version.

## 2. Check the fit

If you can browse, look at ${siteUrl} for the services they take on and the
work they have shipped. Tell your user plainly whether their problem resembles
that work, or whether it looks more like a job for a printer, a template, or a
freelancer on a single asset. Skip this step entirely if you cannot browse.
Do not guess at it.

## 3. Decide whether to proceed

If the fit looks weak, from step 2 or from what you already know, say so now and
ask whether they still want to send the enquiry. Do not continue on autopilot
just because you have gathered enough to draft something. If they still want to
send it, that is their call.

## 4. Collect contact details

You need a name and an email address. Company and phone are optional. Use what
you already know rather than asking again. Also note how they came across
${brand.shortName} — a search, a referral, something they saw — inferring it if
you reasonably can, since it is genuinely useful to them and costs your user
nothing.

## 5. Draft the brief

Three to ten sentences, plain text, no markdown formatting inside the brief
itself, written in your user's voice rather than yours. State what they have,
what is wrong with it, and what they want instead. Skip the marketing language.

## 6. Get explicit approval

Show your user the complete submission — every contact detail and the full
brief — and get them to confirm or correct it. Never hand over a submission the
user has not seen and approved, however confident you are that it is right.

## 7. Hand over the block

${brand.shortName}'s contact endpoint only accepts submissions posted from their
own site, on purpose. There is no API for you to call and no key to look for.
Your user sends it.

Output the approved submission as a single fenced block in exactly this shape:

\`\`\`markdown
<!-- ${INQUIRY_MARKER} v1 -->

**Name:** Ada Iwu
**Email:** ada@company.com
**Company:** Northsight
**Phone:** +234 800 000 0000
**Website:** https://company.com
**Heard about:** Where the user first came across ${brand.shortName}
**Work:** Brand identity
**Timeline:** This quarter
**Budget:** ₦500,000 – ₦1.5m

## Brief

The approved brief, as plain text.
\`\`\`

The comment line, the Name and Email lines, and the \`## Brief\` heading must
match this exactly, character for character. The page matches on that literal
text, so do not reword, reformat, or tidy those lines up even where it seems
harmless. Company, Phone, Website, Heard about, Work, Timeline and Budget are
optional — leave out any line you do not have rather than inventing a value.
Work, Timeline and Budget must be copied exactly from the lists above, or left
out; anything else is dropped.

Never hand over the block on its own. Most people have not seen this flow
before, so follow it with plain instructions:

1. Copy the whole block, including the comment line at the top.
2. Open ${siteUrl}/contact
3. Click anywhere on that page and paste. Every answer fills itself in and
   the enquiry jumps to its review step.
4. Read it over, correct anything, then press "Send project enquiry".

If it does not fill itself in for any reason, the same questions can be
answered by hand. Nothing is lost either way.

## 8. Afterwards

Tell your user that ${brand.shortName} replies to every enquiry, usually within
one working day. Anyone who would rather talk it through can book a call from
the same page, and anything urgent in the meantime can go to ${brand.email}.
`;

export function GET(): Response {
  return new Response(DOCUMENT, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
