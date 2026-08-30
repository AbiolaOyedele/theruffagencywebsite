'use client';

import { useId, useState, type ReactNode } from 'react';
import { color, font, primaryButton, radius, shape, weight } from '@/config/tokens';
import { careersPage } from '@/content/site';
import { HONEYPOT_FIELD } from '@/lib/schemas/form-constants';
import {
  AVAILABILITY_OPTIONS,
  ROLE_CATEGORIES,
} from '@/lib/schemas/talent-constants';
import { useIsMobile } from '@/hooks/useIsMobile';

/** The questions, in order. The last one is the review. */
const STEPS = ['about', 'roles', 'note', 'review'] as const;
type StepId = (typeof STEPS)[number];

const REVIEW_INDEX = STEPS.indexOf('review');

interface Values {
  fullName: string;
  email: string;
  phone: string;
  yearsExperience: string;
  availability: string;
  expectedRate: string;
  portfolioLink: string;
  note: string;
  roles: readonly string[];
}

const EMPTY: Values = {
  fullName: '',
  email: '',
  phone: '',
  yearsExperience: '',
  availability: '',
  expectedRate: '',
  portfolioLink: '',
  note: '',
  roles: [],
};

type Status = 'idle' | 'submitting' | 'error' | 'success';

interface TalentApiResponse {
  readonly ok?: boolean;
  readonly message?: string;
  readonly error?: { readonly code: string; readonly message: string };
  readonly fieldErrors?: Record<string, string>;
}

/**
 * The talent-pool application, asked a step at a time.
 *
 * Same shape as the project enquiry — a progress bar, a visible trail of what
 * has been answered, and a review before anything sends — so someone who has
 * used one already knows how this works. The roles step is the one that earns
 * its own screen: it is a long list, and picking from it is the whole point of
 * the pool.
 */
