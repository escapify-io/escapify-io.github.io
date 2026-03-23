import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart, Line, CartesianGrid } from "recharts";

const navy = "#0a1f38";
const blue = "#1565a8";
const accent = "#00bcd4";
const warm = "#ff7043";
const gold = "#ffc107";
const success = "#43a047";
const purple = "#7e57c2";

const tabs = ["Canvas", "Datos", "Competencia", "Target", "MVP & Validación", "Estado Producto", "Funnel", "Riesgos", "Finanzas"];

// Data
const marketData = [
  { name: "Docentes", value: 792378, display: "792k", color: accent },
  { name: "Alumnado", value: 8348030, display: "8.3M", color: blue },
  { name: "Centros", value: 28654, display: "28.6k", color: warm },
];

const perceptionData = [
  { name: "Formación no\najustada al aula", value: 76, fill: warm },
  { name: "Tecnología\ncomo aliada", value: 63, fill: accent },
  { name: "Prefiere modelo\nhíbrido", value: 62, fill: blue },
  { name: "Invertido en\ndispositivos", value: 43, fill: purple },
  { name: "IA/Big Data\nen centros", value: 34, fill: success },
];

const competitorRadar = [
  { dim: "Escape Room", Genially: 4, Kahoot: 1, BreakoutEDU: 7, Lockee: 3, EduEscapeRoom: 4, Escapify: 9 },
  { dim: "Inclusión DUA", Genially: 1, Kahoot: 1, BreakoutEDU: 1, Lockee: 1, EduEscapeRoom: 1, Escapify: 9 },
  { dim: "Maker/Físico", Genially: 0, Kahoot: 0, BreakoutEDU: 8, Lockee: 0, EduEscapeRoom: 0, Escapify: 8 },
  { dim: "IA Generativa", Genially: 2, Kahoot: 3, BreakoutEDU: 0, Lockee: 0, EduEscapeRoom: 0, Escapify: 8 },
  { dim: "Formación", Genially: 4, Kahoot: 3, BreakoutEDU: 3, Lockee: 1, EduEscapeRoom: 3, Escapify: 9 },
  { dim: "Validación Aula", Genially: 1, Kahoot: 3, BreakoutEDU: 3, Lockee: 1, EduEscapeRoom: 2, Escapify: 9 },
  { dim: "Comunidad", Genially: 6, Kahoot: 5, BreakoutEDU: 4, Lockee: 3, EduEscapeRoom: 4, Escapify: 5 },
];

const riskData = [
  { risk: "Gap intención→acción", impact: 9, probability: 7 },
  { risk: "Cultura 'gratis'", impact: 8, probability: 8 },
  { risk: "Escala sin calidad", impact: 7, probability: 5 },
  { risk: "Onboarding complejo", impact: 8, probability: 4 },
  { risk: "Genially evoluciona", impact: 6, probability: 5 },
];

const funnelSteps = [
  { icon: "🔍", title: "Descubrimiento", users: 10000, desc: "Redes, SEO, contenido, Meta Ads", actions: ["Instagram/TikTok educativo", "Blog SEO gamificación", "Meta Ads → docentes innovadores", "LinkedIn marca personal"] },
  { icon: "📥", title: "Registro", users: 2000, desc: "Lead magnet + acceso free", actions: ["Pack candados gratuito", "Landing con CTA claro", "Webinar demo gratuito", "A/B test mensajes"] },
  { icon: "⚡", title: "Activación", users: 600, desc: "1er escape room en aula", actions: ["Onboarding <30 min", "Plantilla lista para usar", "Tutorial paso a paso", "Soporte chat comunidad"] },
  { icon: "💰", title: "Conversión", users: 120, desc: "Free → Premium", actions: ["Pack premium €9-19", "Generador IA", "Kits maker", "Test 3 franjas precio"] },
  { icon: "🚀", title: "Escala", users: 60, desc: "Referral + Licencias", actions: ["Docente→docente", "Licencia centro", "Marketplace recursos", "Formación como canal"] },
];

const scenarios = {
  pesimista: { label: "Pesimista", activos: 120, conversion: 4, ticket: 9, mrr: 432 },
  medio: { label: "Medio", activos: 300, conversion: 7, ticket: 9, mrr: 1890 },
  optimista: { label: "Optimista", activos: 650, conversion: 10, ticket: 9, mrr: 5850 },
};

const financialEvolution = [
  { month: "M1", pesimista: 120, medio: 280, optimista: 700 },
  { month: "M2", pesimista: 220, medio: 650, optimista: 1600 },
  { month: "M3", pesimista: 310, medio: 1180, optimista: 2900 },
  { month: "M4", pesimista: 400, medio: 1650, optimista: 4300 },
  { month: "M5", pesimista: 430, medio: 1820, optimista: 5100 },
  { month: "M6", pesimista: 432, medio: 1890, optimista: 5850 },
];

