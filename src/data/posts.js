export const posts = [
  {
    id: 1,
    slug: 'building-reliable-payment-systems',
    title: 'Building Reliable Payment Systems',
    date: '2026-05-20',
    category: 'Architecture',
    tags: ['java', 'payments', 'reliability'],
    description:
      'What I learned after years of building high-throughput transaction pipelines — idempotency, distributed locks, and the failure modes that actually happen in production.',
    content: `## The Problem With Payments

Payment systems fail in interesting ways. Unlike a content API where a dropped request just means a missing blog post, a dropped payment request can mean double charges, ghost transactions, or silent failures that surface three days later in a reconciliation report.

## Idempotency Is Non-Negotiable

Every mutation endpoint must be idempotent. This means accepting a client-generated idempotency key, storing it with a short TTL, and returning the cached response on retry — before executing any business logic.

\`\`\`java
@PostMapping("/charge")
public ResponseEntity<ChargeResponse> charge(
    @RequestHeader("Idempotency-Key") String idempotencyKey,
    @RequestBody ChargeRequest request
) {
    return idempotencyService.executeOnce(idempotencyKey, () ->
        chargeService.process(request)
    );
}
\`\`\`

## Distributed Locks for Concurrent Requests

When the same idempotency key arrives twice before the first request completes, you need a distributed lock — not just a database check. Redis with a short expiry works well here.

## Know Your Failure Modes

- **Network timeout after charge, before response:** Client retries with same key — idempotency saves you.
- **Database write succeeded, downstream notification failed:** Outbox pattern, async retry.
- **Partial refund processed twice:** Ledger-based accounting, not stateful balance fields.

Building payments correctly means designing for the failure cases before writing the happy path.`,
  },
  {
    id: 2,
    slug: 'java-virtual-threads-in-practice',
    title: 'Java Virtual Threads in Practice',
    date: '2026-04-10',
    category: 'Java',
    tags: ['java', 'concurrency', 'performance'],
    description:
      'Project Loom\'s virtual threads landed in Java 21. Here\'s what changed in our Spring Boot services when we turned them on — and what didn\'t.',
    content: `## What Virtual Threads Actually Are

Virtual threads are lightweight threads managed by the JVM, not the OS. The key difference: blocking a virtual thread (waiting on I/O, a lock, a sleep) doesn't block the underlying OS thread. The JVM parks the virtual thread and uses the carrier thread for something else.

For services that spend most of their time waiting on database queries or downstream HTTP calls — which is most backend services — this means you can run far more concurrent requests with the same hardware.

## Enabling in Spring Boot 3.2+

\`\`\`properties
spring.threads.virtual.enabled=true
\`\`\`

That's it. Spring Boot will use virtual threads for its embedded Tomcat executor.

## What Changed

**Before:** Under load, our connection pool would exhaust before CPU did. Requests queued waiting for a thread. P99 latency spiked.

**After:** Thread exhaustion is no longer the bottleneck. Connection pool exhaustion surfaces more clearly now — which means we fixed the actual constraint.

## What Didn't Change

- CPU-bound work gets no benefit. If you're doing heavy computation, virtual threads don't help.
- You still need to be careful with thread-local state — it's carried per virtual thread, which can cause unexpected behavior with frameworks that rely on ThreadLocal.
- Synchronized blocks still pin the virtual thread to its carrier. Use ReentrantLock instead.

## Verdict

Low-risk, high-upside change for I/O-heavy services. We rolled it out to all Spring Boot 3.2+ services with no incidents.`,
  },
  {
    id: 4,
    slug: 'the-unexpected-writing-teacher-how-crafting-ai-prompts-makes-you-a-better-communicator',
    title: 'The Unexpected Writing Teacher: How Crafting AI Prompts Makes You a Better Communicator',
    date: '2026-06-11',
    category: 'AI Engineering',
    tags: ['ai', 'prompting', 'writing'],
    description:
      'The first thing a newcomer discovers when they start prompting an AI is that vagueness is punished immediately and visibly.',
    content: `## You Cannot Hide Behind Vagueness

The first thing a newcomer discovers when they start prompting an AI is that vagueness is punished immediately and visibly. Ask a model to "write something about marketing" and you will receive something technically compliant and almost entirely useless. The machine has no patience for implication, no capacity to read your mood, no instinct to ask a follow-up question in the way a helpful colleague might. It takes you exactly at your word. This immediate, unsparing feedback loop forces a reckoning: *What do I actually want?* That question — deceptively simple, genuinely hard — sits at the heart of all good communication.

In human conversation, ambiguity is routinely papered over by social grace. A manager who gives vague instructions is rescued by a team member willing to guess their intent. A client who can't articulate what they want is carried along by a vendor skilled at reading between the lines. AI strips all of that away. When you learn to write a tight, specific, well-scoped prompt, you are training the same cognitive muscle that produces clear briefs, precise emails, and instructions people can actually follow. The skill is not different. The teacher is just more blunt.

---

## Context Is Not Optional

Experienced prompt writers know that a request without context is a coin flip. The same question — "How should I handle this?" — will produce entirely different outputs depending on what information surrounds it. Skilled prompters learn to front-load relevant background: the audience, the purpose, the constraints, the tone, the format, the prior steps already taken. They learn, in other words, that the burden of context-setting falls on the person initiating the communication, not the one receiving it.

This is a lesson that many people have never explicitly been taught, and it shows. Emails that arrive with no subject line and no explanation of why they matter. Meeting requests with no agenda. Instructions that assume the listener already knows what the speaker knows. The failure in each case is the same: the communicator forgot to model the gap between their own mental state and the recipient's. Prompt writing enforces this modeling with mechanical consistency. Every time you add a line of context to a prompt and watch the quality of the response improve, you are building an intuition that will serve you in every memo, presentation, and difficult conversation you will ever have.

---

## Constraints Are Clarifying, Not Limiting

One of the counterintuitive discoveries that prompt writers make is that adding constraints usually improves results. Telling a model to respond in under 200 words, to use plain language, to avoid jargon, to address a skeptical audience, to structure the answer as three bullet points — each of these restrictions paradoxically produces something more useful, because they force specificity of intent. The constraints don't limit what you get; they eliminate the sprawl of things you didn't want.

The parallel in human communication is direct. Good editors know that a tight word count makes writers cut to the point. Good presenters know that a five-minute slot focuses a mind that a thirty-minute one lets wander. Good teachers know that a narrow question produces more useful answers than an open one. When you develop a habit of defining constraints in your prompts — and watching them work — you begin to apply the same discipline to how you communicate with people. You stop writing three-paragraph emails when one will do. You stop scheduling sixty-minute meetings for conversations that need fifteen. You learn to treat the time and attention of your audience as a resource worth respecting.

---

## Iteration Teaches You That First Drafts Lie

No experienced prompt engineer sends one message and walks away. The practice is inherently iterative: send a prompt, read the response, identify what missed the mark, refine, try again. Over dozens of cycles, a subtle but important insight forms — that your *first articulation of what you want* is rarely accurate. It is the approximation you were able to produce before you fully understood what you were asking for. The real clarity emerges in revision.

This maps closely onto something that experienced writers and speakers have long known: you do not fully understand your own thoughts until you have tried to express them. Writing a first draft reveals the gaps. Saying something aloud in a meeting exposes the parts you hadn't quite worked through. The difference is that with AI, the feedback loop is immediate, judgment-free, and available at two in the morning. People who prompt heavily often report a shift in how they approach communication generally — more willingness to write a rough draft before sending, more comfort treating a first explanation as a starting point rather than a finished product, more patience for the revision that turns a muddy thought into a clear one.

---

## Empathy for Your Audience Becomes a Practical Skill

Perhaps the deepest thing prompt writing teaches is audience modeling — the ability to hold in mind a picture of who is receiving your message and what they need in order to understand it. When you prompt an AI, you are making a constant series of micro-decisions: Will the model interpret this word the way I mean it? Is this question too broad? Am I assuming knowledge it doesn't have? Have I given it enough of a frame to respond the way I want? These are, translated into human terms, the questions of a thoughtful communicator. Will my reader know this term? Is my point landing the way I intend? Am I speaking to where my audience actually is, or where I assume them to be?

The discipline that prompt writing cultivates — of continuously imagining the perspective of your recipient and adjusting your message accordingly — is one of the most underrated communication skills there is. It is what separates the professional who sends emails people actually read from the one whose messages get skimmed or ignored. It is what makes a teacher whose students genuinely understand different from one who mistakes familiarity for clarity. Learning to write better prompts will not, on its own, make anyone a great communicator. But it is one of the rare modern skills that rewards the same habits of mind — precision, context-awareness, iteration, and genuine empathy for whoever is on the other end of your words. In a world where those habits are increasingly rare, that is not a small thing.`,
  },
  {
    id: 3,
    slug: 'ai-assisted-code-review',
    title: 'Using AI for Code Review — What Actually Works',
    date: '2026-03-05',
    category: 'Engineering',
    tags: ['ai', 'tooling', 'workflow'],
    description:
      'Six months of using AI tools in daily code review. The patterns where it saves time, the patterns where it hallucinates confidently, and how I adjusted my workflow.',
    content: `## The Honest Starting Point

I was skeptical. Code review requires context — knowing why a design decision was made three sprints ago, understanding the implicit constraints of a third-party integration, recognising patterns that are wrong for *this codebase* even if technically valid.

AI tools don't have that context. But I was wrong about what they're useful for.

## Where It Works Well

**Spotting mechanical bugs:** Null checks, off-by-one errors, missing break statements, incorrect comparisons. These are pattern-match tasks. AI is fast and reliable here.

**Explaining unfamiliar code:** Paste a block of Bash or a regex and ask what it does. Faster than reading it character by character.

**Draft PR descriptions:** Given a diff, AI writes a reasonable first-pass description. I edit it, but starting from something is faster than starting from blank.

**Test case suggestions:** "What edge cases am I missing for this function?" Often surfaces things I'd have caught in QA.

## Where It Doesn't

**Architecture decisions:** It'll tell you your approach is fine even when it isn't. It doesn't know your team's conventions or the six previous attempts at the same problem.

**Security review:** It catches common patterns (SQL injection, XSS) but misses domain-specific issues. Don't rely on it for security-critical paths.

**"Is this the right abstraction?":** Requires judgment, not pattern matching. Still a human problem.

## The Adjusted Workflow

I now use AI as a first pass — mechanical checks, typos, obvious issues — and treat its output as a starting point, not a conclusion. The architectural review still happens in the PR comment thread with the team.`,
  },
]