export function TalentWizard() {
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState(false);
  const honeypotId = useId();

  const step = STEPS[index] as StepId;
  const set = (key: keyof Values, value: string): void =>
    setValues((current) => ({ ...current, [key]: value }));

  const toggleRole = (role: string): void =>
    setValues((current) => ({
      ...current,
      roles: current.roles.includes(role)
        ? current.roles.filter((entry) => entry !== role)
        : [...current.roles, role],
    }));

  /** What is missing on this step, if anything. The server revalidates. */
  function blockedReason(target: StepId): string | null {
    if (target === 'about') {
      if (!values.fullName.trim()) return 'We need a name to put to the application.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
        return 'Enter an email address we can reach you on.';
      }
      if (values.phone.trim().length < 7) return 'Enter a phone number we can reach you on.';
      if (!values.yearsExperience.trim()) return 'Roughly how long have you been doing this?';
      if (!values.availability) return 'Pick the one that fits.';
      if (!values.expectedRate.trim()) return 'A number or a range is fine.';
    }
    if (target === 'roles' && values.roles.length === 0) {
      return 'Pick at least one role.';
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
    setIndex((current) => Math.min(REVIEW_INDEX, current + 1));
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

    try {
      const response = await fetch('/api/v1/talent', { method: 'POST', body: new FormData(form) });
      const body = (await response.json()) as TalentApiResponse;

      if (!response.ok) {
        setStatus('error');
        setMessage(body.error?.message ?? 'We could not send that. Please try again.');
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
          <h2 style={headingStyle(isMobile)}>{careersPage.successHeading}</h2>
          <p style={bodyStyle}>{message}</p>
        </div>
      </Panel>
    );
  }

  const summaries: readonly { readonly id: StepId; readonly label: string; readonly value: string }[] =
    [
      {
        id: 'about',
        label: careersPage.steps.about.label,
        value: [values.fullName, values.email, values.availability].filter(Boolean).join(' · '),
      },
      {
        id: 'roles',
        label: careersPage.steps.roles.label,
        value: values.roles.length ? values.roles.join(', ') : '',
      },
      { id: 'note', label: careersPage.steps.note.label, value: values.note },
    ];

  const answered = summaries.filter((entry) => STEPS.indexOf(entry.id) < index);
  const busy = status === 'submitting';
  const display = (entry: { readonly id: StepId; readonly value: string }): string =>
    entry.value || (entry.id === 'roles' ? careersPage.steps.review.none : careersPage.steps.review.notAnswered);

  return (
    <Panel isMobile={isMobile}>
      <form onSubmit={onSubmit} noValidate>
        {/* Hidden from people and from assistive tech; only a bot fills this. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: -9999, opacity: 0 }}>
          <label htmlFor={honeypotId}>Company fax</label>
          <input id={honeypotId} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Every answer travels with the submission, whichever step is showing. */}
        <input type="hidden" name="fullName" value={values.fullName} readOnly />
        <input type="hidden" name="email" value={values.email} readOnly />
        <input type="hidden" name="phone" value={values.phone} readOnly />
        <input type="hidden" name="yearsExperience" value={values.yearsExperience} readOnly />
        <input type="hidden" name="availability" value={values.availability} readOnly />
        <input type="hidden" name="expectedRate" value={values.expectedRate} readOnly />
        <input type="hidden" name="portfolioLink" value={values.portfolioLink} readOnly />
        <input type="hidden" name="note" value={values.note} readOnly />
        <input type="hidden" name="rolesInterested" value={values.roles.join(',')} readOnly />

        <ProgressRow index={index} total={STEPS.length} />

        {step !== 'review' && answered.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {answered.map((entry) => (
              <TrailRow
                key={entry.id}
                label={entry.label}
                value={display(entry)}
                onEdit={() => {
                  setTouched(false);
                  setIndex(STEPS.indexOf(entry.id));
                }}
                compact
              />
            ))}
          </div>
        ) : null}

        <h2 style={headingStyle(isMobile)}>
          {step === 'review'
            ? careersPage.steps.review.question
            : careersPage.steps[step].question}
        </h2>

        <div style={{ marginTop: 20 }}>
          {step === 'about' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: 16,
                }}
              >
                <Field label={careersPage.steps.about.nameLabel}>
                  {(id) => (
                    <input
                      id={id}
                      type="text"
                      autoComplete="name"
                      autoFocus
                      placeholder={careersPage.steps.about.namePlaceholder}
                      value={values.fullName}
                      onChange={(event) => set('fullName', event.target.value)}
                      className="form-field"
                    />
                  )}
                </Field>
                <Field label={careersPage.steps.about.emailLabel}>
                  {(id) => (
                    <input
                      id={id}
                      type="email"
                      autoComplete="email"
                      placeholder={careersPage.steps.about.emailPlaceholder}
                      value={values.email}
                      onChange={(event) => set('email', event.target.value)}
                      className="form-field"
                    />
                  )}
                </Field>
                <Field label={careersPage.steps.about.phoneLabel}>
                  {(id) => (
                    <input
                      id={id}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={careersPage.steps.about.phonePlaceholder}
                      value={values.phone}
                      onChange={(event) => set('phone', event.target.value)}
                      className="form-field"
                    />
                  )}
                </Field>
                <Field label={careersPage.steps.about.experienceLabel}>
                  {(id) => (
                    <input
                      id={id}
                      type="text"
                      inputMode="numeric"
                      placeholder={careersPage.steps.about.experiencePlaceholder}
                      value={values.yearsExperience}
                      onChange={(event) => set('yearsExperience', event.target.value)}
                      className="form-field"
                    />
                  )}
                </Field>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={groupLabelStyle}>{careersPage.steps.about.availabilityLabel}</span>
                <ChoiceGroup
                  label={careersPage.steps.about.availabilityLabel}
                  options={AVAILABILITY_OPTIONS}
                  value={values.availability}
                  onChange={(next) => set('availability', next)}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: 16,
                }}
              >
                <Field label={careersPage.steps.about.rateLabel}>
                  {(id) => (
                    <input
                      id={id}
                      type="text"
                      placeholder={careersPage.steps.about.ratePlaceholder}
                      value={values.expectedRate}
                      onChange={(event) => set('expectedRate', event.target.value)}
                      className="form-field"
                    />
                  )}
                </Field>
                <Field label={careersPage.steps.about.portfolioLabel}>
                  {(id) => (
                    <input
                      id={id}
                      type="url"
                      inputMode="url"
                      autoComplete="url"
                      placeholder={careersPage.steps.about.portfolioPlaceholder}
                      value={values.portfolioLink}
                      onChange={(event) => set('portfolioLink', event.target.value)}
                      className="form-field"
                    />
                  )}
                </Field>
              </div>
            </div>
          ) : null}

          {step === 'roles' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <p style={{ ...bodyStyle, fontSize: 14 }}>{careersPage.steps.roles.helper}</p>
              {ROLE_CATEGORIES.map((category) => (
                <fieldset
                  key={category.id}
                  style={{ border: 'none', margin: 0, padding: 0, minWidth: 0 }}
                >
                  <legend style={{ ...groupLabelStyle, marginBottom: 10, padding: 0 }}>
                    {category.label}
                  </legend>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {category.roles.map((role) => (
                      <RolePill
                        key={role}
                        label={role}
                        selected={values.roles.includes(role)}
                        onToggle={() => toggleRole(role)}
                      />
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          ) : null}

          {step === 'note' ? (
            <Field label={careersPage.steps.note.label}>
              {(id) => (
                <textarea
                  id={id}
                  rows={5}
                  autoFocus
                  placeholder={careersPage.steps.note.placeholder}
                  value={values.note}
                  onChange={(event) => set('note', event.target.value)}
                  className="form-field form-field--area"
                />
              )}
            </Field>
          ) : null}

          {step === 'review' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {summaries.map((entry) => (
                <TrailRow
                  key={entry.id}
                  label={entry.label}
                  value={display(entry)}
                  onEdit={() => {
                    setTouched(false);
                    setIndex(STEPS.indexOf(entry.id));
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>

        {(touched && blocked) || (status === 'error' && message) ? (
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
            {touched && blocked ? blocked : message}
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
            <button
              type="button"
              onClick={() => {
                setTouched(false);
                setIndex((current) => Math.max(0, current - 1));
              }}
              style={quietButton}
            >
              ← Back
            </button>
          ) : null}

          <span style={{ flex: isMobile ? undefined : 1 }} />

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
            {step === 'review'
              ? busy
                ? careersPage.submitBusyLabel
                : careersPage.submitLabel
              : 'Continue'}{' '}
            →
          </button>
        </div>
      </form>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function ProgressRow({ index, total }: { readonly index: number; readonly total: number }) {
  return (
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
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
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
            width: `${((index + 1) / total) * 100}%`,
            height: '100%',
            background: color.ink,
            transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  );
}

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
  readonly onEdit: () => void;
  readonly compact?: boolean;
}

function TrailRow({ label, value, onEdit, compact = false }: TrailRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        padding: compact ? '10px 14px' : '14px 16px',
        background: compact ? 'transparent' : color.paperAlt,
        border: compact ? 'none' : `2px solid ${color.border}`,
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
            display: '-webkit-box',
            WebkitLineClamp: compact ? 1 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {value}
        </p>
      </div>

      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit: ${label}`}
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
        Edit
      </button>
    </div>
  );
}

interface RolePillProps {
  readonly label: string;
  readonly selected: boolean;
  readonly onToggle: () => void;
}

/** One role. Multi-select, so these are checkboxes rather than radios. */
function RolePill({ label, selected, onToggle }: RolePillProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onToggle}
      style={{
        fontFamily: font.sans,
        fontWeight: weight.bold,
        fontSize: 13,
        color: selected ? color.white : color.ink,
        background: selected ? color.ink : color.paperAlt,
        border: `2px solid ${selected ? color.ink : color.border}`,
        borderRadius: radius.pill,
        padding: '11px 16px',
        minHeight: 44,
        cursor: 'pointer',
        transition: 'background 0.18s ease, color 0.18s ease, border-color 0.18s ease',
      }}
    >
      {label}
    </button>
  );
}

interface ChoiceGroupProps {
  readonly label: string;
  readonly options: readonly string[];
  readonly value: string;
  readonly onChange: (next: string) => void;
}

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
  whiteSpace: 'nowrap',
} as const;
