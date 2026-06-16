export const posts = [
  {
    id: 16,
    slug: 'build-your-own-ai-personal-assistant-with-claude',
    title: 'Build Your Own AI Personal Assistant with Claude',
    date: '2026-06-16',
    category: 'AI Engineering',
    tags: ['ai', 'python', 'claude', 'tutorial'],
    description:
      'A step-by-step guide to building a personal AI assistant using Python and the Anthropic Claude API — with multi-turn memory, streaming, tools, and persistent history across sessions.',
    content: `## What We're Building

By the end of this tutorial, you'll have a working AI personal assistant that can:

- Hold multi-turn conversations (it **remembers** what you said earlier)
- Use **tools** like checking the weather, setting reminders, and searching the web
- Stream responses in real time so it feels snappy and alive
- Maintain a **persistent memory** of your preferences across sessions

\`\`\`
┌─────────────────────────────────────────────────┐
│                                                 │
│   You ──► Personal Assistant ──► Claude API     │
│            │                          │         │
│            ├── Memory Store           │         │
│            ├── Tool Runner            │         │
│            └── Streaming Output ◄─────┘         │
│                                                 │
└─────────────────────────────────────────────────┘
\`\`\`

---

## Prerequisites

- Python 3.10+
- An [Anthropic API key](https://console.anthropic.com) (free to sign up)
- Basic Python knowledge

---

## Step 1 — Installation

\`\`\`bash
pip install anthropic python-dotenv
\`\`\`

Create a \`.env\` file in your project folder:

\`\`\`
ANTHROPIC_API_KEY=your-api-key-here
\`\`\`

---

## Step 2 — Your First Conversation

Let's start simple — a single turn with Claude:

\`\`\`python
import anthropic
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hi! What can you help me with today?"}
    ]
)

print(response.content[0].text)
\`\`\`

Run it — Claude will introduce itself. But this is just a one-shot exchange. A real assistant needs to **remember** the conversation.

---

## Step 3 — Add Memory (Multi-Turn Conversations)

The Claude API is stateless — you must send the full conversation history every time. Here's how to manage that cleanly:

\`\`\`python
import anthropic
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic()

SYSTEM_PROMPT = """You are a helpful personal assistant named Aria.
You are concise, friendly, and proactive. You remember details the user
shares and refer back to them naturally in conversation."""

class Assistant:
    def __init__(self):
        self.history = []

    def chat(self, user_message: str) -> str:
        self.history.append({
            "role": "user",
            "content": user_message
        })

        response = client.messages.create(
            model="claude-opus-4-8",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=self.history
        )

        assistant_reply = response.content[0].text

        self.history.append({
            "role": "assistant",
            "content": assistant_reply
        })

        return assistant_reply


# Try it out
assistant = Assistant()

print("Aria:", assistant.chat("My name is Alex and I love hiking."))
print("Aria:", assistant.chat("What do you know about me?"))
# Aria remembers your name and hobby!
\`\`\`

---

## Step 4 — Add Streaming (Real-Time Output)

Waiting for a full response before printing anything feels slow. Streaming fixes that — text appears word by word, just like ChatGPT:

\`\`\`python
def chat_streaming(self, user_message: str) -> str:
    self.history.append({
        "role": "user",
        "content": user_message
    })

    full_reply = ""

    with client.messages.stream(
        model="claude-opus-4-8",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=self.history
    ) as stream:
        print("Aria: ", end="", flush=True)
        for text in stream.text_stream:
            print(text, end="", flush=True)
            full_reply += text
        print()  # newline after response

    self.history.append({
        "role": "assistant",
        "content": full_reply
    })

    return full_reply
\`\`\`

---

## Step 5 — Give Your Assistant Tools

This is where it gets exciting. Tools let Claude take real actions — check weather, set reminders, do math, or call any API you define.

\`\`\`
User: "What's the weather in Tokyo?"
      │
      ▼
  Claude decides to use the get_weather tool
      │
      ▼
  Your code runs get_weather("Tokyo")
      │
      ▼
  Result returned to Claude
      │
      ▼
  Claude gives a natural language answer
\`\`\`

Here's how to implement this with the tool runner:

\`\`\`python
import anthropic
from anthropic import beta_tool
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
client = anthropic.Anthropic()

@beta_tool
def get_weather(city: str) -> str:
    """Get the current weather for a city.

    Args:
        city: The city name to get weather for.
    """
    mock_weather = {
        "Tokyo": "22°C, partly cloudy",
        "New York": "18°C, sunny",
        "London": "15°C, rainy",
    }
    return mock_weather.get(city, f"Weather data unavailable for {city}")


@beta_tool
def set_reminder(task: str, time: str) -> str:
    """Set a reminder for a task at a specific time.

    Args:
        task: What to be reminded about.
        time: When to set the reminder (e.g. '3pm', 'tomorrow morning').
    """
    return f"✅ Reminder set: '{task}' at {time}"


@beta_tool
def get_current_time() -> str:
    """Get the current date and time."""
    return datetime.now().strftime("%A, %B %d, %Y at %I:%M %p")


class AssistantWithTools:
    def __init__(self):
        self.history = []
        self.tools = [get_weather, set_reminder, get_current_time]

    def chat(self, user_message: str) -> str:
        self.history.append({
            "role": "user",
            "content": user_message
        })

        runner = client.beta.messages.tool_runner(
            model="claude-opus-4-8",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            tools=self.tools,
            messages=self.history
        )

        final_reply = ""
        for message in runner:
            for block in message.content:
                if block.type == "text":
                    final_reply = block.text

        self.history.append({
            "role": "assistant",
            "content": final_reply
        })

        return final_reply
\`\`\`

---

## Step 6 — Persistent Memory Across Sessions

A real personal assistant should remember you even after you restart the app. Save conversation history to a JSON file:

\`\`\`python
import json
import os

class PersistentAssistant(AssistantWithTools):
    def __init__(self, memory_file="assistant_memory.json"):
        super().__init__()
        self.memory_file = memory_file
        self.load_memory()

    def load_memory(self):
        if os.path.exists(self.memory_file):
            with open(self.memory_file, "r") as f:
                data = json.load(f)
                self.history = data.get("history", [])[-40:]
            print(f"📂 Loaded {len(self.history)//2} previous exchanges.")

    def save_memory(self):
        with open(self.memory_file, "w") as f:
            json.dump({"history": self.history}, f, indent=2)

    def chat(self, user_message: str) -> str:
        reply = super().chat(user_message)
        self.save_memory()
        return reply
\`\`\`

---

## Step 7 — Put It All Together

Here's the complete interactive loop:

\`\`\`python
def main():
    print("╔══════════════════════════════════╗")
    print("║   🤖  Aria — Your AI Assistant   ║")
    print("║   Type 'quit' to exit            ║")
    print("╚══════════════════════════════════╝\\n")

    assistant = PersistentAssistant()

    while True:
        try:
            user_input = input("You: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\\nAria: Goodbye! Talk soon. 👋")
            break

        if not user_input:
            continue

        if user_input.lower() in ("quit", "exit", "bye"):
            print("Aria: Goodbye! Have a great day! 👋")
            break

        response = assistant.chat(user_input)
        print(f"Aria: {response}\\n")


if __name__ == "__main__":
    main()
\`\`\`

---

## Running the Assistant

\`\`\`bash
python assistant.py
\`\`\`

**Example conversation:**

\`\`\`
You: My name is Alex. I'm in Tokyo for a week.
Aria: Nice to meet you, Alex! Tokyo is amazing — what brings you there?

You: What's the weather like here?
Aria: In Tokyo right now it's 22°C and partly cloudy —
      great weather for exploring the city!

You: Remind me to visit Shibuya at 6pm
Aria: ✅ Done! I've set a reminder: 'Visit Shibuya' at 6pm.
      Enjoy the famous crossing!

You: What do you know about me?
Aria: You're Alex, currently in Tokyo for a week.
      You've got a Shibuya reminder set for 6pm today!
\`\`\`

---

## Project Structure

\`\`\`
my-assistant/
├── .env                    ← Your API key (never commit this!)
├── .gitignore
├── assistant.py            ← Main app
├── assistant_memory.json   ← Auto-created on first run
└── requirements.txt
\`\`\`

**requirements.txt:**

\`\`\`
anthropic>=0.92.0
python-dotenv>=1.0.0
\`\`\`

---

## What to Build Next

| Feature | How |
|---|---|
| Voice input/output | Add \`speechrecognition\` + \`pyttsx3\` |
| Web search | Call the Google or Brave Search API inside a tool |
| Email drafting | Add a \`draft_email\` tool using Gmail API |
| Calendar integration | Connect to Google Calendar via their Python SDK |
| Custom personality | Expand the \`SYSTEM_PROMPT\` with your preferences |

---

## Key Concepts Recap

\`\`\`
┌─────────────────────────────────────────────────────┐
│  CONCEPT          │  WHAT IT DOES                   │
├───────────────────┼─────────────────────────────────┤
│  System Prompt    │  Gives your assistant a name    │
│                   │  and personality                │
├───────────────────┼─────────────────────────────────┤
│  Message History  │  Enables multi-turn memory      │
├───────────────────┼─────────────────────────────────┤
│  Streaming        │  Real-time word-by-word output  │
├───────────────────┼─────────────────────────────────┤
│  Tool Runner      │  Lets Claude take real actions  │
├───────────────────┼─────────────────────────────────┤
│  JSON Storage     │  Memory persists across restarts│
└───────────────────┴─────────────────────────────────┘
\`\`\`

The Claude API handles the hard AI reasoning — your job is to wire together the memory, tools, and interface around it. That's the whole pattern behind every AI assistant you've ever used.

---

*Happy building! The full source code for this tutorial is self-contained in the snippets above — copy each section in order and you'll have a working assistant in under 30 minutes.*`,
  },
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
    id: 4,
    slug: 'the-unexpected-writing-teacher-how-crafting-ai-prompts-makes-you-a-better-communicator',
    title: 'The Unexpected Writing Teacher: How Crafting AI Prompts Makes You a Better Communicator',
    date: '2026-06-11',
    category: 'AI Engineering',
    tags: ['ai', 'prompting', 'writing'],
    description:
      'The first thing a newcomer discovers when they start prompting an AI is that vagueness is punished immediately and visibly.',
    content: `## You Can't Hide Behind Vagueness

When you first start using AI, one thing becomes clear pretty quickly. Being vague doesn't work. Ask a model to "write something about marketing" and you'll get a response that technically answers the question but isn't useful at all. AI doesn't pick up on hints. It doesn't read the room. It just takes your words at face value.

That's actually useful feedback. It forces you to stop and think about what you actually want. That question, as simple as it sounds, is hard to answer well. It's also the same question behind every clear email, every useful brief, and every instruction that people can actually follow.

In normal conversations, we get away with being vague all the time. A teammate guesses what their manager meant. A vendor figures out what a client wants from context clues. AI removes that buffer entirely. When you learn to write a clear, specific prompt, you're building the same skill that makes you a better communicator in general. The lesson is the same. The AI is just more honest about when you've failed to learn it.

---

## Context Matters More Than You Think

People who are new to prompting often send a request with no background and then wonder why the response misses the mark. Experienced prompt writers do the opposite. They front-load everything. Who is the audience? What's the goal? What format do you want? What have you already tried?

That habit is a communication skill, not just a prompting trick. Think about how many emails arrive with no context, meetings get scheduled with no agenda, or tasks get handed off with assumptions baked in. In all these cases, the sender forgot to think about what the other person actually needs to understand the request.

Prompt writing drills this into you through repetition. Every time you add a line of context and get a better response, you build the habit of thinking from the reader's perspective. That habit carries over into how you write and speak in general.

---

## Constraints Help, Not Hurt

Here's something that surprised me when I started writing prompts. Adding restrictions usually makes the output better. Ask for a response under 200 words, in plain language, for a skeptical reader, structured as three bullet points, and you get something more useful than if you left it open-ended.

This isn't unique to AI. A tight word count pushes writers to get to the point. A short time slot makes presentations more focused. A specific question gets a better answer than a broad one.

When you get used to applying constraints in prompts, you start doing the same thing in other areas. You stop writing long emails when a short one would do. You stop booking hour-long meetings for things that need fifteen minutes. You start treating other people's time like something worth respecting.

---

## First Drafts Are Never Quite Right

No experienced prompt writer sends one message and calls it done. The process is iterative. Write a prompt, look at what comes back, figure out what's off, adjust, try again. After enough of those cycles, something becomes clear. Your first attempt at describing what you want is almost never accurate. It's just the best you could do before you fully understood the problem.

Writers and speakers already know this. You don't really understand what you think until you try to say it. A rough draft shows you the gaps. Saying something in a meeting exposes the parts you hadn't fully worked through.

With AI, the feedback loop is immediate and doesn't come with social judgment. People who prompt a lot tend to get more comfortable with iteration in general. They write drafts before sending messages. They treat first explanations as starting points, not finished products. They become more patient about getting to clarity through revision.

---

## You Learn to Think About Your Reader

Maybe the biggest thing prompting teaches is audience awareness. Every time you write a prompt, you're constantly making small decisions. Will the model understand this the way I mean it? Is my question too vague? Am I assuming something it can't know?

Those are exactly the questions a good communicator asks, just aimed at a person instead of a model. Will my reader get this? Am I being clear or just assuming they'll fill in the gaps? Am I meeting them where they are?

Prompting builds this kind of thinking through constant practice. You're always adjusting your words based on what the receiver can and can't know. That habit, applied to human communication, makes a real difference. It's what separates emails people actually read from ones that get ignored.

Writing better prompts won't make you a great communicator on its own. But it trains the same habits that matter. Being specific, giving context, iterating, and thinking about the person on the other end.`,
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
  {
    id: 5,
    slug: 'jira-as-todo-list-productivity',
    title: "How I've Been Using Jira as To-Do List to Improve My Productivity",
    date: '2021-06-06',
    category: 'Productivity',
    tags: ['productivity', 'jira', 'tools'],
    mediumUrl: 'https://alexanderang24.medium.com/how-ive-been-using-jira-as-to-do-list-to-improve-my-productivity-a962c3816c8e',
    description: 'Why you should use Jira instead of plain old to-do lists.',
    content: `*Summarized from [this article on Medium](https://alexanderang24.medium.com/how-ive-been-using-jira-as-to-do-list-to-improve-my-productivity-a962c3816c8e).*

---

## Introduction

I rely heavily on to-do lists to manage forgetfulness. Think of your brain's memory like a computer's RAM — writing tasks down frees up mental capacity for the actual work. My to-do list journey started in high school with pen and paper, evolved to smartphone apps during university, and eventually made its way to something more sophisticated.

## Migrating from Plain To-Do Lists

Rather than using basic phone applications, I adopted Jira — a professional project tracking tool — for personal productivity. While simpler solutions exist, Jira offers capabilities beyond basic task management: task descriptions, labels, effort scoring, and sprint planning with review reports.

## Implementation

**Setup:**
Create an Atlassian account and set up a Kanban-based, team-managed project. Tasks are called "issues" in Jira terminology.

**Task Organization:**
- Issues live in the backlog until assigned to a sprint
- Sprints are organized weekly (four per month)
- Only "story" and "epic" issue types are used
- Epics act as categorical containers
- Story points use the Fibonacci sequence (1, 2, 3, 5, 8, 13, 20) to estimate effort

**Active Sprint Management:**
The Kanban board has three columns: "To Do," "In Progress," and "Done." Tasks flow through these stages as work progresses.

**My Epic Categories:**
1. Knowledge (reading, learning)
2. Routine (recurring weekly/monthly tasks)
3. Chores (household activities)
4. Weekend (activities requiring time off)
5. Career (professional development)

**Progress Tracking:**
Reports provide productivity insights:
- Sprint reports show burndown charts and issue completion status
- Velocity charts compare productivity across sprints using story point completion

## Conclusion

After four months of use, I noticed significant productivity improvements. While Jira's full capabilities far exceed what a personal to-do list needs, the organizational structure and progress-tracking features make it worthwhile. Find the tool that matches your own needs — this one works for me.`,
  },
  {
    id: 14,
    slug: 'spring-data-redis-usage-across-microservices',
    title: 'Spring Data Redis Usage Across Microservices',
    date: '2021-03-18',
    category: 'Spring Boot',
    tags: ['java', 'spring-boot', 'redis', 'microservices', 'caching'],
    mediumUrl: 'https://alexanderang24.medium.com/spring-data-redis-usage-across-microservices-e2e0b292686e',
    description: 'Demonstrate how to use Redis caching across microservices to reduce unnecessary inter-service communication.',
    content: `*Summarized from [this article on Medium](https://alexanderang24.medium.com/spring-data-redis-usage-across-microservices-e2e0b292686e).*

---

## Overview

This article demonstrates implementing Redis caching in a microservices architecture using Spring Data Redis. The goal: use caching to reduce unnecessary inter-service communication for repeated identical requests.

## Architecture

Two services:
- **learn-redis-api** (front): External API handling incoming requests
- **learn-redis-core** (core): Internal service managing database operations

## Dependencies

**Front service:**

\`\`\`xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
</dependency>
\`\`\`

**Core service:**

\`\`\`xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
  <groupId>com.h2database</groupId>
  <artifactId>h2</artifactId>
</dependency>
<dependency>
  <groupId>org.flywaydb</groupId>
  <artifactId>flyway-core</artifactId>
</dependency>
\`\`\`

## System Flow

**Inquiry Process:**
1. Front receives inquiry request
2. Core validates if inquiry code exists in the database
3. Creates new or updates existing transaction

**Payment Process:**
1. Front receives payment request
2. Core validates existing payment records
3. Completes transaction or returns failure response

## Caching Implementation

The solution uses \`@Cacheable\` on service methods, storing request parameters as cache keys. When an identical request arrives, the cached response is returned immediately — without executing the method or contacting the core service.

\`\`\`java
@Cacheable(value = "paymentCache", key = "#request.referenceId")
public PaymentResponse processPayment(PaymentRequest request) {
    return coreService.processPayment(request);
}
\`\`\`

## Configuration

\`\`\`properties
spring.redis.host=localhost
spring.redis.port=6379
spring.cache.redis.time-to-live=5000
\`\`\`

Redis runs on localhost:6379 via Docker. TTL is set to 5 seconds for testing purposes.

## Key Benefit

Using cache, when the same payment request is sent again within the TTL window, the front service returns a cached response immediately — without forwarding the request to the core service. This significantly reduces latency for repeated identical requests in high-volume scenarios.`,
  },
  {
    id: 6,
    slug: 'redis-learning-from-the-bottom',
    title: 'Redis: Learning from the Bottom',
    date: '2021-03-18',
    category: 'Infrastructure',
    tags: ['redis', 'database', 'caching'],
    mediumUrl: 'https://alexanderang24.medium.com/redis-218699aea278',
    description: 'Learning Redis from the ground up — what it is, how it works, and why companies like Twitter, GitHub, and Pinterest rely on it.',
    content: `*Summarized from [this article on Medium](https://alexanderang24.medium.com/redis-218699aea278).*

---

## What Does Redis Actually Mean?

It stands for **REmote DIctionary Server**.

## Introduction

Redis is "an open source (BSD licensed), in-memory data structure store, used as a database, cache, and message broker." It provides numerous data structures including strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes, and streams.

Key capabilities:
- Atomic operations on data types
- Built-in replication and Lua scripting
- LRU eviction and transaction support
- On-disk persistence options
- High availability via Redis Sentinel
- Automatic partitioning with Redis Cluster

Redis keeps its entire dataset in memory for optimal performance, which is what allows microsecond access times. Users can persist data through periodic disk dumps or append-only command logging.

## How Does Redis Work?

All Redis data stays in memory, eliminating disk seek delays. This architecture supports versatile data structures, high availability, geospatial capabilities, Lua scripting, transactions, on-disk persistence, and cluster functionality — making it ideal for real-time applications.

## Who's Using Redis?

Twitter, GitHub, Weibo, Pinterest, Snapchat, Craigslist, Digg, StackOverflow, and Flickr all use Redis in production.

## Popular Redis Use Cases

- Caching
- Chat, messaging, and queues
- Gaming leaderboards
- Session storage
- Rich media streaming
- Geospatial applications
- Machine learning
- Real-time analytics

## Why Is Redis Different?

Two things set Redis apart from other databases:

1. Values can contain **more complex data types** with atomic operations defined on those types — these structures are exposed directly to the programmer.
2. Being an **in-memory yet disk-persistent** database, Redis achieves very high write and read speed, trading off against data set size being limited by available memory.`,
  },
  {
    id: 7,
    slug: 'spring-aop-logging-processing-time',
    title: 'Menambah Log untuk Processing Time di Spring Boot Menggunakan Anotasi Spring AOP',
    date: '2020-07-09',
    category: 'Spring Boot',
    tags: ['java', 'spring-boot', 'aop', 'logging'],
    mediumUrl: 'https://medium.com/doku-insight/menambah-log-untuk-processing-time-di-spring-boot-menggunakan-anotasi-spring-aop-23af5fa5f35e',
    description: 'Cara menambahkan log processing time di Spring Boot menggunakan custom annotation dengan Spring AOP.',
    content: `*Summarized from [this article on Medium](https://medium.com/doku-insight/menambah-log-untuk-processing-time-di-spring-boot-menggunakan-anotasi-spring-aop-23af5fa5f35e).*

---

## Overview

**AOP (Aspect Oriented Programming)** memungkinkan developer menambahkan fungsionalitas baru ke kode tanpa mengubah logika yang sudah ada. Artikel ini mendemonstrasikan annotation-driven AOP untuk membuat custom annotation yang mencatat waktu eksekusi method.

## Dependencies

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
\`\`\`

## Step 1: Buat Custom Annotation Interface

\`\`\`java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface LogExecutionTime {
}
\`\`\`

- **@Target**: Menentukan di mana annotation dapat digunakan (method level)
- **@Retention**: Memastikan ketersediaan pada saat JVM runtime

## Step 2: Buat Aspect Class

\`\`\`java
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Around("@annotation(LogExecutionTime)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint)
            throws Throwable {
        long start = System.currentTimeMillis();
        Object proceed = joinPoint.proceed();
        long executionTime = System.currentTimeMillis() - start;

        log.info("Request processing time: " + executionTime + "ms");
        return proceed;
    }
}
\`\`\`

- **@Aspect**: Menandai class sebagai aspect
- **@Component**: Mendaftarkannya sebagai Spring bean
- **@Slf4j**: Mengaktifkan logging
- **@Around**: Advice yang dieksekusi sebelum dan sesudah method
- **ProceedingJoinPoint**: Mengeksekusi method yang dianotasi

## Step 3: Terapkan Annotation ke Method

\`\`\`java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping(value = "/ping")
    @LogExecutionTime
    public void test() throws InterruptedException {
        Thread.sleep(2000);
    }
}
\`\`\`

Saat endpoint dipanggil, log processing time akan otomatis muncul.

## Source Code

Full project tersedia di: https://github.com/alexanderang24/learn-logging-aop`,
  },
  {
    id: 8,
    slug: 'openshift-client-instalasi-dan-operasi-dasar',
    title: 'OpenShift Client: Instalasi dan Operasi Dasar',
    date: '2020-06-23',
    category: 'Infrastructure',
    tags: ['openshift', 'kubernetes', 'devops'],
    mediumUrl: 'https://alexanderang24.medium.com/openshift-client-instalasi-dan-operasi-dasar-525d3408c13',
    description: 'Instalasi dan operasi dasar OpenShift Client (OC) untuk mengelola aplikasi pada platform OpenShift atau Kubernetes.',
    content: `*Summarized from [this article on Medium](https://alexanderang24.medium.com/openshift-client-instalasi-dan-operasi-dasar-525d3408c13).*

---

## Pengenalan

OKD adalah platform untuk mengembangkan dan menjalankan aplikasi yang dikontainerisasi. Dibangun dengan fondasi Kubernetes, OKD memungkinkan aplikasi berkembang dari beberapa mesin menjadi ribuan mesin yang melayani jutaan klien.

OpenShift Client membantu pengembang melakukan development, build, deploy, dan menjalankan aplikasi pada platform OpenShift atau Kubernetes melalui command line interface (CLI).

**Kegunaan CLI:**
- Mengerjakan source code project
- Membuat script untuk operasi OKD
- Situasi dengan keterbatasan bandwidth tanpa akses web console

## Installation

1. Download oc client tools dari: https://www.okd.io/download.html#oc-platforms
2. Klik "Latest Release" di bawah "Download the latest OKD4 Release"
3. Pilih file sesuai sistem operasi

**Menentukan PATH:**

\`\`\`bash
# macOS
echo $PATH

# Windows
path
\`\`\`

Pindahkan binary \`oc\` ke lokasi PATH. Untuk Windows, buat folder baru dan tambahkan ke Environment Variables.

**Instalasi via Homebrew (macOS):**

\`\`\`bash
brew install openshift-cli
\`\`\`

**Verifikasi instalasi:**

\`\`\`bash
oc version
\`\`\`

## Operation

Login ke server OKD dengan perintah dari web interface:

\`\`\`bash
oc login https://xxxxx:8080 --token=[TOKEN]
\`\`\`

**Perintah Dasar:**

\`\`\`bash
# Melihat semua project
oc projects

# Project yang sedang aktif
oc project

# Beralih ke project lain
oc project <project_name>

# Status overview project
oc status

# Menampilkan object type tertentu
oc get <object_type>

# Logout
oc logout

# Bantuan
oc help
oc <command> --help
\`\`\`

## Referensi

- https://docs.okd.io/1.5/cli_reference/get_started_cli.html
- https://docs.okd.io/1.5/cli_reference/basic_cli_operations.html
- https://docs.okd.io/latest/architecture/architecture.html`,
  },
  {
    id: 9,
    slug: 'kubernetes-helm-cara-menginstal-dan-operasi-dasar',
    title: 'Kubernetes & Helm: Cara Menginstal dan Operasi Dasar',
    date: '2020-06-23',
    category: 'Infrastructure',
    tags: ['kubernetes', 'helm', 'devops'],
    mediumUrl: 'https://medium.com/doku-insight/kubernetes-helm-cara-menginstal-dan-operasi-dasar-d926f46185f1',
    description: 'Instalasi dan operasi dasar Kubernetes dan Helm untuk mengelola aplikasi yang dikontainerisasi.',
    content: `*Summarized from [this article on Medium](https://medium.com/doku-insight/kubernetes-helm-cara-menginstal-dan-operasi-dasar-d926f46185f1).*

---

## Kubernetes

### Definition

Kubernetes (K8s) adalah "an open-source container orchestration engine" yang mengotomatisasi deployment, scaling, dan manajemen aplikasi yang dikontainerisasi. Dibangun dari 15 tahun pengalaman produksi Google, Kubernetes mengelompokkan container ke dalam unit logis untuk kemudahan manajemen.

### Features

- **Planet scale**: Memungkinkan scaling tanpa memperluas tim operasional
- **Never outgrow**: Fleksibel dari testing lokal hingga operasi enterprise global
- **Run anywhere**: Mendukung on-premise, hybrid, dan public cloud

Dokumentasi: https://kubernetes.io/docs/home/

## Helm

### Definition

Helm adalah "a package and operations manager for Kubernetes." Menggunakan Charts sebagai mekanisme packaging, Helm mengemas Kubernetes releases ke dalam file terkompresi (.tgz). Sebuah helm chart berisi Kubernetes objects seperti Deployments dan Services.

Official charts: https://github.com/helm/charts

### Installation

**Install kubectl:**

\`\`\`bash
# macOS
curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.18.0/bin/darwin/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

# Verifikasi
kubectl version --client
\`\`\`

Via Homebrew:

\`\`\`bash
brew install kubectl
\`\`\`

**Install Helm:**

Download binary dari https://github.com/helm/helm/releases, lalu:

\`\`\`bash
# macOS
mv darwin-amd64/helm /usr/local/bin/helm

# Verifikasi
helm help
\`\`\`

Via Homebrew:

\`\`\`bash
brew install helm
\`\`\`

### Initialize Helm Chart Repository

\`\`\`bash
# Tambah official chart repository
helm repo add stable https://kubernetes-charts.storage.googleapis.com/

# Lihat chart yang tersedia
helm search repo stable

# Buat custom chart
helm create chartname
\`\`\`

**Contoh values.yaml:**

\`\`\`yaml
image:
  repository: jenkins/jenkins
  tag: lts
  pullPolicy: IfNotPresent
\`\`\`

**Contoh penggunaan di deployment.yaml:**

\`\`\`yaml
containers:
  - name: {{ .Chart.Name }}
    image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
    imagePullPolicy: {{ .Values.image.pullPolicy }}
\`\`\`

### Deploy With Helm

\`\`\`bash
# Package chart
helm package chartname

# Deploy
helm install chartname
\`\`\`

## References

- https://kubernetes.io/docs/home/
- https://helm.sh/docs/intro/quickstart/
- https://helm.sh/docs/topics/charts/`,
  },
  {
    id: 10,
    slug: 'redis-implementation-spring-boot',
    title: 'Redis Implementation for Database Operations in Spring Boot',
    date: '2019-12-06',
    category: 'Spring Boot',
    tags: ['java', 'spring-boot', 'redis', 'caching'],
    mediumUrl: 'https://alexanderang24.medium.com/redis-implementation-for-database-operations-in-spring-boot-2e5bc6f7f5af',
    description: 'How to integrate Redis caching with Spring Boot applications for improved database performance.',
    content: `*Summarized from [this article on Medium](https://alexanderang24.medium.com/redis-implementation-for-database-operations-in-spring-boot-2e5bc6f7f5af).*

---

## Overview

This article demonstrates how to integrate Redis caching with Spring Boot applications to reduce database load and improve response times.

## Dependencies

Add the following to your \`pom.xml\`:

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
\`\`\`

## Configuration

Configure Redis in \`application.properties\`:

\`\`\`properties
spring.redis.host=localhost
spring.redis.port=6379
spring.cache.type=redis
spring.cache.redis.time-to-live=60000
spring.cache.redis.cache-null-values=false
spring.cache.redis.use-key-prefix=true
spring.cache.redis.key-prefix=My Cache:
\`\`\`

## Key Implementation Details

- **Serialization**: DTOs must implement \`Serializable\` since Redis stores objects as byte arrays
- **Cache Annotations**: Use \`@Cacheable\`, \`@CachePut\`, and \`@CacheEvict\` in the service layer
- **TTL**: Set time-to-live in milliseconds via \`spring.cache.redis.time-to-live\`

## Redis CLI Commands

\`\`\`bash
redis-cli        # connect to Redis server
keys *           # view all cached entries
get [cache_name] # retrieve specific cache value
\`\`\`

## GUI Tools

- RedisClient (free, lightweight)
- Redily
- rdbtools

## Key Advantage

Redis enables cross-application cache sharing — since caches are stored on the Redis server rather than in application memory, cached data survives application restarts and is accessible across multiple service instances.

Source code: https://github.com/alexanderang24/learn-cache-redis`,
  },
  {
    id: 11,
    slug: 'ehcache-implementation-spring-boot',
    title: 'Ehcache Implementation for Database Operations in Spring Boot',
    date: '2019-12-05',
    category: 'Spring Boot',
    tags: ['java', 'spring-boot', 'ehcache', 'caching'],
    mediumUrl: 'https://alexanderang24.medium.com/ehcache-implementation-for-database-operations-in-spring-boot-b4d709038115',
    description: 'How to integrate Ehcache with Spring Boot for caching database operations using TTL and TTI expiration strategies.',
    content: `*Summarized from [this article on Medium](https://alexanderang24.medium.com/ehcache-implementation-for-database-operations-in-spring-boot-b4d709038115).*

---

## Overview

This article demonstrates how to integrate Ehcache 3.6.2 with Spring Boot for caching database operations, using JSR-107 cache API compliance.

## Dependencies

\`\`\`xml
<dependency>
    <groupId>javax.cache</groupId>
    <artifactId>cache-api</artifactId>
    <version>1.1.0</version>
</dependency>
<dependency>
    <groupId>org.ehcache</groupId>
    <artifactId>ehcache</artifactId>
    <version>3.6.2</version>
</dependency>
\`\`\`

## Configuration (ehcache.xml)

Place in the \`resources\` folder. Two cache instances are defined:

**findAllCache** — uses TTL (time-to-live) expiration of 5 seconds:
- Stores up to 2 heap entries and 10MB off-heap storage
- Fires event listeners on creation and expiration

**findByIdCache** — uses TTI (time-to-idle) expiration of 5 seconds:
- Extends lifetime if accessed within the window
- Supports 2 heap entries and 50MB off-heap storage
- Listeners for multiple event types

Both caches include asynchronous event logging.

Reference the config in \`application.properties\`:

\`\`\`properties
spring.cache.jcache.config=classpath:ehcache.xml
\`\`\`

## Key Requirements

DTOs must implement \`Serializable\` since Ehcache stores objects as byte arrays for disk persistence.

## Cache Operations

- **@Cacheable** — retrieves cached results or executes the method
- **@CachePut** — updates cache entries during modifications
- **@CacheEvict** — clears specific caches on data insertion
- **Manual flush** — clears all cache entries

## TTL vs TTI

- **TTL**: Cache entry expires after a fixed duration regardless of access
- **TTI**: Cache lifetime resets on each access — useful for session-like data

Cache events are logged asynchronously, allowing observation of creation, updates, eviction, and removal operations.`,
  },
  {
    id: 13,
    slug: 'springboot-websocket-across-multiple-applications',
    title: 'SpringBoot + WebSocket Across Multiple Applications',
    date: '2021-04-30',
    category: 'Spring Boot',
    tags: ['java', 'spring-boot', 'websocket', 'microservices'],
    mediumUrl: 'https://alexanderang24.medium.com/springboot-websocket-across-multiple-applications-117e00b1df6a',
    description: 'How to implement WebSocket communication between two separate Spring Boot applications in a microservices architecture.',
    content: `*Summarized from [this article on Medium](https://alexanderang24.medium.com/springboot-websocket-across-multiple-applications-117e00b1df6a).*

---

## Overview

This guide demonstrates implementing WebSocket communication between two separate Spring Boot applications. The use case: a "back" application sending real-time notifications to a "front" application when business events occur.

## Architecture

Two applications:
- **Sender** (\`learn-websocket-sender\`): Port 8090 — backend service
- **Receiver** (\`learn-websocket-receiver\`): Port 8091 — frontend with UI

## Sender Application

### Dependencies

\`\`\`xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
</dependency>
\`\`\`

### Controller

A \`SendMessageController\` accepts messages via API and forwards them to the receiver application's \`/submit\` endpoint.

## Receiver Application

### Dependencies

\`\`\`xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
<dependency>
  <groupId>org.webjars</groupId>
  <artifactId>sockjs-client</artifactId>
  <version>1.0.2</version>
</dependency>
<dependency>
  <groupId>org.webjars</groupId>
  <artifactId>stomp-websocket</artifactId>
  <version>2.3.3</version>
</dependency>
<dependency>
  <groupId>org.webjars</groupId>
  <artifactId>bootstrap</artifactId>
  <version>3.3.7</version>
</dependency>
\`\`\`

### WebSocket Configuration

\`\`\`java
configureMessageBroker() {
  enableSimpleBroker("/topic");
  setApplicationDestinationPrefixes("/app");
}

registerStompEndpoints {
  addEndpoint("/websocket").withSockJS();
}
\`\`\`

This enables a memory-based message broker and registers the SockJS endpoint.

### Controller

Two methods handle messages:
- \`sendMessage()\`: Processes STOMP messages from \`/hello\`, broadcasts to \`/topic/messages\`
- \`receiveMessage()\`: Handles HTTP requests from the sender app, broadcasts to \`/topic/messages\`

### Frontend (app.js)

\`\`\`javascript
connect() {
  var socket = new SockJS('/websocket');
  stompClient = Stomp.over(socket);
  stompClient.subscribe('/topic/messages', function(message) {
    showMessage(message.body);
  });
}

sendName() {
  stompClient.send("/app/hello", {}, $("#name").val());
}
\`\`\`

## Testing

**Within receiver app:** Click Connect, enter a message, click Send.

**Across applications:** Use curl to trigger from the sender:

\`\`\`bash
curl --location --request POST 'http://localhost:8090/submit' \\
--header 'Content-Type: text/plain' \\
--data-raw 'ok'
\`\`\`

Expected: "Received message: [text]" appears in the receiver UI.

## Key Concepts

The controller layer processes messages before broadcasting, enabling business logic and message sanitization. STOMP handles message routing; SockJS provides fallback transport for older browsers.

## References

- [Spring WebSocket Guide](https://spring.io/guides/gs/messaging-stomp-websocket/)
- [GitHub: Sender Repository](https://github.com/alexanderang24/learn-websocket-sender)
- [GitHub: Receiver Repository](https://github.com/alexanderang24/learn-websocket-receiver)`,
  },
  {
    id: 15,
    slug: 'getting-started-with-prometheus-monitoring-in-spring-boot',
    title: 'Getting Started with Prometheus Monitoring in Spring Boot',
    date: '2026-06-16',
    category: 'Backend Engineering',
    tags: ['java', 'spring-boot', 'prometheus', 'monitoring'],
    description: 'A beginner-friendly guide to setting up Prometheus metrics in a Spring Boot application — from dependency setup to writing custom metrics and testing them.',
    content: `## What Is Prometheus?

Prometheus is an open-source monitoring and alerting toolkit. It collects metrics from your application by **pulling** data from a metrics endpoint at regular intervals. Think of it like a health checkup — Prometheus visits your app every few seconds and asks "how are you doing?" then stores the answer.

In the context of Spring Boot, Prometheus works hand-in-hand with **Spring Boot Actuator** and **Micrometer** — a metrics library that acts as a bridge between your application and monitoring systems like Prometheus.

---

## The Big Picture

Here's how the pieces connect:

1. **Your Spring Boot app** exposes a \`/actuator/prometheus\` endpoint
2. **Prometheus** scrapes that endpoint on a schedule (e.g., every 15 seconds)
3. **Grafana** (optional) reads from Prometheus to display dashboards

No code changes are needed on your app once the endpoint is set up — Prometheus does the pulling automatically.

---

## Step 1: Add Dependencies

Add these to your \`pom.xml\`:

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
\`\`\`

- **spring-boot-starter-actuator**: Gives your app built-in health and metrics endpoints
- **micrometer-registry-prometheus**: Formats those metrics in the format Prometheus understands

---

## Step 2: Configure application.properties

\`\`\`properties
management.endpoints.web.exposure.include=health,info,prometheus,metrics
management.endpoint.prometheus.enabled=true
\`\`\`

Restart your app and visit \`http://localhost:8080/actuator/prometheus\`. You'll see a wall of text — that's your metrics in Prometheus format.

---

## Step 3: What You Get for Free

Spring Boot Actuator auto-generates dozens of useful metrics out of the box. No extra code needed.

| Metric | What it measures |
|--------|-----------------|
| \`jvm_memory_used_bytes\` | JVM heap and non-heap memory |
| \`http_server_requests_seconds\` | Response times per endpoint |
| \`jvm_gc_pause_seconds\` | Garbage collection duration |
| \`process_cpu_usage\` | CPU usage of the JVM process |
| \`hikaricp_connections_active\` | Active database connections |

---

## Step 4: Custom Metrics

The real power comes from tracking business-level metrics. Micrometer provides four main types.

### Counter — counting events

Use a \`Counter\` when you want to track how many times something happened. It only goes up.

\`\`\`java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final Counter orderCounter;

    public OrderService(MeterRegistry registry) {
        this.orderCounter = Counter.builder("orders.created.total")
                .description("Total number of orders created")
                .tag("status", "success")
                .register(registry);
    }

    public void createOrder(Order order) {
        // your business logic here
        orderCounter.increment();
    }
}
\`\`\`

In Prometheus, you'd query this as \`orders_created_total\`. Notice that dots become underscores — that's how Prometheus names work.

---

### Gauge — tracking a current value

Use a \`Gauge\` for values that go up and down, like queue size or number of active sessions.

\`\`\`java
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class QueueService {

    private final AtomicInteger queueSize = new AtomicInteger(0);

    public QueueService(MeterRegistry registry) {
        Gauge.builder("queue.size", queueSize, AtomicInteger::get)
                .description("Current number of items in the queue")
                .register(registry);
    }

    public void addToQueue(String item) {
        queueSize.incrementAndGet();
    }

    public void removeFromQueue() {
        queueSize.decrementAndGet();
    }
}
\`\`\`

---

### Timer — measuring duration

Use a \`Timer\` to measure how long operations take.

\`\`\`java
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final Timer paymentTimer;

    public PaymentService(MeterRegistry registry) {
        this.paymentTimer = Timer.builder("payment.processing.duration")
                .description("Time taken to process a payment")
                .register(registry);
    }

    public PaymentResult processPayment(PaymentRequest request) {
        return paymentTimer.record(() -> doProcess(request));
    }
}
\`\`\`

---

### Using @Timed Annotation (Simpler)

For REST endpoints, the \`@Timed\` annotation is cleaner than wiring a \`Timer\` manually:

\`\`\`java
import io.micrometer.core.annotation.Timed;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

    @GetMapping("/products")
    @Timed(value = "products.list.duration", description = "Time to fetch product list")
    public List<Product> getProducts() {
        return productService.findAll();
    }
}
\`\`\`

\`@Timed\` requires a \`TimedAspect\` bean. Add this to a \`@Configuration\` class:

\`\`\`java
import io.micrometer.core.aop.TimedAspect;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MetricsConfig {

    @Bean
    public TimedAspect timedAspect(MeterRegistry registry) {
        return new TimedAspect(registry);
    }
}
\`\`\`

---

## Step 5: Testing Your Metrics

### Test 1: Verify the endpoint is reachable

\`\`\`java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PrometheusEndpointTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void prometheusEndpointReturnsMetrics() throws Exception {
        mockMvc.perform(get("/actuator/prometheus"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("text/plain;version=0.0.4;charset=utf-8"));
    }

    @Test
    void prometheusEndpointContainsJvmMetrics() throws Exception {
        mockMvc.perform(get("/actuator/prometheus"))
                .andExpect(status().isOk())
                .andExpect(content().string(
                        org.hamcrest.Matchers.containsString("jvm_memory_used_bytes")));
    }
}
\`\`\`

### Test 2: Verify your custom counter increments

The key is \`SimpleMeterRegistry\` — an in-memory registry that's perfect for unit tests. No Prometheus server needed.

\`\`\`java
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class OrderServiceTest {

    @Test
    void counterIncrementsWhenOrderIsCreated() {
        MeterRegistry registry = new SimpleMeterRegistry();
        OrderService orderService = new OrderService(registry);

        orderService.createOrder(new Order("product-1", 2));
        orderService.createOrder(new Order("product-2", 1));

        Counter counter = registry.find("orders.created.total")
                .tag("status", "success")
                .counter();

        assertThat(counter).isNotNull();
        assertThat(counter.count()).isEqualTo(2.0);
    }
}
\`\`\`

### Test 3: Verify timer records duration

\`\`\`java
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.Test;

import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

class PaymentServiceTest {

    @Test
    void timerRecordsPaymentDuration() {
        MeterRegistry registry = new SimpleMeterRegistry();
        PaymentService paymentService = new PaymentService(registry);

        paymentService.processPayment(new PaymentRequest("order-123", 50000));

        Timer timer = registry.find("payment.processing.duration").timer();

        assertThat(timer).isNotNull();
        assertThat(timer.count()).isEqualTo(1);
        assertThat(timer.totalTime(TimeUnit.MILLISECONDS)).isGreaterThan(0);
    }
}
\`\`\`

---

## Running Prometheus Locally with Docker

Create a \`prometheus.yml\` config file in your project root:

\`\`\`yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['host.docker.internal:8080']
\`\`\`

Then start Prometheus:

\`\`\`bash
docker run -p 9090:9090 \\
  -v ./prometheus.yml:/etc/prometheus/prometheus.yml \\
  prom/prometheus
\`\`\`

Open \`http://localhost:9090\` and try these queries in the search box:

- \`jvm_memory_used_bytes\` — JVM memory over time
- \`http_server_requests_seconds_count\` — total request count per endpoint
- \`orders_created_total\` — your custom business counter

---

## Quick Reference: When to Use Which Metric Type

| Type | Use when | Example |
|------|----------|---------|
| Counter | Something only increases | Total orders, errors, logins |
| Gauge | A current snapshot that fluctuates | Queue depth, active sessions |
| Timer | Duration of an operation | API latency, DB query time |
| DistributionSummary | Distribution of a value | Payload size, batch size |

---

## Summary

1. Add \`spring-boot-starter-actuator\` and \`micrometer-registry-prometheus\` to \`pom.xml\`
2. Expose the \`/actuator/prometheus\` endpoint in \`application.properties\`
3. Get JVM, HTTP, and DB metrics for free — no extra code
4. Add \`Counter\`, \`Gauge\`, and \`Timer\` via \`MeterRegistry\` for business-level metrics
5. Test metrics in isolation using \`SimpleMeterRegistry\`
6. Point Prometheus at your endpoint and start querying

Prometheus gives you visibility into what your application is actually doing in production — and Spring Boot makes it surprisingly easy to get started.`,
  },
  {
    id: 12,
    slug: 'spring-boot-cache-implementation',
    title: 'Spring Boot Cache Implementation for Database Operations',
    date: '2019-12-02',
    category: 'Spring Boot',
    tags: ['java', 'spring-boot', 'caching'],
    mediumUrl: 'https://alexanderang24.medium.com/spring-boot-cache-implementation-for-database-operations-cf846d6d8e3c',
    description: 'Cache implementation using the built-in cache abstraction in Spring Boot to reduce database hits.',
    content: `*Summarized from [this article on Medium](https://alexanderang24.medium.com/spring-boot-cache-implementation-for-database-operations-cf846d6d8e3c).*

---

## Overview

This article explains how to implement caching in Spring Boot applications to optimize database operations. Caching reduces database hits by storing frequently accessed data in memory.

## Getting Started

### Maven Dependency

\`\`\`xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
\`\`\`

### Enable Caching

Add \`@EnableCaching\` to any configuration class:

\`\`\`java
@EnableCaching
public class DemoApplication { }
\`\`\`

## Core Caching Annotations

### @Cacheable

Enables method-level caching. Returns cached results if available, otherwise executes the method and caches the result.

\`\`\`java
@Cacheable("cacheName")
@Cacheable({"cache1", "cache2"})
\`\`\`

### @CacheEvict

Removes cache entries. Use \`allEntries=true\` to clear all entries in a cache. Unlike \`@Cacheable\`, this always executes the method.

\`\`\`java
@CacheEvict(value="cacheName", allEntries=true)
\`\`\`

### @CachePut

Always runs the method and updates the cache with the result.

\`\`\`java
@CachePut(value="cacheName")
\`\`\`

### @Caching

Applies multiple cache annotations of the same type to a single method:

\`\`\`java
@Caching(evict = {
    @CacheEvict("addresses"),
    @CacheEvict(value="directory", key="#customer.name")
})
\`\`\`

### @CacheConfig

Sets default cache configuration at the class level:

\`\`\`java
@CacheConfig(cacheNames={"cacheName"})
\`\`\`

## Conditional Caching

Three conditional parameters using SpEL expressions:

\`\`\`java
@Cacheable(value="addresses", key="#customer.name")
@CacheEvict(value="cacheName", condition="#customer.name=='Herianto'")
@CachePut(value="addresses", unless="#result.length()<64")
\`\`\`

- **condition**: Evaluated before execution — caches only if true
- **key**: Custom cache key generation
- **unless**: Evaluated after execution — prevents caching if true

## Debugging

Enable cache logging with:

\`\`\`properties
logging.level.org.springframework.cache=TRACE
\`\`\`

Source code: https://github.com/alexanderang24/learn-spring-boot-cache`,
  },
]
