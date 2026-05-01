"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Scroll fade-in hook ─── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ─── Animated counter hook ─── */
function useCountUp(target: number, suffix = "", duration = 1500) {
  const [display, setDisplay] = useState("0" + suffix);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            setDisplay(current + suffix);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, duration]);

  return { ref, display };
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  /* Sticky nav scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Fade-in refs for each section */
  const pullQuoteRef = useFadeIn();
  const whyRef = useFadeIn();
  const curriculumRef = useFadeIn();
  const personaRef = useFadeIn();
  const pricingRef = useFadeIn();
  const credibilityRef = useFadeIn();
  const testimonialRef = useFadeIn();
  const faqRef = useFadeIn();

  /* Counter animations */
  const stat87 = useCountUp(87, "%");
  const stat4 = useCountUp(4, "");
  const stat0 = useCountUp(0, "");

  const scrollTo = useCallback((selector: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
    };
  }, []);

  return (
    <>
      {/* ─── STICKY NAV ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between h-16">
          <span className="font-display text-lg font-bold text-[#FAFAF5]">
            AI Fluency Lab
          </span>
          <div className="hidden sm:flex items-center gap-8 text-sm text-[#FAFAF5]/60">
            <a
              href="#curriculum"
              onClick={scrollTo("#curriculum")}
              className="hover:text-[#FAFAF5] transition-colors duration-200"
            >
              Curriculum
            </a>
            <a
              href="#how-it-works"
              onClick={scrollTo("#how-it-works")}
              className="hover:text-[#FAFAF5] transition-colors duration-200"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={scrollTo("#pricing")}
              className="hover:text-[#FAFAF5] transition-colors duration-200"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={scrollTo("#faq")}
              className="hover:text-[#FAFAF5] transition-colors duration-200"
            >
              FAQ
            </a>
          </div>
          <a
            href="#signup"
            onClick={scrollTo("#signup")}
            className="btn-shimmer bg-gradient-to-r from-accent to-[#F97316] text-foreground px-5 py-2 text-sm font-bold uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        className="hero-grain text-background min-h-[90vh] flex items-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1C1C1C 0%, #111111 50%, #0A0A0A 100%)" }}
      >
        {/* Ambient orb */}
        <div
          className="ambient-orb absolute top-1/4 left-[15%] w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(250,204,21,0.08) 0%, rgba(249,115,22,0.03) 50%, transparent 70%)" }}
          aria-hidden="true"
        />
        {/* Radial warmth behind headline */}
        <div
          className="absolute top-1/3 left-[30%] w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(250,204,21,0.06) 0%, transparent 60%)" }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32 pt-32 relative z-10">
          <p className="text-sm font-medium tracking-widest uppercase gradient-text mb-8">
            Early-bird cohort — 30 seats only
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-[5.5rem] font-black leading-[0.95] tracking-[-0.03em] max-w-4xl">
            Your team doesn&rsquo;t have
            <br />
            an AI problem.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 gradient-text">They have a skills&nbsp;gap.</span>
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
                  className="btn-shimmer bg-accent text-foreground px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-accent-dim hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer whitespace-nowrap"
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

        {/* Decorative elements */}
        <div
          className="hidden lg:block absolute right-0 top-1/4 w-64 h-80 border border-accent/10 opacity-40 blur-[0.5px]"
          aria-hidden="true"
        />
      </section>

      {/* ─── EDITORIAL PULL-QUOTE ─── */}
      <section className="bg-background py-16 sm:py-20">
        <div ref={pullQuoteRef} className="fade-in-section mx-auto max-w-4xl px-6">
          <div className="border-l-4 border-accent pl-8 sm:pl-12">
            <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-[-0.02em]">
              40&nbsp;professionals trained.
              <br />
              <span className="gradient-text">87% still use AI daily, 6&nbsp;months&nbsp;later.</span>
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
      <section
        id="how-it-works"
        className="py-20 sm:py-28 relative"
        style={{ background: "linear-gradient(180deg, #F5F5F0 0%, #EDEDEA 100%)" }}
      >
        <div
          className="hidden md:block absolute left-8 top-16 w-48 h-48 border border-foreground/[0.03] opacity-40 blur-[0.5px]"
          aria-hidden="true"
        />
        <div ref={whyRef} className="fade-in-section mx-auto max-w-4xl px-6">
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
              <div className="border-l-4 border-accent pl-6 bg-background/60 py-4 pr-4 shadow-sm">
                <p className="font-display text-4xl font-black">
                  <span ref={stat87.ref}>{stat87.display}</span>
                </p>
                <p className="text-sm text-muted mt-1">of pilot participants still use AI daily after 6 months</p>
              </div>
              <div className="border-l-4 border-foreground/10 pl-6 bg-background/60 py-4 pr-4 shadow-sm">
                <p className="font-display text-4xl font-black">
                  <span ref={stat4.ref}>{stat4.display}</span> hrs
                </p>
                <p className="text-sm text-muted mt-1">average time saved per week by cohort graduates</p>
              </div>
              <div className="border-l-4 border-foreground/10 pl-6 bg-background/60 py-4 pr-4 shadow-sm">
                <p className="font-display text-4xl font-black">
                  <span ref={stat0.ref}>{stat0.display}</span>
                </p>
                <p className="text-sm text-muted mt-1">prior AI experience required</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CURRICULUM (numbered timeline) ─── */}
      <section id="curriculum" className="bg-background py-20 sm:py-28">
        <div ref={curriculumRef} className="fade-in-section mx-auto max-w-3xl px-6">
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
      <section
        className="text-background py-20 sm:py-28"
        style={{ background: "linear-gradient(135deg, #141414 0%, #0D0D0D 100%)" }}
      >
        <div ref={personaRef} className="fade-in-section mx-auto max-w-4xl px-6">
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

      {/* ─── CREDIBILITY ─── */}
      <section
        className="py-20 sm:py-28 relative"
        style={{ background: "linear-gradient(180deg, #F5F5F0 0%, #EDEDEA 100%)" }}
      >
        <div ref={credibilityRef} className="fade-in-section mx-auto max-w-4xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] mb-4">
            Built by practitioners,<br />not academics
          </h2>
          <p className="text-muted text-lg max-w-prose leading-relaxed mb-12">
            This curriculum wasn&apos;t designed in a classroom. It was built from real
            workplace AI rollouts — the kind where people have jobs to do and
            fifteen minutes to learn something new.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-lg">
                &#x1f3ed;
              </div>
              <div>
                <p className="font-bold text-sm">Developed from real rollouts</p>
                <p className="text-sm text-muted mt-1">
                  Content built from actual workplace AI deployments across
                  operations, finance, and marketing teams.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-lg">
                &#x2705;
              </div>
              <div>
                <p className="font-bold text-sm">Fact-checked by SMEs</p>
                <p className="text-sm text-muted mt-1">
                  Every module reviewed by subject matter experts for accuracy
                  and real-world applicability.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-lg">
                &#x1f3a4;
              </div>
              <div>
                <p className="font-bold text-sm">Live cohort, not pre-recorded</p>
                <p className="text-sm text-muted mt-1">
                  Cohort-based with live Q&amp;A every week. You learn with
                  peers, not alone in front of a screen.
                </p>
              </div>
            </div>
          </div>
          {/* Tool badges */}
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted uppercase tracking-widest mr-2">Tools covered:</span>
            {["ChatGPT", "Notion AI", "Copilot", "Claude", "Midjourney"].map((tool) => (
              <span
                key={tool}
                className="text-xs font-medium px-3 py-1.5 border border-foreground/10 bg-background/80 rounded-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="bg-background py-20 sm:py-28">
        <div ref={pricingRef} className="fade-in-section mx-auto max-w-lg px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] text-center mb-4">
            Simple pricing
          </h2>
          <p className="text-muted text-center mb-12">
            One cohort. One price. Everything included.
          </p>

          <div className="border-2 border-foreground p-8 sm:p-10 shadow-[4px_4px_0_0_rgba(10,10,10,0.08)]">
            <p className="text-sm font-bold uppercase tracking-widest gradient-text mb-4">
              Early-bird price
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-6xl font-black tracking-[-0.03em] gradient-text">$397</span>
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
                  <span className="gradient-text font-bold mt-px">+</span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={scrollTo("#signup")}
              className="btn-shimmer mt-10 w-full bg-foreground text-background px-6 py-4 text-sm font-bold uppercase tracking-wider hover:bg-foreground/90 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shadow-sm"
            >
              Reserve your seat
            </button>

            <p className="mt-4 text-xs text-muted text-center">
              Ask your employer — most L&amp;D budgets cover this.
            </p>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS (3-card grid) ─── */}
      <section
        className="py-20 sm:py-28 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #F5F5F0 0%, #EEEEE8 100%)" }}
      >
        <div
          className="hidden md:block absolute -right-12 top-1/3 w-72 h-40 opacity-50 blur-[1px]"
          style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.08), rgba(249,115,22,0.04))" }}
          aria-hidden="true"
        />
        <div ref={testimonialRef} className="fade-in-section mx-auto max-w-4xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] mb-12">
            What participants say
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <TestimonialCard
              name="Maria T."
              role="Operations Manager"
              quote="I went from asking ChatGPT trivia questions to building an automated weekly report that saves me 4 hours every Friday."
            />
            <TestimonialCard
              name="David K."
              role="SMB Founder"
              quote="Now I can explain exactly what I need from AI tools and delegate AI-powered tasks to my team with confidence."
            />
            <TestimonialCard
              name="Priya L."
              role="L&D Specialist"
              quote="We rolled this out to 20 people. Completion rate was 94%. That never happens with our e-learning programs."
            />
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="bg-background py-20 sm:py-28">
        <div ref={faqRef} className="fade-in-section mx-auto max-w-3xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] mb-12">
            Frequently asked questions
          </h2>
          <div className="divide-y divide-foreground/10">
            {faqItems.map((item, i) => (
              <FaqItem
                key={i}
                question={item.q}
                answer={item.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section
        id="signup"
        className="text-background min-h-[60vh] flex items-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #111111 0%, #0A0A0A 100%)" }}
      >
        {/* Ambient orb */}
        <div
          className="ambient-orb absolute bottom-1/4 right-[10%] w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(250,204,21,0.06) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div className="mx-auto max-w-2xl px-6 py-24 sm:py-32 relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] leading-[1.1] mb-4">
            Ready to become <span className="gradient-text">AI&#8209;fluent</span>?
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
                className="btn-shimmer bg-accent text-foreground px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-accent-dim hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer whitespace-nowrap"
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
      <footer
        className="text-background/40 py-10"
        style={{ background: "linear-gradient(180deg, #0A0A0A 0%, #050505 100%)" }}
      >
        <div className="mx-auto max-w-4xl px-6">
          <nav className="flex flex-wrap justify-center gap-8 text-sm text-background/50 mb-6">
            <a
              href="#curriculum"
              className="hover:text-background transition-colors duration-200"
              onClick={scrollTo("#curriculum")}
            >
              Curriculum
            </a>
            <a
              href="#pricing"
              className="hover:text-background transition-colors duration-200"
              onClick={scrollTo("#pricing")}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:text-background transition-colors duration-200"
              onClick={scrollTo("#faq")}
            >
              FAQ
            </a>
            <a
              href="#signup"
              className="hover:text-background transition-colors duration-200"
              onClick={scrollTo("#signup")}
            >
              Sign Up
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-background transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-background transition-colors duration-200"
            >
              Terms of Service
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
        <p className="text-xs font-bold uppercase tracking-widest gradient-text">
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
    <div className="gradient-border-hover border-t border-background/20 pt-6 hover:-translate-y-1 hover:shadow-lg px-4 pb-4 -mx-4 transition-all duration-200 rounded-sm">
      <h3 className="font-display text-lg font-bold text-background leading-[1.1]">{title}</h3>
      <p className="mt-3 text-sm text-background/60 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <div className="gradient-border-hover bg-background p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 rounded-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-foreground/5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold text-sm">{name}</p>
          <p className="text-xs text-muted">{role}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-foreground/80 italic">
        &ldquo;{quote}&rdquo;
      </p>
    </div>
  );
}

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="py-5">
      <button
        onClick={onToggle}
        className="w-full text-left flex items-center justify-between gap-4 cursor-pointer"
      >
        <span className="font-bold text-base">{question}</span>
        <span
          className={`shrink-0 text-muted text-xl transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm text-muted leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

const faqItems = [
  {
    q: "Is this for total beginners or people who have already tried AI?",
    a: "Both. We start from scratch in Week 1 but move fast. If you've dabbled with ChatGPT, you'll still learn new frameworks and workflows you haven't tried.",
  },
  {
    q: "What if I miss a live session?",
    a: "Every session is recorded and shared within 24 hours. You can catch up async and still participate in the community discussion.",
  },
  {
    q: "How is this different from just using ChatGPT?",
    a: "ChatGPT is a tool. This course teaches you when, why, and how to use it — plus five other AI tools — in the context of your actual job. Tools without method is just experimentation.",
  },
  {
    q: "What tools do we actually learn in the course?",
    a: "ChatGPT, Claude, Notion AI, Microsoft Copilot, and Midjourney. We focus on practical application, not exhaustive feature tours.",
  },
  {
    q: "Do I need any technical background?",
    a: "None. If you can use email and a spreadsheet, you have all the technical skills you need. That's the whole point.",
  },
  {
    q: "What is the time commitment per week?",
    a: "About 3 hours: a 90-minute live session plus 60–90 minutes of hands-on exercises you can do at your own pace.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes. If you attend the first two sessions and feel it's not for you, we'll refund your full payment — no questions asked.",
  },
];
