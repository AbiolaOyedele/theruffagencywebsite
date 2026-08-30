# The Ruff Agency — Website Copy Deck

Every piece of user-facing text on the site, in the order a visitor meets it.

**Source of truth:** `src/content/site.ts`. Anything edited here has to be
carried across to that file to reach the site. A handful of strings live in
components instead; those are marked **(in code)** with their file.

**Status key**

| | |
|---|---|
| ✅ | Final — live copy |
| ✏️ | Placeholder — written to hold the layout, needs replacing |
| ❓ | Needs a decision or information from Ruff |

---

## 00 · Brand basics

| Field | Value | Status |
|---|---|---|
| Name | The Ruff Agency | ✅ |
| Short name | Ruff | ✅ |
| Legal name | The Ruff Agency | ✅ |
| Email | hello@theruff.agency | ✅ |
| Careers email | careers@theruff.agency | ✅ |
| Copyright | © 2026 The Ruff Agency. All rights reserved. | ✅ |
| Based in | Lagos, Nigeria / Working remotely with clients worldwide | ✅ |
| Social | LinkedIn · Instagram · TikTok · X | ✅ |

There is no strapline in the footer any more — the logo carries the block on
its own.

**Brand name casing:** *Ruff* or *The Ruff Agency*. Never *RUFF*.

### The one call to action

Every CTA on the site — nav, footer, pricing cards, case-study rail — uses the
same label and goes to the same place. Change it once, it changes everywhere.

| Field | Value | Status |
|---|---|---|
| Label | **Work with us** | ✅ |
| Destination | `/#contact` (opens the enquiry panel) | ✅ |

The calendar link is offered **only** inside that panel, as the second of two
choices. No CTA drops someone straight into a booking page.

---

## 01 · SEO & link previews

**(in code)** — `src/app/layout.tsx`

| Field | Copy | Limit | Status |
|---|---|---|---|
| Page title | The Ruff Agency \| Brand Strategy & Creative Studio, Lagos | ~60 chars | ✅ |
| Meta description | A remote creative studio in Lagos building brand strategy, identity, motion, and social content for startups and growing brands worldwide. | ~155 chars | ✅ |
| Share description | Brand strategy, creative direction, motion, and social content, built remotely from Lagos for startups and growing brands worldwide. | shorter, punchier | ✅ |

---

## 02 · Navigation

| Item | Copy | Status |
|---|---|---|
| Link 1 | Services | ✅ |
| Link 2 | Work | ✅ |
| Link 3 | Pricing | ✅ |
| CTA | Work with us | ✅ |

**(in code)** Mobile menu labels: `Menu`, `Close menu` — screen-reader only.

---

## 03 · Hero

### Headline

Three deliberate lines. The break is authored, not a wrap.

```
Skip the
guessing.
Build a brand.
```

The word **brand.** is set in the Didone italic. If the headline changes, name
whichever single word should carry that treatment.

### Subheadline

One line on desktop, built from three parts around a word that rotates:

> We turn your **[rotating word]** into a brand people remember.

| Part | Copy | Constraint |
|---|---|---|
| Before | `We turn your ` | — |
| Rotating word | see below | longest word sets the line width |
| After | ` into a brand ` | — |
| Tail | `people remember.` | held together; on narrow screens the wrap lands before it |

**Rotating words:** Brand · Campaign · Identity · Content · Launch · Strategy ·
Story · Motion

⚠️ **Hard constraint:** on desktop the whole line is forced onto one unbroken
row. *Before + longest rotating word + after + tail* must stay under **~65
characters**. Currently 62 with "Campaign".

### Phone notification

| Field | Copy | Status |
|---|---|---|
| Eyebrow | Consider it handled | ✅ |
| Title | Your next campaign, delivered. | ✅ |

Appears three times in the opening sequence and again inside the phone, so it
must read well small and large.

---

## 04 · Client strip

**Label:** Our designers have worked with these companies and brands

Scrolls as a marquee. Seventeen names, each currently set as a wordmark — drop
in a logo file and the strip picks it up automatically.

