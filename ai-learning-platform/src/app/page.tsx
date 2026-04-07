"use client";

import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Prototype: show success state.
    // Production will POST to an API route or email service.
    setSubmitted(true);
  }

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-100">
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32 text-center">
          <p className="inline-block rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700 mb-6">
            Early-bird cohort — limited to 30 seats
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Stop treating AI like a search&nbsp;bar.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            A 6-week cohort that turns non-technical professionals into
            confident AI users — with live practice, real workflows, and a
            community that keeps you accountable.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Get early-bird access
                </button>
              </form>
            ) : (
              <div className="rounded-lg bg-green-50 border border-green-200 px-6 py-4 text-green-800 font-medium">
                You&apos;re on the list! We&apos;ll email you when the first cohort opens.
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-muted">
            No spam. Unsubscribe anytime. First cohort launches Q2 2026.
          </p>
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            The AI skills gap is real — and it&apos;s costing you
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <StatCard number="78%" label="of companies use AI, yet only 1% say they're AI-mature" />
            <StatCard number="59%" label="of leaders report an AI skills gap — even after investing in training" />
            <StatCard number="$5.5T" label="in economic value lost by 2026 due to AI skills shortages" />
          </div>
          <p className="mt-10 text-center text-muted max-w-2xl mx-auto">
            Your company bought the tools. Your LinkedIn feed is full of AI
            takes. But nobody showed your team how to actually <em>use</em> AI
            in their day-to-day work.
          </p>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / FOUNDER STORY ─── */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Built from real experience
          </h2>
          <blockquote className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
            <svg
              className="absolute top-6 left-6 w-8 h-8 text-brand-100"
              fill="currentColor"
              viewBox="0 0 32 32"
            >
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <p className="text-lg leading-relaxed text-foreground mt-4">
              I sit in meetings where smart, capable people treat AI like a
              fancy search bar. They type a question, read the answer, and walk
              away unimpressed. They&apos;ve never iterated on a prompt, never used
              AI to build something, never had a real conversation with a model.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-foreground">
              So I built them a system — AI-generated lessons, scripts, and
              decks, fact-checked by humans. The result? Colleagues who&apos;d never
              touched AI started using it as a real workflow tool. Not a toy. A
              tool.
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
                JB
              </div>
              <div>
                <p className="font-semibold text-foreground">Jeoffrey Batangan</p>
                <p className="text-sm text-muted">Founder, AI Fluency Lab</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ─── WHAT YOU'LL LEARN ─── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What you&apos;ll learn in 6 weeks
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <WeekCard
              week="1-2"
              title="Foundations"
              items={[
                "What AI actually is (and isn't) — no jargon",
                "Your first real AI conversation",
                "How to iterate on prompts like a pro",
              ]}
            />
            <WeekCard
              week="3-4"
              title="Workflows"
              items={[
                "AI for writing, research, and analysis",
                "Automate the repetitive parts of your job",
                "Build a personal AI toolkit",
              ]}
            />
            <WeekCard
              week="5"
              title="Strategy"
              items={[
                "Evaluate AI tools for your team",
                "When to use AI vs. when not to",
                "Build a business case for AI adoption",
              ]}
            />
            <WeekCard
              week="6"
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

      {/* ─── PRICING ─── */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-lg px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Simple pricing</h2>
          <p className="text-muted mb-10">
            One cohort. One price. Everything included.
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-sm font-medium text-brand-600 mb-2">
              Early-bird price
            </p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold text-foreground">$397</span>
              <span className="text-muted text-sm">/person</span>
            </div>
            <p className="mt-1 text-sm text-muted line-through">$597 after early-bird</p>

            <ul className="mt-8 text-left space-y-3 text-sm">
              {[
                "6 live weekly sessions (90 min each)",
                "Hands-on exercises with real AI tools",
                "Private cohort community",
                "Templates and prompt libraries",
                "Certificate of completion",
                "30-day post-cohort support",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
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
              className="mt-8 w-full rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors cursor-pointer"
            >
              Reserve your seat
            </button>

            <p className="mt-4 text-xs text-muted">
              Ask your employer — most L&D budgets cover this.
            </p>
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ─── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Is this for you?
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <PersonaCard
              emoji="📋"
              title="The Ops Manager"
              description="You've heard 'AI' in every leadership meeting for 18 months. Your team nods along but nobody's actually using it. You need practical skills, not theory."
            />
            <PersonaCard
              emoji="🚀"
              title="The SMB Founder"
              description="Your competitors are getting faster with AI. You know you're falling behind but don't know where to start or who to trust."
            />
            <PersonaCard
              emoji="📊"
              title="The L&D Buyer"
              description="You bought LinkedIn Learning licenses. Nobody used them. You need something with measurable completion rates that people voluntarily show up for."
            />
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section id="signup" className="bg-gradient-to-br from-brand-600 to-brand-700 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to become AI-fluent?
          </h2>
          <p className="text-brand-100 mb-8">
            Join the waitlist for the first cohort. Early-bird members get $200
            off and priority access.
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-2">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="rounded-lg bg-white text-brand-700 px-6 py-3 text-sm font-semibold hover:bg-brand-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Join waitlist
              </button>
            </form>
          ) : (
            <div className="rounded-lg bg-white/10 px-6 py-4 text-white font-medium inline-block">
              You&apos;re on the list! We&apos;ll be in touch soon.
            </div>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center text-sm">
          <p>AI Fluency Lab is a product of Isle88 LLC.</p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Isle88 LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

/* ─── Sub-components ─── */

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="text-4xl font-bold text-brand-600">{number}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}

function WeekCard({
  week,
  title,
  items,
}: {
  week: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-surface p-6">
      <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
        Week {week}
      </p>
      <h3 className="mt-1 text-lg font-bold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-brand-600 mt-0.5">-</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PersonaCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <span className="text-4xl">{emoji}</span>
      <h3 className="mt-3 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}