const hypotheses = [
  { id: "H1", text: "El docente pagará por ahorrar tiempo de diseño", status: "test", metric: "Conversión beta → pago" },
  { id: "H2", text: "La inclusión diferencia realmente (no solo discurso)", status: "partial", metric: "Mención inclusión en entrevistas" },
  { id: "H3", text: "Los centros valoran ejemplos tangibles y transferibles", status: "test", metric: "Licencias centro vendidas" },
  { id: "H4", text: "Híbrido físico+digital > solo digital", status: "partial", metric: "Valor percibido en encuesta" },
  { id: "H5", text: "Onboarding <30 min suficiente para aplicar", status: "test", metric: "Tasa activación primer uso" },
  { id: "H6", text: "Alumno más motivado con escape room vs. tradicional", status: "validated", metric: "94% satisfacción TFM" },
];

const statusColors = { validated: success, partial: gold, test: warm };
const statusLabels = { validated: "Validada", partial: "Parcial", test: "Por testar" };

function Badge({ children, color = blue, bg = "#e3f2fd" }) {
  return <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: bg, color, marginRight: 4, marginBottom: 4 }}>{children}</span>;
}

function Section({ title, children }) {
  return <div style={{ marginBottom: 28 }}>{title && <h3 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: navy, marginBottom: 12, letterSpacing: "-.02em" }}>{title}</h3>}{children}</div>;
}

