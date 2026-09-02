# Writing brief — what every blog post needs

For whoever is writing. Everything below is what the site actually reads when it
renders a post; the numbers are not preferences, they come from the layout.

A post is delivered as **plain text in the shape below**. Don't worry about
code, quotes, or escaping — hand over the fields and they get typed into
`src/content/site.ts` against the `BlogPost` type in `src/types/content.ts`.

---

## The nine fields

| Field | What it is | Length |
|---|---|---|
| `title` | The headline. Sentence case, no full stop. | 5–12 words, ≤ 70 characters |
| `slug` | The URL: `/blog/<slug>`. Lowercase, hyphens, no dates. | 3–6 words |
| `excerpt` | One sentence. Card, meta description, link preview. | 90–155 characters |
| `category` | One of the five below. | — |
| `publishedAt` | `YYYY-MM-DD`. | — |
| `author` | Name + role. Default: The Ruff Agency / Studio. | — |
| `sections` | The piece itself — 3 to 5 headed blocks. | ~100 words each |
| `pullQuotes` | Two lines lifted from the writing. | 25–45 words each |
| `gallery` | Two image captions. | ≤ 90 characters each |

Categories in use — reuse one rather than inventing a sixth without asking:
**Brand strategy** · **Working together** · **How we work** ·
**Creative direction** · **Social**

Video behind the panel title is optional and supplied by the studio, not the
writer.

---

## Sections — the body of the piece

Three to five, in reading order. Each is a **heading** plus **one paragraph**.

- Heading: 2–6 words, sentence case, no punctuation at the end.
- Body: 80–130 words, **one continuous paragraph**.
- **No bullet lists, no sub-headings, no links, no bold inside a body.** The
  layout renders each body as a single block of prose; anything else arrives as
  literal characters on the page.
- Three sections is the floor. The images drop in after the second section, so a
  two-section post ends on its gallery.

Reading time on the card is calculated from these bodies at 220 words a minute.
Four sections of ~100 words reads as 2 minutes, which is the length this
archive is built for.

## Pull quotes — exactly two

Each one is a **title** (3–6 words) and a **line** (25–45 words).

These are not new writing. They are the sharpest thought in the piece, said
again on its own — they pin to the corner of the images as dark cards, so they
have to make sense to someone who has not read the paragraph they came from.

**Give exactly as many pull quotes as there are images.** They pair by
position: first quote to first image, second to second. A third is silently
dropped on desktop; a missing one leaves an image with a bare corner. Two of
each is the house shape.

Titles must be different from one another within a post.

## Gallery — two images

Two per post, each with a caption of ≤ 90 characters. The caption is also the
image's alt text, so describe what is actually in the frame — not "image 1".

The writer supplies the **captions and a one-line note on what each image
should show**. The studio sources or shoots the art and uploads it.

---

## House style

Taken from the posts already written, so a new one sits beside them.

- British English — *colours*, *organised*, *recognise*.
- Second person for the reader, first person plural for the studio. No "one".
- Name the problem in the first two sentences. No throat-clearing.
- Plain words. If a sentence would survive on a competitor's site, rewrite it.
- No exclamation marks. No rhetorical questions as headings.
- Specific over broad: "the operations lead at a fifty-seat logistics company",
  not "SMEs".
- Straight apostrophes are fine — typography is handled in the build.

---

## The handover template

Copy this per post and fill it in.

```
TITLE:
SLUG:
EXCERPT:
CATEGORY:
PUBLISHED:

SECTION 1 HEADING:
SECTION 1 BODY:

SECTION 2 HEADING:
SECTION 2 BODY:

SECTION 3 HEADING:
SECTION 3 BODY:

(SECTION 4 / 5 — optional, same shape)

PULL QUOTE 1 TITLE:
PULL QUOTE 1 LINE:

PULL QUOTE 2 TITLE:
PULL QUOTE 2 LINE:

IMAGE 1 CAPTION:
IMAGE 1 — WHAT IT SHOULD SHOW:

IMAGE 2 CAPTION:
IMAGE 2 — WHAT IT SHOULD SHOW:
```

---

## Before it goes live

Every post carries `draft: true` until the studio has read it. Nothing on the
page says "draft" — the flag exists so an unread piece can be held back
deliberately rather than by accident.
