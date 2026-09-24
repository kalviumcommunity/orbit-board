'use strict';

/**
 * dataStore.js
 * Reads and writes the OrbitBoard JSON data file (DATA_FILE).
 * This is a simple file-backed store — no external database required.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..', '..', '..');

function dataFilePath() {
  const rel = process.env.DATA_FILE || './server/data/board.json';
  return path.resolve(rootDir, rel);
}

function readData() {
  const file = dataFilePath();
  if (!fs.existsSync(file)) {
    // No data yet — return an empty list of boards.
    return [];
  }
  const raw = fs.readFileSync(file, 'utf-8');
  try {
    return JSON.parse(raw || '[]');
  } catch (err) {
    throw new Error(`Data file is not valid JSON: ${file}`);
  }
}

function writeData(boards) {
  const file = dataFilePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(boards, null, 2), 'utf-8');
}

// --- Boards -----------------------------------------------------------------

function getBoards() {
  return readData();
}

function getBoard(boardId) {
  return readData().find((b) => b.id === boardId) || null;
}

function createBoard(title) {
  const boards = readData();
  const board = {
    id: `board-${Date.now()}`,
    title: title || 'Untitled board',
    columns: [
      { id: 'col-backlog', title: 'Backlog', cards: [] },
      { id: 'col-in-progress', title: 'In Progress', cards: [] },
      { id: 'col-review', title: 'Review', cards: [] },
      { id: 'col-done', title: 'Done', cards: [] },
    ],
  };
  boards.push(board);
  writeData(boards);
  return board;
}

// --- Cards ------------------------------------------------------------------

function findColumn(boards, boardId, columnId) {
  const board = boards.find((b) => b.id === boardId);
  if (!board) throw Object.assign(new Error('Board not found'), { status: 404 });
  const column = board.columns.find((c) => c.id === columnId);
  if (!column) throw Object.assign(new Error('Column not found'), { status: 404 });
  return { board, column };
}

function createCard(boardId, columnId, { title, description }) {
  const boards = readData();
  const { column } = findColumn(boards, boardId, columnId);
  const card = {
    id: `card-${Date.now()}`,
    title: title || 'Untitled card',
    description: description || '',
  };
  column.cards.push(card);
  writeData(boards);
  return card;
}

function updateCard(boardId, columnId, cardId, updates) {
  const boards = readData();
  const { column } = findColumn(boards, boardId, columnId);
  const card = column.cards.find((c) => c.id === cardId);
  if (!card) throw Object.assign(new Error('Card not found'), { status: 404 });
  if (typeof updates.title === 'string') card.title = updates.title;
  if (typeof updates.description === 'string') card.description = updates.description;
  writeData(boards);
  return card;
}

function deleteCard(boardId, columnId, cardId) {
  const boards = readData();
  const { column } = findColumn(boards, boardId, columnId);

  const targetIndex = column.cards.findIndex((card) => card.id === cardId);
  if (targetIndex === -1) {
    throw Object.assign(new Error('Card not found'), { status: 404 });
  }
  column.cards.splice(targetIndex, 1);

  writeData(boards);
  return { ok: true };
}

function moveCard(boardId, sourceColumnId, targetColumnId, cardId, targetIndex) {
  const boards = readData();
  const board = boards.find((b) => b.id === boardId);
  if (!board) throw Object.assign(new Error('Board not found'), { status: 404 });

  const sourceCol = board.columns.find((c) => c.id === sourceColumnId);
  if (!sourceCol) throw Object.assign(new Error('Source column not found'), { status: 404 });

  const targetCol = board.columns.find((c) => c.id === targetColumnId);
  if (!targetCol) throw Object.assign(new Error('Target column not found'), { status: 404 });

  const cardIndex = sourceCol.cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) throw Object.assign(new Error('Card not found in source column'), { status: 404 });

  const [card] = sourceCol.cards.splice(cardIndex, 1);
  if (typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex <= targetCol.cards.length) {
    targetCol.cards.splice(targetIndex, 0, card);
  } else {
    targetCol.cards.push(card);
  }

  writeData(boards);
  return { ok: true, card, board };
}

module.exports = {
  readData,
  writeData,
  getBoards,
  getBoard,
  createBoard,
  createCard,
  updateCard,
  deleteCard,
  moveCard,
};
