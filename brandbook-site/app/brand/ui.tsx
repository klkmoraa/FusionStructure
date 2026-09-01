'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import type { SignalId } from './system';

export type Theme = 'dia' | 'noche';
export type MotionMode = 'activo' | 'calma';

type BrandbookState = {
  theme: Theme;
  motionMode: MotionMode;
  activeSignal: SignalId;
  copiedValue: string;
  setActiveSignal: (signal: SignalId) => void;
  copyValue: (value: string) => void;
};

const noop = () => {};

export const BrandbookContext = createContext<BrandbookState>({
  theme: 'dia',
  motionMode: 'activo',
  activeSignal: 'axial',
  copiedValue: '',
  setActiveSignal: noop,
  copyValue: noop,
});

export const useBrandbook = () => useContext(BrandbookContext);

export const SectionIntro = ({
  index,
  eyebrow,
  title,
  body,
  aside,
}: {
  index: string;
  eyebrow: string;
  title: string;
  body: string;
  aside?: ReactNode;
}) => (
  <header className="section-intro">
    <div className="section-intro__meta">
      <span>{index}</span>
      <span>{eyebrow}</span>
    </div>
    <div className="section-intro__body">
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
    {aside ? <div className="section-intro__aside">{aside}</div> : null}
  </header>
);

export const RuleStrip = ({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) => (
  <p className="rule-strip">
    <span className="rule-strip__index">{index}</span>
    <span className="rule-strip__text">{children}</span>
    <span className="rule-strip__line" aria-hidden="true" />
  </p>
);

export const CopyChip = ({
  value,
  label,
}: {
  value: string;
  label?: string;
}) => {
  const { copyValue, copiedValue } = useBrandbook();
  const copied = copiedValue === value;
  return (
    <button
      type="button"
      className={`copy-chip ${copied ? 'is-copied' : ''}`}
      onClick={() => copyValue(value)}
      title={`Copiar ${label ?? value}`}
    >
      <code>{label ?? value}</code>
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
};

export const Eyebrow = ({ children }: { children: ReactNode }) => (
  <p className="eyebrow">
    <span className="eyebrow__marker" aria-hidden="true" />
    {children}
  </p>
);
