import React, { useState } from 'react';
import Card from './Card.jsx';
import AddCard from './AddCard.jsx';
import * as api from '../api.js';

export default function Column({
  boardId,
  column,
  allColumns = [],
  columnIndex = 0,
  onChanged,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const prevCol = columnIndex > 0 ? allColumns[columnIndex - 1] : null;
  const nextCol =
    columnIndex < allColumns.length - 1 ? allColumns[columnIndex + 1] : null;

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  }

  function handleDragLeave(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOver(false);
  }

  async function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const data = JSON.parse(dataStr);
      if (data && data.cardId && data.sourceColumnId !== column.id) {
        await api.moveCard(boardId, data.sourceColumnId, column.id, data.cardId);
        onChanged();
      }
    } catch (err) {
      console.error('Failed to move dropped card:', err);
    }
  }

  return (
    <section
      className={`column ${isDragOver ? 'column-drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <h2>{column.title}</h2>
        <span className="card-count">{column.cards ? column.cards.length : 0}</span>
      </div>

      <div className="card-list">
        {column.cards && column.cards.length > 0 ? (
          column.cards.map((card) => (
            <Card
              key={card.id}
              boardId={boardId}
              columnId={column.id}
              card={card}
              prevColumnId={prevCol ? prevCol.id : null}
              nextColumnId={nextCol ? nextCol.id : null}
              prevColumnTitle={prevCol ? prevCol.title : null}
              nextColumnTitle={nextCol ? nextCol.title : null}
              onChanged={onChanged}
            />
          ))
        ) : (
          <div className="empty-column-placeholder">
            Drop cards here or add one below
          </div>
        )}
      </div>

      <AddCard boardId={boardId} columnId={column.id} onAdded={onChanged} />
    </section>
  );
}
