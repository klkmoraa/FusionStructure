'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Copy,
  Download,
  Eye,
  FileSearch,
  FileText,
  FolderOpen,
  Gauge,
  Grid2X2,
  HardHat,
  ImageIcon,
  Info,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Moon,
  MousePointer2,
  Plus,
  RotateCcw,
  Ruler,
  Save,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  Sun,
  Terminal,
  Trash2,
  Undo2,
  Workflow,
  X,
  ZoomIn,
  type LucideIcon,
} from 'lucide-react';

type SectionId = 'north-star' | 'signals' | 'type' | 'motion' | 'material' | 'patterns' | 'mockups' | 'voice';
type Theme = 'light' | 'dark';
type MotionMode = 'full' | 'calm';
type MotionChoice = 'arrive' | 'connect' | 'confirm';
type MaterialLevel = 'paper' | 'pane' | 'float';
type LayoutMode = 'desktop' | 'mobile';

const sectionItems: ReadonlyArray<{ id: SectionId; index: string; label: string; detail: string }> = [
  { id: 'north-star', index: '01', label: 'Norte', detail: 'Qué debe sentirse' },
  { id: 'signals', index: '02', label: 'Señales', detail: 'Color con significado' },
  { id: 'type', index: '03', label: 'Tipografía', detail: 'Leer sin traducir' },
  { id: 'motion', index: '04', label: 'Movimiento', detail: 'Respuesta, no ruido' },
  { id: 'material', index: '05', label: 'Materia', detail: 'Capas que orientan' },
  { id: 'patterns', index: '06', label: 'Patrones', detail: 'Orden que se adapta' },
  { id: 'mockups', index: '07', label: 'Mockups', detail: 'El sistema en producto' },
  { id: 'voice', index: '08', label: 'Voz', detail: 'Lenguaje honesto' },
];

const signalTokens = [
  { id: 'axial', name: 'Axial', short: 'N', color: '#63C5FF', ink: '#176B9D', token: '--fs-signal-axial', use: 'fuerza normal', description: 'Azul claro para tensión y compresión axial a lo largo del elemento.' },
  { id: 'moment', name: 'Momento', short: 'M', color: '#FF6F66', ink: '#B83A33', token: '--fs-signal-moment', use: 'flexión', description: 'Coral para diagramas de momento, giros y zonas dominadas por flexión.' },
  { id: 'shear', name: 'Cortante', short: 'V', color: '#55C990', ink: '#177A50', token: '--fs-signal-shear', use: 'fuerza transversal', description: 'Verde para cortante y relaciones de transferencia entre elementos.' },
  { id: 'error', name: 'Alerta', short: '!', color: '#F3C553', ink: '#825C00', token: '--fs-signal-error', use: 'error o revisión', description: 'Amarillo para advertir, pedir revisión o señalar datos incompletos.' },
  { id: 'deformed', name: 'Deformada', short: 'Δ', color: '#9B87FF', ink: '#6248B5', token: '--fs-signal-deformed', use: 'geometría desplazada', description: 'Morado para distinguir la forma deformada de la geometría original.' },
  { id: 'yield', name: 'Fluencia', short: 'FY', color: '#EF7AB9', ink: '#A43E73', token: '--fs-signal-yield', use: 'línea de fluencia', description: 'Rosa para líneas de fluencia, plastificación y estados límite locales.' },
] as const;

const motionTokens = [
  { name: 'Rápido', value: '120ms', use: 'foco y control' },
  { name: 'Puente', value: '180ms', use: 'cambio de plano' },
  { name: 'Revelar', value: '260ms', use: 'contenido contextual' },
  { name: 'Pulso', value: '680ms', use: 'espera y proceso' },
] as const;

const surfaceTokens = [
  { name: 'Papel', light: '#F6F5F0', dark: '#171A1C', use: 'fondo principal' },
  { name: 'Panel', light: '#FFFEFA', dark: '#252A2E', use: 'superficie de trabajo' },
  { name: 'Elevado', light: '#ECEFE8', dark: '#30363B', use: 'control o tarjeta' },
  { name: 'Borde', light: '#A7B1A9', dark: '#6A746E', use: 'separación visible' },
  { name: 'Sombra', light: '#D6DCD5', dark: '#080A0B', use: 'profundidad con blur corto' },
] as const;

const toolBrands: ReadonlyArray<{
  id: string;
  name: string;
  role: string;
  color: string;
  Icon: LucideIcon;
  status: 'Disponible' | 'Experimental' | 'Planeado';
}> = [
  { id: 'hub', name: 'Fusion Hub', role: 'proyecto común', color: '#63C5FF', Icon: Workflow, status: 'Disponible' },
  { id: 'solver-2d', name: 'Plano', role: 'Solver 2D · marcos y armaduras', color: '#FF6F66', Icon: Ruler, status: 'Disponible' },
  { id: 'space-3d', name: 'Space 3D', role: 'espacio estructural', color: '#55C990', Icon: Box, status: 'Experimental' },
  { id: 'doctor', name: 'Model Doctor', role: 'diagnóstico del modelo', color: '#F3C553', Icon: Stethoscope, status: 'Disponible' },
  { id: 'evidence', name: 'Evidence', role: 'documentos y procedencia', color: '#9B87FF', Icon: FileSearch, status: 'Planeado' },
  { id: 'cost-time', name: 'Cost + Time', role: 'costo y programa', color: '#EF7AB9', Icon: CalendarClock, status: 'Planeado' },
  { id: 'field', name: 'Field', role: 'campo y seguridad', color: '#63C5FF', Icon: HardHat, status: 'Planeado' },
  { id: 'learn', name: 'Learn', role: 'educación y ejemplos', color: '#55C990', Icon: BookOpen, status: 'Planeado' },
];

