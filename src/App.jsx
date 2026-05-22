import * as React from "react";
import { useState, useEffect, useRef } from "react";
import "./App.css";

const STORAGE_KEY = "betBuilderItems_v3";
function loadItems() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}

function StatPill({ label, value, accent }) {
  return (
    <div className="stat-pill">
      <span className="stat-value" style={{ color: accent || "inherit" }}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function WinRateBar({ wins, losses, total }) {
  const wp = total > 0 ? (wins / total) * 100 : 0;
  const lp = total > 0 ? (losses / total) * 100 : 0;
  return (
    <div className="winrate-bar">
      <div className="winrate-bar-hit"  style={{ width: `${wp}%` }} />
      <div className="winrate-bar-miss" style={{ width: `${lp}%` }} />
    </div>
  );
}

function BetRow({ item, onHit, onMiss, onDelete }) {
  const isWin  = item.status === "win";
  const isLose = item.status === "lose";
  return (
    <div className={`bet-row ${item.status}`}>
      <span className={`bet-text ${item.status}`}>{item.text}</span>
      <button className={`btn-hit  ${isWin  ? "active" : ""}`} onClick={onHit}>Hit</button>
      <button className={`btn-miss ${isLose ? "active" : ""}`} onClick={onMiss}>Miss</button>
      <button className="btn-delete-bet" onClick={onDelete}
        onMouseEnter={e => e.currentTarget.style.color = "#ff4d6d"}
        onMouseLeave={e => e.currentTarget.style.color = ""}
      >×</button>
    </div>
  );
}

function GameSection({ game, items, onSetStatus, onDeleteBet, onDeleteGame }) {
  const bets   = items.filter(i => i.game === game);
  const wins   = bets.filter(b => b.status === "win").length;
  const losses = bets.filter(b => b.status === "lose").length;
  const total  = bets.length;
  return (
    <div className="game-section">
      <div className="game-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="game-title">{game}</span>
          {wins === total && total > 0 && <span className="game-badge">SWEEP</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="game-score">
            <span style={{ color: "#00e09a" }}>{wins}</span>
            <span style={{ color: "#555" }}>/</span>
            <span style={{ color: "#ff4d6d" }}>{losses}</span>
            <span style={{ color: "#444" }}>/{total}</span>
          </span>
          <button className="btn-delete-game" onClick={onDeleteGame}
            onMouseEnter={e => e.currentTarget.style.color = "#ff4d6d"}
            onMouseLeave={e => e.currentTarget.style.color = ""}
          >×</button>
        </div>
      </div>
      <div className="game-bets">
        {bets.map(item => (
          <BetRow key={item._id} item={item}
            onHit={()    => onSetStatus(item._id, item.status === "win"  ? "pending" : "win")}
            onMiss={()   => onSetStatus(item._id, item.status === "lose" ? "pending" : "lose")}
            onDelete={()  => onDeleteBet(item._id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [items,    setItems]    = useState(loadItems);
  const [gameName, setGameName] = useState("");
  const [betText,  setBetText]  = useState("");
  const [error,    setError]    = useState("");
  const [dark,     setDark]     = useState(true);
  const textRef = useRef(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  const handleAdd = () => {
    const game  = gameName.trim();
    const lines = betText.split("\n").map(l => l.trim()).filter(Boolean);
    if (!game)         { setError("Enter a game name.");        return; }
    if (!lines.length) { setError("Enter at least one bet.");   return; }
    setError("");
    setItems(prev => [...prev, ...lines.map(line => ({
      _id: `${Date.now()}-${Math.random()}`, game, text: line, status: "pending"
    }))]);
    setBetText(""); setGameName("");
    textRef.current?.focus();
  };

  const handleSetStatus  = (id, status) => setItems(prev => prev.map(i => i._id === id ? { ...i, status } : i));
  const handleDeleteBet  = (id)         => setItems(prev => prev.filter(i => i._id !== id));
  const handleDeleteGame = (game)       => setItems(prev => prev.filter(i => i.game !== game));

  const total   = items.length;
  const wins    = items.filter(i => i.status === "win").length;
  const losses  = items.filter(i => i.status === "lose").length;
  const pending = items.filter(i => i.status === "pending").length;
  const winRate = (wins + losses) > 0 ? Math.round((wins / (wins + losses)) * 100) : null;
  const games   = [...new Set(items.map(i => i.game))];

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>
      <div className="inner">

        {/* Header */}
        <div className="header">
          <div className="header-row">
            <div>
              <div className="tracker-label">Bet Tracker</div>
              <h1 className="app-title">Bet Builder</h1>
            </div>
            <div className="header-actions">
              <button className="toggle" onClick={() => setDark(d => !d)} title={dark ? "Light mode" : "Dark mode"}>
                <div className="toggle-knob" />
              </button>
              {total > 0 && (
                <button className="btn-clear" onClick={() => { if (confirm("Clear all bets?")) setItems([]); }}>
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        {total > 0 && (
          <div className="stats">
            <div className="stat-pills">
              <StatPill label="Total"    value={total} />
              <StatPill label="Hit"      value={wins}    accent="#00e09a" />
              <StatPill label="Miss"     value={losses}  accent="#ff4d6d" />
              <StatPill label="Pending"  value={pending} accent="#888" />
              {winRate !== null && (
                <StatPill label="Win Rate" value={`${winRate}%`} accent={winRate >= 50 ? "#00e09a" : "#ff4d6d"} />
              )}
            </div>
            <WinRateBar wins={wins} losses={losses} total={total} />
          </div>
        )}

        {/* Input card */}
        <div className="input-card">
          <input className="input-field" type="text"
            placeholder="Game name  e.g. OKC vs Indiana"
            value={gameName} onChange={e => setGameName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && textRef.current?.focus()}
          />
          <textarea className="textarea-field" ref={textRef}
            placeholder={"Enter bets, one per line\nLeBron over 25.5 pts\nOKC -4.5"}
            value={betText} onChange={e => setBetText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleAdd(); } }}
            rows={5}
          />
          {error && <div className="error">{error}</div>}
          <div className="input-footer">
            <span className="hint">⌘ + Enter to add</span>
            <button className="btn-add" onClick={handleAdd}>Add Bets</button>
          </div>
        </div>

        {/* Bet list */}
        {games.length === 0 ? (
          <div className="empty">No bets yet — add your first slip above</div>
        ) : (
          <div>
            <div className="bets-hint">Hit or Miss toggles status · × removes the bet</div>
            {games.map(game => (
              <GameSection key={game} game={game} items={items}
                onSetStatus={handleSetStatus}
                onDeleteBet={handleDeleteBet}
                onDeleteGame={() => handleDeleteGame(game)}
              />
            ))}
          </div>
        )}

        {/* Sweep banner */}
        {total > 0 && wins === total && (
          <div className="sweep-banner">
            <div className="sweep-icon">🏆</div>
            <div className="sweep-label">Perfect slip — all bets hit</div>
          </div>
        )}

      </div>
    </div>
  );
}