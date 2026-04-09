import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#FAFAF8", text: "#1a1a1a", body: "#3a3a3a", muted: "#6b7280",
  border: "#e5e5e0", blue: "#2563eb", purple: "#7c3aed", cyan: "#0891b2",
  green: "#059669", amber: "#d97706", red: "#dc2626", indigo: "#4f46e5",
};

// ═══════════════════════════════════════
// VISUAL COMPONENTS
// ═══════════════════════════════════════

function TokenizationViz() {
  // Show actual text being split into colored token boxes with IDs
  const tokens = [
    { text: "The", id: "464", color: "#dbeafe" },
    { text: " capital", id: "6421", color: "#e0e7ff" },
    { text: " of", id: "315", color: "#dbeafe" },
    { text: " France", id: "4611", color: "#fce7f3" },
    { text: " is", id: "318", color: "#dbeafe" },
  ];
  return (
    <svg viewBox="0 0 680 220" style={{ width: "100%", maxWidth: 660 }}>
      {/* Original text */}
      <text x="340" y="28" fontSize="11" fill={C.muted} fontFamily="system-ui" fontWeight="600" textAnchor="middle" letterSpacing="1.5">WHAT YOU TYPE</text>
      <rect x="100" y="38" width="480" height="40" rx="8" fill="#f8fafc" stroke={C.border} />
      <text x="340" y="64" fontSize="16" fill={C.text} fontFamily="Georgia" textAnchor="middle">The capital of France is...</text>

      {/* Arrow down */}
      <line x1="340" y1="82" x2="340" y2="108" stroke={C.blue} strokeWidth="1.5" />
      <polygon points="334,108 340,118 346,108" fill={C.blue} />
      <text x="380" y="100" fontSize="10" fill={C.blue} fontFamily="system-ui" fontWeight="600">Tokenizer</text>

      {/* Token boxes */}
      <text x="340" y="138" fontSize="11" fill={C.muted} fontFamily="system-ui" fontWeight="600" textAnchor="middle" letterSpacing="1.5">WHAT THE MODEL SEES</text>
      {tokens.map((t, i) => {
        const x = 90 + i * 105;
        return (
          <g key={i}>
            <rect x={x} y="148" width="95" height="52" rx="8" fill={t.color} stroke={C.blue + "40"} strokeWidth="1" />
            <text x={x + 47} y="170" fontSize="14" fill={C.text} fontFamily="Georgia" textAnchor="middle" fontWeight="600">{t.text.trim()}</text>
            <text x={x + 47} y="190" fontSize="11" fill={C.blue} fontFamily="system-ui" textAnchor="middle" fontWeight="500">token {t.id}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PredictionLoop() {
  // Cleaner flow: tokens → model → probability bars → sample → loop
  const probs = [
    { word: "Paris", pct: 42, w: 126 },
    { word: "Lyon", pct: 8, w: 24 },
    { word: "the", pct: 6, w: 18 },
    { word: "a", pct: 4, w: 12 },
    { word: "...", pct: 40, w: 0 },
  ];
  return (
    <svg viewBox="0 0 700 280" style={{ width: "100%", maxWidth: 680 }}>
      {/* Input */}
      <text x="50" y="28" fontSize="11" fill={C.muted} fontFamily="system-ui" fontWeight="600" letterSpacing="1">INPUT SEQUENCE</text>
      <rect x="50" y="38" width="230" height="36" rx="8" fill="#f1f5f9" stroke={C.border} />
      <text x="165" y="61" fontSize="13" fill={C.text} fontFamily="Georgia" textAnchor="middle">"The capital of France is"</text>

      {/* Arrow to model */}
      <line x1="290" y1="56" x2="330" y2="56" stroke={C.blue} strokeWidth="2" />
      <polygon points="330,50 342,56 330,62" fill={C.blue} />

      {/* Model */}
      <rect x="345" y="26" width="100" height="60" rx="14" fill={C.blue} />
      <text x="395" y="52" fontSize="12" fill="#fff" fontFamily="system-ui" fontWeight="700" textAnchor="middle">LLM</text>
      <text x="395" y="68" fontSize="9" fill="#bfdbfe" fontFamily="system-ui" textAnchor="middle">Forward pass</text>

      {/* Arrow to output */}
      <line x1="450" y1="56" x2="490" y2="56" stroke={C.blue} strokeWidth="2" />
      <polygon points="490,50 502,56 490,62" fill={C.blue} />

      {/* Probability distribution - horizontal bars */}
      <text x="510" y="28" fontSize="11" fill={C.muted} fontFamily="system-ui" fontWeight="600" letterSpacing="1">PROBABILITIES</text>
      {probs.slice(0, 4).map((p, i) => {
        const y = 40 + i * 22;
        return (
          <g key={i}>
            <text x="510" y={y + 13} fontSize="11" fill={C.body} fontFamily="system-ui" textAnchor="start">{p.word}</text>
            <rect x="560" y={y + 2} width={p.w} height="14" rx="3" fill={i === 0 ? C.blue : C.blue + "40"} />
            <text x={566 + p.w} y={y + 13} fontSize="10" fill={C.muted} fontFamily="system-ui">{p.pct}%</text>
          </g>
        );
      })}

      {/* Selected token */}
      <line x1="620" y1="50" x2="650" y2="50" stroke={C.green} strokeWidth="1.5" />
      <rect x="640" y="36" width="52" height="28" rx="6" fill={C.green + "15"} stroke={C.green} strokeWidth="1.5" />
      <text x="666" y="55" fontSize="12" fill={C.green} fontFamily="Georgia" textAnchor="middle" fontWeight="700">Paris</text>

      {/* Loop-back arrow */}
      <path d="M 666 68 L 666 240 C 666 255, 650 260, 640 260 L 100 260 C 80 260, 70 250, 70 240 L 70 80" fill="none" stroke={C.blue} strokeWidth="1.5" strokeDasharray="6 4" />
      <polygon points="64,82 70,70 76,82" fill={C.blue} />

      {/* Loop label */}
      <rect x="290" y="240" width="200" height="32" rx="8" fill={C.blue + "08"} stroke={C.blue + "20"} />
      <text x="390" y="261" fontSize="11" fill={C.blue} fontFamily="system-ui" fontWeight="600" textAnchor="middle">Append token → repeat</text>

      {/* Growing sequence */}
      <text x="160" y="180" fontSize="11" fill={C.muted} fontFamily="system-ui" fontWeight="600" letterSpacing="1" textAnchor="middle">SEQUENCE GROWS</text>
      <rect x="30" y="192" width="310" height="30" rx="6" fill="#f1f5f9" stroke={C.border} />
      <text x="185" y="212" fontSize="12" fill={C.text} fontFamily="Georgia" textAnchor="middle">"The capital of France is <tspan fill={C.green} fontWeight="700">Paris</tspan>"</text>
    </svg>
  );
}

function GradientDescentViz() {
  // Simplified loss landscape - ball rolling downhill
  return (
    <svg viewBox="0 0 600 230" style={{ width: "100%", maxWidth: 560 }}>
      {/* Landscape curve */}
      <path d="M 30 180 Q 80 40, 150 120 Q 200 180, 260 90 Q 300 30, 350 70 Q 400 110, 420 60 Q 480 20, 530 50 Q 560 70, 580 100"
        fill="none" stroke={C.purple + "30"} strokeWidth="2" />
      <path d="M 30 180 Q 80 40, 150 120 Q 200 180, 260 90 Q 300 30, 350 70 Q 400 110, 420 60 Q 480 20, 530 50 Q 560 70, 580 100 L 580 220 L 30 220 Z"
        fill={C.purple + "06"} />

      {/* Start position */}
      <circle cx="100" cy="75" r="10" fill={C.red} />
      <text x="100" y="60" fontSize="10" fill={C.red} fontFamily="system-ui" fontWeight="600" textAnchor="middle">Start: random</text>

      {/* Path of descent with dots */}
      {[[150, 120], [200, 155], [260, 90], [310, 45], [350, 70], [400, 95], [420, 60], [460, 30]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={C.purple} opacity={0.3 + i * 0.08} />
      ))}
      <path d="M 100 75 C 130 100, 140 120, 150 120 C 170 120, 190 160, 260 90 C 290 50, 310 45, 350 70 C 380 90, 400 95, 420 60 C 440 35, 460 25, 490 28"
        fill="none" stroke={C.purple} strokeWidth="1.5" strokeDasharray="4 3" />

      {/* End position - minimum */}
      <circle cx="490" cy="28" r="10" fill={C.green} />
      <text x="490" y="14" fontSize="10" fill={C.green} fontFamily="system-ui" fontWeight="600" textAnchor="middle">Trained: good predictions</text>

      {/* Axes */}
      <line x1="30" y1="210" x2="580" y2="210" stroke={C.border} strokeWidth="1" />
      <text x="305" y="228" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">Billions of training steps →</text>
      <text x="16" y="120" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle" transform="rotate(-90,16,120)">Prediction error</text>
    </svg>
  );
}

function RLHFPipeline() {
  const steps = [
    { x: 30, label: "Step 1", title: "Supervised\nFine-tuning", icon: "👤", desc: "Humans write\nideal responses", color: C.purple },
    { x: 240, label: "Step 2", title: "Reward\nModeling", icon: "⚖️", desc: "Score responses\non quality", color: "#a78bfa" },
    { x: 450, label: "Step 3", title: "Reinforcement\nLearning", icon: "🎯", desc: "Optimize for\nhigh scores", color: "#c4b5fd" },
  ];
  return (
    <svg viewBox="0 0 660 180" style={{ width: "100%", maxWidth: 640 }}>
      {steps.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y="20" width="170" height="130" rx="12" fill={s.color + "10"} stroke={s.color + "40"} strokeWidth="1.5" />
          <text x={s.x + 85} y="42" fontSize="10" fill={s.color} fontFamily="system-ui" fontWeight="700" textAnchor="middle" letterSpacing="1">{s.label.toUpperCase()}</text>
          <text x={s.x + 85} y="68" fontSize="22" textAnchor="middle">{s.icon}</text>
          {s.title.split("\n").map((line, li) => (
            <text key={li} x={s.x + 85} y={90 + li * 16} fontSize="12" fill={C.text} fontFamily="system-ui" fontWeight="700" textAnchor="middle">{line}</text>
          ))}
          {s.desc.split("\n").map((line, li) => (
            <text key={li} x={s.x + 85} y={126 + li * 14} fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">{line}</text>
          ))}
          {i < 2 && (
            <g>
              <line x1={s.x + 175} y1="85" x2={steps[i + 1].x - 5} y2="85" stroke={C.purple + "50"} strokeWidth="2" />
              <polygon points={`${steps[i + 1].x - 5},80 ${steps[i + 1].x + 5},85 ${steps[i + 1].x - 5},90`} fill={C.purple + "50"} />
            </g>
          )}
        </g>
      ))}
      {/* Result label */}
      <text x="330" y="172" fontSize="11" fill={C.purple} fontFamily="system-ui" fontWeight="600" textAnchor="middle">
        Completion engine → Helpful, safe assistant
      </text>
    </svg>
  );
}

function AttentionViz() {
  const words = ["The", "cat", "sat", "on", "the", "mat", "because", "it", "was", "soft"];
  const w = 58, startX = 50;
  // Attention lines from "it" (index 7) to other words, varying opacity
  const attentions = [
    { to: 1, strength: 0.05 }, // cat
    { to: 5, strength: 0.7 },  // mat — "it" refers to mat (was soft)
    { to: 1, strength: 0.15 }, // cat
  ];
  // Stronger connections
  const connections = [
    { from: 7, to: 5, strength: 0.8, label: "what is 'it'?" },  // it → mat
    { from: 7, to: 1, strength: 0.2 },  // it → cat (weaker)
    { from: 9, to: 5, strength: 0.5 },  // soft → mat
    { from: 8, to: 7, strength: 0.4 },  // was → it
  ];

  return (
    <svg viewBox="0 0 660 200" style={{ width: "100%", maxWidth: 640 }}>
      <text x="330" y="20" fontSize="11" fill={C.muted} fontFamily="system-ui" fontWeight="600" textAnchor="middle" letterSpacing="1">ATTENTION: WHICH WORDS RELATE TO WHICH?</text>

      {/* Words */}
      {words.map((word, i) => {
        const x = startX + i * w;
        const isHighlight = i === 7 || i === 5;
        return (
          <g key={i}>
            <rect x={x} y="40" width={w - 6} height="32" rx="6"
              fill={isHighlight ? C.cyan + "18" : "#f8fafc"}
              stroke={isHighlight ? C.cyan : C.border}
              strokeWidth={isHighlight ? 1.5 : 1} />
            <text x={x + (w - 6) / 2} y="61" fontSize="13" fill={isHighlight ? C.cyan : C.text}
              fontFamily="Georgia" textAnchor="middle" fontWeight={isHighlight ? 700 : 400}>{word}</text>
          </g>
        );
      })}

      {/* Attention arcs */}
      {connections.map((c, i) => {
        const x1 = startX + c.from * w + (w - 6) / 2;
        const x2 = startX + c.to * w + (w - 6) / 2;
        const dist = Math.abs(c.from - c.to);
        const cy = 76 + dist * 18;
        return (
          <g key={i}>
            <path d={`M ${x1} 74 Q ${(x1 + x2) / 2} ${cy}, ${x2} 74`}
              fill="none" stroke={C.cyan} strokeWidth={1 + c.strength * 3}
              opacity={0.2 + c.strength * 0.6} />
            {c.label && (
              <text x={(x1 + x2) / 2} y={cy - 8} fontSize="9" fill={C.cyan}
                fontFamily="system-ui" fontWeight="600" textAnchor="middle">{c.label}</text>
            )}
          </g>
        );
      })}

      {/* Explanation */}
      <text x="330" y="180" fontSize="11" fill={C.body} fontFamily="system-ui" textAnchor="middle">
        The model learns that "it" most likely refers to "mat" (because it "was soft")
      </text>
      <text x="330" y="196" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">
        Not programmed — learned from billions of examples
      </text>
    </svg>
  );
}

function TemperatureViz() {
  const input = '"The best way to learn is"';
  const lowT = [
    { word: "by", pct: 45 }, { word: "to", pct: 28 }, { word: "through", pct: 15 },
    { word: "from", pct: 8 }, { word: "with", pct: 4 },
  ];
  const highT = [
    { word: "by", pct: 22 }, { word: "to", pct: 18 }, { word: "through", pct: 16 },
    { word: "from", pct: 14 }, { word: "failing", pct: 12 },
  ];
  const maxW = 100;

  return (
    <svg viewBox="0 0 660 220" style={{ width: "100%", maxWidth: 640 }}>
      {/* Low temp */}
      <text x="165" y="22" fontSize="11" fill={C.blue} fontFamily="system-ui" fontWeight="700" textAnchor="middle" letterSpacing="1">LOW TEMPERATURE</text>
      <text x="165" y="38" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">Focused, predictable</text>
      {lowT.map((t, i) => {
        const y = 54 + i * 26;
        return (
          <g key={i}>
            <text x="85" y={y + 14} fontSize="11" fill={C.body} fontFamily="system-ui" textAnchor="end">{t.word}</text>
            <rect x="95" y={y + 2} width={t.pct / 45 * maxW} height="16" rx="3" fill={i === 0 ? C.blue : C.blue + "40"} />
            <text x={102 + t.pct / 45 * maxW} y={y + 14} fontSize="10" fill={C.muted} fontFamily="system-ui">{t.pct}%</text>
          </g>
        );
      })}

      {/* Divider */}
      <line x1="330" y1="15" x2="330" y2="210" stroke={C.border} strokeWidth="1" strokeDasharray="4 4" />

      {/* High temp */}
      <text x="495" y="22" fontSize="11" fill={C.amber} fontFamily="system-ui" fontWeight="700" textAnchor="middle" letterSpacing="1">HIGH TEMPERATURE</text>
      <text x="495" y="38" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">Creative, surprising</text>
      {highT.map((t, i) => {
        const y = 54 + i * 26;
        return (
          <g key={i}>
            <text x="415" y={y + 14} fontSize="11" fill={C.body} fontFamily="system-ui" textAnchor="end">{t.word}</text>
            <rect x="425" y={y + 2} width={t.pct / 45 * maxW} height="16" rx="3" fill={i === 4 ? C.amber : C.amber + "50"} />
            <text x={432 + t.pct / 45 * maxW} y={y + 14} fontSize="10" fill={C.muted} fontFamily="system-ui">{t.pct}%</text>
          </g>
        );
      })}

      {/* Bottom label */}
      <text x="330" y="205" fontSize="11" fill={C.body} fontFamily="system-ui" textAnchor="middle" fontWeight="600">Same model, same input — one parameter changes the behavior</text>
    </svg>
  );
}

function MoEDiagram() {
  const experts = ["Expert A", "Expert B", "Expert C", "Expert D", "Expert E", "Expert F"];
  const activeIdx = [1, 4]; // which experts are active
  return (
    <svg viewBox="0 0 660 230" style={{ width: "100%", maxWidth: 640 }}>
      {/* Input */}
      <rect x="30" y="85" width="100" height="40" rx="8" fill="#f1f5f9" stroke={C.border} />
      <text x="80" y="108" fontSize="12" fill={C.text} fontFamily="system-ui" textAnchor="middle">Input token</text>

      {/* Arrow to router */}
      <line x1="135" y1="105" x2="175" y2="105" stroke={C.green} strokeWidth="1.5" />
      <polygon points="175,100 185,105 175,110" fill={C.green} />

      {/* Router */}
      <rect x="188" y="80" width="80" height="50" rx="10" fill={C.green} />
      <text x="228" y="102" fontSize="11" fill="#fff" fontFamily="system-ui" fontWeight="700" textAnchor="middle">Router</text>
      <text x="228" y="118" fontSize="9" fill="#bbf7d0" fontFamily="system-ui" textAnchor="middle">Picks 2 of 6</text>

      {/* Expert grid */}
      {experts.map((e, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 340 + col * 100;
        const y = 30 + row * 100;
        const active = activeIdx.includes(i);
        return (
          <g key={i}>
            <rect x={x} y={y} width="85" height="60" rx="8"
              fill={active ? C.green + "15" : "#f8fafc"}
              stroke={active ? C.green : C.border}
              strokeWidth={active ? 2 : 1} />
            <text x={x + 42} y={y + 28} fontSize="18" textAnchor="middle">{active ? "🔥" : "💤"}</text>
            <text x={x + 42} y={y + 48} fontSize="10" fill={active ? C.green : C.muted}
              fontFamily="system-ui" fontWeight={active ? 700 : 400} textAnchor="middle">{e}</text>
            {/* Arrow from router to active experts */}
            {active && (
              <g>
                <line x1="270" y1="105" x2={x} y2={y + 30} stroke={C.green} strokeWidth="1.5" />
                <polygon points={`${x - 4},${y + 27} ${x + 4},${y + 30} ${x - 4},${y + 33}`} fill={C.green} />
              </g>
            )}
          </g>
        );
      })}

      {/* Labels */}
      <text x="480" y="220" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">
        Huge total capacity — but fast, because only 2 experts run per token
      </text>
    </svg>
  );
}

function DistillationViz() {
  return (
    <svg viewBox="0 0 600 180" style={{ width: "100%", maxWidth: 560 }}>
      {/* Big model */}
      <rect x="40" y="30" width="160" height="120" rx="14" fill={C.green + "10"} stroke={C.green + "40"} strokeWidth="1.5" />
      <text x="120" y="70" fontSize="32" textAnchor="middle">🏋️</text>
      <text x="120" y="100" fontSize="13" fill={C.text} fontFamily="system-ui" fontWeight="700" textAnchor="middle">Large model</text>
      <text x="120" y="118" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">405B parameters</text>
      <text x="120" y="134" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">Runs on data center</text>

      {/* Arrow with label */}
      <line x1="210" y1="90" x2="340" y2="90" stroke={C.green} strokeWidth="2" />
      <polygon points="340,84 352,90 340,96" fill={C.green} />
      <text x="275" y="80" fontSize="10" fill={C.green} fontFamily="system-ui" fontWeight="600" textAnchor="middle">Knowledge</text>
      <text x="275" y="106" fontSize="10" fill={C.green} fontFamily="system-ui" fontWeight="600" textAnchor="middle">transfer</text>

      {/* Small model */}
      <rect x="360" y="50" width="120" height="80" rx="14" fill={C.green + "10"} stroke={C.green + "40"} strokeWidth="1.5" />
      <text x="420" y="80" fontSize="24" textAnchor="middle">📱</text>
      <text x="420" y="102" fontSize="13" fill={C.text} fontFamily="system-ui" fontWeight="700" textAnchor="middle">Small model</text>
      <text x="420" y="118" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">8B params · runs on phone</text>

      {/* Result */}
      <text x="300" y="172" fontSize="11" fill={C.body} fontFamily="system-ui" textAnchor="middle" fontWeight="600">
        80–90% of the performance at a fraction of the cost
      </text>
    </svg>
  );
}

function MultimodalViz() {
  return (
    <svg viewBox="0 0 680 260" style={{ width: "100%", maxWidth: 660 }}>
      {/* Text input */}
      <rect x="20" y="20" width="150" height="50" rx="8" fill="#dbeafe" stroke={C.blue + "40"} />
      <text x="95" y="40" fontSize="11" fill={C.blue} fontFamily="system-ui" fontWeight="700" textAnchor="middle">TEXT</text>
      <text x="95" y="58" fontSize="10" fill={C.body} fontFamily="system-ui" textAnchor="middle">"Describe this image"</text>

      {/* Image input - show grid of patches */}
      <rect x="20" y="90" width="150" height="80" rx="8" fill="#fef3c7" stroke={C.amber + "40"} />
      <text x="95" y="108" fontSize="11" fill={C.amber} fontFamily="system-ui" fontWeight="700" textAnchor="middle">IMAGE</text>
      {/* Patch grid */}
      {Array.from({ length: 12 }).map((_, i) => {
        const col = i % 4, row = Math.floor(i / 4);
        const colors = ["#fde68a", "#fbbf24", "#f59e0b", "#fcd34d", "#fef08a", "#fde68a",
          "#fbbf24", "#f59e0b", "#fcd34d", "#fef08a", "#fde68a", "#fbbf24"];
        return <rect key={i} x={40 + col * 28} y={118 + row * 18} width="24" height="14" rx="2" fill={colors[i]} opacity="0.7" />;
      })}

      {/* Audio input */}
      <rect x="20" y="190" width="150" height="50" rx="8" fill="#d1fae5" stroke={C.green + "40"} />
      <text x="95" y="210" fontSize="11" fill={C.green} fontFamily="system-ui" fontWeight="700" textAnchor="middle">AUDIO</text>
      {/* Waveform */}
      <path d="M 40 228 Q 50 218, 60 228 Q 70 238, 80 228 Q 90 218, 100 228 Q 110 238, 120 228 Q 130 218, 140 228" fill="none" stroke={C.green} strokeWidth="1.5" />

      {/* Arrows converging */}
      {[45, 130, 215].map((y, i) => (
        <g key={i}>
          <line x1="175" y1={y} x2="240" y2="140" stroke={C.border} strokeWidth="1.5" />
        </g>
      ))}

      {/* Tokenize box */}
      <rect x="240" y="110" width="80" height="60" rx="10" fill="#f1f5f9" stroke={C.border} strokeWidth="1.5" />
      <text x="280" y="136" fontSize="10" fill={C.body} fontFamily="system-ui" fontWeight="700" textAnchor="middle">All become</text>
      <text x="280" y="152" fontSize="10" fill={C.body} fontFamily="system-ui" fontWeight="700" textAnchor="middle">tokens</text>

      {/* Arrow to unified stream */}
      <line x1="325" y1="140" x2="365" y2="140" stroke={C.text} strokeWidth="2" />
      <polygon points="365,134 377,140 365,146" fill={C.text} />

      {/* Unified token stream */}
      <rect x="380" y="105" width="260" height="70" rx="12" fill="#f8fafc" stroke={C.border} />
      <text x="510" y="126" fontSize="10" fill={C.muted} fontFamily="system-ui" fontWeight="600" textAnchor="middle" letterSpacing="1">UNIFIED TOKEN STREAM</text>
      {/* Mixed token boxes */}
      {[
        { x: 392, color: "#dbeafe", label: "text" },
        { x: 427, color: "#dbeafe", label: "text" },
        { x: 462, color: "#fef3c7", label: "img" },
        { x: 497, color: "#fef3c7", label: "img" },
        { x: 532, color: "#fef3c7", label: "img" },
        { x: 567, color: "#fef3c7", label: "img" },
        { x: 602, color: "#d1fae5", label: "aud" },
      ].map((t, i) => (
        <rect key={i} x={t.x} y="136" width="30" height="28" rx="4" fill={t.color} stroke={C.border} />
      ))}

      {/* Label */}
      <text x="510" y="206" fontSize="11" fill={C.body} fontFamily="system-ui" textAnchor="middle" fontWeight="600">
        One architecture processes everything — not separate systems bolted together
      </text>

      {/* Arrow down to model */}
      <line x1="510" y1="180" x2="510" y2="216" stroke={C.text} strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="510" y="238" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">
        Same transformer, same attention mechanism
      </text>
    </svg>
  );
}

function AgentLoopViz() {
  return (
    <svg viewBox="0 0 680 260" style={{ width: "100%", maxWidth: 660 }}>
      {/* LLM core */}
      <circle cx="200" cy="130" r="55" fill={C.red + "08"} stroke={C.red} strokeWidth="2" />
      <text x="200" y="120" fontSize="13" fill={C.text} fontFamily="system-ui" fontWeight="700" textAnchor="middle">LLM</text>
      <text x="200" y="138" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">Reasoning</text>
      <text x="200" y="152" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">engine</text>

      {/* Think */}
      <rect x="145" y="10" width="110" height="40" rx="10" fill={C.red + "12"} stroke={C.red} strokeWidth="1.5" />
      <text x="200" y="35" fontSize="12" fill={C.red} fontFamily="system-ui" fontWeight="700" textAnchor="middle">🧠 Think</text>
      <line x1="200" y1="52" x2="200" y2="73" stroke={C.red} strokeWidth="1.5" />
      <polygon points="194,73 200,80 206,73" fill={C.red} />

      {/* Act */}
      <rect x="300" y="110" width="100" height="40" rx="10" fill={C.red + "12"} stroke={C.red} strokeWidth="1.5" />
      <text x="350" y="135" fontSize="12" fill={C.red} fontFamily="system-ui" fontWeight="700" textAnchor="middle">⚡ Act</text>
      <line x1="257" y1="130" x2="298" y2="130" stroke={C.red} strokeWidth="1.5" />
      <polygon points="298,124 305,130 298,136" fill={C.red} />

      {/* Observe */}
      <rect x="145" y="210" width="110" height="40" rx="10" fill={C.red + "12"} stroke={C.red} strokeWidth="1.5" />
      <text x="200" y="235" fontSize="12" fill={C.red} fontFamily="system-ui" fontWeight="700" textAnchor="middle">👁️ Observe</text>
      <line x1="200" y1="187" x2="200" y2="208" stroke={C.red} strokeWidth="1.5" />
      <polygon points="194,208 200,215 206,208" fill={C.red} />

      {/* Loop arrows */}
      <path d="M 350 152 C 350 220, 280 255, 258 240" fill="none" stroke={C.red + "50"} strokeWidth="1.5" />
      <polygon points="260,245 253,238 264,236" fill={C.red + "50"} />
      <path d="M 145 225 C 60 210, 50 50, 145 30" fill="none" stroke={C.red + "50"} strokeWidth="1.5" />
      <polygon points="143,25 150,18 152,32" fill={C.red + "50"} />

      {/* Tools panel */}
      <rect x="460" y="18" width="190" height="225" rx="12" fill="#fef2f2" stroke={C.red + "20"} />
      <text x="555" y="42" fontSize="11" fill={C.red} fontFamily="system-ui" fontWeight="700" textAnchor="middle" letterSpacing="1">TOOLS</text>
      {[
        { icon: "🔍", label: "Web search", desc: "Real-time information" },
        { icon: "💻", label: "Code execution", desc: "Run & test programs" },
        { icon: "📁", label: "File access", desc: "Read & write documents" },
        { icon: "🔌", label: "APIs", desc: "External services" },
        { icon: "💾", label: "Memory", desc: "Persistent knowledge" },
      ].map((t, i) => (
        <g key={i}>
          <text x="480" y={70 + i * 38} fontSize="15">{t.icon}</text>
          <text x="502" y={68 + i * 38} fontSize="11" fill={C.text} fontFamily="system-ui" fontWeight="600">{t.label}</text>
          <text x="502" y={82 + i * 38} fontSize="9" fill={C.muted} fontFamily="system-ui">{t.desc}</text>
        </g>
      ))}

      {/* Connection line */}
      <line x1="402" y1="130" x2="458" y2="130" stroke={C.red} strokeWidth="1.5" strokeDasharray="5 3" />
      <polygon points="455,125 462,130 455,135" fill={C.red} />
    </svg>
  );
}

function UsageSpectrum() {
  const levels = [
    { icon: "💬", label: "Chat", desc: "Type → response", ex: "Claude, ChatGPT" },
    { icon: "🔗", label: "Copilot", desc: "AI in your tools", ex: "M365 Copilot, GitHub" },
    { icon: "⚡", label: "Agent", desc: "Autonomous tasks", ex: "Claude Code, Cursor" },
    { icon: "🤖", label: "Multi-agent", desc: "AI teams", ex: "OpenClaw, CrewAI" },
    { icon: "🏗️", label: "Platform", desc: "AI infrastructure", ex: "Databricks, Azure AI" },
  ];
  return (
    <svg viewBox="0 0 680 230" style={{ width: "100%", maxWidth: 660 }}>
      {/* Gradient bar */}
      <defs>
        <linearGradient id="specGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.indigo + "20"} />
          <stop offset="100%" stopColor={C.indigo} />
        </linearGradient>
      </defs>
      <rect x="40" y="88" width="600" height="8" rx="4" fill="url(#specGrad)" />

      {/* Nodes */}
      {levels.map((l, i) => {
        const x = 65 + i * 140;
        return (
          <g key={i}>
            <circle cx={x} cy="92" r="22" fill="#fff" stroke={C.indigo} strokeWidth="2" />
            <text x={x} y="97" fontSize="18" textAnchor="middle">{l.icon}</text>
            <text x={x} y="132" fontSize="12" fill={C.text} fontFamily="system-ui" fontWeight="700" textAnchor="middle">{l.label}</text>
            <text x={x} y="148" fontSize="10" fill={C.body} fontFamily="system-ui" textAnchor="middle">{l.desc}</text>
            <text x={x} y="165" fontSize="9" fill={C.muted} fontFamily="system-ui" textAnchor="middle" fontStyle="italic">{l.ex}</text>
          </g>
        );
      })}

      {/* Axis labels */}
      <text x="40" y="42" fontSize="10" fill={C.muted} fontFamily="system-ui">Less setup</text>
      <text x="40" y="56" fontSize="10" fill={C.muted} fontFamily="system-ui">More human control</text>
      <text x="640" y="42" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="end">More setup</text>
      <text x="640" y="56" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="end">More AI autonomy</text>

      {/* Bottom note */}
      <text x="340" y="200" fontSize="11" fill={C.body} fontFamily="system-ui" textAnchor="middle" fontWeight="600">
        Most people are in the first two levels today
      </text>
      <text x="340" y="218" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">
        The industry is rapidly moving toward the middle
      </text>
    </svg>
  );
}

function CostBreakdown() {
  return (
    <svg viewBox="0 0 620 160" style={{ width: "100%", maxWidth: 580 }}>
      <text x="310" y="20" fontSize="11" fill={C.muted} fontFamily="system-ui" fontWeight="600" textAnchor="middle" letterSpacing="1">WHERE THE MONEY GOES</text>

      {/* Stacked bar */}
      <rect x="40" y="38" width="420" height="50" rx="8" fill={C.purple} />
      <text x="250" y="60" fontSize="13" fill="#fff" fontFamily="system-ui" fontWeight="700" textAnchor="middle">Pretraining</text>
      <text x="250" y="78" fontSize="11" fill="#e9d5ff" fontFamily="system-ui" textAnchor="middle">~90% · $100M–$1B+</text>

      <rect x="465" y="38" width="50" height="50" rx="8" fill="#a78bfa" />
      <text x="490" y="68" fontSize="9" fill="#fff" fontFamily="system-ui" fontWeight="700" textAnchor="middle">Mid</text>

      <rect x="520" y="38" width="35" height="50" rx="8" fill="#c4b5fd" />
      <text x="537" y="68" fontSize="8" fill="#fff" fontFamily="system-ui" fontWeight="700" textAnchor="middle">Post</text>

      {/* Annotations */}
      <line x1="250" y1="92" x2="250" y2="112" stroke={C.purple} strokeWidth="1" />
      <text x="250" y="126" fontSize="10" fill={C.body} fontFamily="system-ui" textAnchor="middle">1000s of GPUs, months of training</text>
      <text x="250" y="142" fontSize="10" fill={C.muted} fontFamily="system-ui" textAnchor="middle">This is why only ~5 companies build frontier models</text>

      <line x1="537" y1="92" x2="537" y2="112" stroke="#c4b5fd" strokeWidth="1" />
      <text x="537" y="126" fontSize="9" fill={C.body} fontFamily="system-ui" textAnchor="middle">Cheap compute</text>
      <text x="537" y="140" fontSize="9" fill={C.muted} fontFamily="system-ui" textAnchor="middle">Expensive humans</text>
    </svg>
  );
}

// ═══════════════════════════════════════
// SLIDES
// ═══════════════════════════════════════

function ToolSlide({ tools, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", width: "100%", maxWidth: 680, margin: "0 auto" }}>
      {tools.map((t, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", gap: "0.9rem",
          padding: "0.85rem 1rem", background: "#fff",
          borderRadius: 10, border: `1px solid ${C.border}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <span style={{ fontSize: "1.5rem", lineHeight: 1, flexShrink: 0, marginTop: "0.1rem" }}>{t.icon}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: C.text, fontFamily: "system-ui" }}>{t.name}</span>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: t.color || color, background: `${t.color || color}12`, padding: "0.15rem 0.55rem", borderRadius: 20, fontFamily: "system-ui" }}>{t.access}</span>
            </div>
            <p style={{ fontSize: "0.88rem", color: C.body, margin: "0.2rem 0 0", lineHeight: 1.5 }}>{t.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PersonalToolsGrid() {
  const tools = [
    { icon: "🤖", name: "Claude / ChatGPT / Gemini", access: "Free + ~$20/mo", desc: "The big three assistants. Claude for reasoning & long docs, ChatGPT for image gen & Python sandbox, Gemini for Google Workspace integration." },
    { icon: "📓", name: "NotebookLM", access: "Free — Google", desc: "Upload your own documents (PDFs, specs, papers) and ask questions. Only answers from what you uploaded — no hallucinations from outside." },
    { icon: "🔍", name: "Perplexity", access: "Free + Pro", desc: "AI-powered research with real-time web access and cited sources. Better than Google for questions needing synthesis across multiple sources." },
    { icon: "🖥️", name: "Ollama (Local Models)", access: "Free — runs on your laptop", desc: "Run Llama 3.3, Qwen, Phi-4 locally. Nothing leaves your machine — ideal for sensitive data. Gap to cloud models is shrinking fast." },
    { icon: "🛠️", name: "APIs (OpenAI / Anthropic)", access: "Pay-per-use, start free", desc: "Build your own tools and automate repetitive tasks. Most personal automation ideas can be prototyped in an afternoon." },
  ];
  return <ToolSlide tools={tools} color="#9333ea" />;
}

const slides = [
    section: "", color: C.blue,
    content: () => (
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: C.text, lineHeight: 1.1, marginBottom: "1rem" }}>
          How AI Actually Works
        </h1>
        <p style={{ fontSize: "1.15rem", color: C.muted, maxWidth: 480, margin: "0 auto" }}>LLMs, Agents, and What's Really Going On</p>
      </div>
    ),
    notes: "Opening slide. The goal: give everyone a real mental model of how AI works — not just what it does, but why it behaves the way it does. After this, you should be able to evaluate AI tools, understand their limitations, and make better decisions about when and how to use them.",
  },

  // ── PART 1: THE CORE IDEA ──
  { section: "Part 01 · The Core Idea", color: C.blue,
    content: () => (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem", color: C.muted, marginBottom: "1.5rem" }}>Everything starts with one simple idea:</p>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
          Predict the next word
        </div>
        <p style={{ fontSize: "1.05rem", color: C.muted, maxWidth: 460, margin: "1rem auto 0" }}>No database. No search engine. No knowledge base inside.<br/>Just: what word probably comes next?</p>
      </div>
    ),
    notes: "This is the single most important thing to understand. An LLM does exactly one thing: predict the next word. Every capability it has — writing, coding, reasoning, translation — emerges from doing this one thing at enormous scale. There are no separate modules for 'language' or 'logic.' It's all prediction.",
  },

  { section: "Part 01 · The Core Idea", color: C.blue,
    title: "But first: text becomes numbers",
    content: () => <TokenizationViz />,
    notes: "Before the model can do anything, text needs to become numbers — tokens. Each word or word-piece gets mapped to a number from a vocabulary of 50,000–200,000 tokens. The model never sees text. It sees sequences of integers. This is fundamental and also what enables multimodality later — because anything that can be turned into numbers can be processed.",
  },

  { section: "Part 01 · The Core Idea", color: C.blue,
    title: "The prediction loop",
    content: () => <PredictionLoop />,
    notes: "Walk through the diagram. You give the model a sequence. It runs a forward pass and outputs a probability for every possible next token. 'Paris' gets 42%, 'Lyon' gets 8%, etc. It picks one — with some controlled randomness — appends it to the sequence, and runs the whole thing again. One token at a time. This loop IS text generation. The model never plans ahead or sees the whole answer — it commits to each word before thinking about the next.",
  },

  { section: "Part 01 · The Core Idea", color: C.blue,
    title: "Why prediction creates intelligence",
    content: () => (
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ fontSize: "1.4rem", fontWeight: 700, color: C.text, textAlign: "center", marginBottom: "0.75rem", lineHeight: 1.3 }}>
          Predicting text well requires understanding<br/>the world that produced it
        </div>
        <p style={{ textAlign: "center", color: C.muted, fontSize: "0.95rem", marginBottom: "1.5rem" }}>These skills were never programmed in — they emerged from prediction at scale:</p>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
          {["Grammar", "Geography", "Logic", "Code", "Math", "Science", "Languages", "Common sense", "Creativity"].map((s, i) => (
            <span key={i} style={{ padding: "0.45rem 1rem", borderRadius: 8, fontSize: "0.9rem", background: C.blue + "10", color: C.blue, fontWeight: 600, fontFamily: "system-ui" }}>{s}</span>
          ))}
        </div>
      </div>
    ),
    notes: "This is the remarkable part. To predict 'The capital of France is...' you need geography. To predict the next line of code, you need programming logic. To predict dialogue, you need theory of mind. Nobody taught the model these things explicitly — they emerged because knowing them helps predict text better. The knowledge is a side effect of prediction. This is genuinely surprising and is why prediction at scale produces something that looks like intelligence.",
  },

  { section: "Part 01 · The Core Idea", color: C.blue,
    title: "Same root cause, different outcomes",
    content: () => (
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center", maxWidth: 560, margin: "0 auto" }}>
        <div style={{ flex: "1 1 220px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.green, marginBottom: "0.75rem", fontFamily: "system-ui" }}>✓ Strengths</div>
          {["Fluent natural language", "Broad knowledge", "Reasoning chains", "Code generation", "Creative writing", "Multi-language"].map((s, i) => (
            <div key={i} style={{ padding: "0.45rem 0", fontSize: "0.95rem", color: C.body, borderBottom: `1px solid ${C.border}` }}>{s}</div>
          ))}
        </div>
        <div style={{ flex: "1 1 220px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.red, marginBottom: "0.75rem", fontFamily: "system-ui" }}>✗ Weaknesses</div>
          {["Hallucination", "No live knowledge", "Can't take actions", "No persistent memory", "Bad at precise math", "Doesn't know what it doesn't know"].map((s, i) => (
            <div key={i} style={{ padding: "0.45rem 0", fontSize: "0.95rem", color: C.body, borderBottom: `1px solid ${C.border}` }}>{s}</div>
          ))}
        </div>
        <p style={{ width: "100%", textAlign: "center", fontSize: "0.9rem", color: C.muted, fontStyle: "italic", marginTop: "0.5rem" }}>
          Optimized to produce <strong>likely</strong> text, not <strong>verified</strong> text
        </p>
      </div>
    ),
    notes: "Both columns come from the same thing. It produces text that sounds right — that's the strength (fluency, creativity). It produces text that sounds right even when it's wrong — that's the weakness (hallucination). It has no mechanism to verify truth, only to assess likelihood. Once you understand this, you understand exactly when to trust it and when to verify.",
  },

  // ── PART 2: HOW IT GETS BUILT ──
  { section: "Part 02 · How It Gets Built", color: C.purple,
    content: () => (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>Three phases of training</div>
        <p style={{ fontSize: "1.05rem", color: C.muted, maxWidth: 480, margin: "0 auto" }}>Each phase shapes what the model becomes — and the cost distribution is dramatic.</p>
      </div>
    ),
    notes: "Understanding training is key to understanding behavior. There are three main phases with very different purposes and costs. The cost distribution surprised most people: almost everything goes into phase one.",
  },

  { section: "Part 02 · How It Gets Built", color: C.purple,
    title: "Where the money goes",
    content: () => <CostBreakdown />,
    notes: "Look at the proportions. Pretraining is 90%+ of the total cost — hundreds of millions to over a billion dollars. Tens of thousands of GPUs running for months. This is why only about five companies in the world can build frontier models from scratch: Anthropic, OpenAI, Google, Meta, and a few others. Everything after pretraining is refinement — important refinement, but much cheaper in compute. This is also why there's a huge ecosystem of companies fine-tuning and building on top of existing models rather than training their own.",
  },

  { section: "Part 02 · How It Gets Built", color: C.purple,
    title: "Pretraining: how the model learns",
    content: () => <GradientDescentViz />,
    notes: "The model starts with completely random weights — billions of numbers, all random. Then you feed it trillions of tokens and it tries to predict the next one. Each time it's wrong, you measure the error and nudge all the weights slightly in the direction that would have been more correct. This is gradient descent — like a ball rolling downhill on a complex landscape, finding its way to lower and lower error. After billions of steps, the model has found a configuration of weights that predicts text remarkably well. What's amazing is what emerges: grammar, facts, reasoning, code — all as side effects of minimizing prediction error.",
  },

  { section: "Part 02 · How It Gets Built", color: C.purple,
    title: "Post-training: making it useful",
    content: () => <RLHFPipeline />,
    notes: "The raw pretrained model just completes text — it doesn't have conversations. Post-training fixes this in three steps. First, supervised fine-tuning: humans demonstrate ideal assistant behavior. Then reward modeling: train a separate model to judge response quality on helpfulness, accuracy, and safety. Finally, reinforcement learning: optimize the LLM to produce responses that score well. This is where the model becomes a helpful, safe assistant. Cheap in compute — maybe 1-5% of pretraining — but expensive in human expertise. Alignment researchers, red-teamers, policy experts.",
  },

  // ── PART 3: WHAT'S HAPPENING INSIDE ──
  { section: "Part 03 · What's Happening Inside", color: C.cyan,
    title: "Attention: how context shapes meaning",
    content: () => <AttentionViz />,
    notes: "This is the core mechanism inside the transformer. For every word, the model asks: which other words in this sequence matter for understanding me? It computes attention scores — connections of varying strength between all pairs of words. Here, 'it' needs to figure out what it refers to. The attention mechanism learns that 'mat' connects strongly because of 'soft' — mats can be soft, cats can be soft, but in context 'was soft' more likely describes the mat you sit on. Nobody programmed this rule. The model learned it from seeing billions of examples where context determined meaning.",
  },

  { section: "Part 03 · What's Happening Inside", color: C.cyan,
    title: "Temperature: same model, different behavior",
    content: () => <TemperatureViz />,
    notes: "This is a practical detail worth understanding. Temperature controls how the model samples from its probability distribution. Low temperature: it sticks to the highest-probability words. You get focused, predictable, deterministic output. Good for factual questions and code. High temperature: it lets less likely words through. You get creative, surprising, sometimes wild output. Good for brainstorming and creative writing. Same model, same input — one parameter changes the behavior entirely. This is why you sometimes get different answers to the same question.",
  },

  // ── PART 4: MAKING IT SMARTER ──
  { section: "Part 04 · Making It Smarter", color: C.green,
    title: "Mixture of Experts: be big but stay fast",
    content: () => <MoEDiagram />,
    notes: "The early approach was: make the model bigger. But cost scales brutally — 10x compute for 2x improvement. Mixture of Experts is one of the clever alternatives. Instead of one giant network, split it into specialist sub-networks with a router. Each token gets sent to only 2-3 relevant experts out of many. Result: massive total knowledge capacity, but fast inference because only a fraction activates per query. Think of it like a hospital — it has specialists for everything, but you only see the ones relevant to your problem. Most frontier models now use this.",
  },

  { section: "Part 04 · Making It Smarter", color: C.green,
    title: "Distillation: big knowledge, small package",
    content: () => <DistillationViz />,
    notes: "Another key technique. Train a small model to mimic a large model's outputs — not from raw data, but from the large model's behavior. The small model learns from the big model's 'teaching.' You get 80-90% of the performance at a fraction of the size and cost. This is how you get AI on phones and edge devices. And test-time compute goes the other direction — instead of making the model bigger at training time, let it think longer at inference time. Step-by-step reasoning, extended thinking. A smaller model that thinks carefully can match a larger model that answers immediately.",
  },

  // ── PART 5: MULTIMODALITY ──
  { section: "Part 05 · Multimodality", color: C.amber,
    title: "Everything becomes tokens",
    content: () => <MultimodalViz />,
    notes: "This is elegant. Text becomes tokens. Images get chopped into patches — each patch becomes a token. Audio waveforms become tokens. Once everything is tokens, they flow through the exact same transformer architecture. There aren't separate vision and language systems bolted together. It's one unified system processing a mixed stream of tokens from different sources. This is why you can show it a photo and ask about it — image and text tokens sit side by side and the attention mechanism learns relationships between them naturally. Some models can also generate across modalities — outputting images or speech, not just text.",
  },

  // ── PART 6: AGENTS ──
  { section: "Part 06 · Agents", color: C.red,
    title: "A brain needs a body",
    content: () => <AgentLoopViz />,
    notes: "An LLM alone is a brain in a jar. Smart, but can't see, act, or remember. An agent wraps it with tools, memory, and a planning loop. The core cycle: Think — what needs to be done? Act — call a tool (search, run code, read files, call APIs). Observe — look at the result. Then loop back and think about what's next. The tools panel shows what agents can access: web search for real-time information, code execution, file operations, external APIs, and persistent memory. This is how Claude searches the web, writes and runs code, creates documents. It's not magic — it's a loop of reasoning and tool use.",
  },

  { section: "Part 06 · Agents", color: C.red,
    title: "The core insight",
    content: () => (
      <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: "1.5rem" }}>
          The LLM provides reasoning.<br/>The agent framework provides capability.
        </div>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", padding: "1rem", background: "#fef2f2", borderRadius: 10 }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>🧠</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.text }}>Without agent framework</div>
            <div style={{ fontSize: "0.85rem", color: C.muted, marginTop: "0.25rem" }}>Smart but can't do anything</div>
          </div>
          <div style={{ flex: "1 1 200px", padding: "1rem", background: "#f0fdf4", borderRadius: 10 }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>🤖</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.text }}>With agent framework</div>
            <div style={{ fontSize: "0.85rem", color: C.muted, marginTop: "0.25rem" }}>Smart and can act in the world</div>
          </div>
        </div>
        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: C.muted, fontStyle: "italic" }}>
          Progress in AI right now is as much about better agent frameworks<br/>as it is about better base models
        </p>
      </div>
    ),
    notes: "Neither the LLM nor the framework is useful alone. The model provides intelligence. The agent framework — tools, memory, planning — provides the ability to apply that intelligence to real tasks. This is an important point for evaluating AI products: it's not just about which model is 'smartest.' The quality of the agent framework, the tools available, the memory system, the orchestration — all of these matter as much as the base model quality. And multi-agent systems take this further: multiple specialized agents collaborating, each with different tools and instructions.",
  },

  // ── PART 7: HOW IT GETS USED ──
  { section: "Part 07 · How It Gets Used", color: C.indigo,
    title: "A spectrum of autonomy",
    content: () => <UsageSpectrum />,
    notes: "There's a clear spectrum. Chat: you type, it responds. Copilot: AI embedded in tools you already use — M365, GitHub. Agent: autonomous task execution — Claude Code, Cursor. Multi-agent: teams of AI collaborating on complex workflows. Platform: AI embedded in business infrastructure — Databricks, Azure AI. Each step right adds autonomy and capability but requires more setup, trust, and design. Most people and organizations are in the first two levels today. The industry is rapidly moving toward the middle. The right level depends entirely on the task, stakes, and how much you need to verify outputs.",
  },

  // ── PART 8: AUTOSTORE TOOLS ──
  { section: "Part 08 · AutoStore Tools", color: "#0284c7",
    content: () => (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>What you have access to today</div>
        <p style={{ fontSize: "1.05rem", color: C.muted, maxWidth: 480, margin: "0 auto" }}>Five tools available to AutoStore employees — from everyone's desktop to the data platform. You don't need to wait for permission to start.</p>
      </div>
    ),
    notes: "Section intro. These are the tools that are either already in your existing licenses or available to request. The goal here isn't a deep tutorial — it's to make sure everyone knows what exists and where to start. M365 Copilot is for everyone. GitHub Copilot and Cursor are for developers. Databricks Genie and Azure AI Foundry are for data and engineering teams.",
  },

  { section: "Part 08 · AutoStore Tools", color: "#0284c7",
    title: "Microsoft 365 Copilot — for everyone",
    content: () => (
      <ToolSlide color="#0284c7" tools={[
        { icon: "📝", name: "Word & PowerPoint", access: "Draft + rewrite", desc: "Draft documents from bullet points. Summarize long reports. Rewrite in different tones. Generate slides from your notes." },
        { icon: "📊", name: "Excel", access: "Data in plain language", desc: "\"Show me the trend for Q4 by region\" — no formulas needed. Analyses data and explains patterns conversationally." },
        { icon: "📧", name: "Outlook", access: "Email triage", desc: "Summarize long threads. Draft replies. Surface action items from conversations you've been CC'd on." },
        { icon: "🎙️", name: "Teams", access: "Meeting intelligence", desc: "Real-time transcription, auto-summaries, action items. Ask Copilot to summarize any meeting you missed." },
        { icon: "🔎", name: "Copilot Chat", access: "Semantic search", desc: "Search across all your files, emails, and meetings in one place. Ask 'What did we decide about X last month?'" },
      ]} />
    ),
    notes: "M365 Copilot is the lowest-friction starting point for anyone in the company. It lives in tools you already use. The highest-ROI feature for most people is Teams meeting summaries — you get the transcript, key decisions, and action items for any meeting you attended or missed. The second most useful feature is Copilot Chat's semantic search — you can ask questions across your entire Microsoft 365 workspace.",
  },

  { section: "Part 08 · AutoStore Tools", color: "#7c3aed",
    title: "GitHub Copilot + Cursor — for developers",
    content: () => (
      <ToolSlide color="#7c3aed" tools={[
        { icon: "⌨️", name: "GitHub Copilot", access: "In your existing editor", desc: "Inline code completions, chat grounded in your codebase, test generation, PR descriptions. Plugs into VS Code, JetBrains, Neovim.", color: "#7c3aed" },
        { icon: "🖱️", name: "Cursor — Inline (cmd+K)", access: "AI-native editor", desc: "Select any code and describe the change you want. Rewrites the selection based on your instruction.", color: "#059669" },
        { icon: "🤖", name: "Cursor — Composer (cmd+I)", access: "Multi-file edits", desc: "Describe a change at a high level — 'add input validation to the checkout flow.' It plans which files to touch and edits them all.", color: "#059669" },
        { icon: "🔗", name: "Cursor — Agent Mode", access: "Full task execution", desc: "Give it a task, let it run. Reads files, writes code, runs commands, checks errors, iterates. Agentic behavior in the editor.", color: "#059669" },
      ]} />
    ),
    notes: "Both tools are for developers but they sit at different points on the autonomy spectrum. GitHub Copilot is integrated into your existing editor and great for line-by-line assistance and code chat. Cursor is an AI-native editor (built on VS Code, so familiar) with much deeper project context — it can understand and edit across your entire codebase, not just the current file. Cursor's Composer mode is the big differentiator: describe a change at a high level, it figures out all the files to touch. Great for refactors that would normally require understanding multiple interdependencies.",
  },

  { section: "Part 08 · AutoStore Tools", color: "#d97706",
    title: "Databricks + Azure AI Foundry — data & platform",
    content: () => (
      <ToolSlide color="#d97706" tools={[
        { icon: "💬", name: "Databricks Genie", access: "Natural language SQL", desc: "Ask questions about company data in plain English — 'What were our top 10 customers last quarter?' Genie writes and runs the SQL for you.", color: "#d97706" },
        { icon: "📈", name: "Databricks AI/BI", access: "Smart dashboards", desc: "Business intelligence dashboards where users can ask follow-up questions in natural language. No SQL needed to explore.", color: "#d97706" },
        { icon: "🧪", name: "Azure AI Foundry — Playground", access: "Model experimentation", desc: "Compare different AI models side by side on your actual prompts before committing to a build. Fastest way to evaluate models.", color: "#dc2626" },
        { icon: "🏗️", name: "Azure AI Foundry — RAG & Deploy", access: "Production AI", desc: "Connect AI to your internal documents. Build, fine-tune, and deploy AI endpoints with enterprise security and governance.", color: "#dc2626" },
      ]} />
    ),
    notes: "Two tools for more technical users. Databricks Genie is designed specifically for business users who aren't SQL experts — it removes the barrier between a question and an answer by generating the query itself. If you've ever asked a data analyst for a number, Genie is worth trying. Azure AI Foundry is the enterprise platform for building AI solutions — start with the playground to compare models on your actual use case, then use the RAG pipeline builder to connect AI to internal documents.",
  },

  // ── PART 9: GOING FURTHER ──
  { section: "Part 09 · Going Further", color: "#9333ea",
    content: () => (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>What you can explore on your own</div>
        <p style={{ fontSize: "1.05rem", color: C.muted, maxWidth: 480, margin: "0 auto" }}>A rich ecosystem of AI tools is freely available outside company tools. Using them is how you build the intuition to evaluate AI professionally.</p>
      </div>
    ),
    notes: "This section is about the broader ecosystem beyond company-provided tools. The key message: you don't need to wait for official rollouts to start building intuition. All of these are available today, most for free or very low cost. The best calibration comes from using AI on tasks you know well — that's how you develop an accurate mental model of where it helps and where it makes mistakes.",
  },

  { section: "Part 09 · Going Further", color: "#9333ea",
    title: "The big assistants — free tiers are genuinely useful",
    content: () => (
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "1.5rem" }}>
          {[
            { icon: "🤖", name: "Claude", url: "claude.ai", color: "#d97706", tagline: "Reasoning, long docs, structured writing", best: "Best for: analysis, research, drafting, code explanation" },
            { icon: "💬", name: "ChatGPT", url: "chatgpt.com", color: "#059669", tagline: "Image generation, web browsing, Python sandbox", best: "Best for: multimodal tasks, data analysis, general use" },
            { icon: "✨", name: "Gemini", url: "gemini.google.com", color: "#0891b2", tagline: "Google Workspace integration, Deep Research", best: "Best for: research briefs, Gmail/Docs integration" },
          ].map((t, i) => (
            <div key={i} style={{ flex: "1 1 170px", padding: "1rem", background: `${t.color}08`, borderRadius: 10, border: `1px solid ${t.color}20`, textAlign: "center" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.3rem" }}>{t.icon}</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: C.text, fontFamily: "system-ui" }}>{t.name}</div>
              <div style={{ fontSize: "0.75rem", color: t.color, fontFamily: "system-ui", fontWeight: 600, marginBottom: "0.4rem" }}>{t.url}</div>
              <div style={{ fontSize: "0.82rem", color: C.muted, lineHeight: 1.4 }}>{t.best}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: "0.88rem", color: C.muted, fontStyle: "italic" }}>
          All have free tiers. Paid tiers (~$20/mo) unlock significantly more capable models and advanced features.<br/>
          If you use AI regularly for work, a personal subscription typically pays for itself quickly.
        </p>
      </div>
    ),
    notes: "These are the three main general-purpose assistants. The free tiers are genuinely useful — you can do a lot before hitting the limits. The paid tiers (~$20/month) are worth it if you use them regularly for real work tasks. Each has a different strength: Claude is strong at reasoning and long documents; ChatGPT's Advanced Data Analysis can upload a CSV and run Python analysis without any coding; Gemini Deep Research can run multi-step web research automatically. It's worth trying all three on the same task to see how they differ.",
  },

  { section: "Part 09 · Going Further", color: "#9333ea",
    title: "Research tools and local models",
    content: () => <PersonalToolsGrid />,
    notes: "Four more tools worth knowing. NotebookLM is uniquely useful for document-heavy work — you upload your own sources and it only answers from those, so no hallucinations from outside. Great for processing specs, research papers, and technical docs. Perplexity is the best AI search tool — every answer has clickable source citations, which is important when accuracy matters. Ollama is for the technically curious — you can run capable open-source models entirely on your own laptop in a single command. APIs are for anyone who wants to automate a repetitive task or build a personal tool — start with a few free credits and most ideas can be prototyped in an afternoon.",
  },

  { section: "Part 09 · Going Further", color: "#9333ea",
    title: "How to build your own intuition",
    content: () => (
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {[
            { step: "01", title: "Use it on tasks you know well", desc: "When you can judge the quality of the output, you can calibrate where it helps and where it makes mistakes." },
            { step: "02", title: "Try the same task in two models", desc: "The differences reveal each model's strengths and weaknesses better than any benchmark." },
            { step: "03", title: "Ask it to explain its reasoning", desc: "Not just for the answer — understanding why it produced that output tells you whether to trust it." },
            { step: "04", title: "Notice the failure patterns", desc: "Hallucination, overconfidence, missing context. Once you know the failure modes, you know when to verify." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9333ea", fontFamily: "system-ui", flexShrink: 0, paddingTop: "0.2rem", letterSpacing: "0.05em" }}>{s.step}</span>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: C.text, fontFamily: "system-ui" }}>{s.title}</div>
                <div style={{ fontSize: "0.88rem", color: C.body, marginTop: "0.1rem", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: "The meta-point of this whole section. The gap between 'someone who uses AI' and 'someone who uses AI well' is mostly this calibration — an accurate mental model of what it can and can't do. It's surprisingly fast to develop: use it on tasks you know, encounter the errors, understand why. That feedback loop — use, notice failure, understand the mechanism — is what turns novelty into a genuine skill. The people who benefit most from AI aren't always the ones using the most advanced tools. They're the ones with the most accurate model of what the tool is good at.",
  },

  // ── CLOSING ──
  { section: "", color: C.blue,
    content: () => (
      <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700, color: C.text, lineHeight: 1.25, marginBottom: "1.5rem" }}>
          Understanding how it works<br/>is what lets you use it well
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 400, margin: "0 auto", textAlign: "left" }}>
          {[
            "It's a prediction machine — powerful but not infallible",
            "Training shapes behavior — phase by phase",
            "Agents add capability — tools, memory, planning",
            "AutoStore has tools ready to use today",
            "The broader ecosystem is available to explore now",
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <span style={{ color: C.blue, fontWeight: 700, fontSize: "0.9rem", fontFamily: "system-ui", flexShrink: 0 }}>→</span>
              <span style={{ fontSize: "0.95rem", color: C.body }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: "Wrap up with the key takeaways across all sections. The goal was to give everyone a real mental model — not just 'here are some tools,' but a genuine understanding of why AI behaves the way it does, what tools are available now, and what you can explore on your own. The practical action items: try Copilot in your next Teams meeting, start a conversation in Claude or ChatGPT on a task you know well, and notice where the output is good and where it isn't. That calibration is the skill.",
  },
];

// ═══════════════════════════════════════
// PRESENTATION SHELL
// ═══════════════════════════════════════

export default function App() {
  const [current, setCurrent] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const total = slides.length;

  const goNext = useCallback(() => setCurrent(s => Math.min(s + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setCurrent(s => Math.max(s - 1, 0)), []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const slide = slides[current];
  const Content = slide.content;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bg, fontFamily: "'Charter', 'Georgia', serif", userSelect: "none", overflow: "hidden" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 1.25rem", borderBottom: `1px solid ${C.border}`, background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {slide.section && <span style={{ fontSize: "0.72rem", fontWeight: 700, color: slide.color, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "system-ui" }}>{slide.section}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button onClick={() => setShowNotes(!showNotes)} style={{
            padding: "0.25rem 0.6rem", borderRadius: 5, border: `1px solid ${C.border}`,
            background: showNotes ? C.text : "#fff", color: showNotes ? "#fff" : C.muted,
            fontSize: "0.72rem", cursor: "pointer", fontFamily: "system-ui", fontWeight: 600,
          }}>Notes</button>
          <span style={{ fontSize: "0.75rem", color: C.muted, fontFamily: "system-ui" }}>{current + 1} / {total}</span>
        </div>
      </div>

      {/* Slide title */}
      {slide.title && (
        <div style={{ padding: "0.6rem 1.5rem 0", flexShrink: 0 }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: C.text, margin: 0, letterSpacing: "-0.01em" }}>{slide.title}</h2>
        </div>
      )}

      {/* Slide content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0.75rem 1.25rem", minHeight: 0, overflow: "auto" }}
        onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); if (e.clientX > rect.left + rect.width / 2) goNext(); else goPrev(); }}>
        <div style={{ width: "100%", maxWidth: 720 }}><Content /></div>
      </div>

      {/* Speaker notes */}
      {showNotes && slide.notes && (
        <div style={{ flexShrink: 0, maxHeight: "25vh", overflowY: "auto", borderTop: `1px solid ${C.border}`, background: "#fff", padding: "0.75rem 1.25rem" }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.muted, marginBottom: "0.3rem", fontFamily: "system-ui" }}>Speaker Notes</div>
          <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: C.body, margin: 0 }}>{slide.notes}</p>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 1.25rem", borderTop: `1px solid ${C.border}`, background: "#fff", flexShrink: 0 }}>
        <button onClick={goPrev} disabled={current === 0} style={{
          padding: "0.3rem 0.8rem", border: `1px solid ${C.border}`, borderRadius: 5,
          background: "#fff", cursor: current === 0 ? "default" : "pointer",
          opacity: current === 0 ? 0.3 : 1, fontSize: "0.8rem", color: C.body, fontFamily: "system-ui",
        }}>←</button>
        <div style={{ flex: 1, margin: "0 1rem", height: 3, background: C.border, borderRadius: 2, overflow: "hidden" }}>
          <div style={{ width: `${((current + 1) / total) * 100}%`, height: "100%", background: slide.color, borderRadius: 2, transition: "width 0.3s ease" }} />
        </div>
        <button onClick={goNext} disabled={current === total - 1} style={{
          padding: "0.3rem 0.8rem", border: `1px solid ${C.border}`, borderRadius: 5,
          background: "#fff", cursor: current === total - 1 ? "default" : "pointer",
          opacity: current === total - 1 ? 0.3 : 1, fontSize: "0.8rem", color: C.body, fontFamily: "system-ui",
        }}>→</button>
      </div>
    </div>
  );
}
