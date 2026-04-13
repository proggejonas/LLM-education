import { useState, useEffect } from "react";

const sections = [
  { id: "core", label: "The Core Idea", num: "01" },
  { id: "built", label: "How It Gets Built", num: "02" },
  { id: "inside", label: "What's Happening Inside", num: "03" },
  { id: "smarter", label: "Making It Smarter", num: "04" },
  { id: "multi", label: "Multimodality", num: "05" },
  { id: "agents", label: "Agents", num: "06" },
  { id: "used", label: "How It Gets Used", num: "07" },
  { id: "autostore", label: "AutoStore Tools", num: "08" },
  { id: "beyond", label: "Going Further", num: "09" },
];

const C = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  text: "#1a1a1a",
  body: "#3a3a3a",
  muted: "#6b7280",
  border: "#e5e5e0",
  accent1: "#2563eb",
  accent2: "#7c3aed",
  accent3: "#0891b2",
  accent4: "#059669",
  accent5: "#d97706",
  accent6: "#dc2626",
  accent7: "#4f46e5",
};

const sectionAccent = {
  core: C.accent1,
  built: C.accent2,
  inside: C.accent3,
  smarter: C.accent4,
  multi: C.accent5,
  agents: C.accent6,
  used: C.accent7,
  autostore: "#0284c7",
  beyond: "#9333ea",
};

function Callout({ color, children }) {
  return (
    <div style={{
      margin: "2rem 0", padding: "1.5rem 1.5rem 1.5rem 1.75rem",
      borderLeft: `3px solid ${color}`, background: `${color}08`,
      borderRadius: "0 10px 10px 0",
    }}>
      <div style={{ fontSize: "1.05rem", lineHeight: 1.7, color: C.text, fontWeight: 500 }}>{children}</div>
    </div>
  );
}

function PhaseCard({ num, title, tagline, cost, color, children }) {
  return (
    <div style={{
      margin: "1.5rem 0", padding: "1.75rem", background: C.surface,
      borderRadius: 12, border: `1px solid ${C.border}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: "50%", background: color,
          color: "#fff", fontWeight: 700, fontSize: "0.85rem", fontFamily: "system-ui, sans-serif",
        }}>{num}</span>
        <h4 style={{ fontSize: "1.2rem", fontWeight: 700, color: C.text, margin: 0 }}>{title}</h4>
        {cost && <span style={{
          marginLeft: "auto", fontSize: "0.75rem", fontWeight: 600, color,
          background: `${color}12`, padding: "0.25rem 0.75rem", borderRadius: 20,
          fontFamily: "system-ui, sans-serif",
        }}>{cost}</span>}
      </div>
      <p style={{ fontSize: "0.9rem", color, fontWeight: 600, fontStyle: "italic", margin: "0.25rem 0 1rem" }}>{tagline}</p>
      <div style={{ fontSize: "0.98rem", lineHeight: 1.75, color: C.body }}>{children}</div>
    </div>
  );
}

function TwoCol({ color, left, right, leftTitle, rightTitle }) {
  return (
    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", margin: "1.5rem 0" }}>
      {[{ title: leftTitle, items: left }, { title: rightTitle, items: right }].map((col, i) => (
        <div key={i} style={{ flex: "1 1 280px", minWidth: 260 }}>
          <div style={{
            fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", color, marginBottom: "0.6rem",
          }}>{col.title}</div>
          {col.items.map((item, j) => (
            <div key={j} style={{
              fontSize: "0.95rem", color: C.body, lineHeight: 1.65,
              padding: "0.4rem 0 0.4rem 1rem", borderLeft: `2px solid ${color}22`,
              margin: "0.15rem 0",
            }}>{item}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function LevelCard({ icon, title, desc }) {
  return (
    <div style={{
      padding: "1.25rem 1.5rem", background: C.surface, borderRadius: 10,
      border: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    }}>
      <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{icon}</div>
      <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: C.text, marginBottom: "0.4rem" }}>{title}</h4>
      <p style={{ fontSize: "0.92rem", color: C.body, lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
}

function ToolCard({ icon, name, access, tagline, uses, color, tip }) {
  return (
    <div style={{
      margin: "1.25rem 0", padding: "1.75rem", background: C.surface,
      borderRadius: 12, border: `1px solid ${C.border}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" }}>
        <span style={{ fontSize: "2rem", lineHeight: 1 }}>{icon}</span>
        <div>
          <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: C.text, margin: 0 }}>{name}</h4>
          <span style={{
            fontSize: "0.75rem", fontWeight: 600, color, background: `${color}12`,
            padding: "0.2rem 0.65rem", borderRadius: 20, fontFamily: "system-ui, sans-serif",
          }}>{access}</span>
        </div>
      </div>
      <p style={{ fontSize: "0.95rem", color, fontWeight: 600, fontStyle: "italic", margin: "0.25rem 0 0.9rem" }}>{tagline}</p>
      <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
        {uses.map((u, i) => (
          <li key={i} style={{ fontSize: "0.97rem", color: C.body, lineHeight: 1.75, marginBottom: "0.15rem" }}>{u}</li>
        ))}
      </ul>
      {tip && (
        <div style={{
          marginTop: "1rem", padding: "0.65rem 0.85rem", background: `${color}08`,
          borderRadius: 8, fontSize: "0.88rem", color: C.body, borderLeft: `2px solid ${color}`,
        }}>
          <strong style={{ color }}>Tip: </strong>{tip}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ id, num, title }) {
  const color = sectionAccent[id];
  return (
    <div id={id} style={{ paddingTop: "4rem", marginBottom: "1.5rem" }}>
      <span style={{
        fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "0.12em", color, fontFamily: "system-ui, sans-serif",
      }}>Part {num}</span>
      <h2 style={{
        fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700,
        color: C.text, letterSpacing: "-0.025em", lineHeight: 1.15, marginTop: "0.3rem",
      }}>{title}</h2>
    </div>
  );
}

function P({ children, style: s }) {
  return <p style={{ fontSize: "1.02rem", lineHeight: 1.8, color: C.body, margin: "1rem 0", ...s }}>{children}</p>;
}

function H3({ children }) {
  return <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: C.text, margin: "2rem 0 0.5rem", letterSpacing: "-0.01em" }}>{children}</h3>;
}

