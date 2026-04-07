"use client";

import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="hero-grain bg-surface text-background min-h-[90vh] flex items-center relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32 relative z-10">
          <p className="text-sm font-medium tracking-widest uppercase text-accent mb-8">
            Early-bird cohort — 30 seats only
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[0.95] tracking-[-0.03em] max-w-4xl">
            Your team doesn&rsquo;t have
            <br />
            an AI problem.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">They have a skills&nbsp;gap.</span>
              <span
                className="absolute bottom-1 left-0 w-full h-3 sm:h-4 bg-accent/80 -z-0"
                aria-hidden="true"
              />
            </span>
          </h1>
          <p className="mt-10 text-lg sm:text-xl text-background/70 max-w-prose leading-relaxed font-sans">
            A 6-week cohort that turns non-technical professionals into
            confident AI users — with live practice, real workflows, and a
            community that keeps you accountable.
          </p>

          {/* CTA */}
          <div className="mt-12">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-0">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 px-4 py-3.5 text-sm text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
                />
                <button
                  type="submit"
                  className="bg-accent text-foreground px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-accent-dim hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  Get early access
                </button>
              </form>
            ) : (
              <div className="border-l-4 border-accent pl-4 py-2 text-background font-medium">
                You&apos;re on the list. We&apos;ll email you when the first cohort opens.
              </div>
            )}
            <p className="mt-4 text-xs text-background/40">
              No spam. Unsubscribe anytime. First cohort launches Q2&nbsp;2026.
            </p>
            <p className="mt-1 text-xs text-background/25">
              Prototype — email capture is for demonstration only.
            </p>
          </div>
        </div>

        {/* Decorative offset element — polished */}
        <div
          className="hidden lg:block absolute right-0 top-1/4 w-64 h-80 border border-accent/10 opacity-60 blur-[0.5px]"
          aria-hidden="true"
        />
        <div
          className="hidden lg:block absolute right-12 top-[30%] w-48 h-48 bg-accent/5 opacity-40"
          aria-hidden="true"
        />
      </section>

      {/* ─── EDITORIAL PULL-QUOTE ─── */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="border-l-4 border-accent pl-8 sm:pl-12">
            <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-[-0.02em]">
              40&nbsp;professionals trained.
              <br />
              <span className="text-accent-dim">87% still use AI daily, 6&nbsp;months&nbsp;later.</span>
            </p>
            <p className="mt-6 text-muted text-sm uppercase tracking-widest">
              From our pilot cohort
            </p>
          </div>
          <p className="mt-12 text-lg text-muted max-w-prose leading-relaxed">
            Your company bought the tools. Your LinkedIn feed is full of AI
            takes. But nobody showed your team how to actually <em>use</em> AI
            in their day-to-day work. This program changes that.
          </p>
        </div>
      </section>

      {/* ─── WHY THIS WORKS ─── */}
      <section className="bg-surface-light py-20 sm:py-28 relative">
        {/* Overlapping offset element — polished */}
        <div
          className="hidden md:block absolute left-8 top-16 w-48 h-48 border border-foreground/[0.03] opacity-50 blur-[0.5px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] mb-12">
            Why this works when other<br />AI training doesn&apos;t
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-5 text-base leading-relaxed text-foreground/80 max-w-prose">
              <p>
                Most AI training teaches you <em>about</em> AI. Ours teaches you
                to <em>use</em> it. The difference: you leave with workflows you
                actually bring back to your job on Monday.
              </p>
              <p>
                This method was developed and tested with 40 working
                professionals — people who had never opened ChatGPT, let alone
                built anything with it.
              </p>
              <p>
                The result? Within weeks, participants were automating reports,
                drafting decks, and building tools they still use months later.
              </p>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-accent pl-6 bg-background/50 py-4 pr-4 shadow-sm">
                <p className="font-display text-4xl font-black">87%</p>
                <p className="text-sm text-muted mt-1">of pilot participants still use AI daily after 6 months</p>
              </div>
              <div className="border-l-4 border-foreground/10 pl-6 bg-background/50 py-4 pr-4 shadow-sm">
                <p className="font-display text-4xl font-black">4 hrs</p>
                <p className="text-sm text-muted mt-1">average time saved per week by cohort graduates</p>
              </div>
              <div className="border-l-4 border-foreground/10 pl-6 bg-background/50 py-4 pr-4 shadow-sm">
                <p className="font-display text-4xl font-black">0</p>
                <p className="text-sm text-muted mt-1">prior AI experience required</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CURRICULUM (numbered timeline) ─── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] mb-16">
            What you&apos;ll learn
            <br />
            in 6&nbsp;weeks
          </h2>

          <div className="space-y-10">
            <CurriculumItem
              number="01"
              weeks="Week 1–2"
              title="Foundations"
              items={[
                "What AI actually is (and isn't) — no jargon",
                "Your first real AI conversation",
                "How to iterate on prompts like a pro",
              ]}
            />
            <CurriculumItem
              number="02"
              weeks="Week 3–4"
              title="Workflows"
              items={[
                "AI for writing, research, and analysis",
                "Automate the repetitive parts of your job",
                "Build a personal AI toolkit",
              ]}
            />
            <CurriculumItem
              number="03"
              weeks="Week 5"
              title="Strategy"
              items={[
                "Evaluate AI tools for your team",
                "When to use AI vs. when not to",
                "Build a business case for AI adoption",
              ]}
            />
            <CurriculumItem
              number="04"
              weeks="Week 6"
              title="Capstone"
              items={[
                "Apply AI to a real project from your job",
                "Present to the cohort for feedback",
                "Graduate with a portfolio of AI workflows",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section className="bg-surface text-background py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] mb-16">
            Is this for you?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <PersonaCard
              title="The Ops Manager"
              description="You've heard 'AI' in every leadership meeting for 18 months. Your team nods along but nobody's actually using it. You need practical skills, not theory."
            />
            <PersonaCard
              title="The SMB Founder"
              description="Your competitors are getting faster with AI. You know you're falling behind but don't know where to start or who to trust."
            />
            <PersonaCard
              title="The L&D Buyer"
              description="You bought LinkedIn Learning licenses. Nobody used them. You need something with measurable completion rates that people voluntarily show up for."
            />
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-lg px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] text-center mb-4">
            Simple pricing
          </h2>
          <p className="text-muted text-center mb-12">
            One cohort. One price. Everything included.
          </p>

          <div className="border-2 border-foreground p-8 sm:p-10 shadow-[4px_4px_0_0_rgba(10,10,10,0.08)]">
            <p className="text-sm font-bold uppercase tracking-widest text-accent-dim mb-4">
              Early-bird price
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-6xl font-black tracking-[-0.03em]">$397</span>
              <span className="text-muted text-sm">/person</span>
            </div>
            <p className="mt-1 text-sm text-muted line-through">$597 after early-bird</p>

            <ul className="mt-10 space-y-3 text-sm">
              {[
                "6 live weekly sessions (90 min each)",
                "Hands-on exercises with real AI tools",
                "Private cohort community",
                "Templates and prompt libraries",
                "Certificate of completion",
                "30-day post-cohort support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-accent-dim font-bold mt-px">+</span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                document
                  .querySelector("#signup")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-10 w-full bg-foreground text-background px-6 py-4 text-sm font-bold uppercase tracking-wider hover:bg-foreground/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shadow-sm"
            >
              Reserve your seat
            </button>

            <p className="mt-4 text-xs text-muted text-center">
              Ask your employer — most L&amp;D budgets cover this.
            </p>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL (full-bleed blockquote) ─── */}
      <section className="bg-surface-light py-28 sm:py-36 relative overflow-hidden">
        {/* Offset decorative block — polished */}
        <div
          className="hidden md:block absolute -right-12 top-1/3 w-72 h-40 bg-accent/[0.06] opacity-60 blur-[1px]"
          aria-hidden="true"
        />
        <div className="mx-auto max-w-4xl px-6">
          <blockquote className="md:pl-16 relative">
            <span className="font-display text-[8rem] leading-none text-foreground/[0.04] absolute -top-8 -left-4 md:left-0 select-none" aria-hidden="true">
              &ldquo;
            </span>
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl italic leading-tight font-bold relative z-10">
              I went from asking ChatGPT trivia questions to building an
              automated weekly report that saves me 4 hours every Friday.
            </p>
            <footer className="mt-8">
              <p className="font-bold">Early pilot participant</p>
              <p className="text-sm text-muted">Operations Manager, Fortune 500</p>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section id="signup" className="bg-surface text-background min-h-[60vh] flex items-center">
        <div className="mx-auto max-w-2xl px-6 py-24 sm:py-32">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] mb-4">
            Ready to become AI&#8209;fluent?
          </h2>
          <p className="text-background/60 mb-10 max-w-prose leading-relaxed">
            Join the waitlist for the first cohort. Early-bird members get $200
            off and priority access.
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex max-w-md gap-0">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 px-4 py-3.5 text-sm text-background placeholder:text-background/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
              />
              <button
                type="submit"
                className="bg-accent text-foreground px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-accent-dim hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                Join waitlist
              </button>
            </form>
          ) : (
            <div className="border-l-4 border-accent pl-4 py-2 text-background font-medium">
              You&apos;re on the list! We&apos;ll be in touch soon.
            </div>
          )}
          <p className="mt-3 text-xs text-background/25">
            Prototype — email capture is for demonstration only.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-foreground text-background/40 py-10">
        <div className="mx-auto max-w-4xl px-6">
          {/* Footer nav */}
          <nav className="flex justify-center gap-8 text-sm text-background/50 mb-6">
            <a
              href="#curriculum"
              className="hover:text-background transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("section:nth-of-type(4)")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Curriculum
            </a>
            <a
              href="#pricing"
              className="hover:text-background transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("section:nth-of-type(6)")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Pricing
            </a>
            <a
              href="#signup"
              className="hover:text-background transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#signup")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Sign Up
            </a>
          </nav>
          <div className="text-center text-sm">
            <p>&copy; {new Date().getFullYear()} AI Fluency Lab. All rights reserved.</p>
            <p className="mt-2 text-background/25">
              This is a prototype — product details may change before launch.
            </p>
            <p className="mt-2">
              <a
                href="https://github.com/mrjawfree/ideation-demos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/30 hover:text-background/50 transition-colors duration-200 underline underline-offset-2"
              >
                View source
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ─── Sub-components ─── */

function CurriculumItem({
  number,
  weeks,
  title,
  items,
}: {
  number: string;
  weeks: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8 p-5 -mx-5 rounded-sm hover:bg-surface-light/50 transition-colors duration-200">
      <div className="font-display text-5xl sm:text-6xl font-black text-foreground/10 leading-none pt-1">
        {number}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent-dim">
          {weeks}
        </p>
        <h3 className="font-display text-xl sm:text-2xl font-bold mt-1 leading-[1.1]">{title}</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted leading-relaxed">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-foreground/30 mt-0.5">&mdash;</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PersonaCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-t border-background/20 pt-6 hover:bg-background/5 hover:-translate-y-1 hover:shadow-lg px-4 pb-4 -mx-4 transition-all duration-200 rounded-sm">
      <h3 className="font-display text-lg font-bold text-background leading-[1.1]">{title}</h3>
      <p className="mt-3 text-sm text-background/60 leading-relaxed">{description}</p>
    </div>
  );
}