Teemplot · IPC Africa · Zero to 16 · FoodCourt · Daash · WingsBistro ·
Citysubs · GoSource · Anikela · Doux · Renda Africa · Ajebo Chops ·
Spicy Corner · Sisi Eko · Papa's Grill · GetZing · Shiip

---

## 05 · Scroll statement

Revealed word by word as the page scrolls, so each word lands on its own beat.
Keep it short and declarative.

> Building a brand takes strategy. Earning trust takes proof. Ruff brings both.
> Thirty plus campaigns. Real sectors. Real results.

---

## 06 · Services

Five cards, scrolled through horizontally while the section is pinned. The nav
shows a five-dot stepper tracking progress.

| # | Title | Description | Status |
|---|---|---|---|
| 1 | We start with strategy | Before a single visual, we map your market, your audience, and what makes you worth choosing. | ✅ |
| 2 | Creative direction that fits | Every idea is built around your brand, not a template. Concepts you can actually ship. | ✅ |
| 3 | Design, motion, and content | From identity systems to short-form video, one team builds it, so nothing gets lost in handoff. | ✅ |
| 4 | Built into your workflow | Slack, Notion, Figma, whatever you run on. We work inside it, not around it. | ✅ |
| 5 | Delivered, ready to launch | Every project comes with a plan for how to launch it. | ✅ |

**Constraint:** titles run to ~4 words, descriptions to ~18. Card 5 is the
shortest on purpose — it is the last beat before the section zooms into the
dark work section.

---

## 07 · Work

### Section

| Field | Copy | Status |
|---|---|---|
| Headline | Real work, / real results. | ✅ |
| Subhead | Our designers have worked on **30+** campaigns across SaaS, food, fashion, startups, tech, and procurement. | ✅ |
| Card CTA | Read the story | ✅ |

The number counts up from zero as the section arrives. Change `campaignCount`
rather than writing the figure into the sentence.

### Case-study cards

Three clients: **Teemplot**, **IPC Africa**, **Zero to 16**.

Stat labels on hover: Duration · Deliverables · Impact

### ✏️ Case-study pages — all placeholder

Clicking a card zooms into a full story panel. Everything in it is currently
placeholder and carries a visible banner saying so:

> Placeholder copy — awaiting the real write-up  **(in code)**

**Per client, the copywriter needs:**

| Field | Guidance | Current placeholder |
|---|---|---|
| Title | The outcome, as a headline | The outcome headline goes here |
| Summary | One sentence, ~140 chars, in the client's language | ✏️ |
| Quote | 1–2 sentences from the client, their words | ✏️ |
| Attribution | Name + role | Name / Role |
| Duration | Free text | 12 weeks |
| Deliverables | Free text | 30+ assets |
| Impact | One measurable result | ✏️ |
| Credits | Who led it | Name / Creative Lead |

**Four narrative sections** (headings are fixed; bodies need writing):

1. **The context** — who they are, the market, the state of the brand at the
   start. ~80–120 words.
2. **The problem** — the underlying reason the brand was not landing, not a
   list of missing pieces. This section earns the reader's attention, so be
   specific and honest. ~120–200 words.
3. **What we did** — in the order it happened: strategy, creative direction,
   production. Name the decisions, not just the outputs. ~150–200 words.
4. **The impact** — what changed, plainly. Numbers where they exist. ~80–120
   words.

**Three briefs** — each pinned to a gallery image. Pick briefs that show range:
one strategic, one craft-led, one showing how a tricky constraint was handled.
Written in the client's own voice, ~60 words each.

**Three gallery images** ✏️ — currently branded placeholders, each needs a real
image plus a caption.

### Case-study chrome

| Field | Copy | Status |
|---|---|---|
| Contents rail heading | Table of contents **(in code)** | ✅ |
| Team rail heading | Team **(in code)** | ✅ |
| Briefs heading | Selected briefs | ✅ |
| CTA heading | Want results like these? | ✅ |
| CTA body | Tell us what you're building and we'll match you with the right creative lead. | ✅ |
| CTA button | Work with us | ✅ |

---

## 07b · Writing

A section on the home page and a real page at `/blog`. A post opens in the
same panel a client story does, with the same contents rail and narrative
column.

