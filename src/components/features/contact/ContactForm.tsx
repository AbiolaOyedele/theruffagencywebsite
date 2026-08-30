'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { color, font, primaryButton, radius, shape, weight } from '@/config/tokens';
import { brand, contactPage } from '@/content/site';
import { INQUIRY_MARKER, parseInquiryBlock } from '@/lib/agent-inquiry';
import { HONEYPOT_FIELD, REFERRAL_SOURCES } from '@/lib/schemas/form-constants';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Values {
  name: string;
  email: string;
  company: string;
  phone: string;
  referralSource: string;
  projectDetails: string;
}

const EMPTY: Values = {
  name: '',
  email: '',
  company: '',
  phone: '',
  referralSource: '',
  projectDetails: '',
};

type Status = 'idle' | 'submitting' | 'error' | 'success';

interface State {
  readonly status: Status;
  readonly message: string;
  readonly fieldErrors: Readonly<Record<string, string>>;
}

const IDLE: State = { status: 'idle', message: '', fieldErrors: {} };

interface ContactApiResponse {
  readonly ok?: boolean;
  readonly message?: string;
  readonly error?: { readonly code: string; readonly message: string };
  readonly fieldErrors?: Record<string, string>;
}

/**
 * The enquiry form.
 *
 * Fields are controlled so the paste-to-fill flow can populate them: an
 * assistant drafts a brief following /agent/prompt.md, the visitor pastes the
 * result anywhere on this page, and the form fills itself in. Pasted text only
 * ever becomes a field value — never markup — and the server revalidates every
 * field, so a typed submission and a pasted one are checked identically.
 */
