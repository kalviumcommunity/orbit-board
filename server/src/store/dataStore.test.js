'use strict';

/**
 * Regression tests for deleteCard() — OrbitBoard Issue #2.
 *
 * Uses Node's built-in test runner (node:test) and assertions (node:assert/strict).
 * All data I/O is redirected to a temporary JSON file via process.env.DATA_FILE
 * so the real server/data/board.json is never touched.
 *
 * Run with:  node --test server/src/store/dataStore.test.js
 */

const { describe, test, before, beforeEach, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const store = require('./dataStore');

// --- Fixture ---------------------------------------------------------------

const sampleBoard = [
  {
    id: 'board-1',
    title: 'Test Board',
    columns: [
      {
        id: 'col-backlog',
        title: 'Backlog',
        cards: [
          { id: 'card-1', title: 'Test Card 1', description: 'desc 1' },
          { id: 'card-2', title: 'Test Card 2', description: 'desc 2' },
        ],
      },
    ],
  },
];

// --- Setup / Teardown ------------------------------------------------------

let tempDir;
let tempFile;
let originalDataFile;

before(() => {
  // Remember whatever DATA_FILE was set to (could be undefined) so we can
  // restore it exactly during cleanup.
  originalDataFile = process.env.DATA_FILE;

  // Create a unique temp directory + file path.
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'orbit-test-'));
  tempFile = path.join(tempDir, 'board.json');

  // Redirect the data store to the temp file.
  process.env.DATA_FILE = tempFile;
});

beforeEach(() => {
  // Write fresh fixture data before every test so mutations in one test
  // don't leak into the next.
  fs.writeFileSync(tempFile, JSON.stringify(sampleBoard, null, 2), 'utf-8');
});

after(() => {
  // Restore the original DATA_FILE value, even if it was undefined.
  if (originalDataFile === undefined) {
    delete process.env.DATA_FILE;
  } else {
    process.env.DATA_FILE = originalDataFile;
  }

  // Remove the temp directory and everything inside it.
  if (tempDir && fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

// --- Tests -----------------------------------------------------------------

describe('deleteCard — existing card', () => {
  test('removes the card and persists the change', () => {
    // Act: delete card-1 from col-backlog on board-1
    const result = store.deleteCard('board-1', 'col-backlog', 'card-1');

    // Assert: return value
    assert.deepEqual(result, { ok: true });

    // Assert: the file on disk was persisted with card-1 removed
    const boards = store.readData();
    const column = boards[0].columns[0];

    assert.equal(column.cards.length, 1, 'column should have 1 card after deletion');
    assert.equal(column.cards[0].id, 'card-2', 'remaining card should be card-2');
    assert.equal(column.cards[0].title, 'Test Card 2', 'card-2 title should be unchanged');
    assert.equal(column.cards[0].description, 'desc 2', 'card-2 description should be unchanged');

    // Assert: card-1 is gone from the data
    const deleted = column.cards.find((c) => c.id === 'card-1');
    assert.equal(deleted, undefined, 'card-1 should no longer exist');
  });
});

describe('deleteCard — non-existent card', () => {
  test('throws an error with status 404 and message "Card not found"', () => {
    assert.throws(
      () => store.deleteCard('board-1', 'col-backlog', 'card-does-not-exist'),
      (err) => {
        assert.equal(err.status, 404);
        assert.equal(err.message, 'Card not found');
        return true;
      },
    );
  });

  test('does not modify the data file', () => {
    // Attempt the deletion (will throw)
    try {
      store.deleteCard('board-1', 'col-backlog', 'card-does-not-exist');
    } catch (_) {
      // expected
    }

    // Read the file back — both cards should still be there
    const boards = store.readData();
    const column = boards[0].columns[0];

    assert.equal(column.cards.length, 2, 'no cards should have been removed');
    assert.equal(column.cards[0].id, 'card-1', 'card-1 should still exist');
    assert.equal(column.cards[1].id, 'card-2', 'card-2 should still exist');
  });
});

describe('deleteCard — non-existent column', () => {
  test('throws the existing 404 error with message "Column not found"', () => {
    assert.throws(
      () => store.deleteCard('board-1', 'col-does-not-exist', 'card-1'),
      (err) => {
        assert.equal(err.status, 404);
        assert.equal(err.message, 'Column not found');
        return true;
      },
    );
  });
});