| Field | Copy |
|---|---|
| Eyebrow | Writing |
| Heading | How we / *think* about it. |
| Intro | Notes from the studio on brand, creative direction, and the parts of the work nobody puts in a case study. |
| Card button | Read → |
| `/blog` intro | …No newsletter, no gate — just the thinking. |

### The ten posts ✏️

The home page carries the three newest; `/blog` is the archive, laid out as a
bento — mixed tile sizes on a four-column grid, one column on a phone.

Card grounds come from position, not from the post, cycling pink → lime →
yellow → orange. Only those four: the deeper green and purple are in the
palette but the site does not wear them. Because the colour cycle is four long
and the tile-size pattern is six, no two neighbours ever share a ground —
checked in the browser rather than assumed.

| Slug | Title | Category |
|---|---|---|
| `a-logo-is-not-a-brand` | A logo is not a brand, and the difference costs money | Brand strategy |
| `brief-that-gets-good-work` | How to write a brief that gets you good work | Working together |
| `why-we-work-inside-your-tools` | Why we work inside your tools, not around them | How we work |
| `your-feed-looks-fine` | Your feed looks fine. That is the problem. | Social |
| `three-questions-before-a-quote` | The three questions we ask before quoting | Working together |
| `premium-does-not-mean-western` | Premium does not mean Western | Brand strategy |
| `motion-is-not-decoration` | Motion is not decoration | Creative direction |
| `what-a-retainer-buys` | What a retainer actually buys you | Working together |
| `brief-the-designer-first` | Stop briefing your designer last | Working together |
| `the-market-stall-test` | The market stall test | Brand strategy |

Each runs three or four sections. Full text is in `src/content/site.ts` under
`blogPosts`. Nothing on the page marks them as drafts — the `draft` flag is a
note to the studio, not a badge on the post.

❓ These are written in the studio's voice but nobody at Ruff has approved
them. Read them before the `draft` flag comes off.

❓ At 250–350 words they are short for anything meant to rank on search. If a
post is meant to bring people in, 800–1,200 words is the working figure.

❓ Ten is more than the studio needs on day one. Cut the ones whose angle is
wrong rather than keeping them because they exist.

---

## 08 · Pricing

**Headline:** Simple, honest pricing.

### Plan 1 — Project

- **Price:** From ₦150,000 ❓ *awaiting the detailed structure*
- **Description:** A single, well-scoped project, from brand strategy to launch-ready creative.
- Defined scope & timeline
- Dedicated creative lead
- Fixed project price
- Milestone check-ins
- Built-in revisions
- Launch-ready files

### Plan 2 — Retainer

- **Price:** Custom
- **Description:** Ongoing brand, content, and creative support for teams that need a steady hand.
- Ongoing scope, monthly
- Dedicated creative lead
- Predictable monthly rate
- Weekly check-ins
- Ongoing creative support
- Pause or end anytime

Both cards are links to the enquiry panel, labelled **Work with us**.

---

## 09 · FAQ

**Headline:** Frequently asked questions
**Subhead:** Everything you need to know before getting started.

**How much does a project cost?**
Projects start from ₦150,000, depending on scope. Send us a brief and we'll come back with a clear quote before any work begins.

**We already have a design team. Can you still help?**
Yes. We plug into your existing workflow and tools, working as an extension of your team rather than a replacement.

**Who will work on my project?**
A dedicated creative lead who owns your project from strategy through delivery, backed by our full team for design, motion, and content.

**What can you help with?**
Brand strategy, creative direction, social content, and motion and video, from a single campaign to an ongoing retainer.

**How fast can we start?**
Most projects kick off within a week of your first call. Tell us what you need and we'll scope it from there.

---

## 10 · Footer

Two blocks: the logo on the footer's own paper — no card, no strapline — and
the links panel beside it.

| Column | Items |
|---|---|
| Links | Services · Work · FAQ |
| Company | Contact · Careers · Privacy Policy · Terms |
| Follow | LinkedIn · Instagram · TikTok · X |

Plus the copyright line and the **Work with us** button. Below the footer sits
the watermark: **hello@theruff.agency**, with a **Copy our email** button.

---

## 11 · Cookie banner

