"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import {
  COMPANY_SIZES,
  FORM_URL,
  GOALS,
  INDUSTRIES,
  MARKETS,
  MONTHLY_AD_SPEND,
  SERVICE_OPTIONS,
} from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const STEPS = ["About you", "Your goal", "Your company"] as const;
const LAST = STEPS.length - 1;

const fieldClass =
  "h-12 w-full rounded-xl border border-line bg-white/[0.03] px-4 text-[15px] text-foreground placeholder:text-foreground/30 outline-none transition-[border-color,background-color] duration-300 focus:border-accent-warm/70 focus:bg-white/[0.05]";

/**
 * Global strategy-call modal. Any link to FORM_URL opens it (captured before smooth-scroll anchors),
 * as does landing on /#book-a-call directly. The form runs in three steps that slide in the direction
 * of travel while the card eases to each step's height.
 */
export function WaitlistModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const directionRef = useRef(1);
  const heightRef = useRef<number | null>(null);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const id = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const open = () => {
      if (dialog.open) return;
      dialog.showModal();
      window.__lenis?.stop();
      firstFieldRef.current?.focus();
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.(`a[href="${FORM_URL}"]`);
      if (!link) return;
      event.preventDefault();
      event.stopPropagation();
      open();
    };
    const onClose = () => {
      window.__lenis?.start();
      // Reopening after a submission shows a fresh form from the first step.
      setStatus((current) => {
        if (current !== "success") return current;
        setStep(0);
        return "idle";
      });
      setError("");
      if (window.location.hash === FORM_URL) history.replaceState(null, "", window.location.pathname);
    };

    const onHashChange = () => {
      if (window.location.hash === FORM_URL) open();
    };

    document.addEventListener("click", onClick, { capture: true });
    dialog.addEventListener("close", onClose);
    window.addEventListener("hashchange", onHashChange);
    onHashChange();

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      dialog.removeEventListener("close", onClose);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  // Each new step slides in from the side it's coming from, and the card eases to its new height.
  useGSAP(
    () => {
      const body = bodyRef.current;
      const panel = body?.querySelector<HTMLElement>(`[data-step="${step}"]`);
      if (!body || !panel || heightRef.current === null) return;
      const from = heightRef.current;
      heightRef.current = null;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(body, { height: from }, { height: "auto", duration: 0.5, ease: "expo.out" });
        gsap.fromTo(
          panel,
          { x: 40 * directionRef.current, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.55, ease: "expo.out" },
        );
      });
      panel.querySelector<HTMLElement>("input, select")?.focus({ preventScroll: true });
    },
    { dependencies: [step] },
  );

  const close = () => dialogRef.current?.close();

  /** Checks the current step's fields, showing the browser's message on the first invalid one. */
  const stepIsValid = () => {
    const panel = bodyRef.current?.querySelector<HTMLElement>(`[data-step="${step}"]`);
    if (!panel) return true;
    for (const group of panel.querySelectorAll<HTMLElement>("[data-require-one]")) {
      const boxes = [...group.querySelectorAll<HTMLInputElement>("input[type=checkbox]")];
      boxes[0].setCustomValidity(boxes.some((box) => box.checked) ? "" : "Choose at least one option.");
    }
    for (const field of panel.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input:not([tabindex='-1']), select")) {
      if (!field.reportValidity()) return false;
    }
    return true;
  };

  const goTo = (next: number) => {
    if (next === step) return;
    directionRef.current = next > step ? 1 : -1;
    heightRef.current = bodyRef.current?.offsetHeight ?? null;
    setError("");
    setStep(next);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stepIsValid()) return;
    if (step < LAST) {
      goTo(step + 1);
      return;
    }

    const form = new FormData(event.currentTarget);
    const data = {
      company: form.get("company"),
      email: form.get("email"),
      website: form.get("website"),
      goal: form.get("goal"),
      markets: form.getAll("markets"),
      services: form.getAll("services"),
      industry: form.get("industry"),
      size: form.get("size"),
      spend: form.get("spend"),
      nickname: form.get("nickname"),
    };

    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      formRef.current?.reset();
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-desc`}
      data-lenis-prevent
      className="waitlist-dialog m-auto w-[calc(100%-2rem)] max-w-lg overflow-visible bg-transparent p-0 text-foreground"
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="relative isolate max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl border border-line bg-[#111112] p-6 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)] sm:p-9">
        {/* Soft brand glow from the top centre; sits above the card fill, below the content. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-[radial-gradient(100%_100%_at_50%_0%,rgb(195_184_168/0.16),transparent_70%)]"
        />
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-foreground/60 ring-1 ring-line transition-colors hover:bg-foreground hover:text-background"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="py-6 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent-warm/15 text-accent-warm">
              <svg viewBox="0 0 16 16" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <path d="M3 8.5l3.2 3L13 4.5" />
              </svg>
            </span>
            <h2 id={`${id}-title`} className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
              Request received.
            </h2>
            <p id={`${id}-desc`} className="mt-3 text-pretty text-foreground/60">
              We&apos;ll email you soon to schedule your strategy call.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-8 h-11 w-full rounded-full bg-foreground text-sm font-medium text-background transition-colors hover:bg-accent-warm"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id={`${id}-title`} className="mt-5 pr-10 text-[1.75rem] leading-tight font-semibold tracking-[-0.035em]">
              Book a <span className="font-serif-accent text-accent-warm">strategy call.</span>
            </h2>
            <p id={`${id}-desc`} className="mt-3 text-pretty text-foreground/60">
              Thirty minutes on your goal, markets and content. Three quick steps so we come prepared.
            </p>

            {/* Step progress */}
            <div className="mt-7">
              <div className="flex gap-1.5" aria-hidden>
                {STEPS.map((label, i) => (
                  <span key={label} className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-line">
                    <span
                      className={cn(
                        "absolute inset-0 origin-left bg-accent-warm transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                        i <= step ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </span>
                ))}
              </div>
              <p className="mt-3 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase" aria-live="polite">
                Step {step + 1} of {STEPS.length} · {STEPS[step]}
              </p>
            </div>

            <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-6">
              <div ref={bodyRef} className="relative overflow-hidden px-1 py-1">
                <Step index={0} current={step}>
                  <Field label="Company name">
                    <input
                      ref={firstFieldRef}
                      name="company"
                      required
                      autoComplete="organization"
                      maxLength={120}
                      placeholder="Acme Inc."
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Work email">
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={160}
                      placeholder="you@company.com"
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Company website">
                    <input
                      name="website"
                      type="text"
                      inputMode="url"
                      required
                      autoComplete="url"
                      maxLength={200}
                      placeholder="acme.com"
                      className={fieldClass}
                    />
                  </Field>
                </Step>

                <Step index={1} current={step}>
                  <ChipGroup legend="Main goal" name="goal" type="radio" options={GOALS} />
                  <ChipGroup legend="Target markets" name="markets" type="checkbox" options={MARKETS} />
                  <ChipGroup legend="What do you need?" name="services" type="checkbox" options={SERVICE_OPTIONS} />
                </Step>

                <Step index={2} current={step}>
                  <Field label="Sector">
                    <Select name="industry" placeholder="Choose your sector" options={INDUSTRIES} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Company size">
                      <Select name="size" placeholder="Employees" options={COMPANY_SIZES} />
                    </Field>
                    <Field label="Monthly ad spend">
                      <Select name="spend" placeholder="Choose a range" options={MONTHLY_AD_SPEND} />
                    </Field>
                  </div>
                  {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
                  <input type="text" name="nickname" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
                </Step>
              </div>

              {status === "error" ? (
                <p role="alert" className="mt-4 text-sm text-[oklch(0.75_0.15_25)]">
                  {error}
                </p>
              ) : null}

              <div className="mt-7 flex gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    className="h-12 shrink-0 rounded-full px-5 text-[15px] font-medium text-foreground/70 ring-1 ring-line transition-colors hover:text-foreground hover:ring-foreground/40"
                  >
                    Back
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="group/submit flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-[15px] font-medium text-background transition-colors hover:bg-accent-warm disabled:cursor-wait disabled:opacity-80"
                >
                  {status === "submitting" ? (
                    <>
                      <span
                        aria-hidden
                        className="size-4 animate-spin rounded-full border-2 border-background/30 border-t-background"
                      />
                      Sending…
                    </>
                  ) : step < LAST ? (
                    <>
                      Continue
                      <span aria-hidden className="transition-transform duration-300 group-hover/submit:translate-x-0.5">
                        →
                      </span>
                    </>
                  ) : (
                    "Request a call"
                  )}
                </button>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                No spam. We&apos;ll only email you to schedule the call. See our{" "}
                <a href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-foreground">
                  privacy policy
                </a>
                .
              </p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}

/** One step of the form. Inactive steps stay mounted (so answers persist) but are hidden. */
function Step({ index, current, children }: { index: number; current: number; children: ReactNode }) {
  return (
    <fieldset data-step={index} hidden={index !== current} className="grid gap-5">
      <legend className="sr-only">{STEPS[index]}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-foreground/70">{label}</span>
      {children}
    </label>
  );
}

/** Pill-shaped radio or checkbox options. Checkbox groups need at least one choice. */
function ChipGroup({
  legend,
  name,
  type,
  options,
}: {
  legend: string;
  name: string;
  type: "radio" | "checkbox";
  options: readonly string[];
}) {
  return (
    <fieldset data-require-one={type === "checkbox" ? "" : undefined}>
      <legend className="mb-2.5 text-sm text-foreground/70">
        {legend}
        {type === "checkbox" ? <span className="text-foreground/40"> · choose any</span> : null}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option, i) => (
          <label key={option} className="relative cursor-pointer">
            <input
              type={type}
              name={name}
              value={option}
              required={type === "radio" && i === 0}
              onChange={(e) => clearGroupError(e.currentTarget)}
              className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full"
            />
            <span className="pointer-events-none flex h-10 items-center rounded-full px-4 text-sm text-foreground/70 ring-1 ring-line transition-[color,background-color,box-shadow] duration-300 peer-checked:bg-accent-warm/15 peer-checked:text-foreground peer-checked:ring-accent-warm/70 peer-hover:ring-foreground/35 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-warm">
              {option}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Once any box in a "choose at least one" group is ticked, the group's error clears. */
function clearGroupError(input: HTMLInputElement) {
  input.closest("[data-require-one]")?.querySelector<HTMLInputElement>("input[type=checkbox]")?.setCustomValidity("");
}

function Select({ name, placeholder, options }: { name: string; placeholder: string; options: readonly string[] }) {
  return (
    <span className="relative">
      <select name={name} required defaultValue="" className={cn(fieldClass, "appearance-none pr-10 invalid:text-foreground/30")}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#111112] text-foreground">
            {option}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 16 16"
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-foreground/50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </span>
  );
}
