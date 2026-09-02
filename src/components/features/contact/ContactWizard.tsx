'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { color, font, primaryButton, radius, shape, weight } from '@/config/tokens';
import { INQUIRY_MARKER, parseInquiryBlock } from '@/lib/agent-inquiry';
import {
  BUDGET_BANDS,
  HONEYPOT_FIELD,
  SERVICE_TYPES,
  TIMELINES,
} from '@/lib/schemas/form-constants';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useContent } from '@/components/providers/ContentProvider';

/** The questions, in order. The last one is the review. */
const STEPS = ['service', 'project', 'you', 'context', 'scope', 'review'] as const;
type StepId = (typeof STEPS)[number];

/** Steps a visitor may pass without answering. */
const OPTIONAL: ReadonlySet<StepId> = new Set<StepId>(['context']);

const REVIEW_INDEX = STEPS.indexOf('review');

interface Values {
  service: string;
  projectDetails: string;
  name: string;
  email: string;
  company: string;
  referralSource: string;
  timeline: string;
  budget: string;
}

const EMPTY: Values = {
  service: '',
  projectDetails: '',
  name: '',
  email: '',
  company: '',
  referralSource: '',
  timeline: '',
  budget: '',
};

type Status = 'idle' | 'submitting' | 'error' | 'success';

interface ContactApiResponse {
  readonly ok?: boolean;
  readonly message?: string;
  readonly error?: { readonly code: string; readonly message: string };
  readonly fieldErrors?: Record<string, string>;
}

/**
 * The project enquiry, asked one question at a time.
 *
 * Every answered question stays on screen above the current one so the trail is
 * always visible and any of it can be corrected without starting again, and
 * nothing is sent until the whole thing has been reviewed. The two questions
 * that are hard to answer cold — stage and budget — each carry a "Not sure yet",
 * so no one is ever stuck on a screen they cannot honestly complete.
 *
 * An assistant following /agent/prompt.md can fill every answer at once; that
 * lands the visitor straight on the review step with the same chance to correct
 * it. Pasted text only ever becomes a field value, and the server revalidates
 * regardless of how the answers got there.
 */
