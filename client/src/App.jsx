import React, { useEffect, useState } from 'react';
import Column from './components/Column.jsx';
import * as api from './api.js';

export default function App() {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <header className="app-header">
        <h1>🛰️ OrbitBoard</h1>
        <span className="tag">by OrbitLabs · v0.5 (~50% built)</span>
      </header>

      <div className="banner">
        ⏳ Drag-and-drop and card editing are not implemented yet.
      </div>

      {loading && <p style={{ margin: 24 }}>Loading board…</p>}

      {error && (
        <p className="banner error" style={{ margin: 24 }}>
          Couldn't load the board: {error}. Did you run <code>npm run seed</code>?
        </p>
      )}

      {!loading && !error && !board && (
        <p style={{ margin: 24 }}>
          No boards yet. Run <code>npm run seed</code> to add sample data.
        </p>
      )}

      {board && (
        <main className="board">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              boardId={board.id}
              column={column}
              onChanged={loadBoard}
            />
          ))}
        </main>
      )}
    </div>
  );
}
