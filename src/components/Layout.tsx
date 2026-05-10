import type { ReactNode } from "react";
import type { Screen } from "../types";
import { PixelButton } from "./PixelButton";

type Props = {
  children: ReactNode;
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  onReset: () => void;
};

export function Layout({ children, screen, onNavigate, onReset }: Props) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => onNavigate("home")}>PhiloQuest</button>
        <nav className="top-actions" aria-label="Навигация">
          <PixelButton active={screen === "campaign"} onClick={() => onNavigate("campaign")}>Карта</PixelButton>
          <PixelButton active={screen === "weak"} onClick={() => onNavigate("weak")}>Слабые</PixelButton>
          <PixelButton active={screen === "coverage"} onClick={() => onNavigate("coverage")}>Покрытие</PixelButton>
          <PixelButton active={screen === "data"} onClick={() => onNavigate("data")}>Data</PixelButton>
          <PixelButton variant="danger" onClick={onReset}>Сброс</PixelButton>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
