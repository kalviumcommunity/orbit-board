import React, { useState } from 'react';
import * as api from '../api.js';

export default function Card({ boardId, columnId, card, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      await api.deleteCard(boardId, columnId, card.id);
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="title">{card.title}</div>
      {card.description && <div className="desc">{card.description}</div>}

      <div className="card-actions">
        {/* TODO: card editing is read-only for now. */}
        <button type="button" disabled title="Editing not implemented yet">
          ✎ Edit
        </button>
        <button type="button" onClick={handleDelete} disabled={busy}>
          {busy ? '…' : '✕ Delete'}
        </button>
      </div>

      {error && <div className="desc error">Error: {error}</div>}
    </div>
  );
}
