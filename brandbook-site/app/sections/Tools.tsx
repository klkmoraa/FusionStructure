'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { StatusPill, ToolTile } from '../brand/marks';
import {
  FAMILY_META,
  STATUS_META,
  TOOLS,
  type StatusId,
  type Tool,
} from '../brand/catalog';
import type { FamilyId } from '../brand/generated/palette';
import { RuleStrip, SectionIntro } from '../brand/ui';

type FamilyFilter = FamilyId | 'todas';
type StatusFilter = StatusId | 'todos';

const STATUS_ORDER: readonly StatusId[] = [
  'disponible',
  'experimental',
  'planeado',
  'no-comprometido',
];

const ToolDetail = ({ tool, onClose }: { tool: Tool; onClose: () => void }) => (
  <aside
    className={`tool-detail family--${tool.family}`}
    aria-label={`Detalle de ${tool.name}`}
  >
    <div className="tool-detail__head">
      <ToolTile glyph={tool.glyph} family={tool.family} size={54} />
      <div>
        <code>{tool.code}</code>
        <h3>{tool.name}</h3>
        <p>{tool.summary}</p>
      </div>
      <button
        type="button"
        className="icon-button"
        onClick={onClose}
        aria-label="Cerrar detalle"
      >
        <X size={16} />
      </button>
    </div>
    <dl className="tool-detail__body">
      <div>
        <dt>Hoy</dt>
        <dd>{tool.today}</dd>
      </div>
      <div>
        <dt>Debe crecer</dt>
        <dd>{tool.next}</dd>
      </div>
      <div>
        <dt>Puerta mínima</dt>
        <dd>{tool.gate}</dd>
      </div>
      <div>
        <dt>Categoría estudiada</dt>
        <dd>
          {tool.reference}
          <small>
            Referencia de categoría para investigar el problema. No implica
            equivalencia, compatibilidad ni reemplazo.
          </small>
        </dd>
      </div>
    </dl>
    <footer className="tool-detail__foot">
      <StatusPill status={tool.status} />
      <span>{STATUS_META[tool.status].rule}</span>
    </footer>
  </aside>
);

export const Tools = () => {
  const [family, setFamily] = useState<FamilyFilter>('todas');
  const [status, setStatus] = useState<StatusFilter>('todos');
  const [query, setQuery] = useState('');
  const [openTool, setOpenTool] = useState<string | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (family !== 'todas' && tool.family !== family) return false;
      if (status !== 'todos' && tool.status !== status) return false;
      if (!needle) return true;
      return [tool.name, tool.code, tool.role, tool.summary, tool.reference]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [family, status, query]);

  const selected = visible.find((tool) => tool.id === openTool) ?? null;

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenTool(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <section id="herramientas" className="section tools">
      <SectionIntro
        index="03"
        eyebrow="Herramientas · catálogo"
        title="Veinticinco superficies, un solo proyecto."
        body="Un solver 2D para pórticos, un dominio 3D separado, dibujo, modelo constructivo, terreno, costos, programa, conectores y aula. Cada tarjeta declara qué existe hoy, qué debe crecer y qué prueba tiene que pasar antes de cambiar de estado."
      />

      <div className="tools__controls">
        <fieldset className="filter-row">
          <legend className="visually-hidden">Filtrar por familia</legend>
          <button
            type="button"
            className={`chip ${family === 'todas' ? 'is-active' : ''}`}
            onClick={() => setFamily('todas')}
          >
            Todas <span>{TOOLS.length}</span>
          </button>
          {(Object.keys(FAMILY_META) as FamilyId[]).map((id) => (
            <button
              key={id}
              type="button"
              className={`chip family--${id} ${family === id ? 'is-active' : ''}`}
              onClick={() => setFamily(id)}
            >
              <span className="chip__swatch" aria-hidden="true" />
              {FAMILY_META[id].label}
              <span>{TOOLS.filter((tool) => tool.family === id).length}</span>
            </button>
          ))}
        </fieldset>

        <div className="tools__controls-row">
          <fieldset className="filter-row filter-row--status">
            <legend className="visually-hidden">Filtrar por estado</legend>
            <button
              type="button"
              className={`chip chip--quiet ${status === 'todos' ? 'is-active' : ''}`}
              onClick={() => setStatus('todos')}
            >
              Cualquier estado
            </button>
            {STATUS_ORDER.map((id) => {
              const count = TOOLS.filter((tool) => tool.status === id).length;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={count === 0}
                  className={`chip chip--status status--${id} ${status === id ? 'is-active' : ''}`}
                  onClick={() => setStatus(id)}
                >
                  <span className="status__dot" aria-hidden="true" />
                  {STATUS_META[id].label} <span>{count}</span>
                </button>
              );
            })}
          </fieldset>

          <label className="search">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder="Buscar superficie, código o categoría"
              onChange={(event) => setQuery(event.target.value)}
            />
            <span className="visually-hidden">Buscar en el catálogo</span>
          </label>
        </div>
      </div>

      <p className="tools__count" aria-live="polite">
        {visible.length === TOOLS.length
          ? `${TOOLS.length} superficies`
          : `${visible.length} de ${TOOLS.length} superficies`}
      </p>

      <ul className="tool-grid">
        {visible.map((tool) => (
          <li key={tool.id}>
            <button
              type="button"
              className={`tool-card family--${tool.family} ${openTool === tool.id ? 'is-open' : ''}`}
              onClick={() => setOpenTool(openTool === tool.id ? null : tool.id)}
              aria-expanded={openTool === tool.id}
            >
              <span className="tool-card__top">
                <ToolTile glyph={tool.glyph} family={tool.family} size={48} />
                <code>{tool.code}</code>
              </span>
              <span className="tool-card__name">
                <strong>{tool.name}</strong>
                <small>{tool.role}</small>
              </span>
              <span className="tool-card__summary">{tool.summary}</span>
              <span className="tool-card__reference">
                <small>categoría estudiada</small>
                {tool.reference}
              </span>
              <span className="tool-card__foot">
                <StatusPill status={tool.status} compact />
                <span className="tool-card__more">Ver puerta mínima</span>
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {visible.length === 0 ? (
        <p className="empty-state">
          Ninguna superficie coincide con ese filtro. Prueba con otra familia o
          borra la búsqueda.
        </p>
      ) : null}

      {selected ? (
        <ToolDetail tool={selected} onClose={() => setOpenTool(null)} />
      ) : null}

      <div className="status-board">
        <div className="status-board__head">
          <span className="tag">Vocabulario de estado</span>
          <p>
            Cuatro palabras. Se usan igual en la interfaz, en la documentación y
            aquí.
          </p>
        </div>
        {STATUS_ORDER.map((id) => (
          <div key={id} className="status-board__row">
            <StatusPill status={id} />
            <p>{STATUS_META[id].meaning}</p>
            <small>{STATUS_META[id].rule}</small>
          </div>
        ))}
      </div>

      <RuleStrip index="Regla 03">
        Una tarjeta puede dibujar una intención. No puede escribirla en
        presente.
      </RuleStrip>
    </section>
  );
};
