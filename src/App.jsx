import * as React from "react";
import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "betBuilderItems_v3";

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

const STATUS_META = {
  win:     { color: "#00e09a", bg: "rgba(0,224,154,0.08)",  border: "rgba(0,224,154,0.25)" },
  lose:    { color: "#ff4d6d", bg: "rgba(255,77,109,0.08)", border: "rgba(255,77,109,0.25)" },
  pending: { color: "#888",    bg: "transparent",            border: "rgba(255,255,255,0.07)" },
};

function StatPill({ label, value, accent }) {
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"10px 18px", borderRadius:10,
      border:"0.5px solid rgba(255,255,255,0.1)",
      background:"rgba(255,255,255,0.04)", minWidth:70,
    }}>
      <span style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.5px", color:accent||"#fff" }}>{value}</span>
      <span style={{ fontSize:11, color:"#666", marginTop:2, letterSpacing:"0.08em", textTransform:"uppercase" }}>{label}</span>
    </div>
  );
}

function WinRateBar({ wins, losses, total }) {
  const wp = total > 0 ? (wins/total)*100 : 0;
  const lp = total > 0 ? (losses/total)*100 : 0;
  return (
    <div style={{ width:"100%", height:6, borderRadius:3, background:"rgba(255,255,255,0.07)", overflow:"hidden", display:"flex" }}>
      <div style={{ width:`${wp}%`, background:"#00e09a", transition:"width 0.4s ease" }} />
      <div style={{ width:`${lp}%`, background:"#ff4d6d", transition:"width 0.4s ease" }} />
    </div>
  );
}

function BetRow({ item, onHit, onMiss, onDelete }) {
  const meta = STATUS_META[item.status];
  const isWin = item.status === "win";
  const isLose = item.status === "lose";
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:8,
      padding:"10px 14px", borderRadius:8,
      background:meta.bg, border:`0.5px solid ${meta.border}`,
      transition:"background 0.2s, border-color 0.2s",
    }}>
      <span style={{
        flex:1, fontSize:14,
        color: isWin ? "#00e09a" : isLose ? "rgba(255,77,109,0.7)" : "#ccc",
        textDecoration: isWin ? "line-through" : "none",
        textDecorationColor:"rgba(0,224,154,0.4)",
      }}>
        {item.text}
      </span>

      <button onClick={onHit} style={{
        padding:"4px 10px", borderRadius:5, cursor:"pointer",
        fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
        transition:"all 0.15s",
        border: isWin ? "1.5px solid #00e09a" : "0.5px solid rgba(255,255,255,0.12)",
        background: isWin ? "rgba(0,224,154,0.12)" : "transparent",
        color: isWin ? "#00e09a" : "#555",
      }}>Hit</button>

      <button onClick={onMiss} style={{
        padding:"4px 10px", borderRadius:5, cursor:"pointer",
        fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase",
        transition:"all 0.15s",
        border: isLose ? "1.5px solid #ff4d6d" : "0.5px solid rgba(255,255,255,0.12)",
        background: isLose ? "rgba(255,77,109,0.12)" : "transparent",
        color: isLose ? "#ff4d6d" : "#555",
      }}>Miss</button>

      <button onClick={onDelete} style={{
        flexShrink:0, width:22, height:22, borderRadius:4,
        border:"none", background:"transparent", color:"#333",
        cursor:"pointer", fontSize:18, lineHeight:1,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}
        onMouseEnter={e => e.currentTarget.style.color="#ff4d6d"}
        onMouseLeave={e => e.currentTarget.style.color="#333"}
      >×</button>
    </div>
  );
}