| Field | Copy |
|---|---|
| Title | Good work starts with understanding. |
| Body | We use analytics cookies to understand how you use this site. Nothing more. |
| Buttons | Reject · Accept |

---

## 12 · Enquiry panel

Opens over the page from any **Work with us**. `/contact` redirects into it.

| Field | Copy |
|---|---|
| Heading | Let's Talk! |
| Eyebrow | Work with us |
| Intro | Five short questions — about a minute. We will come back with the most useful next step, whether that is a quote or a conversation. |

### The six steps

Asked one at a time. Answered questions stay on screen above the current one
and can be edited. Nothing sends until the whole thing is reviewed.

**01 — What kind of work is it?**
Brand identity · Brand strategy · Campaign · Content & motion · Packaging ·
Something else
*Label in the summary:* Kind of work

**02 — Tell us about the project.**
Placeholder: *What is it for, who is it meant to reach, and what would make it
a success? A few sentences is plenty.*
*Label:* The project

**03 — What should we call you, and where can we reach you?**
Name (`First and last name`) · Email (`you@company.com`)

**04 — Does the brand have a name yet, and how did you find us?** *(optional, skippable)*
Brand or company (`What is it called? (optional)`)
How you found us (`A referral, a search, something you saw (optional)`)

**05 — When do you need it, and what budget are you working with?**

*Timeline:* As soon as possible · Within a month · This quarter · Later this
year · Not sure yet

*Budget:* Under ₦150,000 · ₦150,000 – ₦500,000 · ₦500,000 – ₦1.5m ·
₦1.5m – ₦5m · ₦5m+ · Not sure yet

*Note under the bands:* Projects start from ₦150,000. A rough band is enough —
it only helps us shape the right scope.

*Label:* Timing and budget

**06 — Review**
> That is everything. Look it over, then send it when you are ready.

Rows read `Skipped` or `Not answered` where nothing was given.

### Buttons and states

| Field | Copy |
|---|---|
| Back / Skip / Continue / Edit | Back · Skip · Continue · Edit |
| Primary | Send project enquiry |
| While sending | Sending… |
| Secondary | Book a direct call |
| Success heading | Enquiry sent |
| Success body | Thanks — your message is with us. We will reply shortly. **(in code)** |

### Validation messages **(in code)** — `ContactWizard.tsx`

| Trigger | Message |
|---|---|
| No work type | Pick whichever is closest. |
| No project description | Tell us a little about the project first. |
| No name | We need a name to reply to. |
| Bad email | Enter an email address we can reach you on. |
| No timeline | Roughly when do you need it? |
| No budget | Pick whichever band is closest. |
| Server failure | We could not send that just now. Please try again in a moment. |
| Too many attempts | That is a few too many messages in a row. Please wait a minute and try again. |

### Side panel

| Field | Copy |
|---|---|
| Call heading | Rather talk it through? |
| Call body | Book a call and we will match you with the right creative lead. |
| Email label | Or email us directly |
| Location label | Based in **(in code)** |

### AI assistant card

| Field | Copy |
|---|---|
| Heading | Working with an AI agent? |
| Body | Copy one prompt into Claude, ChatGPT, or any agent. It works the brief out with you, then hands you a snippet to paste on this page — every answer fills itself in and you check it over before sending. |
| Button | Copy prompt → Copied |
| If copying fails | Copy failed — open it instead |
| After a successful paste | We filled your answers in from your assistant's draft. Check them over, then send. |

---

## 13 · AI agent instructions

**(in code)** — `src/app/agent/prompt.md/route.ts`, served at `/agent/prompt.md`

A document written **for an AI assistant, not for a person.** It walks the
assistant through understanding the brief, checking the fit, getting explicit
approval, and handing back a block to paste.

Worth a read by whoever owns the brand voice, since it describes Ruff to every
assistant that reads it — including that Ruff does **not** build software.

The assistant never sends anything. The visitor pastes, reviews, and presses
send themselves.

---

## 14 · Careers

Opens as a panel at `#careers`, the same way contact does. `/careers`
redirects into it.