export function ContactWizard() {
  const { brand, contactPage } = useContent();
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [skipped, setSkipped] = useState<readonly StepId[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Readonly<Record<string, string>>>({});
  const [touched, setTouched] = useState(false);
  const [pasteNotice, setPasteNotice] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);
  const honeypotId = useId();

  const step = STEPS[index] as StepId;
  const set = useCallback(
    (key: keyof Values, value: string) =>
      setValues((current) => ({ ...current, [key]: value })),
    [],
  );

  // Page-level paste. Anything that is not one of our blocks falls through, so
  // ordinary copy-paste into a field still behaves normally.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent): void => {
      const text = event.clipboardData?.getData('text/plain');
      if (!text || !text.includes(INQUIRY_MARKER)) return;

      const parsed = parseInquiryBlock(text);
      if (!parsed) return;

      event.preventDefault();
      setValues((current) => ({ ...current, ...parsed }));
      setPasteNotice(contactPage.agent.pasteNotice);
      setIndex(REVIEW_INDEX);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [contactPage.agent.pasteNotice]);

  /** What is missing on this step, if anything. Server-side rules still apply. */
  function blockedReason(target: StepId): string | null {
    if (target === 'service' && !values.service) return 'Pick whichever is closest.';
    if (target === 'project' && !values.projectDetails.trim()) {
      return 'Tell us a little about the project first.';
    }
    if (target === 'you') {
      if (!values.name.trim()) return 'We need a name to reply to.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        return 'Enter an email address we can reach you on.';
      }
    }
    if (target === 'scope') {
      if (!values.timeline) return 'Roughly when do you need it?';
      if (!values.budget) return 'Pick whichever band is closest.';
    }
    return null;
  }

  const blocked = blockedReason(step);

  function advance(): void {
    if (blocked) {
      setTouched(true);
      return;
    }
    setTouched(false);
    setSkipped((current) => current.filter((id) => id !== step));
    setIndex((current) => Math.min(REVIEW_INDEX, current + 1));
  }

  function skip(): void {
    setTouched(false);
    setSkipped((current) => (current.includes(step) ? current : [...current, step]));
    setIndex((current) => Math.min(REVIEW_INDEX, current + 1));
  }

  function goBack(): void {
    setTouched(false);
    setIndex((current) => Math.max(0, current - 1));
  }

  function editStep(target: StepId): void {
    setTouched(false);
    setIndex(STEPS.indexOf(target));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    // Enter on an earlier step means "continue", never "send".
    if (step !== 'review') {
      advance();
      return;
    }

    const form = event.currentTarget;
    setStatus('submitting');
    setMessage('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/v1/contact', {
        method: 'POST',
        body: new FormData(form),
      });
      const body = (await response.json()) as ContactApiResponse;

      if (!response.ok) {
        setStatus('error');
        setMessage(body.error?.message ?? 'We could not send that. Please try again.');
        setFieldErrors(body.fieldErrors ?? {});
        return;
      }

      setStatus('success');
      setMessage(body.message ?? '');
    } catch {
      // A network failure, not a rejection — the server never saw this.
      setStatus('error');
      setMessage('We could not reach the server. Check your connection and try again.');
    }
  }

  if (status === 'success') {
    return (
      <Panel isMobile={isMobile}>
        <div role="status" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={headingStyle(isMobile)}>{contactPage.successHeading}</h2>
          <p style={bodyStyle}>{message}</p>
        </div>
      </Panel>
    );
  }

  /** One line per answered question, for the trail and the review. */
  const summaries: readonly { readonly id: StepId; readonly label: string; readonly value: string }[] =
    [
      { id: 'service', label: contactPage.steps.service.label, value: values.service },
      {
        id: 'project',
        label: contactPage.steps.project.label,
        value: values.projectDetails,
      },
      {
        id: 'you',
        label: contactPage.steps.you.nameLabel,
        value: [values.name, values.email].filter(Boolean).join(' · '),
      },
      {
        id: 'context',
        label: contactPage.steps.context.companyLabel,
        value: [values.company, values.referralSource].filter(Boolean).join(' · '),
      },
      {
        id: 'scope',
        label: contactPage.steps.scope.label,
        value: [values.timeline, values.budget].filter(Boolean).join(' · '),
      },
    ];

  /**
   * What to show for a step. A real answer always wins over a skip flag — an
   * assistant's paste can fill a step that was skipped by hand earlier, and the
   * row has to show what will actually be sent.
   */
  const display = (entry: { readonly id: StepId; readonly value: string }): string => {
    if (entry.value) return entry.value;
    if (skipped.includes(entry.id)) return contactPage.steps.review.skipped;
    return contactPage.steps.review.notAnswered;
  };

  const answered = summaries.filter((entry) => STEPS.indexOf(entry.id) < index);
  const busy = status === 'submitting';

  return (
    <Panel isMobile={isMobile}>
      <form ref={formRef} onSubmit={onSubmit} noValidate>
        {/* Hidden from people and from assistive tech; only a bot fills this. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: -9999, opacity: 0 }}>
          <label htmlFor={honeypotId}>Company fax</label>
          <input
            id={honeypotId}
            name={HONEYPOT_FIELD}
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Every answer travels with the submission, whichever step is showing. */}
        <input type="hidden" name="service" value={values.service} readOnly />
        <input type="hidden" name="projectDetails" value={values.projectDetails} readOnly />
        <input type="hidden" name="name" value={values.name} readOnly />
        <input type="hidden" name="email" value={values.email} readOnly />
        <input type="hidden" name="company" value={values.company} readOnly />
        <input type="hidden" name="referralSource" value={values.referralSource} readOnly />
        <input type="hidden" name="timeline" value={values.timeline} readOnly />
        <input type="hidden" name="budget" value={values.budget} readOnly />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <p
            aria-live="polite"
            style={{
              fontFamily: font.sans,
              fontWeight: weight.bold,
              fontSize: 12,
              letterSpacing: '0.1em',
              color: color.muted,
              margin: 0,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {String(index + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
          </p>

          <div
            aria-hidden="true"
            style={{
              flex: 1,
              height: 4,
              borderRadius: 999,
              background: color.border,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${((index + 1) / STEPS.length) * 100}%`,
                height: '100%',
                background: color.ink,
                transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </div>
        </div>

        {pasteNotice ? (
          <p
            role="status"
            style={{
              fontFamily: font.body,
              fontWeight: weight.light,
              fontSize: 14,
              lineHeight: 1.6,
              color: color.ink,
              background: color.accentPink,
              border: shape.keyline,
              borderRadius: 14,
              padding: '12px 16px',
              margin: '0 0 20px',
            }}
          >
            {pasteNotice}
          </p>
        ) : null}

        {/* The trail: what has been answered so far, still correctable. */}
        {step !== 'review' && answered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {answered.map((entry) => (
              <TrailRow
                key={entry.id}
                label={entry.label}
                value={display(entry)}
                editLabel={`${contactPage.editLabel}: ${entry.label}`}
                onEdit={() => editStep(entry.id)}
                compact
              />
            ))}
          </div>
        ) : null}

        <h2 style={headingStyle(isMobile)}>
          {step === 'review'
            ? contactPage.steps.review.question
            : contactPage.steps[step].question}
        </h2>

        <div style={{ marginTop: 20 }}>
          {step === 'service' ? (
            <ChoiceGroup
              label={contactPage.steps.service.question}
              options={SERVICE_TYPES}
              value={values.service}
              onChange={(next) => set('service', next)}
            />
          ) : null}

          {step === 'project' ? (
            <Field label={contactPage.steps.project.label}>
              {(id) => (
                <textarea
                  id={id}
                  rows={5}
                  autoFocus
                  placeholder={contactPage.steps.project.placeholder}
                  value={values.projectDetails}
                  onChange={(event) => set('projectDetails', event.target.value)}
                  className="form-field form-field--area"
                />
              )}
            </Field>
          ) : null}

          {step === 'you' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 16,
              }}
            >
              <Field label={contactPage.steps.you.nameLabel}>
                {(id) => (
                  <input
                    id={id}
                    type="text"
                    autoComplete="name"
                    autoFocus
                    placeholder={contactPage.steps.you.namePlaceholder}
                    value={values.name}
                    onChange={(event) => set('name', event.target.value)}
                    className="form-field"
                  />
                )}
              </Field>
              <Field label={contactPage.steps.you.emailLabel}>
                {(id) => (
                  <input
                    id={id}
                    type="email"
                    autoComplete="email"
                    placeholder={contactPage.steps.you.emailPlaceholder}
                    value={values.email}
                    onChange={(event) => set('email', event.target.value)}
                    className="form-field"
                  />
                )}
              </Field>
            </div>
          ) : null}

          {step === 'context' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: 16,
              }}
            >
              <Field label={contactPage.steps.context.companyLabel}>
                {(id) => (
                  <input
                    id={id}
                    type="text"
                    autoComplete="organization"
                    autoFocus
                    placeholder={contactPage.steps.context.companyPlaceholder}
                    value={values.company}
                    onChange={(event) => set('company', event.target.value)}
                    className="form-field"
                  />
                )}
              </Field>
              <Field label={contactPage.steps.context.referralLabel}>
                {(id) => (
                  <input
                    id={id}
                    type="text"
                    placeholder={contactPage.steps.context.referralPlaceholder}
                    value={values.referralSource}
                    onChange={(event) => set('referralSource', event.target.value)}
                    className="form-field"
                  />
                )}
              </Field>
            </div>
          ) : null}

          {step === 'scope' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={groupLabelStyle}>{contactPage.steps.scope.timelineLabel}</span>
                <ChoiceGroup
                  label={contactPage.steps.scope.timelineLabel}
                  options={TIMELINES}
                  value={values.timeline}
                  onChange={(next) => set('timeline', next)}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={groupLabelStyle}>{contactPage.steps.scope.budgetLabel}</span>
                <ChoiceGroup
                  label={contactPage.steps.scope.budgetLabel}
                  options={BUDGET_BANDS}
                  value={values.budget}
                  onChange={(next) => set('budget', next)}
                />
                <p style={{ ...bodyStyle, fontSize: 14 }}>{contactPage.steps.scope.note}</p>
              </div>
            </div>
          ) : null}

          {step === 'review' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {summaries.map((entry) => (
                <TrailRow
                  key={entry.id}
                  label={entry.label}
                  value={display(entry)}
                  editLabel={`${contactPage.editLabel}: ${entry.label}`}
                  onEdit={() => editStep(entry.id)}
                  error={fieldErrorFor(entry.id, fieldErrors)}
                />
              ))}
            </div>
          ) : null}
        </div>

        {touched && blocked ? (
          <p
            role="alert"
            style={{
              fontFamily: font.body,
              fontWeight: weight.light,
              fontSize: 14,
              color: color.brandDeep,
              margin: '14px 0 0',
            }}
          >
            {blocked}
          </p>
        ) : null}

        {status === 'error' && message ? (
          <p
            role="alert"
            style={{
              fontFamily: font.body,
              fontWeight: weight.light,
              fontSize: 14,
              color: color.brandDeep,
              margin: '14px 0 0',
            }}
          >
            {message}
          </p>
        ) : null}

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column-reverse' : 'row',
            alignItems: 'stretch',
            gap: 10,
            marginTop: 28,
          }}
        >
          {index > 0 ? (
            <button type="button" onClick={goBack} style={quietButton}>
              ← {contactPage.back}
            </button>
          ) : null}

          {OPTIONAL.has(step) ? (
            <button type="button" onClick={skip} style={quietButton}>
              {contactPage.skip}
            </button>
          ) : null}

          <span style={{ flex: isMobile ? undefined : 1 }} />

          {step === 'review' ? (
            <>
              {/* An empty address means there is no calendar to offer, the same
                  way an empty social URL hides its icon. Rendering href="" would
                  link the button at the page it is already on, which reads as a
                  broken booking rather than an absent one. */}
              {brand.bookACallUrl ? (
                <a
                  href={brand.bookACallUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={quietButton}
                >
                  {contactPage.callLabel}
                </a>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                style={{
                  ...primaryButton,
                  padding: '16px 28px',
                  fontSize: 15,
                  cursor: busy ? 'progress' : 'pointer',
                  opacity: busy ? 0.72 : 1,
                }}
              >
                {busy ? contactPage.submitBusyLabel : contactPage.submitLabel} →
              </button>
            </>
          ) : (
            <button
              type="submit"
              style={{ ...primaryButton, padding: '16px 28px', fontSize: 15 }}
            >
              {contactPage.continueLabel} →
            </button>
          )}
        </div>
      </form>
    </Panel>
  );
}

/** Maps a server field error back onto the step that collects it. */
function fieldErrorFor(
  id: StepId,
  errors: Readonly<Record<string, string>>,
): string | undefined {
  const byStep: Partial<Record<StepId, readonly string[]>> = {
    service: ['service'],
    project: ['projectDetails'],
    you: ['name', 'email'],
    context: ['company', 'referralSource'],
    scope: ['timeline', 'budget'],
  };
  for (const key of byStep[id] ?? []) {
    const found = errors[key];
    if (found) return found;
  }
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Panel({ isMobile, children }: { readonly isMobile: boolean; readonly children: ReactNode }) {
  return (
    <div
      style={{
        background: color.white,
        border: shape.keyline,
        borderRadius: 24,
        boxShadow: shape.hardShadow,
        padding: isMobile ? 24 : 36,
      }}
    >
      {children}
    </div>
  );
}

interface TrailRowProps {
  readonly label: string;
  readonly value: string;
  readonly editLabel: string;
  readonly onEdit: () => void;
  readonly compact?: boolean;
  readonly error?: string | undefined;
}

/** One answered question: what was asked, what was said, and a way to change it. */
function TrailRow({ label, value, editLabel, onEdit, compact = false, error }: TrailRowProps) {
  const { contactPage } = useContent();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        padding: compact ? '10px 14px' : '14px 16px',
        background: compact ? 'transparent' : color.paperAlt,
        border: compact ? 'none' : `2px solid ${error ? color.brand : color.border}`,
        borderLeft: compact ? `2px solid ${color.border}` : undefined,
        borderRadius: compact ? 0 : 14,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontFamily: font.sans,
            fontWeight: weight.bold,
            fontSize: 11,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: color.muted,
            margin: '0 0 3px',
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: font.body,
            fontWeight: weight.light,
            fontSize: compact ? 14 : 15,
            lineHeight: 1.5,
            color: color.ink,
            margin: 0,
            // A long brief should not push the Edit button off the row.
            display: '-webkit-box',
            WebkitLineClamp: compact ? 1 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {value}
        </p>
        {error ? (
          <p
            style={{
              fontFamily: font.body,
              fontWeight: weight.light,
              fontSize: 13,
              color: color.brandDeep,
              margin: '6px 0 0',
            }}
          >
            {error}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onEdit}
        aria-label={editLabel}
        style={{
          flexShrink: 0,
          background: 'none',
          border: 'none',
          padding: '4px 2px',
          minHeight: 44,
          cursor: 'pointer',
          fontFamily: font.sans,
          fontWeight: weight.bold,
          fontSize: 13,
          color: color.ink,
          textDecoration: 'underline',
          textUnderlineOffset: 3,
        }}
      >
        {contactPage.editLabel}
      </button>
    </div>
  );
}

interface ChoiceGroupProps {
  readonly label: string;
  readonly options: readonly string[];
  readonly value: string;
  readonly onChange: (next: string) => void;
}

/** A single-select set of chips. The last option is always a way out. */
function ChoiceGroup({ label, options, value, onChange }: ChoiceGroupProps) {
  return (
    <div role="radiogroup" aria-label={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            style={{
              fontFamily: font.sans,
              fontWeight: weight.bold,
              fontSize: 14,
              color: selected ? color.white : color.ink,
              background: selected ? color.ink : color.paperAlt,
              border: `2px solid ${selected ? color.ink : color.border}`,
              borderRadius: radius.pill,
              padding: '12px 18px',
              minHeight: 44,
              cursor: 'pointer',
              transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

interface FieldProps {
  readonly label: string;
  readonly children: (id: string) => ReactNode;
}

function Field({ label, children }: FieldProps) {
  const id = useId();
  return (
    <label htmlFor={id} style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}>
      <span
        style={{
          fontFamily: font.sans,
          fontWeight: weight.bold,
          fontSize: 13,
          color: color.ink,
        }}
      >
        {label}
      </span>
      {children(id)}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const headingStyle = (isMobile: boolean) =>
  ({
    fontFamily: font.display,
    fontWeight: weight.extrabold,
    fontSize: isMobile ? 22 : 27,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: color.ink,
    margin: 0,
    textWrap: 'balance',
  }) as const;

const groupLabelStyle = {
  fontFamily: font.sans,
  fontWeight: weight.bold,
  fontSize: 13,
  color: color.ink,
} as const;

const bodyStyle = {
  fontFamily: font.body,
  fontWeight: weight.light,
  fontSize: 15,
  lineHeight: 1.65,
  color: color.muted,
  margin: 0,
} as const;

const quietButton = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: color.white,
  color: color.ink,
  border: shape.keyline,
  borderRadius: radius.pill,
  boxShadow: shape.hardShadowSmall,
  fontFamily: font.sans,
  fontWeight: weight.bold,
  fontSize: 14,
  padding: '14px 22px',
  minHeight: 44,
  cursor: 'pointer',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
} as const;
