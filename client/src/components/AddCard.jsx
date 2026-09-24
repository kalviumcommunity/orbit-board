import React, { useState } from 'react';
import * as api from '../api.js';

export default function AddCard({ boardId, columnId, onAdded }) {
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    try {
      await api.addCard(boardId, columnId, { title: trimmed });
      setTitle('');
      onAdded();
    } catch (err) {
      setError(err.message || 'Failed to add card');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="add-card" onSubmit={handleAdd}>
      <input
        type="text"
        placeholder="+ Add a card…"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError(null);
        }}
        disabled={busy}
      />
      <button type="submit" disabled={busy || !title.trim()}>
        {busy ? 'Adding…' : 'Add card'}
      </button>
      {error && <div className="desc error">Error: {error}</div>}
    </form>
  );
}
