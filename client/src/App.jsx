import React, { useEffect, useState } from 'react';
import Column from './components/Column.jsx';
import * as api from './api.js';

export default function App() {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  async function loadBoard() {
    try {
      setLoading(true);
      const boards = await api.getBoards();
      setBoard(boards[0] || null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
  }, []);

  // Compute total card count
  const totalCards = board
    ? board.columns.reduce((sum, col) => sum + (col.cards ? col.cards.length : 0), 0)
    : 0;

  // Filter columns and cards if search query is entered
  const displayColumns = board
    ? board.columns.map((col) => {
        if (!searchQuery.trim()) return col;
        const q = searchQuery.toLowerCase();
        const filteredCards = (col.cards || []).filter(
          (c) =>
            (c.title && c.title.toLowerCase().includes(q)) ||
            (c.description && c.description.toLowerCase().includes(q))
        );
        return { ...col, cards: filteredCards };
      })
    : [];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <h1>🛰️ OrbitBoard</h1>
          <span className="tag">by OrbitLabs</span>
          {board && <span className="board-title-badge">{board.title}</span>}
        </div>

        <div className="header-actions">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search cards…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            className="btn-refresh"
            onClick={loadBoard}
            disabled={loading}
            title="Refresh board"
          >
            {loading ? '⟳ Refreshing…' : '⟳ Refresh'}
          </button>
        </div>
      </header>

      <div className="status-bar">
        <div className="status-pill active">
          <span className="dot"></span> All systems operational
        </div>
        <div className="status-stats">
          <span>{totalCards} total cards</span>
          <span>·</span>
          <span>{board ? board.columns.length : 0} columns</span>
          <span>·</span>
          <span className="hint-text">
            💡 Drag & drop cards between columns or use ← / → buttons
          </span>
        </div>
      </div>

      {loading && !board && <p className="state-message">Loading board…</p>}

      {error && (
        <p className="state-message error">
          Couldn't load the board: {error}. Did you run <code>npm run seed</code>?
        </p>
      )}

      {!loading && !error && !board && (
        <p className="state-message">
          No boards yet. Run <code>npm run seed</code> to add sample data.
        </p>
      )}

      {board && (
        <main className="board">
          {displayColumns.map((column, idx) => (
            <Column
              key={column.id}
              boardId={board.id}
              column={column}
              allColumns={board.columns}
              columnIndex={idx}
              onChanged={loadBoard}
            />
          ))}
        </main>
      )}
    </div>
  );
}