const iconSamples = [
  { name: 'Seleccionar', Icon: MousePointer2 },
  { name: 'Abrir', Icon: FolderOpen },
  { name: 'Guardar', Icon: Save },
  { name: 'Revisar', Icon: Eye },
  { name: 'Acercar', Icon: ZoomIn },
  { name: 'Deshacer', Icon: Undo2 },
  { name: 'Exportar', Icon: Download },
  { name: 'Bloquear', Icon: LockKeyhole },
  { name: 'Documento', Icon: FileText },
  { name: 'Más', Icon: MoreHorizontal },
] as const;

const diagramSamples = [
  { id: 'axial', name: 'Axial', unit: 'N · kN', color: '#63C5FF' },
  { id: 'moment', name: 'Momento', unit: 'M · kN·m', color: '#FF6F66' },
  { id: 'shear', name: 'Cortante', unit: 'V · kN', color: '#55C990' },
  { id: 'deformed', name: 'Deformada', unit: 'Δ · mm', color: '#9B87FF' },
  { id: 'yield', name: 'Fluencia', unit: 'Fy · estado', color: '#EF7AB9' },
] as const;

const mockupItems = [
  { id: 'day-analysis', mode: 'day', format: 'landscape', src: '/mockups/fusionstructure-desktop-day.png', title: 'Mesa de análisis', note: 'Modelo, resultados e inspector comparten un solo campo de trabajo.' },
  { id: 'day-projects', mode: 'day', format: 'landscape', src: '/mockups/day-project-hub.png', title: 'Continuidad de proyecto', note: 'Fases, versiones y siguiente acción sin convertir el inicio en un tablero genérico.' },
  { id: 'day-model', mode: 'day', format: 'landscape', src: '/mockups/day-model-loads.png', title: 'Modelado directo', note: 'La carga nace del elemento seleccionado y la profundidad explica la relación.' },
  { id: 'day-compare', mode: 'day', format: 'landscape', src: '/mockups/day-results-compare.png', title: 'Comparación estructural', note: 'Los seis colores se alinean por significado y permiten comparar sin traducir.' },
  { id: 'day-field', mode: 'day', format: 'portrait', src: '/mockups/day-mobile-field-review.png', title: 'Revisión de campo', note: 'Una incidencia, su evidencia y un siguiente paso visible en móvil.' },
  { id: 'night-model', mode: 'night', format: 'landscape', src: '/mockups/night-model-editor.png', title: 'Modelo Charcoal', note: 'Carbón neutro con superficies elevadas y color técnico de alta legibilidad.' },
  { id: 'night-results', mode: 'night', format: 'landscape', src: '/mockups/night-results-explorer.png', title: 'Explorador de resultados', note: 'Diagramas sincronizados, estación seleccionada y deformada vinculada.' },
  { id: 'night-trace', mode: 'night', format: 'landscape', src: '/mockups/night-decision-trace.png', title: 'Traza de decisión', note: 'Modelo, análisis, incidencia y evidencia dentro de una secuencia reversible.' },
  { id: 'night-report', mode: 'night', format: 'landscape', src: '/mockups/night-report-evidence.png', title: 'Reporte y procedencia', note: 'El documento conserva vínculos visibles con modelos, resultados y versiones.' },
  { id: 'night-mobile', mode: 'night', format: 'portrait', src: '/mockups/night-mobile-results.png', title: 'Resultados móviles', note: 'Charcoal mantiene foco táctil y significado estructural en poco espacio.' },
] as const;

const SectionIntro = ({ index, eyebrow, title, body }: { index: string; eyebrow: string; title: string; body: string }) => (
  <div className="section-intro">
    <div className="section-intro__meta"><span>{index}</span><span>{eyebrow}</span></div>
    <h2>{title}</h2>
    <p>{body}</p>
  </div>
);

const BrandMark = ({ small = false, label = false }: { small?: boolean; label?: boolean }) => (
  <span className={`brand-mark ${small ? 'brand-mark--small' : ''}`} aria-hidden={!label}>
    <svg viewBox="0 0 48 48" role={label ? 'img' : undefined} aria-label={label ? 'Símbolo de FusionStructure' : undefined}>
      <path className="brand-mark__piece" d="M4 5h15v7h-7v7H4z" />
      <path className="brand-mark__piece" d="M29 5h15v14h-8v-7h-7z" />
      <path className="brand-mark__piece" d="M4 29h8v7h7v8H4z" />
      <path className="brand-mark__piece" d="M29 36h7v-7h8v15H29z" />
      <circle className="brand-mark__register" cx="39" cy="10" r="2.25" />
    </svg>
  </span>
);

const ToolMark = ({ color, Icon }: { color: string; Icon: LucideIcon }) => (
  <span className="tool-mark" style={{ '--tool-color': color } as CSSProperties}>
    <svg className="tool-mark__frame" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M4 5h15v7h-7v7H4zM29 5h15v14h-8v-7h-7zM4 29h8v7h7v8H4zM29 36h7v-7h8v15H29z" />
    </svg>
    <Icon className="tool-mark__glyph" size={19} strokeWidth={1.8} aria-hidden="true" />
  </span>
);

