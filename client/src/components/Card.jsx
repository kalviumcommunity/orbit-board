import React, { useState } from 'react';
import * as api from '../api.js';

export default function Card({
  boardId,
  columnId,
  card,
  prevColumnId,
  nextColumnId,
  prevColumnTitle,
  nextColumnTitle,
  onChanged,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title || '');
  const [editDesc, setEditDesc] = useState(card.description || '');
  const [isDragging, setIsDragging] = useState(false);

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      await api.deleteCard(boardId, columnId, card.id);
      alert(`Card "${card.title}" has been deleted.`);
      onChanged();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    const trimmed = editTitle.trim();
    if (!trimmed) {
      setError('Title cannot be empty');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await api.updateCard(boardId, columnId, card.id, {
        title: trimmed,
        description: editDesc.trim(),
      });
      setIsEditing(false);
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function handleCancelEdit() {
    setEditTitle(card.title || '');
    setEditDesc(card.description || '');
    setIsEditing(false);
    setError(null);
  }

  async function handleMove(targetColumnId) {
    if (!targetColumnId || busy) return;
    setBusy(true);
    setError(null);
    try {
      await api.moveCard(boardId, columnId, targetColumnId, card.id);
      onChanged();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  function handleDragStart(e) {
    setIsDragging(true);
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        boardId,
        sourceColumnId: columnId,
        cardId: card.id,
      })
    );
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragEnd() {
    setIsDragging(false);
  }

  if (isEditing) {
    return (
      <form
        className="card card-edit-form"
        onSubmit={handleSaveEdit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleCancelEdit();
        }}
      >
        <input
          type="text"
          className="edit-input"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Card title"
          autoFocus
          disabled={busy}
        />
        <textarea
          className="edit-textarea"
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          disabled={busy}
        />
        <div className="card-actions edit-actions">
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={handleCancelEdit} disabled={busy}>
            Cancel
          </button>
        </div>
        {error && <div className="desc error">Error: {error}</div>}
      </form>
    );
  }

  return (
    <div
      className={`card ${isDragging ? 'is-dragging' : ''}`}
      draggable={!busy}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="card-header">
        <div className="title">{card.title}</div>
        <div className="card-quick-nav">
          {prevColumnId && (
            <button
              type="button"
              className="btn-icon"
              onClick={() => handleMove(prevColumnId)}
              disabled={busy}
              title={`Move to ${prevColumnTitle || 'previous column'}`}
            >
              ←
            </button>
          )}
          {nextColumnId && (
            <button
              type="button"
              className="btn-icon"
              onClick={() => handleMove(nextColumnId)}
              disabled={busy}
              title={`Move to ${nextColumnTitle || 'next column'}`}
            >
              →
            </button>
          )}
        </div>
      </div>

      {card.description && <div className="desc">{card.description}</div>}

      <div className="card-actions">
        <button
          type="button"
          onClick={() => {
            setEditTitle(card.title || '');
            setEditDesc(card.description || '');
            setIsEditing(true);
          }}
          disabled={busy}
          title="Edit card"
        >
          ✎ Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          title="Delete card"
          className="btn-delete"
        >
          {busy ? '…' : '✕ Delete'}
        </button>
      </div>

      {error && <div className="desc error">Error: {error}</div>}
    </div>
  );
}
