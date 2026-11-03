'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const store = require('../src/store/dataStore');

function createBoardData() {
  return [
    {
      id: 'board-1',
      title: 'Test board',
      columns: [
        {
          id: 'column-1',
          title: 'Todo',
          cards: [
            { id: 'card-1', title: 'Remove me', description: '' },
            { id: 'card-2', title: 'Keep me', description: '' },
          ],
        },
      ],
    },
  ];
}

function useTemporaryDataFile(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'orbit-board-test-'));
  const file = path.join(directory, 'board.json');
  const previousDataFile = process.env.DATA_FILE;

  fs.writeFileSync(file, JSON.stringify(createBoardData()), 'utf8');
  process.env.DATA_FILE = file;

  t.after(() => {
    if (previousDataFile === undefined) {
      delete process.env.DATA_FILE;
    } else {
      process.env.DATA_FILE = previousDataFile;
    }
    fs.rmSync(directory, { recursive: true, force: true });
  });

  return file;
}

test('deleteCard removes and persists only the requested card', (t) => {
  const file = useTemporaryDataFile(t);

  assert.deepEqual(store.deleteCard('board-1', 'column-1', 'card-1'), {
    ok: true,
  });

  const savedBoards = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.deepEqual(savedBoards[0].columns[0].cards, [
    { id: 'card-2', title: 'Keep me', description: '' },
  ]);
});

test('deleteCard returns 404 and leaves data unchanged for an unknown card', (t) => {
  const file = useTemporaryDataFile(t);
  const originalBoards = createBoardData();

  assert.throws(
    () => store.deleteCard('board-1', 'column-1', 'missing-card'),
    (error) => error.message === 'Card not found' && error.status === 404
  );

  assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')), originalBoards);
});