function GameSection({ game, items, onSetStatus, onDeleteBet, onDeleteGame }) {
  const bets = items.filter(i => i.game === game);
  const wins = bets.filter(b => b.status === "win").length;
  const losses = bets.filter(b => b.status === "lose").length;
  const total = bets.length;

  return (
    <div style={{
      borderRadius:12, border:"0.5px solid rgba(255,255,255,0.08)",
      overflow:"hidden", background:"rgba(255,255,255,0.02)", marginBottom:16,
    }}>
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"12px 16px", borderBottom:"0.5px solid rgba(255,255,255,0.06)",
        background:"rgba(255,255,255,0.03)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"#fff" }}>{game}</span>
          {wins === total && total > 0 && (
            <span style={{ fontSize:10, padding:"2px 8px", borderRadius:4, background:"rgba(0,224,154,0.15)", color:"#00e09a", fontWeight:700, letterSpacing:"0.08em" }}>SWEEP</span>
          )}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:12 }}>
            <span style={{ color:"#00e09a" }}>{wins}</span>
            <span style={{ color:"#333" }}>/</span>
            <span style={{ color:"#ff4d6d" }}>{losses}</span>
            <span style={{ color:"#444" }}>/{total}</span>
          </span>
          <button onClick={onDeleteGame} style={{ border:"none", background:"transparent", color:"#333", cursor:"pointer", fontSize:18, lineHeight:1, padding:0 }}
            onMouseEnter={e => e.currentTarget.style.color="#ff4d6d"}
            onMouseLeave={e => e.currentTarget.style.color="#333"}
          >×</button>
        </div>
      </div>
      <div style={{ padding:"10px 12px", display:"flex", flexDirection:"column", gap:6 }}>
        {bets.map(item => (
          <BetRow
            key={item._id}
            item={item}
            onHit={() => onSetStatus(item._id, item.status === "win" ? "pending" : "win")}
            onMiss={() => onSetStatus(item._id, item.status === "lose" ? "pending" : "lose")}
            onDelete={() => onDeleteBet(item._id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState(loadItems);
  const [gameName, setGameName] = useState("");
  const [betText, setBetText] = useState("");
  const [error, setError] = useState("");
  const textRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    const game = gameName.trim();
    const lines = betText.split("\n").map(l => l.trim()).filter(Boolean);
    if (!game) { setError("Enter a game name."); return; }
    if (!lines.length) { setError("Enter at least one bet."); return; }
    setError("");
    setItems(prev => [
      ...prev,
      ...lines.map(line => ({ _id: `${Date.now()}-${Math.random()}`, game, text: line, status: "pending" }))
    ]);
    setBetText("");
    setGameName("");
    textRef.current?.focus();
  };

  const handleSetStatus = (id, status) => {
    setItems(prev => prev.map(item => item._id === id ? { ...item, status } : item));
  };

  const handleDeleteBet = (id) => {
    setItems(prev => prev.filter(item => item._id !== id));
  };

  const handleDeleteGame = (game) => {
    setItems(prev => prev.filter(item => item.game !== game));
  };

  const total = items.length;
  const wins = items.filter(i => i.status === "win").length;
  const losses = items.filter(i => i.status === "lose").length;
  const pending = items.filter(i => i.status === "pending").length;
  const winRate = (wins + losses) > 0 ? Math.round((wins / (wins + losses)) * 100) : null;
  const games = [...new Set(items.map(i => i.game))];

  return (
    <div style={{
      minHeight:"100vh", background:"#0d0d0f",
      fontFamily:"'DM Mono','Fira Mono','SF Mono',monospace",
      color:"#ccc", display:"flex", flexDirection:"column",
      alignItems:"center", padding:"32px 16px 64px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        input, textarea, button { font-family: inherit; }
        textarea:focus, input:focus { outline: none; border-color: rgba(255,255,255,0.25) !important; }
        textarea { resize: vertical; }
        ::selection { background: rgba(0,224,154,0.25); }
      `}</style>

      <div style={{ width:"100%", maxWidth:620 }}>

        <div style={{ marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:4 }}>
            <div>
              <div style={{ fontSize:10, letterSpacing:"0.2em", color:"#444", textTransform:"uppercase", marginBottom:6 }}>Bet Tracker</div>
              <h1 style={{ margin:0, fontSize:"clamp(26px,6vw,38px)", fontWeight:500, letterSpacing:"-0.03em", color:"#fff", lineHeight:1 }}>Bet Builder</h1>
            </div>
            {total > 0 && (
              <button onClick={() => { if (confirm("Clear all bets?")) setItems([]); }} style={{
                border:"0.5px solid #222", background:"transparent", color:"#444",
                fontSize:11, letterSpacing:"0.08em", padding:"6px 12px", borderRadius:6,
                cursor:"pointer", textTransform:"uppercase",
              }}
                onMouseEnter={e => { e.currentTarget.style.color="#ff4d6d"; e.currentTarget.style.borderColor="#ff4d6d33"; }}
                onMouseLeave={e => { e.currentTarget.style.color="#444"; e.currentTarget.style.borderColor="#222"; }}
              >Clear all</button>
            )}
          </div>
        </div>

        {total > 0 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
              <StatPill label="Total" value={total} />
              <StatPill label="Hit" value={wins} accent="#00e09a" />
              <StatPill label="Miss" value={losses} accent="#ff4d6d" />
              <StatPill label="Pending" value={pending} accent="#888" />
              {winRate !== null && <StatPill label="Win Rate" value={`${winRate}%`} accent={winRate >= 50 ? "#00e09a" : "#ff4d6d"} />}
            </div>
            <WinRateBar wins={wins} losses={losses} total={total} />
          </div>
        )}

        <div style={{
          background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)",
          borderRadius:12, padding:"20px", marginBottom:28,
        }}>
          <input type="text" placeholder="Game name  e.g. OKC vs Indiana"
            value={gameName} onChange={e => setGameName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && textRef.current?.focus()}
            style={{
              width:"100%", background:"transparent", border:"0.5px solid rgba(255,255,255,0.08)",
              borderRadius:7, padding:"10px 12px", color:"#fff", fontSize:13, marginBottom:10,
            }}
          />
          <textarea ref={textRef}
            placeholder={"Enter bets, one per line\nLeBron over 25.5 pts\nOKC -4.5"}
            value={betText} onChange={e => setBetText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleAdd(); } }}
            rows={5}
            style={{
              width:"100%", background:"transparent", border:"0.5px solid rgba(255,255,255,0.08)",
              borderRadius:7, padding:"10px 12px", color:"#ccc", fontSize:13, lineHeight:1.7,
            }}
          />
          {error && <div style={{ fontSize:12, color:"#ff4d6d", marginTop:6 }}>{error}</div>}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
            <span style={{ fontSize:11, color:"#333" }}>⌘ + Enter to add</span>
            <button onClick={handleAdd} style={{
              background:"#00e09a", color:"#000", border:"none", borderRadius:7,
              padding:"9px 20px", fontSize:12, fontWeight:500, letterSpacing:"0.06em",
              cursor:"pointer", textTransform:"uppercase",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity="1"}
            >Add Bets</button>
          </div>
        </div>

        {games.length === 0 ? (
          <div style={{ textAlign:"center", padding:"48px 0", color:"#333", fontSize:13, letterSpacing:"0.05em" }}>
            No bets yet — add your first slip above
          </div>
        ) : (
          <div>
            <div style={{ fontSize:10, letterSpacing:"0.15em", color:"#333", textTransform:"uppercase", marginBottom:14 }}>
              Hit or Miss toggles status · × removes the bet
            </div>
            {games.map(game => (
              <GameSection
                key={game}
                game={game}
                items={items}
                onSetStatus={handleSetStatus}
                onDeleteBet={handleDeleteBet}
                onDeleteGame={() => handleDeleteGame(game)}
              />
            ))}
          </div>
        )}

        {total > 0 && wins === total && (
          <div style={{
            marginTop:24, textAlign:"center", padding:"16px", borderRadius:10,
            background:"rgba(0,224,154,0.08)", border:"0.5px solid rgba(0,224,154,0.2)",
          }}>
            <div style={{ fontSize:20, marginBottom:4 }}>🏆</div>
            <div style={{ fontSize:13, color:"#00e09a", fontWeight:500 }}>Perfect slip — all bets hit</div>
          </div>
        )}
      </div>
    </div>
  );
}