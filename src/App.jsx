import * as React from "react";
import { useState, useEffect, useRef } from "react";
import "./App.css";

const STORAGE_KEY = "betBuilderItems_v5";
function loadItems() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; }
  catch { return []; }
}

function BetRow({ item, index, onHit, onMiss, onDelete }) {
  const isWin  = item.status === "win";
  const isLose = item.status === "lose";
  return (
    <div className={`bet-row ${item.status}`}>
      <span className="bet-num">{index + 1}</span>
      <div className="bet-status-dot" />
      <span className="bet-text">{item.text}</span>
      <div className="bet-btns">
        <button className={`btn-hit  ${isWin  ? "active" : ""}`} onClick={onHit}>✓ Hit</button>
        <button className={`btn-miss ${isLose ? "active" : ""}`} onClick={onMiss}>✗ Miss</button>
        <button className="btn-del" onClick={onDelete}>×</button>
      </div>
    </div>
  );
}

function GameCard({ game, items, onSetStatus, onDeleteBet, onDeleteGame }) {
  const bets   = items.filter(i => i.game === game);
  const wins   = bets.filter(b => b.status === "win").length;
  const losses = bets.filter(b => b.status === "lose").length;
  const total  = bets.length;
  const sweep  = wins === total && total > 0;
  const winPct = total > 0 ? (wins / total) * 100 : 0;
  const losePct= total > 0 ? (losses / total) * 100 : 0;

  return (
    <div className="game-card">
      <div className="game-card-head">
        <div className="game-card-left">
          <div className="matchup-icon">🏀</div>
          <span className="game-name">{game}</span>
          {sweep && <span className="sweep-chip">🔥 Sweep</span>}
        </div>
        <div className="game-card-right">
          <div className="mini-score">
            <span className="ms-win">{wins}W</span>
            <span className="ms-sep">·</span>
            <span className="ms-lose">{losses}L</span>
            <span className="ms-sep">·</span>
            <span className="ms-total">{total - wins - losses}P</span>
          </div>
          <button className="btn-remove-game" onClick={onDeleteGame}>×</button>
        </div>
      </div>
      <div className="game-progress">
        <div className="gp-win"  style={{ width: `${winPct}%` }} />
        <div className="gp-lose" style={{ width: `${losePct}%` }} />
      </div>
      <div className="game-bets">
        {bets.map((item, i) => (
          <BetRow key={item._id} item={item} index={i}
            onHit={()   => onSetStatus(item._id, item.status === "win"  ? "pending" : "win")}
            onMiss={()  => onSetStatus(item._id, item.status === "lose" ? "pending" : "lose")}
            onDelete={() => onDeleteBet(item._id)}
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
    if (!game)         { setError("Enter a game name.");      return; }
    if (!lines.length) { setError("Enter at least one bet."); return; }
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
  const settled = wins + losses;
  const winRate = settled > 0 ? Math.round((wins / settled) * 100) : null;
  const games   = [...new Set(items.map(i => i.game))];
  const allWon  = total > 0 && wins === total;

  const wrClass = winRate === null ? "none" : winRate >= 50 ? "good" : "bad";

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>

      {/* Topbar */}
      <nav className="topbar">
        <div className="brand">
          <span className="brand-name">Bet<span className="brand-dot">.</span>Builder</span>
          <span className="brand-pill">Live</span>
        </div>
        <div className="topbar-right">
          <button className={`toggle ${dark ? "on" : "off"}`} onClick={() => setDark(d => !d)}>
            <div className="toggle-knob" />
          </button>
          {total > 0 && (
            <button className="btn-clear" onClick={() => { if (confirm("Clear all bets?")) setItems([]); }}>
              Clear All
            </button>
          )}
        </div>
      </nav>

      <div className="page">

        {/* Scorecard */}
        <div className="scorecard">
          <div className="scorecard-header">
            <span className="scorecard-title">Today's Slip</span>
            <span className={`winrate-badge ${wrClass}`}>
              {winRate !== null ? `${winRate}% Win Rate` : "No bets yet"}
            </span>
          </div>
          <div className="scorecard-stats">
            <div className="stat-box">
              <div className="stat-num white">{total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-box">
              <div className="stat-num green">{wins}</div>
              <div className="stat-label">Hit</div>
            </div>
            <div className="stat-box">
              <div className="stat-num red">{losses}</div>
              <div className="stat-label">Miss</div>
            </div>
            <div className="stat-box">
              <div className="stat-num dim">{pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-green" style={{ width: `${total > 0 ? (wins/total)*100 : 0}%` }} />
            <div className="progress-red"   style={{ width: `${total > 0 ? (losses/total)*100 : 0}%` }} />
          </div>
        </div>

        {/* Slip form */}
        <div className="slip-form">
          <div className="form-header">
            <div className="form-icon">✍️</div>
            <span className="form-title">Add New Slip</span>
          </div>
          <div className="form-body">
            <div>
              <div className="field-label">Game / Matchup</div>
              <input className="field" type="text"
                placeholder="e.g. OKC vs Indiana"
                value={gameName} onChange={e => setGameName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && textRef.current?.focus()}
              />
            </div>
            <div>
              <div className="field-label">Your Picks — one per line</div>
              <textarea className="field" ref={textRef}
                placeholder={"SGA over 30.5 pts\nOKC -6.5\nTotal over 222.5\nChet Holmgren 3+ blocks"}
                value={betText} onChange={e => setBetText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleAdd(); } }}
              />
            </div>
          </div>
          {error && <div className="error-msg">⚠ {error}</div>}
          <div className="form-footer">
            <div className="kbd-hint">
              <span className="kbd">⌘</span>+<span className="kbd">↵</span>&nbsp;to add
            </div>
            <button className="btn-add" onClick={handleAdd}>Add to Slip</button>
          </div>
        </div>

        {/* Bets list */}
        {games.length === 0 ? (
          <div className="empty">
            <div className="empty-emoji">🎯</div>
            <div className="empty-title">No slips yet</div>
            <div className="empty-sub">Add a game and your picks above to get started</div>
          </div>
        ) : (
          <div>
            <div className="section-head">
              <span className="section-head-label">Active Slips</span>
              <span className="section-head-count">{games.length} game{games.length !== 1 ? "s" : ""}</span>
            </div>
            {games.map(game => (
              <GameCard key={game} game={game} items={items}
                onSetStatus={handleSetStatus}
                onDeleteBet={handleDeleteBet}
                onDeleteGame={() => handleDeleteGame(game)}
              />
            ))}
          </div>
        )}

        {allWon && (
          <div className="perfect">
            <span className="perfect-icon">🏆</span>
            <div>
              <div className="perfect-title">Perfect Slip!</div>
              <div className="perfect-sub">Every single pick hit — cashing out</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}