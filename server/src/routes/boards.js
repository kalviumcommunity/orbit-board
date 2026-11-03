'use strict';

const express = require('express');
const store = require('../store/dataStore');

const router = express.Router();

// GET /api/boards — all boards
router.get('/boards', (req, res, next) => {
  try {
    res.json(store.getBoards());
  } catch (err) {
    next(err);
  }
});

// GET /api/boards/:boardId — one board
router.get('/boards/:boardId', (req, res, next) => {
  try {
    const board = store.getBoard(req.params.boardId);
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json(board);
  } catch (err) {
    next(err);
  }
});

// POST /api/boards — create a board
router.post('/boards', (req, res, next) => {
  try {
    const board = store.createBoard(req.body.title);
    res.status(201).json(board);
  } catch (err) {
    next(err);
  }
});

// POST /api/boards/:boardId/columns/:columnId/cards — create a card
router.post('/boards/:boardId/columns/:columnId/cards', (req, res, next) => {
  try {
    const { boardId, columnId } = req.params;
    const card = store.createCard(boardId, columnId, req.body);
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
});

// PUT /api/boards/:boardId/columns/:columnId/cards/:cardId — update a card
// NOTE: card editing is read-only in the UI for now (TODO), but the API works.
router.put('/boards/:boardId/columns/:columnId/cards/:cardId', (req, res, next) => {
  try {
    const { boardId, columnId, cardId } = req.params;
    const card = store.updateCard(boardId, columnId, cardId, req.body);
    res.json(card);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/boards/:boardId/columns/:columnId/cards/:cardId — delete a card
router.delete('/boards/:boardId/columns/:columnId/cards/:cardId', (req, res, next) => {
  try {
    const { boardId, columnId, cardId } = req.params;
    const result = store.deleteCard(boardId, columnId, cardId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
