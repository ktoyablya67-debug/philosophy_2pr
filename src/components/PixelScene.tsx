import { useState } from "react";
import type { Aesthetic, WorldVisual } from "../types";

type Props = {
  aesthetic: Aesthetic;
  title: string;
  visual?: WorldVisual;
};

const scenes: Record<Aesthetic, JSX.Element> = {
  medieval: (
    <>
      <rect x="18" y="54" width="124" height="64" fill="#222b3a" />
      <rect x="36" y="34" width="18" height="84" fill="#1a2230" />
      <rect x="106" y="34" width="18" height="84" fill="#1a2230" />
      <polygon points="36,34 45,18 54,34" fill="#111827" />
      <polygon points="106,34 115,18 124,34" fill="#111827" />
      <rect x="68" y="42" width="24" height="50" fill="#6f1d1b" />
      <rect x="72" y="46" width="7" height="16" fill="#f4c95d" />
      <rect x="81" y="46" width="7" height="16" fill="#68b0ab" />
      <rect x="70" y="96" width="20" height="22" fill="#0b1020" />
      <rect x="22" y="108" width="116" height="10" fill="#f4c95d" opacity=".7" />
    </>
  ),
  scholastic: (
    <>
      <rect x="18" y="36" width="42" height="82" fill="#68452b" />
      <rect x="62" y="26" width="78" height="92" fill="#8a6a3d" />
      <rect x="72" y="40" width="52" height="10" fill="#2b2118" />
      <rect x="72" y="58" width="52" height="10" fill="#2b2118" />
      <rect x="72" y="76" width="52" height="10" fill="#2b2118" />
      <rect x="28" y="52" width="20" height="44" fill="#f5deb3" />
      <rect x="32" y="56" width="12" height="36" fill="#1d3557" />
      <rect x="132" y="90" width="8" height="28" fill="#f2c078" />
      <rect x="130" y="84" width="12" height="8" fill="#ffd166" />
    </>
  ),
  renaissance: (
    <>
      <rect x="0" y="0" width="160" height="72" fill="#67b7dc" />
      <rect x="12" y="70" width="34" height="48" fill="#f1d2a4" />
      <polygon points="8,70 29,54 50,70" fill="#c94f2d" />
      <rect x="54" y="60" width="42" height="58" fill="#f7e5c5" />
      <polygon points="50,60 75,42 100,60" fill="#d56f3e" />
      <rect x="110" y="50" width="28" height="68" fill="#e7d8bd" />
      <rect x="116" y="36" width="16" height="14" fill="#f5f5dc" />
      <circle cx="128" cy="22" r="5" fill="#fff7ad" />
      <rect x="16" y="92" width="122" height="6" fill="#0d7ea8" opacity=".7" />
    </>
  ),
  newTime: (
    <>
      <rect x="0" y="0" width="160" height="118" fill="#07111f" />
      <rect x="10" y="92" width="140" height="20" fill="#4a2e1f" />
      <rect x="24" y="74" width="48" height="8" fill="#b88746" />
      <rect x="34" y="48" width="8" height="28" fill="#b88746" />
      <rect x="42" y="42" width="54" height="8" fill="#7dd3fc" />
      <circle cx="118" cy="70" r="16" fill="none" stroke="#b88746" strokeWidth="6" />
      <circle cx="118" cy="70" r="5" fill="#7dd3fc" />
      <rect x="108" y="28" width="6" height="34" fill="#b88746" />
      <circle cx="111" cy="24" r="7" fill="#7dd3fc" />
    </>
  ),
  enlightenment: (
    <>
      <rect x="0" y="0" width="160" height="118" fill="#fff3c4" />
      <circle cx="128" cy="26" r="18" fill="#f7c948" />
      <rect x="20" y="36" width="16" height="72" fill="#f8fafc" />
      <rect x="58" y="36" width="16" height="72" fill="#f8fafc" />
      <rect x="96" y="36" width="16" height="72" fill="#f8fafc" />
      <rect x="12" y="104" width="118" height="10" fill="#d7a33d" />
      <rect x="32" y="78" width="78" height="12" fill="#9a6a00" />
      <rect x="118" y="84" width="18" height="18" fill="#87bde8" />
    </>
  ),
  finalBoss: (
    <>
      <rect x="0" y="0" width="160" height="118" fill="#171717" />
      <rect x="16" y="18" width="128" height="54" fill="#17382d" />
      <rect x="22" y="26" width="50" height="4" fill="#e5e7eb" />
      <rect x="22" y="38" width="78" height="4" fill="#e5e7eb" />
      <rect x="22" y="50" width="36" height="4" fill="#e5e7eb" />
      <rect x="42" y="84" width="78" height="26" fill="#5b2f24" />
      <rect x="126" y="78" width="10" height="32" fill="#ff4d5d" />
      <rect x="126" y="56" width="10" height="20" fill="#9b1c31" />
    </>
  ),
};

export function PixelScene({ aesthetic, title, visual }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = visual?.imageUrl && !failed;

  return (
    <section className={`pixel-scene ${aesthetic}`} style={{ background: visual?.fallbackGradient }}>
      {showImage ? <img src={visual.imageUrl} alt={visual.imageAlt} onError={() => setFailed(true)} /> : null}
      <div className="pixel-scene-overlay" />
      <svg viewBox="0 0 160 118" role="img" aria-label={visual?.imageAlt ?? title} preserveAspectRatio="none">
        {scenes[aesthetic]}
      </svg>
      <div className="scene-title">
        <span>{title}</span>
      </div>
    </section>
  );
}
