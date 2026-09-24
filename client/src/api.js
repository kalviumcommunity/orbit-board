// OrbitBoard API client.
// Uses VITE_API_URL when provided at build time, otherwise falls back to the
// same-origin "/api" path (works when the Express server serves this build).
const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch (_) {
      /* ignore parse errors */
    }
    throw new Error(message);
  }
  return res.json();
}

export function getBoards() {
  return request('/boards');
}

export function addCard(boardId, columnId, card) {
  return request(`/boards/${boardId}/columns/${columnId}/cards`, {
    method: 'POST',
    body: JSON.stringify(card),
  });
}

export function updateCard(boardId, columnId, cardId, updates) {
  return request(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export function deleteCard(boardId, columnId, cardId) {
  return request(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`, {
    method: 'DELETE',
  });
}

export function moveCard(boardId, sourceColumnId, targetColumnId, cardId, targetIndex) {
  return request(`/boards/${boardId}/move-card`, {
    method: 'POST',
    body: JSON.stringify({ sourceColumnId, targetColumnId, cardId, targetIndex }),
  });
}