| Field | Copy |
|---|---|
| Panel title | Work at Ruff |
| Eyebrow | Careers |
| Intro | We are a small studio that takes on work bigger than our size. When we hire, we hire from people who have already told us what they do. |
| Openings heading | No open roles right now |
| Openings body | Nothing is posted at the moment. The talent pool is how we find people when that changes — it is the first place we look, before anything goes public. |
| Button | Join the talent pool |
| Note beside it | Takes about two minutes. |
| Side card | Or email us directly → careers@theruff.agency |

**When a role does open,** replace `careersPage.openings` in `site.ts`. That is
the only edit needed — nothing else on the page assumes the list is empty.

### The talent form — four steps

The option sets are lifted from the studio's existing careers form, so someone
applying from either place describes themselves the same way.

| # | Question | Fields |
|---|---|---|
| 01 | Tell us about you. | Full name · Email · Phone number · Years of experience · Availability · Expected monthly rate or salary · Portfolio or LinkedIn |
| 02 | Which roles fit you? | 30 roles in five groups, pick as many as apply |
| 03 | Anything you want us to know? | Optional note |
| 04 | That is everything. Look it over, then send it when you are ready. | Review, with **Edit** back to any step |

**Availability** — Full-time · Part-time · Freelance

**Role groups** — Creative & Design (13) · Social & Marketing (7) ·
Client & Ops (4) · Admin & Support (4) · Legal (2)

**Buttons and states** — Join the talent pool · Sending… · **You are in** ·
"Thanks — you are in the talent pool. We will be in touch when something fits."

### Messages that stop a step **(in code)** — `TalentWizard.tsx`

Shown under the step when someone tries to move on too early.

| Missing | Message |
|---|---|
| Name | We need a name to put to the application. |
| Email | Enter an email address we can reach you on. |
| Phone | Enter a phone number we can reach you on. |
| Experience | Roughly how long have you been doing this? |
| Availability | Pick the one that fits. |
| Rate | A number or a range is fine. |
| Roles | Pick at least one role. |

### Messages from the server **(in code)** — `src/lib/schemas/talent.ts`

The same ground covered again on the way in, for anything that skips the form:
"Your name is required." · "An email address is required." · "Enter a valid
email address." · "A phone number is required." · "That phone number looks too
short." · "Enter a phone number we can reach you on." · "Years of experience is
required." · "Pick your availability." · "An expected rate is required." ·
"Enter a full link, starting with https://" · "Select at least one role."

❓ The original form asks a set of role-specific follow-up questions after the
role step. Those are not built here — say the word if they should be.

---

## 15 · Legal

**Privacy Policy** — Last updated: April 2026. Nine sections: Introduction ·
Information we collect · How we use your information · Cookies · Data sharing ·
Data retention · Your rights · Security · Changes to this policy.

**Terms of Service** — Last updated: April 2026. Ten sections: Overview ·
Services · Projects and retainers · Intellectual property · Confidentiality ·
Payment terms · Limitation of liability · Termination · Governing law · Changes.

❓ Governing law is currently the Federal Republic of Nigeria, jurisdiction
Lagos. Confirm before launch.

❓ Both dates say April 2026. Update on publication.

Full text is in `src/content/site.ts` — it is long and unchanged from the
version already reviewed, so it is summarised rather than repeated here.

---

## Outstanding

| # | Item | Needed from |
|---|---|---|
| 1 | Real case-study copy for all three clients — narrative, quotes, stats, briefs | Ruff + clients |
| 2 | Case-study gallery images (3 per client) | Ruff |
| 3 | Client logo files for the marquee | Ruff |
| 4 | Detailed pricing structure | Ruff |
| 5 | Confirm Nigeria governing law | Ruff / legal |
| 6 | Update both legal dates on publication | Ruff |
| 7 | Send a test enquiry and a test application, to confirm both land | Ruff |
| 8 | Read and approve the three posts before they go out | Ruff |
| 9 | Cloudinary cloud name, so images can move off `public/` | Ruff |

### Flagged for a decision

White text on the brand red measures **4.44:1**. WCAG AA asks for 4.5:1 on
body text. `#DC1B32` clears it with no visible change to the red. Buttons are
the only place the red carries text.
