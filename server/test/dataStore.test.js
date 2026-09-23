'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Isolate test data using a dedicated temporary data file
const testDataFile = './server/data/test-board.json';
process.env.DATA_FILE = testDataFile;

const store = require('../src/store/dataStore');

test('deleteCard removes an existing card by id without error', (t) => {
  const rootDir = path.resolve(__dirname, '..', '..');
  const fullPath = path.resolve(rootDir, testDataFile);

  const initialData = [
    {
      id: 'board-test',
      title: 'Test Board',
      columns: [
        {
          id: 'col-1',
          title: 'Column 1',
          cards: [
            { id: 'card-1', title: 'Card 1', description: '' },
            { id: 'card-2', title: 'Card 2', description: '' },
          ],
        },
      ],
    },
  ];

  store.writeData(initialData);

  t.after(() => {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  });

  const result = store.deleteCard('board-test', 'col-1', 'card-1');

  assert.deepStrictEqual(result, { ok: true });

  const updatedBoard = store.getBoard('board-test');
  const remainingCards = updatedBoard.columns[0].cards;

  assert.strictEqual(remainingCards.length, 1);
  assert.strictEqual(remainingCards[0].id, 'card-2');
  assert.strictEqual(remainingCards.find((c) => c.id === 'card-1'), undefined);
});