export default function App() {
  const [activeSection, setActiveSection] = useState("core");
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setShowToc(false);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Charter', 'Georgia', 'Times New Roman', serif" }}>
      {/* Mobile TOC button */}
      <button onClick={() => setShowToc(!showToc)} style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 200,
        width: 44, height: 44, borderRadius: "50%", background: C.text, color: "#fff",
        border: "none", cursor: "pointer", fontSize: "1.1rem",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)", display: "none",
        alignItems: "center", justifyContent: "center",
      }} className="toc-fab">☰</button>

      {/* Mobile TOC overlay */}
      {showToc && (
        <div style={{ position: "fixed", inset: 0, zIndex: 199, background: "rgba(0,0,0,0.4)" }} onClick={() => setShowToc(false)}>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: C.surface, borderRadius: "16px 16px 0 0",
            padding: "1.5rem", maxHeight: "60vh",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem", fontFamily: "system-ui, sans-serif" }}>Contents</div>
            {sections.map((s) => (
              <div key={s.id} onClick={() => scrollTo(s.id)} style={{
                padding: "0.7rem 0", cursor: "pointer",
                color: activeSection === s.id ? sectionAccent[s.id] : C.body,
                fontWeight: activeSection === s.id ? 700 : 400,
                fontSize: "1rem", borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.8rem", marginRight: "0.75rem", color: C.muted }}>{s.num}</span>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", maxWidth: 1120, margin: "0 auto" }}>
        {/* Sidebar TOC */}
        <nav style={{
          width: 220, flexShrink: 0, position: "sticky", top: 0,
          height: "100vh", padding: "3rem 1.25rem 2rem 1.5rem",
          overflowY: "auto", borderRight: `1px solid ${C.border}`,
        }} className="desktop-nav">
          <div style={{
            fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.12em", color: C.muted, marginBottom: "1.5rem",
            fontFamily: "system-ui, sans-serif",
          }}>Contents</div>
          {sections.map((s) => {
            const active = activeSection === s.id;
            const color = sectionAccent[s.id];
            return (
              <div key={s.id} onClick={() => scrollTo(s.id)} style={{
                padding: "0.45rem 0.75rem", margin: "0.15rem 0", cursor: "pointer",
                borderRadius: 6, fontSize: "0.88rem", lineHeight: 1.4,
                transition: "all 0.15s ease",
                background: active ? `${color}10` : "transparent",
                color: active ? color : C.muted,
                fontWeight: active ? 700 : 400,
              }}>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.75rem", marginRight: "0.5rem", opacity: 0.6 }}>{s.num}</span>
                {s.label}
              </div>
            );
          })}
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0, padding: "0 2rem 6rem", maxWidth: 720, margin: "0 auto" }} className="main-content">
          {/* Hero */}
          <div style={{ padding: "5rem 0 2rem", borderBottom: `1px solid ${C.border}`, marginBottom: "1rem" }}>
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 700,
              letterSpacing: "-0.035em", lineHeight: 1.1, color: C.text, marginBottom: "1rem",
            }}>How AI Actually Works</h1>
            <p style={{ fontSize: "1.15rem", color: C.muted, lineHeight: 1.6, maxWidth: 520 }}>
              LLMs, agents, and what's really going on under the hood — explained for people who want to understand, not just use.
            </p>
          </div>

          {/* ── SECTION 1 ── */}
          <SectionHeader id="core" num="01" title="The Core Idea" />
          <Callout color={C.accent1}>An LLM is a prediction machine. You feed it a string of text, and it guesses what comes next. That's the entire trick.</Callout>
          <P>There is no knowledge base inside. No search engine. No database of facts. Just a massive mathematical function trained to do one thing: given a sequence of text, predict the most likely next word.</P>
          <P>So why does that produce something that seems intelligent? Because if you do this at massive scale — trillions of words, billions of parameters — predicting text well <em>requires</em> understanding the world that produced the text. To predict what follows "The capital of France is...", the system needs to have internalized geography. To predict the next line of working code, it needs programming logic. Knowledge, reasoning, and language ability all emerge as side effects of getting very good at prediction.</P>
          <P>This single fact — that it's a prediction engine, not a knowledge engine — explains both what LLMs are great at and where they fall short.</P>
          <TwoCol color={C.accent1}
            leftTitle="Strengths" rightTitle="Weaknesses"
            left={["Fluency and natural language", "Broad general knowledge", "Reasoning and logical chains", "Code generation and debugging", "Creative writing and ideation", "Working across languages"]}
            right={["Hallucination — confident but wrong", "No real-time or live knowledge", "Can't act on its own", "No persistent memory between sessions", "Struggles with precise arithmetic", "Difficulty knowing what it doesn't know"]}
          />
          <P style={{ color: C.muted, fontStyle: "italic" }}>Both columns follow directly from the same thing: the model is optimized to produce likely text. It's brilliant at producing text that sounds right — which is also exactly why it sometimes produces text that sounds right but isn't.</P>

          {/* ── SECTION 2 ── */}
          <SectionHeader id="built" num="02" title="How It Gets Built" />
          <Callout color={C.accent2}>Building an LLM happens in distinct phases. Each phase has a different purpose, a different cost profile, and shapes what the model becomes.</Callout>
          <P>Understanding the training pipeline is key to understanding why models behave the way they do — and why there are so few companies that build frontier models from scratch, but many that build on top of them.</P>

          <PhaseCard num="1" title="Pretraining" tagline="Learning how the world works" cost="~90% of total cost" color={C.accent2}>
            <P>Ingest trillions of tokens from the internet, books, code, and scientific papers. The model tries to predict the next token, over and over, adjusting its internal weights every time it gets it wrong.</P>
            <P>This is where the vast majority of the cost sits. Training a frontier model requires tens of thousands of specialized GPUs running for weeks to months. The price tag: hundreds of millions to over a billion dollars.</P>
            <P>What emerges is a system that has absorbed grammar, facts, reasoning patterns, coding ability, multiple languages, and common sense — all as a side effect of getting better at prediction. No one programs in "know that water boils at 100°C." The model learns it because that knowledge helps it predict text more accurately.</P>
            <P style={{ color: C.muted }}>The learning mechanism is gradient descent: start with random weights, make a prediction, measure the error, nudge all parameters toward a better answer. Repeated billions of times, this converges on a configuration that predicts text remarkably well.</P>
          </PhaseCard>

          <PhaseCard num="2" title="Mid-Training" tagline="Sharpening the good stuff" cost="~5–10% of total cost" color={C.accent2}>
            <P>After the broad pretraining sweep, continue training on a smaller but carefully curated dataset — high-quality textbooks, verified code, structured reasoning examples, long-form analysis.</P>
            <P>Pretraining on raw internet data teaches enormous breadth, but it also teaches noise: forum arguments, clickbait, factual errors. Mid-training is where you up-weight the signal and down-weight the garbage. Targeted curation can boost reasoning and code capabilities far beyond what the extra compute alone would suggest.</P>
          </PhaseCard>

          <PhaseCard num="3" title="Post-Training" tagline="From completion engine to useful assistant" cost="~1–5% of compute, high human cost" color={C.accent2}>
            <P>The raw pretrained model is a text completion engine, not an assistant. If you type a question, it might complete it with another question, or continue as if it were a forum post. Post-training transforms it into something that follows instructions and has a conversation.</P>
            <P><strong>Supervised fine-tuning:</strong> Human demonstrators write thousands of examples of ideal assistant behavior. The model learns the format, tone, and behavioral patterns of being helpful.</P>
            <P><strong>Reinforcement learning from feedback:</strong> A reward model scores responses on helpfulness, accuracy, and safety. Reinforcement learning then optimizes the LLM to produce responses that score well. This is where the model learns nuance, safety boundaries, and alignment with human preferences.</P>
            <P style={{ color: C.muted }}>Relatively cheap in compute, but extremely expensive in human expertise — alignment researchers, red-teamers, domain experts, and careful policy design.</P>
          </PhaseCard>

          <H3>The Takeaway</H3>
          <P>The cost is heavily front-loaded. Pretraining is the massive infrastructure investment. Everything after is refinement — but that refinement is where most of the behavioral quality comes from. This is why there are only a handful of frontier model builders, but a large and growing ecosystem building on top.</P>

          {/* ── SECTION 3 ── */}
          <SectionHeader id="inside" num="03" title="What's Happening Inside" />
          <Callout color={C.accent3}>The model is layers of pattern recognition, stacked deep. Each word flows through these layers, and at each step the model refines its understanding of what that word means in context.</Callout>

          <H3>Context Is Everything</H3>
          <P>The word "bank" means different things next to "river" versus "money." The model resolves this not because someone wrote a rule, but because it learned from billions of examples where context determined meaning.</P>
          <P>The core mechanism is called <strong>attention</strong>. For each word, the model asks: which other words in this sequence matter for understanding me? It computes these relationships across all words simultaneously, building a rich representation that accounts for context, nuance, and long-range dependencies.</P>

          <H3>From Context to Prediction</H3>
          <P>After flowing through all the layers (frontier models use 80–120+), the model outputs a probability for every possible next word. "The cat sat on the..." → "mat" gets high probability. Pick one, append it, run the process again. One word at a time. This is <strong>autoregressive generation</strong>.</P>

          <H3>Temperature and Creativity</H3>
          <P><strong>Low temperature</strong> makes the model stick to high-probability words — focused and deterministic. <strong>High temperature</strong> lets less likely words through — creative and surprising. Same model, same input, different behavior from one parameter.</P>

          <H3>Why This Matters</H3>
          <P>It's confident but sometimes wrong — because it produces <em>likely</em> text, not <em>verified</em> text. It's creative — because it samples from probabilities. "Thinking step by step" helps — because intermediate steps give the model better information to predict from. And longer context windows mean better results — more signal for the attention mechanism to work with.</P>

          {/* ── SECTION 4 ── */}
          <SectionHeader id="smarter" num="04" title="Making It Smarter" />
          <Callout color={C.accent4}>Raw scale is hitting diminishing returns. The frontier is now about architectural cleverness, better data, and smarter inference.</Callout>
          <P>The early playbook was simple: make it bigger, feed it more data, use more compute. That worked — but the cost curve is brutal. Labs are now finding smarter approaches.</P>

          <H3>Mixture of Experts</H3>
          <P>Instead of one giant network where every parameter activates for every input, split the model into many "expert" sub-networks with a router that sends each input to the most relevant few. Huge knowledge capacity, but efficient because only a fraction activates per query.</P>

          <H3>Better Data Over More Data</H3>
          <P>A model trained on 1 trillion high-quality tokens can outperform one trained on 10 trillion noisy tokens. Data curation — quality, deduplication, domain mixing — has become as important as architecture research.</P>

          <H3>Test-Time Compute</H3>
          <P>Instead of making the model bigger, let it "think longer" on hard problems. Extended thinking, chain-of-thought, and step-by-step reasoning all trade inference cost for quality. A major frontier: smaller models that think harder can match larger models that answer immediately.</P>

          <H3>Distillation</H3>
          <P>Train a small model to mimic a large model's outputs. Get 80–90% of the performance at a fraction of the size and cost. This is how AI models end up running on phones.</P>

          <H3>Synthetic Data</H3>
          <P>Use strong models to generate training data for weaker ones. Controversial but effective when done carefully. The best models are now partly trained on data generated by previous versions of themselves.</P>

          {/* ── SECTION 5 ── */}
          <SectionHeader id="multi" num="05" title="Multimodality" />
          <Callout color={C.accent5}>Once you can convert something into tokens, the model doesn't care what it originally was. Text, images, audio — it's all just sequences of numbers.</Callout>

          <H3>How Vision Works</H3>
          <P>An image gets divided into patches — small squares, like a grid overlay. Each patch becomes a token, encoded as a vector of numbers, just like text tokens. These visual tokens join the text tokens and flow through the same architecture. The attention mechanism learns relationships between what the model sees and what it reads.</P>

          <H3>Audio and Speech</H3>
          <P>Same principle. Audio waveforms get converted into tokens through spectrograms or audio codecs. Once they're tokens, they're processed by the same system.</P>

          <H3>The Key Insight</H3>
          <P>There aren't separate "vision" and "language" systems bolted together. It's one unified system processing a combined stream of tokens from different sources. It can reason across modalities naturally — interpreting a photo alongside text, relating a diagram to code. Some models can also <em>generate</em> across modalities, producing images or speech as output.</P>

          {/* ── SECTION 6 ── */}
          <SectionHeader id="agents" num="06" title="Agents" />
          <Callout color={C.accent6}>An LLM alone is a brain in a jar. Smart, but it can't see, act, or remember. An agent adds a body — tools, memory, and a planning loop.</Callout>

          <H3>The Limitations of a Raw LLM</H3>
          <P>No persistent memory — the context window is all it sees. No ability to take actions — can't send an email or query a database. No real-time information — frozen at training data. Stateless — every request is independent.</P>

          <H3>What an Agent Adds</H3>
          <P><strong>Tools.</strong> The ability to call external functions — search the web, run code, query APIs, read files. The model generates a function call, the system executes it, results come back into context.</P>
          <P><strong>Memory.</strong> Conversation history in the context window (short-term), retrieved past conversations (medium-term), stored facts and preferences that persist across sessions (long-term).</P>
          <P><strong>A planning loop.</strong> Think about what needs doing, take an action, observe the result, decide what's next. Think → Act → Observe → Repeat until done.</P>
          <P><strong>System instructions.</strong> Instructions that define who the agent is, what it can access, how it should behave, and what constraints apply.</P>

          <H3>Multi-Agent Systems</H3>
          <P>Multiple specialized agents collaborating — one researches, one writes, one reviews. Each is an LLM with different tools and instructions, coordinated by an orchestration layer. Not one super-agent, but a team of focused agents.</P>

          <H3>The Core Insight</H3>
          <P>The LLM provides reasoning. The agent framework provides the ability to apply it. Neither is very useful without the other. The rapid progress in AI right now is as much about better agent frameworks as better base models.</P>

          {/* ── SECTION 7 ── */}
          <SectionHeader id="used" num="07" title="How It Gets Used" />
          <Callout color={C.accent7}>There's a spectrum from "chatting with AI" to "building autonomous systems." The right level depends on the task, the stakes, and the setup required.</Callout>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", margin: "1.5rem 0" }}>
            <LevelCard icon="💬" title="Conversational AI"
              desc="Claude, ChatGPT, Copilot chat. You type, it responds. Great for drafting, brainstorming, explaining, analyzing. The entry point — and for many tasks, all you need." />
            <LevelCard icon="🔗" title="Copilot-Style Integration"
              desc="AI embedded in tools you already use — Copilot in Office, GitHub Copilot in your editor. The model has context from your work environment. The AI meets you where you work." />
            <LevelCard icon="⚡" title="Agentic Tools"
              desc="Tools where the AI writes, runs, tests, and iterates autonomously. Describe what you want, it builds it — planning steps, using tools, adjusting based on results. Agent behavior in practice." />
            <LevelCard icon="🤖" title="Multi-Agent Frameworks"
              desc="Multiple specialized agents coordinated together. One researches, one writes, one reviews. You define the workflow; the agents execute. Complex multi-step tasks with minimal human intervention." />
            <LevelCard icon="🏗️" title="Enterprise AI Platforms"
              desc="Databricks, Azure AI, AWS Bedrock — connecting LLMs to your organization's data, building pipelines, fine-tuning on domain knowledge. The infrastructure layer: embedding AI into how the business operates." />
          </div>

          <H3>The Gradient</H3>
          <P>Chat → Copilot → Agent → Multi-agent → Platform. Each step adds more autonomy, more tool access, more context — and requires more setup and trust. Most people are in the first two levels today. The industry is rapidly moving toward the middle.</P>

          {/* ── SECTION 8 ── */}
          <SectionHeader id="autostore" num="08" title="Tools Available at AutoStore" />
          <Callout color="#0284c7">You don't need to be an AI researcher to use AI at work. Here are the tools available to AutoStore employees today — what each one does, and where it delivers the most value.</Callout>
          <P>These tools are either already included in your existing licenses or available for request. The best way to build intuition is to use them on real work — even imperfect outputs are useful for understanding what AI can and can't do for your specific tasks.</P>

          <ToolCard
            icon="🏢"
            name="Microsoft 365 Copilot"
            access="Available to all employees"
            tagline="AI built into the tools you already use every day"
            color="#0284c7"
            uses={[
              "Meeting transcriptions & summaries: Every Teams meeting can be automatically transcribed and summarised — who said what, what was decided, what actions were assigned",
              "Custom summaries: Go beyond the default. Prompt Copilot to structure it your way — \"Summarise as facilitator notes with: 1) Decisions made, 2) Actions with owner and deadline, 3) Parking lot items\"",
              "Facilitator notes: Before a workshop, ask Copilot to draft an agenda and talking points. After, use it to turn the transcript into structured notes ready to share with the team",
              "Build your own agent: In Microsoft Copilot Studio, create a custom agent trained on your own documents — a team FAQ bot, an onboarding guide, a process assistant — no coding required",
              "Copilot Notebook: An open-ended AI workspace inside Microsoft 365 — paste in a doc, a transcript, or raw notes and have a conversation with the content",
            ]}
            tip={'Try this right now: open any recent Teams meeting, click the Copilot button, and paste in: "Give me facilitator notes with decisions, actions by owner, and open questions." The difference between the default summary and a prompted one is significant.'}
          />

          <ToolCard
            icon="⌨️"
            name="GitHub Copilot"
            access="Available to developers"
            tagline="An AI pair programmer in your editor — and a tool-builder in your terminal"
            color="#7c3aed"
            uses={[
              "Copilot in VS Code: Code completions, inline edits, and a chat interface that understands your actual codebase — explain, refactor, test, and debug without leaving the editor",
              "GitHub Copilot CLI: Use AI in the terminal to generate shell commands, scripts, and automation from plain English — 'create a script that monitors disk usage and alerts when above 80%'",
              "Build presentations and reports: This very page was built using GitHub Copilot CLI — describe what you want to create and let it generate the scaffolding, code, and content",
              "Build tools and software: Describe a tool you need, have Copilot generate the implementation, iterate in plain language — useful for internal scripts, dashboards, and automation",
            ]}
            tip="The CLI use case is underrated for non-developers too. 'gh copilot suggest' turns plain English into working shell commands or scripts — you don't need to know the syntax, just describe what you want done."
          />

          <ToolCard
            icon="🖱️"
            name="Cursor"
            access="Available to developers"
            tagline="An AI-native code editor — deeper context, more agentic than Copilot"
            color="#059669"
            uses={[
              "Understands your full project: reasons across multiple files, not just the current one",
              "Composer (cmd+I): describe a change in plain language, it plans and edits multiple files at once",
              "Inline edits (cmd+K): select any code and describe what you want changed",
              "Agent mode: give it a task like 'add authentication to this API' and it executes step by step",
              "Context-aware chat: attach specific files, docs, or web URLs to ground the conversation",
            ]}
            tip="Composer is particularly powerful for large refactors — describe the change at a high level and it figures out which files to touch. Useful for changes that would normally require understanding multiple interdependencies across the codebase."
          />

          <ToolCard
            icon="📊"
            name="Databricks"
            access="Available to data teams"
            tagline="Natural language access to AutoStore's datalake — from broad exploration to focused analysis"
            color="#d97706"
            uses={[
              "Databricks AI/BI (One): Prompt directly across AutoStore's entire datalake in plain English — 'What is the trend for order completion rates by region over the last 6 months?' — no SQL, no analyst required",
              "Genie Spaces: Topic-specific AI data assistants — each Space is pre-configured for a particular domain (Supply Chain, Sales, Operations) and understands the relevant tables, metrics, and terminology",
              "From question to insight: Business users can get answers without knowing which tables exist or how to write a query — type the question, Genie writes and runs the SQL, returns the result",
              "AI/BI Dashboards: Build smart dashboards where users can ask natural language follow-up questions directly in the dashboard view",
            ]}
            tip="Genie Spaces are the fastest path to value for domain experts. Instead of a generic 'ask anything' interface, a Space is pre-loaded with the right context for your area — ask your data team if there's a Space set up for your domain, or request one."
          />

          <ToolCard
            icon="🔬"
            name="Azure AI Foundry"
            access="Available to platform and engineering teams"
            tagline="The enterprise platform for building and deploying AI solutions on your own data"
            color="#dc2626"
            uses={[
              "Model playground: Experiment with and compare different AI models side by side",
              "RAG pipelines: Connect AI to your internal documents, manuals, and knowledge bases",
              "Prompt engineering: Test, evaluate, and iterate on prompts at scale before deploying",
              "Fine-tuning: Adapt models to your specific domain, data, or tone requirements",
              "Deployment: Host and serve AI endpoints with enterprise security and governance",
            ]}
            tip="Use the model playground first — it's the fastest way to compare how different models handle your specific use cases before committing to an architecture. Benchmark your actual prompts, not hypothetical ones."
          />

          <H3>Where to Start</H3>
          <P>If you're new to these tools, M365 Copilot is the lowest-friction starting point — it's inside tools you already use daily, and meeting summaries alone are worth trying. If you write code, GitHub Copilot or Cursor should be the first thing you set up. For data work, Genie lets you get direct answers from your data without waiting for an analyst.</P>
          <P style={{ color: C.muted, fontStyle: "italic" }}>The key calibration insight: use these tools on tasks you already know well. That's how you develop an accurate sense of where they help and where they make mistakes — which is the foundation for using them confidently on tasks that matter.</P>

          {/* ── SECTION 9 ── */}
          <SectionHeader id="beyond" num="09" title="Going Further on Your Own" />
          <Callout color="#9333ea">Outside company tools, a rich ecosystem of AI is freely available. Exploring it is worth your time — both for personal productivity, and because hands-on experience with different tools is how you build the intuition to evaluate AI professionally.</Callout>
          <P>You don't need to wait for official rollouts. The best way to understand what AI can and can't do is to use it on tasks that matter to you, encounter the edges, and refine your approach. Here's what's available today.</P>

          <H3>The Big Three Assistants</H3>
          <TwoCol color="#9333ea"
            leftTitle="Tool & Access" rightTitle="Best For"
            left={[
              "Claude — claude.ai · Free + Pro ($20/mo)",
              "ChatGPT — chatgpt.com · Free + Plus ($20/mo)",
              "Gemini — gemini.google.com · Free + Advanced",
            ]}
            right={[
              "Long documents, reasoning, structured writing",
              "Image generation, browsing, Python code sandbox",
              "Google Workspace integration, Deep Research mode",
            ]}
          />
          <P>All three have free tiers that are genuinely useful. The paid tiers (~$20/month) unlock significantly more capable models, longer context, and advanced features. If you use AI regularly for work tasks, a personal subscription typically pays for itself in time saved within the first week.</P>

          <ToolCard
            icon="📓"
            name="NotebookLM"
            access="Free — notebooklm.google.com"
            tagline="Upload your own documents and have a conversation with them"
            color="#9333ea"
            uses={[
              "Upload PDFs, Google Docs, YouTube videos, or web pages — it reads them for you",
              "Ask questions about your uploaded material and get answers with cited source passages",
              "Generates study guides, briefing documents, and FAQs grounded in your specific sources",
              "Audio overview: generates a podcast-style conversation summarizing your documents",
              "Great for product specs, research papers, technical documentation, and annual reports",
            ]}
            tip="Upload a dense PDF you've been putting off reading and ask for a 5-bullet summary of the key decisions and open questions. Then ask follow-up questions about the parts most relevant to your work. It only answers from what you uploaded — so no hallucinations from outside sources."
          />

          <ToolCard
            icon="🔍"
            name="Perplexity"
            access="Free + Pro — perplexity.ai"
            tagline="AI-powered research with real-time web access and cited sources"
            color="#0891b2"
            uses={[
              "Ask research questions and get synthesized answers linked to real, verifiable sources",
              "Real-time web access — unlike ChatGPT's default mode, always current information",
              "Deep Research mode: runs multi-step web research and produces a detailed briefing document",
              "Great for: competitive analysis, technical comparisons, 'how does X work?'",
            ]}
            tip="Better than Google for questions that need synthesis across multiple sources. The key difference from ChatGPT is that every claim links back to a source you can click and verify. Use it when you care about accuracy more than speed."
          />

          <ToolCard
            icon="🖥️"
            name="Local Models with Ollama"
            access="Free — ollama.com — runs entirely on your own machine"
            tagline="Run capable AI models locally — nothing leaves your computer"
            color="#059669"
            uses={[
              "Download and run models like Llama 3.3, Qwen2.5, Phi-4, or Mistral with a single command",
              "Everything stays on your machine — ideal for sensitive data or privacy-conscious use",
              "Combine with Open WebUI for a polished browser-based chat interface running locally",
              "Connect local models to VS Code, Cursor, and other tools via the OpenAI-compatible API",
              "Experiment with open-source models you can inspect, modify, and customize",
            ]}
            tip="Start with 'ollama run llama3.2' in your terminal — it downloads and runs a capable model in one command. The gap between local and cloud models is much smaller than it was even 12 months ago. For sensitive work or offline use, local models are increasingly a real option."
          />

          <ToolCard
            icon="🛠️"
            name="APIs and Personal Automation"
            access="OpenAI, Anthropic, Google — pay-per-use, start free"
            tagline="Get programmatic access to the models behind ChatGPT, Claude, and Gemini"
            color="#4f46e5"
            uses={[
              "Direct API access: build your own tools, scripts, and integrations from scratch",
              "Automate repetitive tasks: document processing, data extraction, email classification",
              "n8n or Zapier: connect AI to your existing tools without writing code",
              "Build personal assistants grounded in your own documents and workflows",
              "Prototype fast — most useful personal automation tasks can be built in an afternoon",
            ]}
            tip="Start at console.anthropic.com or platform.openai.com — both offer free credits to begin. A script that processes 100 documents typically costs a few cents. If you have a repetitive task involving text, there is almost certainly a way to automate most of it."
          />

          <H3>The Point of All This</H3>
          <P>The gap between "someone who uses AI" and "someone who uses AI well" is mostly calibration — an accurate mental model of what it can and can't do, developed through direct experience. The fastest way to build that model is to use it on tasks you know well, where you can judge the quality of the output.</P>
          <P>Try the same task in two different models and compare. Ask a model to explain its reasoning. Use it in a domain you're expert in, where you'll immediately spot errors. That feedback loop — use it, notice when it's wrong, understand why — is what turns novelty into a genuine skill.</P>


          <div style={{ marginTop: "5rem", paddingTop: "2rem", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
            <p style={{ fontSize: "0.85rem", color: C.muted }}>How AI Actually Works — AutoStore Team Guide</p>
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .toc-fab { display: flex !important; }
          .main-content { padding: 0 1.25rem 4rem !important; }
        }
      `}</style>
    </div>
  );
}
