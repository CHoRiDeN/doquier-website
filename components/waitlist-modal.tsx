"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { COMPANY_SIZES, FORM_URL, MONTHLY_AD_SPEND } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "h-12 w-full rounded-xl border border-line bg-white/[0.03] px-4 text-[15px] text-foreground placeholder:text-foreground/30 outline-none transition-[border-color,background-color] duration-300 focus:border-accent-warm/70 focus:bg-white/[0.05]";

/**
 * Global waitlist modal. Any link to FORM_URL opens it (captured before smooth-scroll anchors),
 * as does landing on /#waitlist directly.
 */
export function WaitlistModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
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
      // Reopening after a submission shows a fresh form.
      setStatus((current) => (current === "success" ? "idle" : current));
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

  const close = () => dialogRef.current?.close();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
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
              You&apos;re on the list.
            </h2>
            <p id={`${id}-desc`} className="mt-3 text-pretty text-foreground/60">
              We&apos;ll reach out as soon as a production slot opens up for your brand.
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
              We&apos;re at capacity. <span className="font-serif-accent text-accent-warm">Join the waitlist.</span>
            </h2>
            <p id={`${id}-desc`} className="mt-3 text-pretty text-foreground/60">
              We only take on a few brands at a time to keep quality high. Leave your details and we&apos;ll reach out
              as soon as a slot opens.
            </p>

            <form onSubmit={onSubmit} className="mt-7 grid gap-4">
              <label className="grid gap-1.5 text-sm">
                <span className="text-foreground/70">Company name</span>
                <input
                  ref={firstFieldRef}
                  name="company"
                  required
                  autoComplete="organization"
                  maxLength={120}
                  placeholder="Acme Inc."
                  className={fieldClass}
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-foreground/70">Work email</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={160}
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="text-foreground/70">Company website</span>
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
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  <span className="text-foreground/70">Company size</span>
                  <Select name="size" placeholder="Employees" options={COMPANY_SIZES} />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-foreground/70">Monthly ad spend</span>
                  <Select name="spend" placeholder="Choose a range" options={MONTHLY_AD_SPEND} />
                </label>
              </div>

              {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
              <input type="text" name="nickname" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

              {status === "error" ? (
                <p role="alert" className="text-sm text-[oklch(0.75_0.15_25)]">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 h-12 w-full rounded-full bg-foreground text-[15px] font-medium text-background transition-colors hover:bg-accent-warm disabled:cursor-wait disabled:opacity-70"
              >
                {status === "submitting" ? "Joining…" : "Join the waitlist"}
              </button>
              <p className="text-center text-xs text-muted-foreground">No spam. We&apos;ll only email you about your slot.</p>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
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
