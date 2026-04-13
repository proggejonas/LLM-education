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
    notes: "Opening slide. The goal is to give everyone a real mental model of how AI works \u2014 not just what it does, but why it behaves the way it does. After this session you should be able to evaluate AI tools, understand their limitations, and most importantly know how to get better results from them.",
  },

  // ── PART 01: THE CORE IDEA ──
  { section: "01 \u00b7 The Core Idea", color: C.blue,
    content: () => (
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.1rem", color: C.muted, marginBottom: "1.5rem" }}>Everything starts with one simple idea:</p>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
          Predict the next word
        </div>
        <p style={{ fontSize: "1.05rem", color: C.muted, maxWidth: 460, margin: "1rem auto 0" }}>
          No database. No search engine. No knowledge base inside.<br/>Just: what word probably comes next?
        </p>
      </div>
    ),
    notes: "This is the single most important thing to understand. An LLM does exactly one thing: predict the next word. Every capability \u2014 writing, coding, reasoning, translation \u2014 emerges from doing this one thing at massive scale. There are no separate modules for 'language' or 'logic.' It is all prediction.",
  },

  { section: "01 \u00b7 The Core Idea", color: C.blue,
    title: "But first: text becomes numbers",
    content: () => <TokenizationViz />,
    notes: "Before the model can do anything, text becomes numbers \u2014 tokens. Each word or word-piece gets mapped to a number from a vocabulary of 50,000\u2013200,000 tokens. The model never sees text. It sees sequences of integers. This is fundamental and also enables multimodality later \u2014 anything that can be turned into numbers can be processed.",
  },

  { section: "01 \u00b7 The Core Idea", color: C.blue,
    title: "The prediction loop",
    content: () => <PredictionLoop />,
    notes: "Walk through the diagram. You give the model a sequence. It runs a forward pass and outputs a probability for every possible next token. 'Paris' gets 42%, 'Lyon' gets 8%, etc. It picks one \u2014 with some controlled randomness \u2014 appends it to the sequence, and loops. One token at a time. The model never plans ahead. It commits to each word before thinking about the next.",
  },

  { section: "01 \u00b7 The Core Idea", color: C.blue,
    title: "Why prediction creates intelligence",
    content: () => (
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ fontSize: "1.4rem", fontWeight: 700, color: C.text, textAlign: "center", marginBottom: "0.75rem", lineHeight: 1.3 }}>
          Predicting text well requires understanding<br/>the world that produced it
        </div>
        <p style={{ textAlign: "center", color: C.muted, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
          These skills were never programmed in \u2014 they emerged from prediction at scale:
        </p>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
          {["Grammar", "Geography", "Logic", "Code", "Math", "Science", "Languages", "Common sense", "Creativity"].map((s, i) => (
            <span key={i} style={{ padding: "0.45rem 1rem", borderRadius: 8, fontSize: "0.9rem", background: C.blue + "10", color: C.blue, fontWeight: 600, fontFamily: "system-ui" }}>{s}</span>
          ))}
        </div>
      </div>
    ),
    notes: "This is the remarkable part. To predict 'The capital of France is...' you need geography. To predict the next line of code, you need programming logic. Nobody taught the model these things explicitly \u2014 they emerged because knowing them helps predict text better. The knowledge is a side effect of prediction.",
  },

  { section: "01 \u00b7 The Core Idea", color: C.blue,
    title: "Same root cause, different outcomes",
    content: () => (
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center", maxWidth: 560, margin: "0 auto" }}>
        <div style={{ flex: "1 1 220px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.green, marginBottom: "0.75rem", fontFamily: "system-ui" }}>{"\u2713"} Strengths</div>
          {["Fluent natural language", "Broad knowledge", "Reasoning chains", "Code generation", "Creative writing", "Multi-language"].map((s, i) => (
            <div key={i} style={{ padding: "0.45rem 0", fontSize: "0.95rem", color: C.body, borderBottom: `1px solid ${C.border}` }}>{s}</div>
          ))}
        </div>
        <div style={{ flex: "1 1 220px" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.red, marginBottom: "0.75rem", fontFamily: "system-ui" }}>{"\u2717"} Weaknesses</div>
          {["Hallucination", "No live knowledge", "Can\u2019t take actions", "No persistent memory", "Bad at precise math", "Doesn\u2019t know what it doesn\u2019t know"].map((s, i) => (
            <div key={i} style={{ padding: "0.45rem 0", fontSize: "0.95rem", color: C.body, borderBottom: `1px solid ${C.border}` }}>{s}</div>
          ))}
        </div>
        <p style={{ width: "100%", textAlign: "center", fontSize: "0.9rem", color: C.muted, fontStyle: "italic", marginTop: "0.5rem" }}>
          Optimised to produce <strong>likely</strong> text, not <strong>verified</strong> text
        </p>
      </div>
    ),
    notes: "Both columns come from the same thing. It produces text that sounds right \u2014 that is the strength (fluency, creativity). It produces text that sounds right even when it is wrong \u2014 that is the weakness (hallucination). It has no mechanism to verify truth, only to assess likelihood. Once you understand this, you know exactly when to trust it and when to verify.",
  },

  // ── PART 02: HOW IT GETS BUILT ──
  { section: "02 \u00b7 How It Gets Built", color: C.purple,
    content: () => (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>Three phases of training</div>
        <p style={{ fontSize: "1.05rem", color: C.muted, maxWidth: 480, margin: "0 auto" }}>
          Each phase shapes what the model becomes \u2014 and the cost distribution is dramatic.
        </p>
      </div>
    ),
    notes: "Understanding training is key to understanding behaviour. There are three main phases with very different purposes and costs. Almost everything goes into phase one.",
  },

  { section: "02 \u00b7 How It Gets Built", color: C.purple,
    title: "Where the money goes",
    content: () => <CostBreakdown />,
    notes: "Look at the proportions. Pretraining is 90%+ of the total cost \u2014 hundreds of millions to over a billion dollars. This is why only about five companies can build frontier models from scratch: Anthropic, OpenAI, Google, Meta, and a few others. Everything after is refinement \u2014 important but much cheaper in compute.",
  },

  { section: "02 \u00b7 How It Gets Built", color: C.purple,
    title: "Pretraining: how the model learns",
    content: () => <GradientDescentViz />,
    notes: "The model starts with completely random weights \u2014 billions of numbers, all random. Feed it trillions of tokens, it predicts the next one. Each time it is wrong, nudge all the weights in the direction that would have been more correct. This is gradient descent \u2014 like a ball rolling downhill on a complex landscape. After billions of steps, grammar, facts, reasoning, code \u2014 all emerge as side effects of minimising prediction error.",
  },

  { section: "02 \u00b7 How It Gets Built", color: C.purple,
    title: "Post-training: making it useful",
    content: () => <RLHFPipeline />,
    notes: "The raw pretrained model just completes text \u2014 it does not have conversations. Post-training fixes this in three steps. First, supervised fine-tuning: humans demonstrate ideal assistant behaviour. Then reward modelling: train a separate model to judge response quality. Finally, reinforcement learning: optimise the LLM to produce responses that score well. This is where the model becomes a helpful, safe assistant.",
  },

  // ── PART 03: UNDER THE HOOD ──
  { section: "03 \u00b7 Under the Hood", color: C.cyan,
    title: "Attention: how context shapes meaning",
    content: () => <AttentionViz />,
    notes: "This is the core mechanism inside the transformer. For every word, the model asks: which other words in this sequence matter for understanding me? It computes attention scores between all word pairs. Here, 'it' needs to figure out what it refers to. The attention mechanism learns that 'mat' connects strongly because of 'soft.' Nobody programmed this rule. The model learned it from billions of examples.",
  },

  { section: "03 \u00b7 Under the Hood", color: C.cyan,
    title: "Temperature: same model, different behaviour",
    content: () => <TemperatureViz />,
    notes: "Practical detail worth understanding. Temperature controls how the model samples from its probability distribution. Low: sticks to high-probability words \u2014 focused, predictable. Good for factual questions and code. High: lets less likely words through \u2014 creative, surprising. Good for brainstorming. Same model, same input \u2014 one parameter changes the behaviour entirely.",
  },

  // ── PART 04: SCALING UP ──
  { section: "04 \u00b7 Scaling Up", color: C.green,
    title: "Mixture of Experts: be big but stay fast",
    content: () => <MoEDiagram />,
    notes: "The early approach was: make it bigger. But cost scales brutally. Mixture of Experts is one of the clever alternatives. Split the model into specialist sub-networks with a router. Each token goes to only 2\u20133 relevant experts. Huge total knowledge, but fast because only a fraction activates per query. Like a hospital with specialists \u2014 you only see the relevant ones. Most frontier models now use this.",
  },

  { section: "04 \u00b7 Scaling Up", color: C.green,
    title: "Distillation: big knowledge, small package",
    content: () => <DistillationViz />,
    notes: "Train a small model to mimic a large model's outputs. Get 80\u201390% of the performance at a fraction of the size and cost. This is how AI ends up on phones. Related concept: test-time compute \u2014 instead of making the model bigger at training time, let it think longer at inference time. Step-by-step reasoning, chain-of-thought. A smaller model that thinks carefully can match a larger model that answers immediately.",
  },

  { section: "04 \u00b7 Scaling Up", color: C.green,
    title: "Everything becomes tokens",
    content: () => <MultimodalViz />,
    notes: "Text becomes tokens. Images get chopped into patches \u2014 each patch becomes a token. Audio waveforms become tokens. Once everything is tokens, they flow through the same architecture. There are not separate vision and language systems bolted together. It is one unified system processing a mixed stream of tokens. This is why you can show it a photo and ask about it.",
  },

  // ── PART 05: FROM BRAIN TO BODY ──
  { section: "05 \u00b7 From Brain to Body", color: C.red,
    title: "A brain needs a body",
    content: () => <AgentLoopViz />,
    notes: "An LLM alone is a brain in a jar. Smart, but it cannot see, act, or remember. An agent wraps it with tools, memory, and a planning loop. The core cycle: Think \u2014 what needs to be done? Act \u2014 call a tool. Observe \u2014 look at the result. Then loop. This is how Claude searches the web, writes and runs code, creates documents. Not magic \u2014 a loop of reasoning and tool use.",
  },

  { section: "05 \u00b7 From Brain to Body", color: C.red,
    title: "The core insight",
    content: () => (
      <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: C.text, lineHeight: 1.3, marginBottom: "1.5rem" }}>
          The LLM provides reasoning.<br/>The agent framework provides capability.
        </div>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", padding: "1rem", background: "#fef2f2", borderRadius: 10 }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{"\uD83E\uDDE0"}</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.text }}>Without agent framework</div>
            <div style={{ fontSize: "0.85rem", color: C.muted, marginTop: "0.25rem" }}>Smart but cannot do anything</div>
          </div>
          <div style={{ flex: "1 1 200px", padding: "1rem", background: "#f0fdf4", borderRadius: 10 }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{"\uD83E\uDD16"}</div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.text }}>With agent framework</div>
            <div style={{ fontSize: "0.85rem", color: C.muted, marginTop: "0.25rem" }}>Smart and can act in the world</div>
          </div>
        </div>
      </div>
    ),
    notes: "Neither is useful alone. The model provides intelligence. The agent framework provides the ability to apply it. This is key for evaluating AI products: it is not just about which model is 'smartest.' The quality of the agent framework, the tools available, the memory system \u2014 all matter as much as the base model quality.",
  },

  { section: "05 \u00b7 From Brain to Body", color: C.red,
    title: "A spectrum of autonomy",
    content: () => <UsageSpectrum />,
    notes: "Chat: you type, it responds. Copilot: AI embedded in your tools. Agent: autonomous task execution. Multi-agent: teams of AI collaborating. Platform: AI in business infrastructure. Most people are in the first two levels. The industry is moving toward the middle. The right level depends on the task, the stakes, and how much you need to verify.",
  },

  // ── PART 06: THE INPUT IS EVERYTHING ──
  { section: "06 \u00b7 The Input Is Everything", color: C.indigo,
    content: () => (
      <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: "1rem" }}>
          What comes out<br/>depends on what goes in
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.5rem 0" }}>
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
              <span style={{ fontSize: "0.85rem", color: C.red, fontFamily: "system-ui", fontWeight: 600 }}>Vague output</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            <div style={{ padding: "0.5rem 1rem", background: C.green + "10", borderRadius: 8, border: `1px solid ${C.green}20` }}>
              <span style={{ fontSize: "0.85rem", color: C.green, fontFamily: "system-ui", fontWeight: 600 }}>Clear input</span>
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
          Prompting is the single most important skill for getting value from AI
        </p>
      </div>
    ),
    notes: "This is arguably the most practical section. Everything so far explains why the model behaves the way it does. This section is about how to work with it effectively. The core insight: the model is trying to predict what comes next based on what you gave it. The more specific and structured your input, the better the prediction \u2014 and therefore the output. Prompting is not a trick. It is the primary interface.",
  },

  { section: "06 \u00b7 The Input Is Everything", color: C.indigo,
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
    notes: "This is the most common failure mode. The left prompt gives the model almost nothing to work with, so it produces generic filler. The right prompt gives it audience, context, structure, and tone \u2014 so the output is immediately useful. The same model produced both. The difference is entirely in the input.",
  },

  { section: "06 \u00b7 The Input Is Everything", color: C.indigo,
    title: "The anatomy of a good prompt",
    content: () => <PromptFramework />,
    notes: "Four elements. Goal: what do you actually want? Context: what does the AI need to know to do this well? Constraints: what are the boundaries \u2014 length, tone, audience, what to avoid? Format: what should the output look like? You do not need all four every time, but the more you provide, the less the model has to guess \u2014 and guessing is where it goes wrong.",
  },

  { section: "06 \u00b7 The Input Is Everything", color: C.indigo,
    title: "The most powerful trick",
    content: () => (
      <ConversationFlow messages={[
        { from: "user", text: "Help me prepare for the quarterly business review." },
        { from: "ai", text: "Happy to help. Before I start, a few questions:\n\n1. Who is the audience \u2014 leadership, your team, or cross-functional?\n2. What is the main message you want to land?\n3. What data do you have available?\n4. How long should the presentation be?" },
        { from: "user", text: "Leadership. Main message: behind on revenue but ahead on new customer acquisition. I have the Q3 dashboard. 15 minutes." },
        { from: "ai", text: "Got it. Here is a suggested structure for a 15-minute leadership review\u2026" },
      ]} />
    ),
    notes: "This is the single most underused technique. Instead of trying to write the perfect prompt yourself, tell the AI: 'Before you start, ask me any questions you need to do this well.' The model is very good at identifying what information it is missing. This turns a monologue into a dialogue \u2014 and the output quality jumps dramatically. You can also prompt: 'Ask me clarifying questions one at a time until you have what you need.'",
  },

  { section: "06 \u00b7 The Input Is Everything", color: C.indigo,
    title: "Establish the goal before you build",
    content: () => (
      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", maxWidth: 620, margin: "0 auto" }}>
        <div style={{ flex: "1 1 260px", maxWidth: 290 }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.6rem", fontFamily: "system-ui" }}>{"\u274C"} Dive straight in</div>
          {[
            { step: "1", text: "\"Build me a dashboard\"" },
            { step: "2", text: "\"No, not like that\"" },
            { step: "3", text: "\"Closer but still not right\"" },
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
            { step: "3", text: "What does 'good' look like? \u2192 Trends + top bottlenecks" },
            { step: "\u2192", text: "Now build: clear spec, right the first time" },
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
    notes: "This applies to everything from asking for a meeting summary to building software with an AI tool. The natural impulse is to jump straight to 'build me X.' But if you spend even two minutes defining who it is for, what decisions it supports, and what 'good' looks like \u2014 the AI has enough to get it right the first time. Think of it like briefing a colleague: you would not just say 'make a dashboard' \u2014 you would explain the context.",
  },

  { section: "06 \u00b7 The Input Is Everything", color: C.indigo,
    title: "Prompt anti-patterns",
    content: () => <PromptAntiPatterns />,
    notes: "These are funny but real. 'Make it better' \u2014 better how? The model has to guess, and it will guess wrong. 'Write something about AI' \u2014 gives the model zero constraints, so you get generic content. 'Fix this' with 500 lines and no context \u2014 the model does not know what is broken. 'Be more creative' \u2014 creativity without direction produces randomness, not inspiration. The fix for all of these: be specific.",
  },

  // ── PART 07: YOUR TOOLS (PLACEHOLDER) ──
  { section: "07 \u00b7 Your Tools at AutoStore", color: "#0284c7",
    content: () => (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>What you have access to today</div>
        <p style={{ fontSize: "1.05rem", color: C.muted, maxWidth: 480, margin: "0 auto" }}>
          Microsoft 365 Copilot {"\u00b7"} GitHub Copilot {"\u00b7"} Cursor {"\u00b7"} Databricks {"\u00b7"} Azure AI Foundry
        </p>
        <p style={{ fontSize: "0.85rem", color: C.muted, marginTop: "1.5rem", fontStyle: "italic" }}>[ Live demos and screenshots ]</p>
      </div>
    ),
    notes: "This section will be done with live demos and screenshots. Key tools: M365 Copilot (meeting summaries, custom prompts, Copilot Studio agents, Notebook), GitHub Copilot (VS Code, CLI, building tools), Databricks (AI/BI One, Genie Spaces). The article has detailed write-ups for each.",
  },

  // ── PART 08: GOING FURTHER (PLACEHOLDER) ──
  { section: "08 \u00b7 Going Further", color: "#9333ea",
    content: () => (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 700, color: C.text, marginBottom: "1rem" }}>What you can explore on your own</div>
        <p style={{ fontSize: "1.05rem", color: C.muted, maxWidth: 480, margin: "0 auto" }}>
          Claude {"\u00b7"} ChatGPT {"\u00b7"} Gemini {"\u00b7"} NotebookLM {"\u00b7"} Perplexity {"\u00b7"} Ollama {"\u00b7"} APIs
        </p>
        <p style={{ fontSize: "0.85rem", color: C.muted, marginTop: "1.5rem", fontStyle: "italic" }}>[ Live demos and screenshots ]</p>
      </div>
    ),
    notes: "This section will also use live demos. Key message: you do not need to wait for official rollouts. The big three assistants (Claude, ChatGPT, Gemini) all have free tiers. NotebookLM for documents. Perplexity for research. Ollama for local/private use. APIs for automation.",
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
            { num: "1", text: "It is a prediction machine \u2014 powerful but not infallible" },
            { num: "2", text: "What comes out depends on what you put in \u2014 prompting is the skill" },
            { num: "3", text: "The tools are here now \u2014 start using them on tasks you know well" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: C.blue, fontFamily: "system-ui", flexShrink: 0 }}>{s.num}</span>
              <span style={{ fontSize: "1.05rem", color: C.body, lineHeight: 1.5 }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: "Three takeaways. First: it predicts text \u2014 that explains both the magic and the failures. Second: the quality of your input determines the quality of the output \u2014 prompting is the most important skill to develop. Third: the tools are available now \u2014 the fastest way to build intuition is to use them on tasks where you can judge the quality of the output.",
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