const MiniDiagram = ({ type, color }: { type: (typeof diagramSamples)[number]['id']; color: string }) => (
  <svg className="mini-diagram" viewBox="0 0 180 92" aria-hidden="true" style={{ '--diagram-color': color } as CSSProperties}>
    <path className="mini-diagram__axis" d="M12 46H168" />
    {type === 'axial' ? <><path className="mini-diagram__signal" d="M24 46v-12m18 12v-20m18 20V17m18 29V11m18 35V18m18 28V27m18 19V35" /><path className="mini-diagram__signal" d="m20 34 4 5 4-5m10-8 4 5 4-5m10-9 4 5 4-5m10-6 4 5 4-5m10-3 4 5 4-5m10 4 4 5 4-5m10 8 4 5 4-5" /></> : null}
    {type === 'moment' ? <><path className="mini-diagram__fill" d="M18 46C52 46 58 78 90 78s38-32 72-32V46H18Z" /><path className="mini-diagram__signal" d="M18 46C52 46 58 78 90 78s38-32 72-32" /></> : null}
    {type === 'shear' ? <><path className="mini-diagram__fill" d="m18 22 64 24-64 22Zm144 2L98 46l64 24Z" /><path className="mini-diagram__signal" d="m18 22 64 24-64 22m144-44L98 46l64 24" /></> : null}
    {type === 'deformed' ? <><path className="mini-diagram__ghost" d="M20 24h140" /><path className="mini-diagram__signal" d="M20 24c30 0 34 48 70 48s42-48 70-48" /><circle className="mini-diagram__point" cx="20" cy="24" r="3" /><circle className="mini-diagram__point" cx="160" cy="24" r="3" /></> : null}
    {type === 'yield' ? <><path className="mini-diagram__ghost" d="M24 70 58 22l32 48 34-48 32 48" /><path className="mini-diagram__signal" d="M24 70 90 22l66 48M58 22l66 48" /><circle className="mini-diagram__point" cx="90" cy="22" r="4" /></> : null}
  </svg>
);

const Status = ({ tone, children }: { tone: 'ready' | 'experimental' | 'planned'; children: string }) => (
  <span className={`status status--${tone}`}><span className="status__dot" />{children}</span>
);

const CopyChip = ({ value, onCopy, copied }: { value: string; onCopy: () => void; copied: boolean }) => (
  <button type="button" className="copy-chip" onClick={onCopy} title="Copiar token"><code>{value}</code>{copied ? <Check size={13} /> : <Copy size={13} />}</button>
);

