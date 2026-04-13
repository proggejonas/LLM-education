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
// PROMPTING COMPONENTS
// ═══════════════════════════════════════

function PromptComparison({ bad, good }) {
  return (
    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", justifyContent: "center", maxWidth: 680, margin: "0 auto" }}>
      {[
        { label: "Vague prompt", color: C.red, icon: "❌", ...bad },
        { label: "Structured prompt", color: C.green, icon: "✅", ...good },
      ].map((side, i) => (
        <div key={i} style={{ flex: "1 1 280px", maxWidth: 320 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: side.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem", fontFamily: "system-ui" }}>
            {side.icon} {side.label}
          </div>
          <div style={{ padding: "0.75rem", background: side.color + "08", border: `1px solid ${side.color}25`, borderRadius: 8, marginBottom: "0.5rem" }}>
            <div style={{ fontSize: "0.85rem", color: C.text, fontFamily: "'SF Mono', 'Consolas', monospace", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{side.prompt}</div>
          </div>
          <div style={{ padding: "0.75rem", background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 8, borderLeft: `3px solid ${side.color}` }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: C.muted, marginBottom: "0.3rem", fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: "0.05em" }}>TYPICAL OUTPUT</div>
            <div style={{ fontSize: "0.82rem", color: C.body, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{side.output}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PromptFramework() {
  const elements = [
    { icon: "🎯", label: "Goal", desc: "What do you want to achieve?", example: "Write an executive summary for the board", color: C.blue },
    { icon: "📋", label: "Context", desc: "What should the AI know?", example: "Q3 revenue was \u20ac42M vs \u20ac45M target\u2026", color: C.purple },
    { icon: "🔒", label: "Constraints", desc: "What are the boundaries?", example: "Max 1 page. Formal tone. No jargon.", color: C.amber },
    { icon: "📐", label: "Format", desc: "What should the output look like?", example: "3 sections: Results, Risks, Actions", color: C.green },
  ];
  return (
    <div style={{ maxWidth: 580, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {elements.map((e, i) => (
          <div key={i} style={{ padding: "1rem", background: e.color + "08", border: `1px solid ${e.color}20`, borderRadius: 10 }}>
            <div style={{ fontSize: "1.3rem", marginBottom: "0.25rem" }}>{e.icon}</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: C.text, fontFamily: "system-ui" }}>{e.label}</div>
            <div style={{ fontSize: "0.82rem", color: C.muted, marginBottom: "0.4rem" }}>{e.desc}</div>
            <div style={{ fontSize: "0.78rem", color: e.color, fontFamily: "'SF Mono', monospace", fontStyle: "italic" }}>{e.example}</div>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: "0.85rem", color: C.muted, marginTop: "1rem", fontStyle: "italic" }}>
        The more of these you provide, the less the model has to guess
      </p>
    </div>
  );
}

function ConversationFlow({ messages }) {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {messages.map((m, i) => (
        <div key={i} style={{
          alignSelf: m.from === "user" ? "flex-end" : "flex-start",
          maxWidth: "88%",
          padding: "0.65rem 0.9rem",
          borderRadius: m.from === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
          background: m.from === "user" ? C.blue + "12" : "#f1f5f9",
          border: `1px solid ${m.from === "user" ? C.blue + "25" : C.border}`,
        }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 700, color: m.from === "user" ? C.blue : C.green, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.2rem", fontFamily: "system-ui" }}>
            {m.from === "user" ? "You" : "AI"}
          </div>
          <div style={{ fontSize: "0.85rem", color: C.body, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.text}</div>
        </div>
      ))}
    </div>
  );
}

function PromptAntiPatterns() {
  const patterns = [
    { prompt: "Make it better", why: "Better how? Shorter? More formal? More detailed? More creative?", icon: "\uD83E\uDD37" },
    { prompt: "Write something about AI", why: "For whom? How long? What angle? Blog post or board memo?", icon: "\uD83C\uDF0A" },
    { prompt: "Fix this", why: "[attaches 500 lines of code with no error description]", icon: "\uD83D\uDD25" },
    { prompt: "Be more creative", why: "The AI equivalent of 'draw the rest of the owl'", icon: "\uD83E\uDD89" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", maxWidth: 580, margin: "0 auto" }}>
      {patterns.map((p, i) => (
        <div key={i} style={{ padding: "0.85rem", background: C.red + "06", border: `1px solid ${C.red}18`, borderRadius: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "1.2rem" }}>{p.icon}</span>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: C.text, fontFamily: "'SF Mono', monospace" }}>{`"${p.prompt}"`}</span>
          </div>
          <div style={{ fontSize: "0.8rem", color: C.muted, lineHeight: 1.4 }}>{p.why}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// ACT 1-3 COMPONENTS
// ═══════════════════════════════════════

function EmergenceViz() {
  const examples = [
    { prompt: "The patient presents with a 3cm lesion on the anterior\u2026", skill: "Medical knowledge", color: C.blue },
    { prompt: "function calculateTax(income, rate) { return income *\u2026", skill: "Programming logic", color: C.purple },
    { prompt: "La capital de Francia es\u2026", skill: "Spanish + Geography", color: C.green },
    { prompt: "If all roses are flowers and some flowers fade quickly, then\u2026", skill: "Logical reasoning", color: C.amber },
  ];
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {examples.map((e, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.8rem", background: e.color + "06", border: `1px solid ${e.color}15`, borderRadius: 10 }}>
            <div style={{ flex: 1, fontSize: "0.82rem", color: C.body, fontFamily: "'SF Mono', 'Consolas', monospace", lineHeight: 1.4 }}>{e.prompt}</div>
            <span style={{ color: C.muted, fontSize: "0.9rem" }}>{"\u2192"}</span>
            <div style={{ flexShrink: 0, padding: "0.3rem 0.7rem", background: e.color + "12", borderRadius: 6, fontSize: "0.82rem", fontWeight: 700, color: e.color, fontFamily: "system-ui" }}>{e.skill}</div>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: "0.9rem", color: C.muted, fontStyle: "italic", marginTop: "1rem" }}>
        Nobody taught it these things. It learned them because they help it predict.
      </p>
    </div>
  );
}

function DiamondStages() {
  const stages = [
    { icon: "\uD83D\uDC8E", title: "Raw", subtitle: "Pre-training", desc: "Show it the internet. Trillions of tokens. Understanding emerges from prediction.", cost: "$1B+", color: C.purple },
    { icon: "\u2702\uFE0F", title: "Cut", subtitle: "Mid-training", desc: "Fine-tune for skills: instructions, reasoning, coding.", cost: "$10\u2013100M", color: C.blue },
    { icon: "\u2728", title: "Polish", subtitle: "Post-training", desc: "Humans rate responses. It learns to be helpful and safe.", cost: "$1\u201310M", color: C.green },
  ];
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: "0.4rem", flexWrap: "wrap" }}>
        {stages.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ flex: "0 1 170px", textAlign: "center", padding: "0.8rem 0.5rem", background: s.color + "06", borderRadius: 12, border: `1px solid ${s.color}15` }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{s.icon}</div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, color: C.text }}>{s.title}</div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "system-ui", marginBottom: "0.3rem" }}>{s.subtitle}</div>
              <div style={{ fontSize: "0.78rem", color: C.body, lineHeight: 1.4, marginBottom: "0.2rem" }}>{s.desc}</div>
              <div style={{ fontSize: "0.72rem", color: C.muted, fontFamily: "system-ui" }}>{s.cost}</div>
            </div>
            {i < 2 && <div style={{ fontSize: "1.3rem", color: C.muted, flexShrink: 0, padding: "0 0.15rem", alignSelf: "center" }}>{"\u2192"}</div>}
          </React.Fragment>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: "0.82rem", color: C.muted, marginTop: "1rem", fontStyle: "italic" }}>
        Only ~5 companies can afford to start from raw. Everyone else refines existing diamonds.
      </p>
    </div>
  );
}

function SmartestPersonViz() {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{ flex: "1 1 240px", maxWidth: 270 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem", fontFamily: "system-ui" }}>{"\u274C"} What most people ask</div>
          {[
            { q: "How much is 12\u00d77?", why: "A calculator is faster" },
            { q: "Tell me a joke", why: "Fine, but not why it exists" },
            { q: "Summarize this page", why: "OK, but barely scratching the surface" },
            { q: "What is the weather?", why: "Google is better at this" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "0.4rem 0.5rem", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ fontSize: "0.85rem", color: C.body, fontFamily: "'SF Mono', monospace" }}>{`"${s.q}"`}</div>
              <div style={{ fontSize: "0.72rem", color: C.muted, fontStyle: "italic" }}>{s.why}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: "1 1 240px", maxWidth: 270 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem", fontFamily: "system-ui" }}>{"\u2705"} What it can actually do</div>
          {[
            "Analyse a dataset and find the anomalies",
            "Draft a technical spec from rough notes",
            "Redesign a process given constraints",
            "Review code for bugs and security issues",
            "Build custom tools and automations",
          ].map((s, i) => (
            <div key={i} style={{ padding: "0.4rem 0.5rem", fontSize: "0.85rem", color: C.body, borderBottom: `1px solid ${C.border}` }}>{s}</div>
          ))}
        </div>
      </div>
      <p style={{ textAlign: "center", fontSize: "0.9rem", color: C.muted, fontStyle: "italic", marginTop: "1rem" }}>
        Same model. The only difference is how you ask.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════
// SLIDES
// ═══════════════════════════════════════

const slides = [
  // ── TITLE ──
  {
    section: "", color: C.blue,
    content: () => (
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: C.text, lineHeight: 1.1, marginBottom: "1rem" }}>
          How AI Actually Works
        </h1>
        <p style={{ fontSize: "1.15rem", color: C.muted, maxWidth: 480, margin: "0 auto" }}>
          A practical guide for the AutoStore team
        </p>
      </div>
    ),
    notes: "Opening slide. The goal today is to give everyone a real mental model of how AI works \u2014 not just what it does, but why it behaves the way it does. By the end you should understand what these tools are actually doing, what they are good and bad at, and most importantly how to get much better results from them.",
  },

  // ── PART 01: WHAT IS AN LLM? ──
  { section: "01 \u00b7 What Is an LLM?", color: C.blue,
    content: () => (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem", color: C.muted, marginBottom: "1rem" }}>Every AI tool you use today \u2014 Copilot, ChatGPT, Claude \u2014 runs on the same core idea:</p>
        <div style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: C.text, lineHeight: 1.15 }}>
          Predict the next word.
        </div>
        <p style={{ fontSize: "1rem", color: C.muted, maxWidth: 460, margin: "1.5rem auto 0" }}>
          No database. No search engine. No rules.<br/>Just: given everything so far, what word probably comes next?
        </p>
      </div>
    ),
    notes: "This is the single most important concept in the entire presentation. Every LLM does exactly one thing: predict the next token. Writing, coding, reasoning, translation \u2014 these all emerge from doing this incredibly well at massive scale. There are no separate modules for language or logic. It is all prediction. If people remember one thing from today, it should be this.",
  },

  { section: "01 \u00b7 What Is an LLM?", color: C.blue,
    title: "The prediction machine",
    content: () => <PredictionLoop />,
    notes: "Walk through the diagram. You give the model some text. It runs it through billions of parameters and outputs a probability for every possible next word. Paris gets 42 percent, Lyon gets 8 percent, and so on. It picks one \u2014 usually the most likely, with some controlled randomness \u2014 appends it to the sequence, and loops. One word at a time. The model never plans ahead. It commits to each word before thinking about the next. This is why it can sometimes start a sentence well and then go off the rails.",
  },

  { section: "01 \u00b7 What Is an LLM?", color: C.blue,
    title: "Knowledge as a side effect",
    content: () => <EmergenceViz />,
    notes: "Here is the remarkable thing. To predict medical text well, you need medical knowledge. To predict the next line of code, you need programming logic. To predict Spanish, you need to know Spanish and the topic being discussed. Nobody taught the model any of these things explicitly. The knowledge emerged because having it helps the model predict better. This also explains why it knows so much \u2014 it was trained on text about essentially every topic humans have ever written about.",
  },

  { section: "01 \u00b7 What Is an LLM?", color: C.blue,
    title: "Brilliant and wrong \u2014 for the same reason",
    content: () => (
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: C.text, lineHeight: 1.3 }}>
            It always produces text that <span style={{ color: C.blue }}>sounds right</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ flex: "1 1 220px", maxWidth: 250, padding: "1rem", background: C.green + "08", borderRadius: 10, border: `1px solid ${C.green}20` }}>
            <div style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>{"\u2705"}</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: C.text, marginBottom: "0.3rem" }}>When it has the knowledge</div>
            <div style={{ fontSize: "0.82rem", color: C.body, lineHeight: 1.5 }}>Fluent writing, deep knowledge, working code, logical reasoning, creative ideas</div>
          </div>
          <div style={{ flex: "1 1 220px", maxWidth: 250, padding: "1rem", background: C.red + "08", borderRadius: 10, border: `1px solid ${C.red}20` }}>
            <div style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>{"\u274C"}</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: C.text, marginBottom: "0.3rem" }}>When it does not</div>
            <div style={{ fontSize: "0.82rem", color: C.body, lineHeight: 1.5 }}>Hallucination, confident errors, invented citations, made-up numbers, no self-doubt</div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "1.25rem", padding: "0.6rem 1rem", background: "#f8f9fa", borderRadius: 8 }}>
          <span style={{ fontSize: "0.9rem", color: C.body }}>Optimised to produce <strong>likely</strong> text, not <strong>verified</strong> text</span>
        </div>
      </div>
    ),
    notes: "Both the brilliance and the errors come from the same root cause. It produces text that sounds right \u2014 because that is literally what it was trained to do. When it has seen enough examples of a topic, the output is genuinely useful. When it has not, or when the topic requires precision it does not have, it still produces confident fluent text \u2014 but it can be completely wrong. This is hallucination. It is not lying. It is predicting what the right answer would sound like. Once you understand this, you know exactly when to trust it and when to verify.",
  },

  // ── PART 02: HOW IT WAS MADE ──
  { section: "02 \u00b7 How It Was Made", color: C.purple,
    title: "Cutting the diamond",
    content: () => <DiamondStages />,
    notes: "Think of building an LLM like cutting a diamond. Phase one \u2014 raw: you show it trillions of words from the internet. It learns to predict, and world knowledge emerges as a side effect. This is absurdly expensive \u2014 over a billion dollars. Only about five companies can afford this from scratch: OpenAI, Google, Anthropic, Meta, and maybe one or two others. Phase two \u2014 cut: fine-tune it for specific abilities. Teach it to follow instructions, reason step by step, write code. Phase three \u2014 polish: humans rate thousands of responses. The model learns what helpful, safe, useful behaviour looks like. This is where it transforms from a text-completion engine into the assistant you talk to.",
  },

  // ── PART 03: FROM BRAIN TO BODY ──
  { section: "03 \u00b7 From Brain to Body", color: C.red,
    content: () => (
      <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>{"\uD83E\uDDE0"}</div>
        <div style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700, color: C.text, lineHeight: 1.25, marginBottom: "1rem" }}>
          A brain in a jar
        </div>
        <p style={{ fontSize: "1rem", color: C.body, maxWidth: 440, margin: "0 auto", lineHeight: 1.6 }}>
          An LLM alone is incredibly smart but completely helpless.
        </p>
        <p style={{ fontSize: "0.95rem", color: C.muted, maxWidth: 400, margin: "0.75rem auto 0", lineHeight: 1.6 }}>
          It cannot browse the web. It cannot run code.<br/>It cannot read your files. It cannot remember yesterday.
        </p>
        <p style={{ fontSize: "1rem", color: C.body, fontStyle: "italic", marginTop: "1.25rem" }}>
          To be useful, a brain needs a body.
        </p>
      </div>
    ),
    notes: "Important framing. The raw LLM can only do text in, text out. It has no tools, no memory, no way to interact with the world. When ChatGPT searches the web, or writes and runs code, that is not the LLM itself. That is an agent framework wrapping the LLM and giving it capabilities. The model provides intelligence. The framework provides the ability to act. This distinction matters when you evaluate AI products \u2014 the agent framework quality matters as much as the underlying model.",
  },

  { section: "03 \u00b7 From Brain to Body", color: C.red,
    title: "The agent loop",
    content: () => <AgentLoopViz />,
    notes: "Here is how agents actually work. Think: what needs to be done? Act: call a tool \u2014 search the web, run code, read a file, call an API. Observe: look at the result. Then loop. This is exactly how GitHub Copilot edits code, how ChatGPT browses the web, how Claude writes and tests programs. It is not magic. It is a loop of reasoning and tool use. The quality of the tools available, and how well the framework orchestrates them, determines what the agent can actually accomplish.",
  },

  { section: "03 \u00b7 From Brain to Body", color: C.red,
    title: "Where are we today?",
    content: () => <UsageSpectrum />,
    notes: "Think of this as a spectrum of autonomy. Chat: you type, it responds. Copilot: AI embedded in your tools, helping as you work. Agent: autonomous task execution with tool use. Multi-agent: teams of AI collaborating on complex tasks. Platform: AI built into business infrastructure. Most of us are at the first two levels today. The industry is moving rapidly toward agents. The right level depends on the task, the stakes, and how much you need to verify the output.",
  },

  // ── PART 04: THE INPUT IS EVERYTHING ──
  { section: "04 \u00b7 The Input Is Everything", color: C.indigo,
    title: "You have access to the smartest person in the world",
    content: () => <SmartestPersonViz />,
    notes: "This is the bridge to the most practical part of the talk. Most people have access to an incredibly powerful tool and use a tiny fraction of its capability. Not because the tool is limited, but because of how they ask. The left column is fine \u2014 but it is like hiring a world-class analyst to do basic arithmetic. The right column shows tasks where AI genuinely saves hours and often produces better output than most people could alone. Same model in both columns. The only difference is the input.",
  },

  { section: "04 \u00b7 The Input Is Everything", color: C.indigo,
    content: () => (
      <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
          What comes out<br/>depends entirely on what goes in
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", margin: "1.5rem 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            <div style={{ padding: "0.5rem 1rem", background: C.red + "10", borderRadius: 8, border: `1px solid ${C.red}20` }}>
              <span style={{ fontSize: "0.85rem", color: C.red, fontFamily: "system-ui", fontWeight: 600 }}>Vague input</span>
            </div>
            <span style={{ fontSize: "1.1rem", color: C.muted }}>{"\u2192"}</span>
            <div style={{ padding: "0.4rem 0.7rem", background: "#f1f5f9", borderRadius: 8, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: "0.8rem", color: C.muted, fontFamily: "system-ui" }}>LLM</span>
            </div>
            <span style={{ fontSize: "1.1rem", color: C.muted }}>{"\u2192"}</span>
            <div style={{ padding: "0.5rem 1rem", background: C.red + "10", borderRadius: 8, border: `1px solid ${C.red}20` }}>
              <span style={{ fontSize: "0.85rem", color: C.red, fontFamily: "system-ui", fontWeight: 600 }}>Generic output</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            <div style={{ padding: "0.5rem 1rem", background: C.green + "10", borderRadius: 8, border: `1px solid ${C.green}20` }}>
              <span style={{ fontSize: "0.85rem", color: C.green, fontFamily: "system-ui", fontWeight: 600 }}>Specific input</span>
            </div>
            <span style={{ fontSize: "1.1rem", color: C.muted }}>{"\u2192"}</span>
            <div style={{ padding: "0.4rem 0.7rem", background: "#f1f5f9", borderRadius: 8, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: "0.8rem", color: C.muted, fontFamily: "system-ui" }}>LLM</span>
            </div>
            <span style={{ fontSize: "1.1rem", color: C.muted }}>{"\u2192"}</span>
            <div style={{ padding: "0.5rem 1rem", background: C.green + "10", borderRadius: 8, border: `1px solid ${C.green}20` }}>
              <span style={{ fontSize: "0.85rem", color: C.green, fontFamily: "system-ui", fontWeight: 600 }}>Useful output</span>
            </div>
          </div>
        </div>
        <p style={{ fontSize: "0.95rem", color: C.muted, fontStyle: "italic" }}>
          Prompting is the most important skill for getting value from AI
        </p>
      </div>
    ),
    notes: "This is the central message of the prompting section. The LLM is a vast pool of knowledge and capability. But your prompt determines what comes out. A vague question gets a vague answer. A specific, well-structured question gets a specific, useful answer. The model did not get smarter between the two. You just asked better. This means prompting is not a nice-to-have skill \u2014 it is THE skill for working with AI effectively.",
  },

  { section: "04 \u00b7 The Input Is Everything", color: C.indigo,
    title: "Vague in, vague out",
    content: () => (
      <PromptComparison
        bad={{
          prompt: "Write a report on Q3",
          output: "Here is a general overview of Q3 performance. The quarter saw various developments across multiple areas including revenue, operations, and strategic initiatives\u2026"
        }}
        good={{
          prompt: "Write a 1-page executive summary of Q3 for the board.\n\nContext: Revenue \u20ac42M vs \u20ac45M target. Strong EMEA growth. APAC supply chain delays.\n\nFormat: 3 sections \u2014 Results, Risks, Actions. Bullet points. Formal tone.",
          output: "Q3 Executive Summary\n\n\u25a0 Results: Revenue \u20ac42M (93% of target). EMEA +18% YoY\u2026\n\u25a0 Risks: APAC supply chain \u2014 2 week avg delay\u2026\n\u25a0 Actions: 1) Diversify APAC suppliers by Q4\u2026"
        }}
      />
    ),
    notes: "Concrete example. Same model, same day, same everything. The left prompt gives it almost nothing to work with: what kind of report? For whom? What data? What format? It has to guess, and it guesses generically. The right prompt specifies audience, context, structure, and tone. The output is immediately useful. This is not about tricking the AI. It is about giving it the information it needs to do the job well.",
  },

  { section: "04 \u00b7 The Input Is Everything", color: C.indigo,
    title: "The anatomy of a good prompt",
    content: () => <PromptFramework />,
    notes: "Four elements that make prompts effective. Goal: what do you actually want? Context: what does the AI need to know to do this well? Constraints: what are the boundaries \u2014 length, tone, audience, what to avoid? Format: what should the output look like? You do not need all four every time. But the more you provide, the less the model has to guess. And guessing is where it goes wrong.",
  },

  { section: "04 \u00b7 The Input Is Everything", color: C.indigo,
    title: "The most powerful trick: let it ask YOU",
    content: () => (
      <ConversationFlow messages={[
        { from: "user", text: "Help me prepare for the quarterly business review." },
        { from: "ai", text: "Before I start, a few questions:\n\n1. Who is the audience?\n2. What is the main message you want to land?\n3. What data do you have?\n4. How long is the presentation?" },
        { from: "user", text: "Leadership. Main message: behind on revenue but ahead on new customer acquisition. I have the Q3 dashboard. 15 minutes." },
        { from: "ai", text: "Got it. Here is a suggested structure for a 15-minute leadership review\u2026" },
      ]} />
    ),
    notes: "The single most underused prompting technique. Instead of trying to write the perfect prompt, tell the AI: before you start, ask me any questions you need to do this well. The model is excellent at identifying what information is missing. This turns a monologue into a dialogue and the output quality jumps dramatically. You can also say: ask me questions one at a time until you have what you need.",
  },

  { section: "04 \u00b7 The Input Is Everything", color: C.indigo,
    title: "Plan before you build",
    content: () => (
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", maxWidth: 620, margin: "0 auto" }}>
        <div style={{ flex: "1 1 260px", maxWidth: 290 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem", fontFamily: "system-ui" }}>{"\u274C"} Dive straight in</div>
          {[
            { step: "1", text: "\"Build me a dashboard\"" },
            { step: "2", text: "\"No, not like that\"" },
            { step: "3", text: "\"Closer but still wrong\"" },
            { step: "4", text: "\"Let me start over\u2026\"" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", padding: "0.4rem 0", borderBottom: `1px solid ${C.border}`, alignItems: "flex-start" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: C.red, fontFamily: "system-ui", flexShrink: 0, marginTop: "0.15rem" }}>{s.step}</span>
              <span style={{ fontSize: "0.85rem", color: C.body }}>{s.text}</span>
            </div>
          ))}
          <div style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: C.red, fontWeight: 600, fontFamily: "system-ui" }}>4 iterations, still guessing</div>
        </div>
        <div style={{ flex: "1 1 260px", maxWidth: 290 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem", fontFamily: "system-ui" }}>{"\u2705"} Establish the goal first</div>
          {[
            { step: "1", text: "Who is this for? \u2192 Ops team" },
            { step: "2", text: "What decisions does it support? \u2192 Weekly priorities" },
            { step: "3", text: "What does good look like? \u2192 Trends + top bottlenecks" },
            { step: "\u2192", text: "Now build: clear spec, nailed first time" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", padding: "0.4rem 0", borderBottom: `1px solid ${C.border}`, alignItems: "flex-start" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: C.green, fontFamily: "system-ui", flexShrink: 0, marginTop: "0.15rem" }}>{s.step}</span>
              <span style={{ fontSize: "0.85rem", color: C.body }}>{s.text}</span>
            </div>
          ))}
          <div style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: C.green, fontWeight: 600, fontFamily: "system-ui" }}>1 iteration, nailed it</div>
        </div>
      </div>
    ),
    notes: "This applies to everything \u2014 from asking for a meeting summary to building software. The natural impulse is to jump straight to build me X. But spending two minutes defining who it is for, what decisions it supports, and what good looks like gives the AI enough context to get it right the first time. Think of it like briefing a colleague: you would not just say make a dashboard without explaining the context.",
  },

  { section: "04 \u00b7 The Input Is Everything", color: C.indigo,
    title: "Prompt anti-patterns",
    content: () => <PromptAntiPatterns />,
    notes: "These are funny but real. Make it better \u2014 better how? The model has to guess. Write something about AI \u2014 zero constraints means generic filler. Fix this with 500 lines of code and no error description \u2014 the model does not know what is broken. Be more creative \u2014 creativity without direction produces randomness. The fix for all of these: be specific about what you want.",
  },

  // ── PART 05: YOUR TOOLS (PLACEHOLDER) ──
  { section: "05 \u00b7 Your Tools at AutoStore", color: "#0284c7",
    content: () => (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>What you have access to today</div>
        <p style={{ fontSize: "1.05rem", color: C.muted, maxWidth: 480, margin: "0 auto" }}>
          Microsoft 365 Copilot {"\u00b7"} GitHub Copilot {"\u00b7"} Cursor {"\u00b7"} Databricks {"\u00b7"} Azure AI Foundry
        </p>
        <p style={{ fontSize: "0.85rem", color: C.muted, marginTop: "1.5rem", fontStyle: "italic" }}>[ Live demos and screenshots ]</p>
      </div>
    ),
    notes: "This section will use live demos and screenshots. Key tools: M365 Copilot for meeting summaries, custom prompts, building agents with Copilot Studio, and Notebook. GitHub Copilot for coding in VS Code, CLI presentations and tools. Databricks for AI/BI One querying across the datalake, and Genie Spaces for specific topics. The article has detailed write-ups for each.",
  },

  // ── PART 06: GOING FURTHER (PLACEHOLDER) ──
  { section: "06 \u00b7 Going Further", color: "#9333ea",
    content: () => (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>What you can explore on your own</div>
        <p style={{ fontSize: "1.05rem", color: C.muted, maxWidth: 480, margin: "0 auto" }}>
          Claude {"\u00b7"} ChatGPT {"\u00b7"} Gemini {"\u00b7"} NotebookLM {"\u00b7"} Perplexity {"\u00b7"} Ollama {"\u00b7"} APIs
        </p>
        <p style={{ fontSize: "0.85rem", color: C.muted, marginTop: "1.5rem", fontStyle: "italic" }}>[ Live demos and screenshots ]</p>
      </div>
    ),
    notes: "Also live demos. Key message: you do not need to wait for official rollouts. The big three assistants \u2014 Claude, ChatGPT, Gemini \u2014 all have free tiers. NotebookLM for working with documents. Perplexity for research. Ollama for local and private use. APIs for building your own automations.",
  },

  // ── CLOSING ──
  { section: "", color: C.blue,
    content: () => (
      <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 700, color: C.text, lineHeight: 1.25, marginBottom: "1.5rem" }}>
          Three things to remember
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 440, margin: "0 auto", textAlign: "left" }}>
          {[
            { num: "1", text: "It predicts text \u2014 that explains both the magic and the mistakes" },
            { num: "2", text: "What comes out depends on what you put in \u2014 prompting is the skill to develop" },
            { num: "3", text: "The tools are here \u2014 start with tasks where you can judge the output" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: C.blue, fontFamily: "system-ui", flexShrink: 0 }}>{s.num}</span>
              <span style={{ fontSize: "1.05rem", color: C.body, lineHeight: 1.5 }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: "Three takeaways. First: it predicts text. That one fact explains both why it is so powerful and why it hallucinates. Second: the quality of your input determines the quality of the output. Prompting is the single most important skill to develop. Third: the tools are available right now. The fastest way to build intuition is to use them on real tasks where you can judge the quality of the output yourself.",
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