export function ContactForm() {
  const isMobile = useIsMobile();
  const [state, setState] = useState<State>(IDLE);
  const [values, setValues] = useState<Values>(EMPTY);
  const [pasteNotice, setPasteNotice] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);
  const listId = useId();

  const set =
    (key: keyof Values) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
      setValues((current) => ({ ...current, [key]: event.target.value }));

  // Page-level paste listener. Anything that is not one of our blocks falls
  // through untouched, so ordinary copy-paste into a field still works.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent): void => {
      const text = event.clipboardData?.getData('text/plain');
      if (!text || !text.includes(INQUIRY_MARKER)) return;

      const parsed = parseInquiryBlock(text);
      if (!parsed) return;

      event.preventDefault();
      setValues((current) => ({ ...current, ...parsed }));
      setPasteNotice(contactPage.agent.pasteNotice);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    setState({ ...IDLE, status: 'submitting' });

    try {
      const response = await fetch('/api/v1/contact', {
        method: 'POST',
        body: new FormData(form),
      });
      const body = (await response.json()) as ContactApiResponse;

      if (!response.ok) {
        setState({
          status: 'error',
          message: body.error?.message ?? 'We could not send that. Please try again.',
          fieldErrors: body.fieldErrors ?? {},
        });
        return;
      }

      setState({ status: 'success', message: body.message ?? '', fieldErrors: {} });
      setValues(EMPTY);
      setPasteNotice('');
    } catch {
      // A network failure, not a rejection — the server never saw this.
      setState({
        status: 'error',
        message: 'We could not reach the server. Check your connection and try again.',
        fieldErrors: {},
      });
    }
  }

  if (state.status === 'success') {
    return (
      <div
        role="status"
        style={{
          background: color.white,
          border: shape.keyline,
          borderRadius: 24,
          boxShadow: shape.hardShadow,
          padding: isMobile ? 28 : 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <h2
          style={{
            fontFamily: font.display,
            fontWeight: weight.extrabold,
            fontSize: isMobile ? 24 : 28,
            letterSpacing: '-0.02em',
            color: color.ink,
            margin: 0,
          }}
        >
          {contactPage.successHeading}
        </h2>
        <p
          style={{
            fontFamily: font.body,
            fontWeight: weight.light,
            fontSize: 16,
            lineHeight: 1.7,
            color: color.muted,
            margin: 0,
          }}
        >
          {state.message}
        </p>
      </div>
    );
  }

  const busy = state.status === 'submitting';

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      style={{
        background: color.white,
        border: shape.keyline,
        borderRadius: 24,
        boxShadow: shape.hardShadow,
        padding: isMobile ? 24 : 36,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <h2
        style={{
          fontFamily: font.display,
          fontWeight: weight.extrabold,
          fontSize: isMobile ? 22 : 26,
          letterSpacing: '-0.02em',
          color: color.ink,
          margin: 0,
        }}
      >
        {contactPage.formHeading}
      </h2>

      {/* Hidden from people and from assistive tech; only a bot fills this. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: -9999, opacity: 0 }}>
        <label htmlFor={`${listId}-fax`}>Company fax</label>
        <input id={`${listId}-fax`} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      {pasteNotice ? (
        <p
          role="status"
          aria-live="polite"
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
            margin: 0,
          }}
        >
          {pasteNotice}
        </p>
      ) : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 20,
        }}
      >
        <Field label={contactPage.fields.name.label} required error={state.fieldErrors['name']}>
          {(id, invalid) => (
            <input
              id={id}
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder={contactPage.fields.name.placeholder}
              value={values.name}
              onChange={set('name')}
              aria-invalid={invalid}
              style={inputStyle}
            />
          )}
        </Field>

        <Field label={contactPage.fields.email.label} required error={state.fieldErrors['email']}>
          {(id, invalid) => (
            <input
              id={id}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={contactPage.fields.email.placeholder}
              value={values.email}
              onChange={set('email')}
              aria-invalid={invalid}
              style={inputStyle}
            />
          )}
        </Field>

        <Field label={contactPage.fields.company.label} error={state.fieldErrors['company']}>
          {(id, invalid) => (
            <input
              id={id}
              name="company"
              type="text"
              autoComplete="organization"
              placeholder={contactPage.fields.company.placeholder}
              value={values.company}
              onChange={set('company')}
              aria-invalid={invalid}
              style={inputStyle}
            />
          )}
        </Field>

        <Field label={contactPage.fields.phone.label} error={state.fieldErrors['phone']}>
          {(id, invalid) => (
            <input
              id={id}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder={contactPage.fields.phone.placeholder}
              value={values.phone}
              onChange={set('phone')}
              aria-invalid={invalid}
              style={inputStyle}
            />
          )}
        </Field>
      </div>

      <Field
        label={contactPage.fields.referralSource.label}
        error={state.fieldErrors['referralSource']}
      >
        {(id, invalid) => (
          <>
            <input
              id={id}
              name="referralSource"
              type="text"
              list={`${listId}-sources`}
              placeholder={contactPage.fields.referralSource.placeholder}
              value={values.referralSource}
              onChange={set('referralSource')}
              aria-invalid={invalid}
              style={inputStyle}
            />
            {/* Suggestions, not a closed set — free text is still accepted. */}
            <datalist id={`${listId}-sources`}>
              {REFERRAL_SOURCES.map((source) => (
                <option key={source} value={source} />
              ))}
            </datalist>
          </>
        )}
      </Field>

      <Field
        label={contactPage.fields.projectDetails.label}
        required
        error={state.fieldErrors['projectDetails']}
      >
        {(id, invalid) => (
          <textarea
            id={id}
            name="projectDetails"
            required
            rows={6}
            placeholder={contactPage.fields.projectDetails.placeholder}
            value={values.projectDetails}
            onChange={set('projectDetails')}
            aria-invalid={invalid}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 150 }}
          />
        )}
      </Field>

      {state.status === 'error' && state.message ? (
        <p
          role="alert"
          style={{
            fontFamily: font.body,
            fontWeight: weight.light,
            fontSize: 14,
            lineHeight: 1.6,
            color: color.brandDeep,
            margin: 0,
          }}
        >
          {state.message}
        </p>
      ) : null}

      {/* The two ways forward, side by side: send the brief, or book a call. */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 12,
          alignItems: 'stretch',
        }}
      >
        <button
          type="submit"
          disabled={busy}
          style={{
            ...primaryButton,
            flex: isMobile ? undefined : '1 1 0',
            padding: '16px 28px',
            fontSize: 15,
            cursor: busy ? 'progress' : 'pointer',
            opacity: busy ? 0.72 : 1,
          }}
        >
          {busy ? contactPage.submitBusyLabel : contactPage.submitLabel}
        </button>

        <a
          href={brand.bookACallUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: isMobile ? undefined : '1 1 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: color.white,
            color: color.ink,
            border: shape.keyline,
            borderRadius: radius.pill,
            boxShadow: shape.hardShadowSmall,
            fontFamily: font.sans,
            fontWeight: weight.bold,
            fontSize: 15,
            padding: '16px 28px',
            textDecoration: 'none',
            minHeight: 44,
          }}
        >
          {contactPage.callLabel}
        </a>
      </div>
    </form>
  );
}

const inputStyle = {
  width: '100%',
  fontFamily: font.body,
  fontWeight: weight.light,
  fontSize: 16,
  color: color.ink,
  background: color.paperAlt,
  border: `2px solid ${color.border}`,
  borderRadius: 14,
  padding: '13px 14px',
  minHeight: 44,
  outlineOffset: 2,
} as const;

interface FieldProps {
  readonly label: string;
  readonly required?: boolean;
  readonly error?: string | undefined;
  /** Receives the generated id and whether the control is in an error state. */
  readonly children: (id: string, invalid: boolean) => ReactNode;
}

/** Label, control and inline error, wired together by a generated id. */
function Field({ label, required = false, error, children }: FieldProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 0 }}
    >
      <span
        style={{
          fontFamily: font.sans,
          fontWeight: weight.bold,
          fontSize: 13,
          color: color.ink,
        }}
      >
        {label}
        {required ? null : (
          <span style={{ fontWeight: weight.medium, color: color.muted }}> (optional)</span>
        )}
      </span>

      {children(id, Boolean(error))}

      {error ? (
        <span
          style={{
            fontFamily: font.body,
            fontWeight: weight.light,
            fontSize: 13,
            color: color.brandDeep,
          }}
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