export default function Home() {
  const [theme, setTheme] = useState<Theme>('light');
  const [motionMode, setMotionMode] = useState<MotionMode>('full');
  const [activeSection, setActiveSection] = useState<SectionId>('north-star');
  const [activeSignal, setActiveSignal] = useState<(typeof signalTokens)[number]['id']>('axial');
  const [motionChoice, setMotionChoice] = useState<MotionChoice>('arrive');
  const [motionReplay, setMotionReplay] = useState(0);
  const [materialLevel, setMaterialLevel] = useState<MaterialLevel>('float');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('desktop');
  const [fontWeight, setFontWeight] = useState(650);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [copiedValue, setCopiedValue] = useState('');
  const copyTimer = useRef<number | undefined>(undefined);

  const selectedSignal = useMemo(() => signalTokens.find((signal) => signal.id === activeSignal) ?? signalTokens[0], [activeSignal]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id as SectionId);
    }, { rootMargin: '-18% 0px -58% 0px', threshold: [0.05, 0.2, 0.5] });
    sectionItems.forEach(({ id }) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
  }, []);

  const goTo = (id: SectionId) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: motionMode === 'calm' ? 'auto' : 'smooth', block: 'start' });
  };

  const copyValue = async (value: string) => {
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      // Clipboard is progressive enhancement; the token remains visible.
    }
    setCopiedValue(value);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopiedValue(''), 1800);
  };

  const siteStyle = { '--active-signal': selectedSignal.color, '--display-weight': fontWeight } as CSSProperties;
  const cycleSignal = () => {
    const currentIndex = signalTokens.findIndex((signal) => signal.id === activeSignal);
    setActiveSignal(signalTokens[(currentIndex + 1) % signalTokens.length].id);
  };

  return (
    <div className={`brandbook brandbook--${theme} ${motionMode === 'calm' ? 'brandbook--calm' : ''}`} style={siteStyle}>
      <header className="topbar">
        <button type="button" className="brand-lockup" onClick={() => goTo('north-star')} aria-label="Volver al inicio">
          <BrandMark />
          <span className="brand-lockup__name">FusionStructure</span>
          <span className="brand-lockup__slash">/</span>
          <span className="brand-lockup__sub">Brandbook</span>
        </button>
        <div className="topbar__center"><span className="live-dot" />Structural Paper <code>01—08</code></div>
        <div className="topbar__actions">
          <button type="button" className="top-control" onClick={() => setMotionMode((mode) => mode === 'full' ? 'calm' : 'full')} aria-pressed={motionMode === 'calm'}><Gauge size={15} /><span>{motionMode === 'calm' ? 'Calma' : 'Activo'}</span></button>
          <button type="button" className="top-control" onClick={() => setTheme((mode) => mode === 'light' ? 'dark' : 'light')} aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}><span>{theme === 'light' ? 'Día' : 'Noche'}</span>{theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}</button>
          <button type="button" className="menu-control" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Cerrar índice' : 'Abrir índice'}>{mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </header>

      <div className="app-frame">
        <aside className={`index-panel ${mobileMenuOpen ? 'index-panel--open' : ''}`}>
          <div className="index-panel__head"><span>Index / 2026</span><span className="index-panel__line" /></div>
          <nav aria-label="Secciones del brandbook">
            {sectionItems.map((item) => <button type="button" key={item.id} className={`index-link ${activeSection === item.id ? 'is-active' : ''}`} onClick={() => goTo(item.id)} aria-current={activeSection === item.id ? 'location' : undefined}><span className="index-link__number">{item.index}</span><span className="index-link__copy"><strong>{item.label}</strong><small>{item.detail}</small></span><ChevronRight size={14} /></button>)}
          </nav>
          <div className="index-panel__bottom"><div className="legend"><span><i className="legend__line legend__line--ink" />base</span><span><i className="legend__line legend__line--signal" />señal</span></div><p>Un sistema propio para hacer legible la complejidad del trabajo construido.</p><span className="index-panel__version">FS.SP / dirección 03</span></div>
        </aside>

        <main className="content">
          <section id="north-star" className="section hero">
            <div className="hero__copy">
              <div className="eyebrow"><span className="eyebrow__marker" />FusionStructure / sistema visual</div>
              <h1 aria-label="Make complexity legible."><span>Make</span><span>complexity</span><em>legible.</em></h1>
              <p className="hero__lead">Un sistema visual para convertir modelos, resultados y decisiones en una experiencia clara, conectada y trazable.</p>
              <div className="hero__buttons"><button type="button" className="action action--primary" onClick={() => goTo('signals')}>Explorar señales <ArrowRight size={16} /></button><button type="button" className="action action--quiet" onClick={() => copyValue('Make complexity legible.')}>Copiar principio <Copy size={14} /></button></div>
              <div className="hero__stats"><div><strong>1</strong><span>proyecto común</span></div><div><strong>6</strong><span>señales estructurales</span></div><div><strong>∞</strong><span>vistas conectadas</span></div></div>
            </div>
            <div className="field-board" aria-label="Mesa de trabajo interactiva">
              <div className="field-board__bar"><span>CAMPO / 00</span><span>MODELO → DECISIÓN → EVIDENCIA</span><button type="button" onClick={cycleSignal} aria-label="Cambiar señal visible"><Sparkles size={14} /></button></div>
              <div className="field-board__body">
                <div className="field-board__grid" aria-hidden="true" />
                <div className="axis axis--x"><span>X</span></div><div className="axis axis--y"><span>Y</span></div>
                <div className="beam beam--a" /><div className="beam beam--b" /><div className="beam beam--c" /><div className="beam beam--d" />
                <span className="node node--a" /><span className="node node--b" /><span className="node node--c" /><span className="node node--d" /><span className="node node--e" />
                <div className="force force--one"><span /><i>24.0 kN</i></div><div className="force force--two"><span /><i>8.0 kN/m</i></div>
                <div className="deflection" />
                <div className="field-note field-note--one"><span>01 / ENTRADA</span><strong>el modelo</strong><small>fuente de referencia</small></div>
                <div className="field-note field-note--two"><span>02 / RESULTADO</span><strong style={{ color: selectedSignal.color }}>{selectedSignal.short}</strong><small>significado vinculado</small></div>
                <span className="field-crosshair" aria-hidden="true" />
              </div>
              <div className="field-board__bottom"><span><span className="live-dot live-dot--green" />cursor / listo</span><code>12.000 m · 3.000 m</code><span>pasar / revisar</span></div>
            </div>
          </section>

          <section className="section manifesto-section">
            <div className="manifesto-quote"><span className="quote-mark">“</span><p>Todo lo importante cerca. Nada compite sin motivo.</p><span className="quote-author">— principio de interfaz</span></div>
            <div className="belief-grid"><article><span>01</span><h3>Claro por capas</h3><p>La primera acción se entiende de inmediato. El detalle aparece cuando aporta contexto.</p></article><article><span>02</span><h3>Movimiento útil</h3><p>Cada transición muestra qué llegó, qué cambió o qué puede deshacerse.</p></article><article><span>03</span><h3>Precisión honesta</h3><p>La interfaz distingue lo disponible, lo experimental y lo planeado.</p></article></div>
          </section>

          <section className="section identity-section" aria-labelledby="identity-title">
            <div className="identity-copy"><div className="section-intro__meta"><span>01A</span><span>Identidad / Familia</span></div><h2 id="identity-title">Una marca madre. Muchas herramientas reconocibles.</h2><p>Cuatro piezas se acercan a un núcleo común sin cerrarlo: el proyecto puede crecer y cada herramienta conserva su lugar. El símbolo general es neutral; las variantes añaden glifo y color.</p></div>
            <div className="identity-stage">
              <div className="logo-primary"><BrandMark label /><div><strong>FusionStructure</strong><span>Make complexity legible.</span></div></div>
              <div className="logo-variants"><div><BrandMark /><span>Marca / 48</span></div><div><BrandMark small /><span>Interfaz / 24</span></div><div className="logo-favicon"><BrandMark small /><span>Favicon / 16</span></div></div>
              <div className="logo-rule"><span>Espacio libre</span><p>Conservar una pieza completa alrededor del símbolo. La marca madre nunca adopta el color de una herramienta.</p></div>
            </div>
            <div className="brand-family" aria-labelledby="brand-family-title">
              <div className="brand-family__head"><div><span>ARQUITECTURA / MARCA RESPALDADA</span><h3 id="brand-family-title">El glifo identifica. El color agrupa.</h3></div><p>La forma compartida demuestra parentesco. El nombre y el glifo mantienen cada herramienta legible incluso sin color.</p></div>
              <div className="brand-family__grid">
                {toolBrands.map(({ id, name, role, color, Icon, status }) => <article key={id} style={{ '--tool-color': color } as CSSProperties}>
                  <ToolMark color={color} Icon={Icon} />
                  <div><strong>{name}</strong><small>{role}</small></div>
                  <span className={`brand-family__status brand-family__status--${status.toLowerCase()}`}>{status}</span>
                </article>)}
              </div>
              <div className="brand-family__rules"><div><span>01</span><strong>Marca madre neutral</strong><p>Identifica la plataforma completa.</p></div><div><span>02</span><strong>Glifo por función</strong><p>Evita depender sólo del color.</p></div><div><span>03</span><strong>Color por familia</strong><p>Orienta sin competir con los resultados.</p></div><div><span>04</span><strong>Nombre siempre visible</strong><p>El símbolo aislado se reserva a contextos conocidos.</p></div></div>
              <p className="brand-family__boundary"><Info size={14} /> La familia visual propone identidades; no cambia el estado real de cada módulo. Disponible, Experimental y Planeado siguen definidos por el producto ejecutable.</p>
            </div>
          </section>

          <section id="signals" className="section">
            <SectionIntro index="02" eyebrow="Color / Señales" title="El color explica el comportamiento." body="Los fondos permanecen tranquilos. El color aparece en líneas, puntos y estados para indicar qué resultado se está leyendo." />
            <div className="signals-lab">
              <div className="signal-list" role="tablist" aria-label="Tokens de señal">
                {signalTokens.map((signal) => <button type="button" key={signal.id} className={`signal-row signal-row--${signal.id} ${activeSignal === signal.id ? 'is-active' : ''}`} onClick={() => setActiveSignal(signal.id)} role="tab" aria-selected={activeSignal === signal.id}><span className="signal-row__swatch" style={{ backgroundColor: signal.color }} /><span><strong>{signal.name}</strong><small>{signal.use}</small></span><code>{signal.token}</code><ChevronRight size={14} /></button>)}
              </div>
              <div className="signal-stage" style={{ '--active-signal': selectedSignal.color } as CSSProperties}>
                <div className="signal-stage__top"><span>ACTIVO / {selectedSignal.short}</span><CopyChip value={selectedSignal.color} onCopy={() => copyValue(selectedSignal.color)} copied={copiedValue === selectedSignal.color} /></div>
                <div className="signal-plot"><div className="plot-axis plot-axis--left"><span>RESULT</span><span>+</span><span>0</span><span>−</span></div><svg viewBox="0 0 520 260" aria-label="Trazo de resultado con punto seleccionado"><path className="plot-grid" d="M36 54H486 M36 108H486 M36 162H486 M36 216H486 M112 26V232 M206 26V232 M300 26V232 M394 26V232" /><path className="plot-ghost" d="M36 188 C88 188 104 102 152 122 C201 142 208 183 256 150 C300 118 320 72 364 92 C410 112 430 186 486 120" /><path className="plot-signal" d="M36 172 C86 171 104 76 153 95 C204 115 211 165 257 126 C305 86 320 51 365 71 C410 91 431 167 486 101" /><circle className="plot-point" cx="257" cy="126" r="7" /><path className="plot-cursor" d="M257 126V232" /><text x="38" y="250">0.00</text><text x="453" y="250">12.00</text><text x="272" y="119">peak</text></svg><div className="plot-tooltip"><span className="plot-tooltip__ring" /><span><strong>{selectedSignal.name}</strong><small>{selectedSignal.description}</small></span></div></div>
                <div className="signal-stage__bottom"><span>usar en / línea · punto · estado</span><span>evitar / fondo completo</span></div>
              </div>
            </div>
            <div className="rule-strip"><span>REGLA 02</span><p>Si el color no explica una relación, se elimina.</p><span className="rule-strip__line" /></div>
            <div className="surface-palette"><div className="surface-palette__intro"><span>BASES / DÍA + NOCHE</span><strong>La profundidad nace del contraste.</strong><p>Cada tema separa fondo, panel, borde y sombra. El modo noche evita el negro puro en las superficies de contenido.</p></div><div className="surface-palette__tokens">{surfaceTokens.map((token) => <article key={token.name}><div className="surface-pair"><i style={{ background: token.light }} /><i style={{ background: token.dark }} /></div><strong>{token.name}</strong><small>{token.use}</small><code>{token.light}<br />{token.dark}</code></article>)}</div></div>
          </section>

          <section id="type" className="section type-section">
            <SectionIntro index="03" eyebrow="Tipografía / Jerarquía" title="La jerarquía se entiende antes de leerse." body="La sans orienta y permite actuar. La monoespaciada reserva un lugar preciso para unidades, coordenadas, versiones y procedencia." />
            <div className="type-lab">
              <div className="type-canvas"><span className="type-canvas__label">Screen sans / variable weight</span><div className="type-display" style={{ fontVariationSettings: `'wght' ${fontWeight}` }}>One clear<br /><em>next step.</em></div><div className="type-baseline"><span>La claridad puede tener carácter.</span><code>wght {fontWeight}</code></div></div>
              <div className="type-panel"><div className="panel-label"><span>Display weight</span><code>450—750</code></div><div className="weight-picker" aria-label="Peso de demostración">{[450, 550, 650, 750].map((weight) => <button type="button" key={weight} className={fontWeight === weight ? 'is-active' : ''} onClick={() => setFontWeight(weight)} aria-pressed={fontWeight === weight}>{weight}</button>)}</div><div className="type-panel__rule" /><div className="type-family"><span className="type-family__glyph">Aa</span><div><strong>Screen Sans</strong><small>nombres, acciones, contexto</small></div></div><div className="type-family"><span className="type-family__glyph type-family__glyph--mono">N/V/M</span><div><strong>Data Mono</strong><small>valores, unidades, trazas</small></div></div><div className="type-panel__tip"><CircleHelp size={14} /><span>Un número que no muestra su unidad todavía no está listo.</span></div></div>
            </div>
            <div className="type-scale"><div><span>Hero</span><strong>clamp(48 → 104)</strong><small>una idea que abre</small></div><div><span>Reading</span><strong>16 / 1.5</strong><small>un párrafo que acompaña</small></div><div><span>Data</span><strong>11 / mono</strong><small>un dato que compara</small></div><div><span>Label</span><strong>10 / caps</strong><small>una coordenada</small></div></div>
          </section>

          <section id="motion" className="section motion-section">
            <SectionIntro index="04" eyebrow="Movimiento / Respuesta" title="El movimiento muestra qué cambió." body="Las piezas llegan desde su origen, los estados mantienen continuidad y las relaciones se dibujan antes de pedir atención. Reducir movimiento nunca reduce información." />
            <div className="motion-lab">
              <div className="motion-screen"><div className="motion-screen__bar"><span>INTERACCIÓN / {motionChoice.toUpperCase()}</span><span className="motion-screen__live"><span className="live-dot live-dot--green" />{motionMode === 'calm' ? 'modo calma' : 'vista activa'}</span></div><div className="motion-screen__canvas"><div key={`${motionChoice}-${motionReplay}-${motionMode}`} className={`motion-sample motion-sample--${motionChoice}`}><span className="motion-sample__node motion-sample__node--a" /><span className="motion-sample__node motion-sample__node--b" /><span className="motion-sample__node motion-sample__node--c" /><span className="motion-sample__bridge" /><div className="motion-sample__caption"><code>{motionChoice === 'arrive' ? 'revelar / 260ms' : motionChoice === 'connect' ? 'conectar / 180ms' : 'confirmar / 120ms'}</code><strong>{motionChoice === 'arrive' ? 'Llega con contexto.' : motionChoice === 'connect' ? 'Conecta la siguiente superficie.' : 'Confirma el nuevo estado.'}</strong></div></div></div><div className="motion-screen__footer"><span>útil, reversible, tranquilo</span><button type="button" aria-label="Reproducir demostración" onClick={() => setMotionReplay((value) => value + 1)}><RotateCcw size={14} /> repetir</button></div></div>
              <div className="motion-controls"><div className="panel-label"><span>Elige el mensaje</span><code>uno a la vez</code></div><div className="motion-picker" aria-label="Demostraciones de movimiento">{([['arrive', 'Llegar', 'entrada contextual'], ['connect', 'Conectar', 'relación de superficies'], ['confirm', 'Confirmar', 'estado guardado']] as const).map(([id, label, note]) => <button type="button" aria-label={label} key={id} className={motionChoice === id ? 'is-active' : ''} onClick={() => setMotionChoice(id)} aria-pressed={motionChoice === id}><span>{label}</span><small>{note}</small><ChevronRight size={14} /></button>)}</div><button type="button" className="calm-switch" aria-label="Alternar modo calma" onClick={() => setMotionMode((mode) => mode === 'full' ? 'calm' : 'full')} aria-pressed={motionMode === 'calm'}><span className="switch-track"><span /></span><span><strong>{motionMode === 'calm' ? 'Modo calma activo' : 'Probar modo calma'}</strong><small>La preferencia de movimiento reducido conserva toda la información.</small></span></button></div>
            </div>
            <div className="token-grid">{motionTokens.map((token) => <div className="motion-token" key={token.name}><span>{token.name}</span><strong>{token.value}</strong><small>{token.use}</small></div>)}</div>
            <div className="brand-film">
              <div className="brand-film__copy"><span>REMOTION / BRAND MOTION 01</span><h3>Del modelo a una decisión legible.</h3><p>Una pieza original de 10.8 segundos: presenta la interfaz en dispositivos, conecta las seis señales estructurales y termina en el principio rector de la marca.</p><div><strong>1920 × 1080</strong><small>H.264 · loop silencioso · controles disponibles</small></div></div>
              <div className="brand-film__player"><div className="brand-film__bar"><span><span className="live-dot live-dot--green" /> Motion study</span><code>10.8s / 30fps</code></div><video autoPlay muted loop playsInline controls preload="metadata" poster="/motion/fusionstructure-brand-motion-poster.png" aria-label="Animación de marca de FusionStructure"><source src="/motion/fusionstructure-brand-motion.mp4" type="video/mp4" /></video></div>
            </div>
          </section>

          <section id="material" className="section material-section">
            <SectionIntro index="05" eyebrow="Materia / Profundidad" title="La profundidad también comunica." body="Borde, espacio y sombra indican qué está arriba, qué puede presionarse y qué superficie contiene la decisión actual." />
            <div className="material-lab">
              <div className="material-stage"><div className="material-stage__mesh" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /></div><div className={`material-card material-card--${materialLevel}`}><div className="material-card__header"><span>PROYECTO / NOROESTE</span><Status tone="ready">guardado</Status></div><div className="material-card__content"><div className="material-mini-graph"><span /><span /><span /><i /></div><div><strong>Traza de decisión</strong><small>modelo → análisis → nota</small></div></div>{detailOpen ? <div className="material-detail"><span>Señal reciente</span><strong style={{ color: selectedSignal.color }}>{selectedSignal.name}</strong><small>vinculada a Pórtico_01</small></div> : null}<button type="button" className="material-card__button" onClick={() => setDetailOpen((open) => !open)}>{detailOpen ? 'Cerrar traza' : 'Abrir traza'} <ArrowUpRight size={13} /></button></div><span className="material-annotation material-annotation--one">{materialLevel} / seleccionado</span><span className="material-annotation material-annotation--two">posición = jerarquía</span></div>
              <div className="material-controls"><div className="panel-label"><span>Elige el nivel</span><code>data-level</code></div>{([['paper', 'Papel', 'retícula / tabla'], ['pane', 'Panel', 'barra / inspector'], ['float', 'Flotante', 'popover / hoja']] as const).map(([id, label, note]) => <button type="button" key={id} className={`material-option material-option--${id} ${materialLevel === id ? 'is-active' : ''}`} onClick={() => setMaterialLevel(id)} aria-pressed={materialLevel === id}><span className="material-option__sample" /><span><strong>{label}</strong><small>{note}</small></span><ChevronRight size={14} /></button>)}<div className="material-controls__rule" /><div className="material-note"><LayersIcon /><span>Un nivel comunica una sola profundidad.</span></div></div>
            </div>
            <div className="component-system">
              <div className="component-system__head"><span>COMPONENTES / DÍA + CARBÓN</span><p>La geometría no cambia entre temas; cambian el papel, la tinta y la profundidad.</p></div>
              <div className="component-specimens">
                <article className="component-specimen component-specimen--day">
                  <div className="component-specimen__top"><span>DÍA / PAPEL</span><Sun size={15} /></div>
                  <div className="specimen-card"><div className="specimen-card__meta"><span>Pórtico 04</span><Status tone="ready">guardado</Status></div><strong>Envolvente axial</strong><div className="specimen-trace specimen-trace--axial"><i /><i /><i /><i /><i /></div><small>Nmax · 248.2 kN</small></div>
                  <div className="specimen-actions"><button type="button" className="specimen-button specimen-button--primary" onClick={() => setActiveSignal('axial')}>Revisar <ArrowUpRight size={13} /></button><button type="button" className="specimen-button specimen-button--quiet">Comparar</button><button type="button" className="specimen-button specimen-button--icon" aria-label="Añadir vista"><Plus size={14} /></button></div>
                </article>
                <article className="component-specimen component-specimen--night">
                  <div className="component-specimen__top"><span>NOCHE / CARBÓN</span><Moon size={15} /></div>
                  <div className="specimen-card"><div className="specimen-card__meta"><span>Revisión 12</span><span className="specimen-warning"><i />atención</span></div><strong>Traza de fluencia</strong><div className="specimen-trace specimen-trace--yield"><i /><i /><i /><i /><i /></div><small>Revisión local · nudo B4</small></div>
                  <div className="specimen-actions"><button type="button" className="specimen-button specimen-button--primary" onClick={() => setActiveSignal('yield')}>Revisar <ArrowUpRight size={13} /></button><button type="button" className="specimen-button specimen-button--quiet">Descartar</button><button type="button" className="specimen-button specimen-button--icon" aria-label="Añadir revisión"><Plus size={14} /></button></div>
                </article>
              </div>
              <div className="component-language">
                <div className="component-language__head"><span>01 / BOTONES</span><strong>La etiqueta anticipa el resultado.</strong><p>Todos los controles comparten altura, trazo, foco y respuesta al presionar.</p></div>
                <div className="button-showcase" aria-label="Variantes de botones"><button type="button" className="ui-button ui-button--primary"><Sparkles size={15} /> Analizar</button><button type="button" className="ui-button ui-button--secondary">Comparar</button><button type="button" className="ui-button ui-button--quiet">Ver detalle</button><button type="button" className="ui-button ui-button--danger"><Trash2 size={15} /> Eliminar</button><button type="button" className="ui-button ui-button--icon" aria-label="Más opciones"><MoreHorizontal size={17} /></button><button type="button" className="ui-button ui-button--loading" aria-label="Análisis en curso"><span className="ui-spinner" /> Analizando</button><button type="button" className="ui-button" disabled>Sin cambios</button></div>
                <div className="component-detail-grid">
                  <div className="icon-system"><div className="component-detail__label"><span>02 / ICONOS</span><code>1.75px · 18px</code></div><div className="icon-grid">{iconSamples.map(({ name, Icon }) => <button type="button" key={name} aria-label={name} title={name}><Icon size={18} strokeWidth={1.75} /><span>{name}</span></button>)}</div><p>Una familia de línea, extremos redondeados y metáforas directas.</p></div>
                  <div className="diagram-system"><div className="component-detail__label"><span>03 / DIAGRAMAS</span><code>color = significado</code></div><div className="diagram-grid">{diagramSamples.map((diagram) => <article key={diagram.id}><div><strong>{diagram.name}</strong><small>{diagram.unit}</small></div><MiniDiagram type={diagram.id} color={diagram.color} /></article>)}</div></div>
                </div>
                <div className="feedback-strip"><div><CheckCircle2 size={17} /><span><strong>Correcto</strong><small>El modelo está listo para analizar.</small></span></div><div><AlertTriangle size={17} /><span><strong>Revisar</strong><small>Falta definir la unidad de la carga.</small></span></div><div><Info size={17} /><span><strong>Información</strong><small>El resultado pertenece a esta versión.</small></span></div></div>
              </div>
            </div>
          </section>

          <section id="patterns" className="section patterns-section">
            <SectionIntro index="06" eyebrow="Patrones / Composición" title="La información aparece cuando hace falta." body="Consola para orientar, lienzo para trabajar e instrumento para confirmar. En móvil, la misma lógica se convierte en una secuencia enfocada." />
            <div className="layout-toolbar"><div><span>CAMPO DE INTERFAZ</span><strong>{layoutMode === 'desktop' ? 'Escritorio / mesa de trabajo' : 'Móvil / modo enfocado'}</strong></div><div className="layout-picker" aria-label="Vista del patrón"><button type="button" className={layoutMode === 'desktop' ? 'is-active' : ''} onClick={() => setLayoutMode('desktop')} aria-pressed={layoutMode === 'desktop'}><Grid2X2 size={14} /> Escritorio</button><button type="button" className={layoutMode === 'mobile' ? 'is-active' : ''} onClick={() => setLayoutMode('mobile')} aria-pressed={layoutMode === 'mobile'}><MousePointer2 size={14} /> Móvil</button></div></div>
            <div className={`workbench workbench--${layoutMode}`}><div className="workbench__console"><div className="workbench__brand"><BrandMark small /><span>FS</span></div><button type="button" className="workbench__tool is-active"><Ruler size={14} /><span>Modelo</span></button><button type="button" className="workbench__tool"><SlidersHorizontal size={14} /><span>Revisar</span></button><button type="button" className="workbench__tool"><Terminal size={14} /><span>Traza</span></button><span className="workbench__label">CONSOLA / 52</span></div><div className="workbench__canvas"><div className="workbench__canvasbar"><span>Pórtico_Ejemplo_01</span><Status tone="ready">disponible</Status></div><div className="workbench__drawing"><div className="drawing-grid" /><div className="drawing-beam drawing-beam--one" /><div className="drawing-beam drawing-beam--two" /><div className="drawing-beam drawing-beam--three" /><span className="drawing-node drawing-node--one" /><span className="drawing-node drawing-node--two" /><span className="drawing-node drawing-node--three" /><span className="drawing-node drawing-node--four" /><span className="drawing-signal" /><span className="drawing-dimension">12.000 m</span></div><span className="workbench__label">LIENZO / área de enfoque</span></div><div className="workbench__instrument"><div><span className="instrument-led" /><span>Guardado localmente</span></div><code>X 6.000 · Y 3.000</code><span className="workbench__label">INSTRUMENTO / 24</span></div><div className="additive-note additive-note--one"><Plus size={12} /> contexto</div><div className="additive-note additive-note--two"><Workflow size={12} /> traza</div></div>
            <div className="pattern-rules"><div><span>01</span><strong>Orientar</strong><small>nombre antes del control</small></div><div><span>02</span><strong>Actuar</strong><small>una acción principal</small></div><div><span>03</span><strong>Comprobar</strong><small>estado a la vista</small></div><div><span>04</span><strong>Continuar</strong><small>un siguiente paso claro</small></div></div>
          </section>

          <section id="mockups" className="section mockups-section">
            <SectionIntro index="07" eyebrow="Referencias / Producto" title="Una identidad, cualquier superficie." body="Los mockups fijan proporción, jerarquía, densidad, color y profundidad. No son pantallas finales: son criterios para diseñar las siguientes." />
            <div className="device-references">
              <figure className="device-reference device-reference--day"><div className="device-reference__head"><span>DEVICE STUDY / DAY</span><strong>computadora + teléfono</strong></div><Image unoptimized src="/mockups/device-day-studio.png" alt="Mockup de referencia de FusionStructure en monitor y teléfono, modo día" width={1584} height={992} sizes="(max-width: 900px) 100vw, 50vw" /><figcaption>La misma jerarquía pasa del escritorio al móvil sin convertirse en otra interfaz.</figcaption></figure>
              <figure className="device-reference device-reference--night"><div className="device-reference__head"><span>DEVICE STUDY / NIGHT</span><strong>carbón neutro</strong></div><Image unoptimized src="/mockups/device-night-studio.png" alt="Mockup de referencia de FusionStructure en monitor y teléfono, modo noche carbón" width={1584} height={992} sizes="(max-width: 900px) 100vw, 50vw" /><figcaption>El color técnico permanece visible; la carcasa visual se vuelve carbón, no azul.</figcaption></figure>
            </div>
            {(['day', 'night'] as const).map((mode) => (
              <div className={`mockup-group mockup-group--${mode}`} key={mode}>
                <div className="mockup-group__head"><span>{mode === 'day' ? 'DAY / STRUCTURAL PAPER' : 'NIGHT / CHARCOAL'}</span><strong>05 referencias</strong></div>
                <div className="mockup-gallery">
                  {mockupItems.filter((item) => item.mode === mode).map((item) => (
                    <figure className={`mockup-frame mockup-frame--${item.format}`} key={item.id}>
                      <div className="mockup-frame__bar"><span><ImageIcon size={13} /> {item.format === 'portrait' ? 'Mobile' : 'Desktop'} / {mode}</span><code>{item.id}</code></div>
                      <Image unoptimized src={item.src} alt={`Mockup original de FusionStructure: ${item.title}`} width={item.format === 'portrait' ? 943 : 1584} height={item.format === 'portrait' ? 1677 : 992} sizes={item.format === 'portrait' ? '(max-width: 620px) 100vw, 470px' : '(max-width: 900px) 100vw, 50vw'} />
                      <figcaption><strong>{item.title}</strong><span>{item.note}</span></figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
            <div className="reference-rules"><span>DIRECCIÓN PROPIA</span><p>Aplicar principios, no copiar pantallas: papel técnico, sombra rígida, color semántico y movimiento que explica procedencia.</p></div>
          </section>

          <section id="voice" className="section voice-section">
            <SectionIntro index="08" eyebrow="Voz / Verdad del producto" title="Claro sobre lo que existe. Preciso sobre lo que falta." body="La confianza se cuida declarando el estado, nombrando los límites y explicando qué información está conectada." />
            <div className="voice-grid"><article className="voice-card voice-card--do"><div className="voice-card__head"><Check size={15} /><span>Decir</span></div><ul><li>“Resultado vinculado al modelo.”</li><li>“Experimental: requiere revisión.”</li><li>“Guardar una versión local.”</li><li>“Abrir la traza del cálculo.”</li></ul></article><article className="voice-card voice-card--dont"><div className="voice-card__head"><span className="voice-cross">×</span><span>Evitar</span></div><ul><li>“Exacto para construir.”</li><li>“La plataforma lo resuelve todo.”</li><li>“Listo” sin explicar el estado.</li><li>Color decorativo sin significado.</li></ul></article></div>
            <div className="status-board"><div className="status-board__header"><span>LENGUAJE DE ESTADOS</span><span>Primero la etiqueta; después, la explicación</span></div><div className="status-line"><Status tone="ready">Disponible</Status><span>Existe y puede usarse hoy.</span><code>ready</code></div><div className="status-line"><Status tone="experimental">Experimental</Status><span>Existe con límites explícitos.</span><code>limited</code></div><div className="status-line"><Status tone="planned">Planeado</Status><span>Es una dirección futura, no una capacidad actual.</span><code>direction</code></div></div>
            <div className="handoff"><div><div className="eyebrow"><span className="eyebrow__marker" />Resumen de entrega</div><h3>Diseñar desde el significado.</h3><p>Una identidad para crecer desde el modelo hasta la evidencia sin perder claridad, movimiento ni honestidad.</p></div><button type="button" className="action action--primary" onClick={() => copyValue('FusionStructure · Make complexity legible. · Color con significado.')}>Copiar resumen <Copy size={14} /></button></div>
          </section>

          <footer className="footer"><div className="footer__brand"><BrandMark /><strong>FusionStructure</strong></div><p>Make complexity legible.</p><span>Structural Paper / dirección 03 / sistema propio</span></footer>
        </main>
      </div>

      <output className={`copy-toast ${copiedValue ? 'is-visible' : ''}`} aria-live="polite"><Check size={14} /><span>Copiado</span><code>{copiedValue}</code></output>
      <button type="button" className="back-top" onClick={() => goTo('north-star')} aria-label="Volver al inicio"><ChevronDown size={16} /></button>
    </div>
  );
}

const LayersIcon = () => <span className="layers-icon" aria-hidden="true"><i /><i /><i /></span>;