function CanvasBox({ title, sub, children, color = blue, span }) {
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #c5ddf0", borderRadius: 14, padding: "12px 12px 10px",
      position: "relative", overflow: "hidden", minHeight: span ? 260 : 130,
      gridRow: span ? "span 2" : undefined,
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg, ${color}, ${accent})`, borderRadius: 4 }} />
      <div style={{ paddingLeft: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em", color: navy, marginBottom: 3 }}>{title}</div>
        {sub && <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: blue, marginBottom: 6 }}>{sub}</div>}
        {children}
      </div>
    </div>
  );
}

function CompTable() {
  const comps = [
    { name: "Genially", er: "Plantillas genéricas", inc: "No", maker: "Solo digital", ia: "No", form: "Webinars", valid: "No", locks: "Integra Lockee/S'cape", price: "Free / €7,5-79/mes" },
    { name: "Kahoot", er: "No (solo quiz)", inc: "No", maker: "Solo digital", ia: "IA básica quiz", form: "Academy", valid: "Estudios ext.", locks: "No", price: "Free / €3-9/mes" },
    { name: "Breakout EDU", er: "Kits físicos (US)", inc: "No", maker: "Kits físicos", ia: "No", form: "Guías", valid: "Estudios ext.", locks: "Físicos", price: "Kits desde $150" },
    { name: "Lockee.fr", er: "Solo candados", inc: "No", maker: "No", ia: "No", form: "FAQ", valid: "No", locks: "60 gratis, variados", price: "Gratis (no comercial)" },
    { name: "EduEscapeRoom", er: "Generador candados", inc: "No", maker: "No", ia: "No", form: "Blog/guías", valid: "No", locks: "Generador web", price: "Gratis" },
    { name: "Escapify.io", er: "Sistema completo ✦", inc: "23 adaptaciones ✦", maker: "Láser + 3D ✦", ia: "Narrativa + adapt. ✦", form: "Cursos + comunidad ✦", valid: "TFM + aula real ✦", locks: "Propios + maker ✦", price: "Freemium + kits" },
  ];
  const cols = ["name", "er", "inc", "maker", "ia", "locks", "form", "valid", "price"];
  const headers = ["", "Escape Room", "Inclusión", "Maker", "IA", "Candados", "Formación", "Validación", "Precio"];
  const isEscapify = (i) => i === comps.length - 1;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12 }}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={{ background: navy, color: "#fff", padding: "8px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", borderRadius: i === 0 ? "10px 0 0 0" : i === headers.length - 1 ? "0 10px 0 0" : 0 }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {comps.map((c, ri) => (
            <tr key={ri} style={{ background: isEscapify(ri) ? "linear-gradient(90deg, #e3f2fd, #e8f5e9)" : ri % 2 === 0 ? "#fafcff" : "#fff" }}>
              {cols.map((col, ci) => (
                <td key={ci} style={{ padding: "7px 10px", borderBottom: "1px solid #e0ecf5", fontWeight: ci === 0 || isEscapify(ri) ? 700 : 400, color: isEscapify(ri) ? navy : c[col] === "No" ? "#9aa8b5" : "#1c2f42" }}>
                  {c[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LeanCanvasV2() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState("medio");
  const scenario = scenarios[selectedScenario];

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: navy, minHeight: "100vh", padding: 0 }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${navy}, #14375a)`, padding: "24px 28px 16px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ padding: "3px 10px", borderRadius: 999, background: "rgba(255,112,67,.2)", color: warm, fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>V2 · Iterado · Mar 2026</span>
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 32, margin: 0, letterSpacing: "-.03em" }}>Lean Canvas · Escapify.io</h1>
        <p style={{ marginTop: 6, fontSize: 13, opacity: .8, lineHeight: 1.5, maxWidth: 700 }}>
          Plataforma para diseñar escape rooms educativos inclusivos · Gamificación + Maker + IA + Inclusión
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, padding: "0 16px", background: "#f0f4f8", overflowX: "auto" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            padding: "10px 16px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700,
            background: activeTab === i ? "#fff" : "transparent",
            color: activeTab === i ? navy : "#607080",
            borderBottom: activeTab === i ? `3px solid ${accent}` : "3px solid transparent",
            borderRadius: "8px 8px 0 0", transition: "all .2s",
            whiteSpace: "nowrap",
          }}>{t}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 20px 32px", background: "#fff", minHeight: 500 }}>

        {/* TAB 0: CANVAS */}
        {activeTab === 0 && (
          <div>
            <Section title="Mapa de Modelo de Negocio">
              <p style={{ fontSize: 13, color: "#607080", marginBottom: 16 }}>Las 9 casillas del Lean Canvas — versión enriquecida con datos y feedback</p>
            </Section>
            <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1.05fr 1.2fr 1.05fr 1.25fr", gap: 10 }}>
              <CanvasBox title="Problema" sub="Top 5 con datos" color={blue} span>
                <ul style={{ paddingLeft: 14, fontSize: 12, lineHeight: 1.6 }}>
                  <li><strong>Dolor operativo:</strong> quiere innovar, pero no le da la vida para diseñar desde cero</li>
                  <li>Falta tiempo/sobrecarga (<strong>43h/semana</strong> de media)</li>
                  <li>Adaptar a diversidad (DI, TEA, TDAH…)</li>
                  <li>No hay herramienta físico + digital</li>
                  <li>Gamificación superficial (quiz ≠ pedagógica)</li>
                </ul>
                <div style={{ marginTop: 8, padding: "6px 8px", borderRadius: 8, background: "#f4faff", border: "1px dashed rgba(21,101,168,.15)", fontSize: 11, color: "#607080" }}>
                  <strong>Alternativas:</strong> Genially, Kahoot, Lockee.fr, EduEscapeRoom, Breakout EDU, TPT, Pinterest
                </div>
              </CanvasBox>

              <CanvasBox title="Solución" sub="MVP faseado" color={blue}>
                <ul style={{ paddingLeft: 14, fontSize: 12, lineHeight: 1.6 }}>
                  <li><strong>F1:</strong> Candados + plantillas</li>
                  <li><strong>F2:</strong> Generador IA</li>
                  <li><strong>F3:</strong> Kits maker</li>
                  <li><strong>F4:</strong> Formación + marketplace</li>
                </ul>
              </CanvasBox>

              <CanvasBox title="Propuesta de valor" sub="Dual: docente + alumno" color={warm} span>
                <p style={{ fontSize: 12, lineHeight: 1.6 }}><strong>Docente:</strong> <strong>"Crea escape rooms educativos inclusivos en minutos, sin diseñarlos desde cero"</strong>.</p>
                <p style={{ fontSize: 12, lineHeight: 1.6, marginTop: 4 }}>Ahorra tiempo, reduce complejidad y obtiene materiales listos para aplicar.</p>
                <p style={{ fontSize: 12, lineHeight: 1.6, marginTop: 4 }}><strong>Alumno:</strong> Motivación, inclusión real, aprendizaje significativo, competencias transversales.</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                  {["Ahorro tiempo", "DUA", "Físico+Digital", "Motivación", "Competencias"].map(t => <Badge key={t}>{t}</Badge>)}
                </div>
              </CanvasBox>

              <CanvasBox title="Ventaja especial" sub="Unfair advantage" color={purple}>
                <p style={{ fontSize: 12, lineHeight: 1.6 }}>TFM validado · 94% satisfacción · 23 adaptaciones · Maker (láser/3D) · Sistema completo · La Maleta del Tiempo como prueba tangible</p>
              </CanvasBox>

              <CanvasBox title="Segmentos" sub="Early adopters" color={warm} span>
                <ul style={{ paddingLeft: 14, fontSize: 12, lineHeight: 1.6 }}>
                  <li>🎯 <strong>Nicho MVP:</strong> Primaria + 1º-2º ESO innovadores</li>
                  <li>🧩 Ed. especial e inclusión</li>
                  <li>🏫 Centros tipo CSMB</li>
                  <li>🎮 Formadores gamificación</li>
                  <li>🧠 Opositores / máster</li>
                </ul>
                <div style={{ marginTop: 8, padding: "6px 8px", borderRadius: 8, background: "#fff4ea", border: "1px dashed rgba(255,112,67,.25)", fontSize: 11, color: "#9c4f28" }}>
                  <strong>Perfil tipo:</strong> docente 30-40 años, creativo, activo en redes educativas, frustrado por falta de tiempo.
                </div>
              </CanvasBox>

              <CanvasBox title="Métricas" sub="North Star + AARRR" color={success}>
                <ul style={{ paddingLeft: 14, fontSize: 12, lineHeight: 1.6 }}>
                  <li>⭐ Docentes que aplican en aula</li>
                  <li>📥 Registros · 🔓 Activación</li>
                  <li>🔄 Retención · 💰 Conversión</li>
                  <li>📣 Referral</li>
                </ul>
              </CanvasBox>

              <CanvasBox title="Canales" sub="Captación" color={blue}>
                <ul style={{ paddingLeft: 14, fontSize: 12, lineHeight: 1.6 }}>
                  <li>🌐 Inbound: web + SEO + recursos gratuitos</li>
                  <li>📱 Contenido en IG/TikTok con demos reales</li>
                  <li>💼 LinkedIn con evidencia pedagógica</li>
                  <li>📧 Secuencias email: descarga → demo → beta</li>
                  <li>🎓 Formación/workshops como canal de venta</li>
                  <li>📢 Meta Ads + alianzas comunidades docentes</li>
                </ul>
              </CanvasBox>

              <div style={{ gridColumn: "1 / span 2" }}>
                <CanvasBox title="Estructura de costes" sub="Por fase" color={blue}>
                  <p style={{ fontSize: 12, lineHeight: 1.6 }}><strong>F1:</strong> Web, contenidos, tiempo propio · <strong>F2+:</strong> APIs IA, marketing, kits maker, hosting</p>
                </CanvasBox>
              </div>
              <div style={{ gridColumn: "3 / span 3" }}>
                <CanvasBox title="Fuentes de ingresos" sub="Freemium escalonado" color={success}>
                  <p style={{ fontSize: 12, lineHeight: 1.6 }}>💳 SaaS free→premium · 📦 Kits físicos · 🎓 Formación · 🏫 Licencias centro · 📘 Packs premium · 🤖 IA avanzada</p>
                  <div style={{ marginTop: 8, padding: "6px 8px", borderRadius: 8, background: "#e8f5e9", border: "1px dashed rgba(67,160,71,.25)", fontSize: 11, color: "#2e7d32" }}>
                    <strong>Enfoque recomendado:</strong> modelo híbrido SaaS + formación.
                  </div>
                </CanvasBox>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: DATOS */}
        {activeTab === 1 && (
          <div>
            <Section title="Contexto educativo español — Datos objetivos">
              <p style={{ fontSize: 13, color: "#607080", marginBottom: 20 }}>Cifras oficiales que dimensionan el problema y el mercado potencial</p>
            </Section>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: navy }}>Percepción del profesorado (%)</h4>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={perceptionData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {perceptionData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p style={{ fontSize: 10, color: "#9aa8b5", marginTop: 4 }}>Fuentes: GoStudent/TusClasesParticulares 2024, MEC 2024-25</p>
              </div>

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: navy }}>Dimensión del sistema educativo</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {marketData.map(d => (
                    <div key={d.name} style={{ background: `linear-gradient(135deg, ${navy}, #14375a)`, borderRadius: 14, padding: "18px 16px", color: "#fff", textAlign: "center" }}>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: d.color, lineHeight: 1 }}>{d.display}</div>
                      <div style={{ fontSize: 11, opacity: .8, marginTop: 4 }}>{d.name}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "#f8f4ff", border: `1px solid ${purple}30` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: purple, marginBottom: 6 }}>DATO CLAVE PARA ESCAPIFY</div>
                  <p style={{ fontSize: 12, lineHeight: 1.6 }}>
                    Con <strong>~800k docentes</strong> no universitarios, si Escapify captura solo el <strong>0.1%</strong> del mercado en fase inicial = <strong>~800 docentes activos</strong>. Con conversión del 6% a premium (€9/mes) = <strong>~€500/mes MRR</strong> como punto de partida validable.
                  </p>
                </div>
                <div style={{ marginTop: 10, padding: 14, borderRadius: 12, background: "#fff8e1", border: `1px solid ${gold}40` }}>
                  <p style={{ fontSize: 12, lineHeight: 1.6 }}>
                    <strong>Tendencia:</strong> Las pedagogías activas (gamificación, ABP) son tendencia educativa clave para 2025-26. La IA y la personalización del aprendizaje se consolidan como ejes transversales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPETENCIA */}
        {activeTab === 2 && (
          <div>
            <Section title="Análisis competitivo detallado">
              <p style={{ fontSize: 13, color: "#607080", marginBottom: 16 }}>Comparativa completa incluyendo Lockee.fr y EduEscapeRoom.com</p>
            </Section>

            <CompTable />

            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginTop: 24 }}>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: navy }}>Radar competitivo (1-10)</h4>
                <ResponsiveContainer width="100%" height={340}>
                  <RadarChart data={competitorRadar}>
                    <PolarGrid stroke="#e0ecf5" />
                    <PolarAngleAxis dataKey="dim" tick={{ fontSize: 10, fill: navy }} />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 9 }} />
                    <Radar name="Escapify" dataKey="Escapify" stroke={accent} fill={accent} fillOpacity={0.25} strokeWidth={2.5} />
                    <Radar name="Genially" dataKey="Genially" stroke={blue} fill={blue} fillOpacity={0.08} strokeWidth={1.5} />
                    <Radar name="Lockee.fr" dataKey="Lockee" stroke={purple} fill={purple} fillOpacity={0.06} strokeWidth={1.5} />
                    <Radar name="Breakout EDU" dataKey="BreakoutEDU" stroke={warm} fill={warm} fillOpacity={0.06} strokeWidth={1.5} />
                    <Radar name="Kahoot" dataKey="Kahoot" stroke={gold} fill={gold} fillOpacity={0.06} strokeWidth={1.5} />
                    <Radar name="EduEscapeRoom" dataKey="EduEscapeRoom" stroke={success} fill={success} fillOpacity={0.06} strokeWidth={1.5} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: navy }}>Análisis por competidor</h4>
                {[
                  { name: "Lockee.fr", color: purple, desc: "Servicio francés gratuito de candados virtuales (numéricos, color, musicales, geolocalización). Límite 60 candados. Muy popular entre docentes hispanos vía S'cape. Sin escape rooms completos, sin inclusión, sin maker, sin IA. Solo herramienta puntual, no sistema." },
                  { name: "EduEscapeRoom", color: success, desc: "Generador web de candados digitales gratuito + blog con guías. Herramienta simple y específica. Sin plataforma, sin adaptaciones, sin componente físico, sin IA. Recurso aislado." },
                  { name: "Genially", color: blue, desc: "Plataforma de contenido interactivo. Permite crear breakouts con plantillas S'cape, pero requiere integrar herramientas externas (Lockee). No hay escape rooms completos ni inclusión. Solo digital." },
                  { name: "Breakout EDU", color: warm, desc: "Kits físicos de EE.UU. Buenos materiales pero caros ($150+), sin componente digital integrado, sin adaptaciones de inclusión, sin presencia en mercado hispano." },
                ].map(c => (
                  <div key={c.name} style={{ padding: "10px 12px", borderRadius: 10, background: `${c.color}08`, border: `1px solid ${c.color}20`, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: c.color, marginBottom: 3 }}>{c.name}</div>
                    <p style={{ fontSize: 11, lineHeight: 1.5, color: "#1c2f42" }}>{c.desc}</p>
                  </div>
                ))}
                <div style={{ padding: "10px 12px", borderRadius: 10, background: "#e8f5e9", border: `1px solid ${success}30`, marginTop: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: navy }}>→ Conclusión</div>
                  <p style={{ fontSize: 11, lineHeight: 1.5 }}>Ningún competidor integra las 4 dimensiones: escape room completo + inclusión real + maker + IA. Lockee.fr y EduEscapeRoom resuelven solo candados. Genially es plataforma genérica. El nicho de "sistema completo de escape room educativo inclusivo" está vacío.</p>
                </div>
                <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 10, background: "#f3f7ff", border: `1px solid ${blue}30` }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: navy, marginBottom: 4 }}>Integración web con Lockee.fr (MVP)</div>
                  <p style={{ fontSize: 11, lineHeight: 1.55 }}>
                    1) Diseñar narrativa/pistas en Escapify → 2) Crear candados en Lockee → 3) Integrar por iframe o enlace controlado → 4) Medir activación (docente aplica en aula).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TARGET */}
        {activeTab === 3 && (
          <div>
            <Section title="Doble Target: Docente + Alumno">
              <p style={{ fontSize: 13, color: "#607080", marginBottom: 20 }}>No solo el profesor como usuario — también el alumno como beneficiario final</p>
            </Section>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={{ padding: 20, borderRadius: 16, background: "#f5faff", border: `1px solid ${blue}20` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: blue, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Target primario · Docente</div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, color: navy, marginBottom: 12 }}>¿Qué problema le resuelve?</h3>
                {[
                  { icon: "⏱️", title: "Tiempo", desc: "De 8-15h de diseño manual → <1h con Escapify" },
                  { icon: "🧩", title: "Complejidad", desc: "Sin saber game design ni programación" },
                  { icon: "♿", title: "Inclusión", desc: "Adaptaciones listas sin formación en NEE" },
                  { icon: "⭐", title: "Diferenciación", desc: "Innova con evidencia y rigor" },
                  { icon: "📦", title: "Coherencia", desc: "Sistema unificado vs. patchwork de fuentes" },
                ].map(item => (
                  <div key={item.title} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: navy }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: "#607080" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: 20, borderRadius: 16, background: "#fff8e1", border: `1px solid ${gold}30` }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: gold, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Target beneficiario · Alumno</div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: 18, color: navy, marginBottom: 12 }}>¿Qué gana el alumno?</h3>
                {[
                  { icon: "🎮", title: "Motivación", desc: "Participación activa vs. escucha pasiva" },
                  { icon: "🤝", title: "Inclusión real", desc: "Pistas escalonadas, roles distribuidos, adaptaciones sensoriales" },
                  { icon: "🧠", title: "Aprendizaje significativo", desc: "Conexión emocional a través de narrativa y experiencia" },
                  { icon: "💡", title: "Competencias transversales", desc: "Trabajo en equipo, pensamiento crítico, creatividad" },
                  { icon: "📊", title: "Resultado validado", desc: "94% satisfacción · 43 episodios de liderazgo emergente" },
                ].map(item => (
                  <div key={item.title} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: navy }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: "#607080" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 16, borderRadius: 14, background: `${purple}08`, border: `1px solid ${purple}15` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: purple, marginBottom: 6 }}>INSIGHT DEL FEEDBACK</div>
              <p style={{ fontSize: 12, lineHeight: 1.6 }}>
                El alumno es el beneficiario final y su experiencia valida el producto. <strong>Sin motivación del alumno, el docente no repite.</strong> Por eso la propuesta de valor debe comunicar resultados en AMBOS lados: ahorro para el profe + impacto real para el alumno.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: MVP */}
        {activeTab === 4 && (
          <div>
            <Section title="Plan de validación y MVP">
              <p style={{ fontSize: 13, color: "#607080", marginBottom: 20 }}>Las 3 piezas clave que el feedback pide definir con claridad</p>
            </Section>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[
                { lbl: "Perfil docente inicial", title: "Nicho MVP", color: blue, items: ["Primaria + 1º-2º ESO", "Sensibilidad innovadora (STEAM, gamificación)", "Centros tipo CSMB o con proyectos EBI/ABP", "Red directa + centros cercanos primero"], note: "Un solo perfil → una etapa → un tipo de centro" },
                { lbl: "Problema concreto", title: "Qué le ahorras", color: warm, items: ["No es 'gamificación genérica'", "Es: 'Un escape room real para mi clase en <1h'", "Con materiales listos y adaptados a mi grupo", "Que funcione el lunes sin empezar de cero"], note: "Reducción: de 8-15h manual → <1h con Escapify" },
                { lbl: "MVP concreto", title: "Qué se valida primero", color: success, items: ["Pack candados digitales propios", "Plantillas imprimibles (estilo Archivo del Tiempo)", "1 escape room modelo listo (La Maleta como demo)", "Onboarding: aplicar en <30 min"], note: "Métrica éxito: ¿lo aplica EN CLASE y vuelve?" },
              ].map(card => (
                <div key={card.title} style={{ padding: 18, borderRadius: 14, background: "#fff", border: `1px solid ${card.color}25` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: card.color, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>{card.lbl}</div>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: 17, color: navy, marginBottom: 10 }}>{card.title}</h3>
                  <ul style={{ paddingLeft: 16, fontSize: 12, lineHeight: 1.6 }}>
                    {card.items.map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{item}</li>)}
                  </ul>
                  <div style={{ marginTop: 10, padding: "6px 8px", borderRadius: 8, background: `${card.color}10`, fontSize: 11, color: card.color, fontWeight: 600 }}>
                    → {card.note}
                  </div>
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: 14, fontWeight: 700, color: navy, marginBottom: 12 }}>Acciones de validación de mercado</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
              {[
                { icon: "🎤", title: "Discovery", items: ["10-15 entrevistas docentes", "5 entrevistas alumno", "3 centros (decisores)", "2-3 empresas escape edu"] },
                { icon: "🌐", title: "Landing + Waitlist", items: ["Landing propuesta clara", "CTA: 'Accede a la beta'", "Medir: registros, tasa, origen", "A/B test mensajes"] },
                { icon: "🧪", title: "Beta cerrada", items: ["5-10 docentes usan MVP", "¿Lo aplican? ¿Repiten?", "Entrevistas post-uso", "NPS + disposición a pago"] },
                { icon: "💰", title: "Smoke test monetización", items: ["Pack premium €9-19", "Conversión real (no intención)", "Test 3 franjas precio", "Freemium vs. pago directo"] },
              ].map(card => (
                <div key={card.title} style={{ padding: 14, borderRadius: 12, background: "#fafcff", border: "1px solid #e0ecf5" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{card.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: navy, marginBottom: 6 }}>{card.title}</div>
                  <ul style={{ paddingLeft: 14, fontSize: 11, lineHeight: 1.6 }}>
                    {card.items.map((item, i) => <li key={i} style={{ marginBottom: 3 }}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ESTADO PRODUCTO */}
        {activeTab === 5 && (
          <div>
            <Section title="Qué está funcional hoy y qué viene después">
              <p style={{ fontSize: 13, color: "#607080", marginBottom: 18 }}>
                Para quien entra por primera vez: separar claramente realidad actual, MVP y roadmap.
              </p>
            </Section>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div style={{ padding: 16, borderRadius: 12, background: "#e8f5e9", border: "1px solid #c8e6c9" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: success, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>Ya funcional</div>
                <ul style={{ paddingLeft: 16, fontSize: 12, lineHeight: 1.65 }}>
                  <li>Landing y narrativa de proyecto</li>
                  <li>Demo validada: La Maleta del Tiempo</li>
                  <li>Base metodológica e inclusión documentada</li>
                </ul>
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: "#f3f8ff", border: "1px solid #d3e6f7" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: blue, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>MVP inmediato</div>
                <ul style={{ paddingLeft: 16, fontSize: 12, lineHeight: 1.65 }}>
                  <li>Generador guiado de 1 escape room</li>
                  <li>Candados digitales + plantillas</li>
                  <li>Onboarding para usar en &lt;30 min</li>
                </ul>
              </div>
              <div style={{ padding: 16, borderRadius: 12, background: "#f8f4ff", border: "1px solid #e3d9f6" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: purple, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>Roadmap</div>
                <ul style={{ paddingLeft: 16, fontSize: 12, lineHeight: 1.65 }}>
                  <li>IA para narrativa/adaptaciones</li>
                  <li>Kits maker físicos (láser/3D)</li>
                  <li>Licencias de centro + marketplace</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FUNNEL */}
        {activeTab === 6 && (
          <div>
            <Section title="Embudo de captación y escalabilidad">
              <p style={{ fontSize: 13, color: "#607080", marginBottom: 20 }}>De red cercana a captación escalable — responde a la pregunta central del feedback</p>
            </Section>

            {/* Funnel visualization */}
            <div style={{ display: "flex", alignItems: "stretch", gap: 6, marginBottom: 28 }}>
              {funnelSteps.map((step, i) => {
                const widthPct = 20 + (4 - i) * 12;
                const opacity = 1 - i * 0.12;
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: `${widthPct}%`, minWidth: 80,
                      background: `linear-gradient(180deg, ${[accent, blue, purple, warm, success][i]}, ${[accent, blue, purple, warm, success][i]}cc)`,
                      borderRadius: 12, padding: "14px 10px", textAlign: "center", color: "#fff",
                      opacity,
                    }}>
                      <div style={{ fontSize: 24 }}>{step.icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 800, marginTop: 4 }}>{step.title}</div>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: 22, marginTop: 2 }}>{step.users.toLocaleString()}</div>
                    </div>
                    {i < funnelSteps.length - 1 && (
                      <div style={{ fontSize: 10, color: warm, fontWeight: 800, margin: "4px 0", textAlign: "center" }}>
                        {Math.round(funnelSteps[i + 1].users / step.users * 100)}% →
                      </div>
                    )}
                    <div style={{ marginTop: 8, padding: 10, borderRadius: 10, background: "#fafcff", border: "1px solid #e0ecf5", width: "100%", fontSize: 11 }}>
                      <div style={{ fontWeight: 700, color: navy, marginBottom: 4 }}>{step.desc}</div>
                      <ul style={{ paddingLeft: 14, lineHeight: 1.5 }}>
                        {step.actions.map((a, j) => <li key={j}>{a}</li>)}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ padding: 16, borderRadius: 14, background: `${accent}08`, border: `1px solid ${accent}20` }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 8 }}>Fase 1: Red cercana (meses 1-3)</h4>
                <ul style={{ paddingLeft: 16, fontSize: 12, lineHeight: 1.7 }}>
                  <li>Profesorado directo (TFM, CSMB, contactos)</li>
                  <li>Beta cerrada con 5-10 docentes reales</li>
                  <li>Formación 6h como canal de entrada</li>
                  <li>Feedback directo, iterar MVP</li>
                </ul>
              </div>
              <div style={{ padding: 16, borderRadius: 14, background: `${blue}08`, border: `1px solid ${blue}20` }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 8 }}>Fase 2: Escalable (meses 4-12)</h4>
                <ul style={{ paddingLeft: 16, fontSize: 12, lineHeight: 1.7 }}>
                  <li>Content marketing (blog SEO + redes)</li>
                  <li>Meta Ads segmentados (docentes innovadores)</li>
                  <li>Referral programa (docente invita docente)</li>
                  <li>Licencias centro + workshops presenciales</li>
                  <li>LinkedIn marca personal como amplificador</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: RIESGOS */}
        {activeTab === 7 && (
          <div>
            <Section title="Hipótesis y Riesgos">
              <p style={{ fontSize: 13, color: "#607080", marginBottom: 20 }}>Qué validar y qué puede fallar — visión honesta para el pitch</p>
            </Section>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 12 }}>Hipótesis a validar</h4>
                {hypotheses.map(h => (
                  <div key={h.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, padding: "10px 12px", borderRadius: 10, background: `${statusColors[h.status]}08`, border: `1px solid ${statusColors[h.status]}20` }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 32, height: 22, borderRadius: 6, background: statusColors[h.status], color: "#fff", fontSize: 10, fontWeight: 800 }}>{h.id}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: navy }}>{h.text}</div>
                      <div style={{ fontSize: 10, color: "#607080", marginTop: 2 }}>Métrica: {h.metric}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: statusColors[h.status], whiteSpace: "nowrap" }}>
                      {statusLabels[h.status]}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 12 }}>Mapa de riesgos (impacto × probabilidad)</h4>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={riskData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0ecf5" />
                    <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="risk" width={120} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="impact" fill={warm} name="Impacto" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="probability" fill={blue} name="Probabilidad" radius={[0, 4, 4, 0]} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </BarChart>
                </ResponsiveContainer>

                <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#ffebee", border: "1px solid #ef535030" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#ef5350", marginBottom: 4 }}>MITIGACIÓN PRINCIPAL</div>
                  <p style={{ fontSize: 12, lineHeight: 1.6 }}>
                    <strong>Validar ANTES de construir.</strong> MVP ultra-ligero. Medir uso real, no registros. Test de pago con beta cerrada antes de invertir en desarrollo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: FINANZAS */}
        {activeTab === 8 && (
          <div>
            <Section title="Escenarios económico-financieros">
              <p style={{ fontSize: 13, color: "#607080", marginBottom: 20 }}>
                Tres escenarios para validar con entrevistas y beta real (10-15 potenciales clientes).
              </p>
            </Section>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
              {Object.entries(scenarios).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setSelectedScenario(key)}
                  style={{
                    border: `1px solid ${selectedScenario === key ? blue : "#d0dfec"}`,
                    background: selectedScenario === key ? blue : "#fff",
                    color: selectedScenario === key ? "#fff" : blue,
                    borderRadius: 999,
                    padding: "7px 12px",
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: ".05em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Docentes activos", value: scenario.activos, max: 650, suffix: "" },
                { label: "Conversión premium", value: scenario.conversion, max: 12, suffix: "%" },
                { label: "MRR estimado", value: scenario.mrr, max: 6000, suffix: "€", money: true },
              ].map((kpi) => (
                <div key={kpi.label} style={{ border: "1px solid #dbe9f5", borderRadius: 12, padding: 12, background: "#f8fcff" }}>
                  <div style={{ fontSize: 10, color: "#607080", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700 }}>{kpi.label}</div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 28, color: navy, lineHeight: 1.15, marginTop: 4 }}>
                    {kpi.money ? `€${kpi.value.toLocaleString()}` : `${kpi.value}${kpi.suffix}`}
                  </div>
                  <div style={{ marginTop: 8, height: 8, borderRadius: 999, background: "#e6f0f8", overflow: "hidden" }}>
                    <span style={{ display: "block", width: `${Math.min(100, (kpi.value / kpi.max) * 100)}%`, height: "100%", background: `linear-gradient(90deg, ${blue}, ${accent})` }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 14, borderRadius: 12, border: "1px solid #dbe9f5", background: "#fff", marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: navy, marginBottom: 8 }}>Evolución MRR estimada (6 meses)</h4>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={financialEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0ecf5" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => `€${v.toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="pesimista" stroke={warm} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="medio" stroke={blue} strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="optimista" stroke={success} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ padding: 12, borderRadius: 10, background: "#fff8e1", border: "1px solid #ffe082", fontSize: 12, lineHeight: 1.6 }}>
              <strong>Próximo paso recomendado:</strong> validar estas hipótesis con 10-15 docentes (entrevistas + beta) antes de priorizar desarrollo pesado.
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ padding: "12px 20px", background: "#f0f4f8", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 10, color: "#9aa8b5" }}>
        <span><strong style={{ color: navy }}>Escapify.io</strong> · Lean Canvas V2 · Iterado con feedback</span>
        <span>Datos: MEC 2024-25 · GoStudent 2024 · I Congreso Lúdica 2025</span>
        <span>Producto demostrador: La Maleta del Tiempo · <strong style={{ color: navy }}>archivotiempo.github.io</strong></span>
      </div>
    </div>
  );
}