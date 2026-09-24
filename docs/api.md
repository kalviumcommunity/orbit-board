# OrbitBoard REST API

Base URL: `http://localhost:3000/api` (configurable via `API_URL`).

All responses are JSON. All request bodies are JSON (`Content-Type: application/json`).

## Data model

```jsonc
// Board
{
  "id": "board-1",
  "title": "OrbitBoard Demo",
  "columns": [
    {
      "id": "col-backlog",
      "title": "Backlog",
      "cards": [
        { "id": "card-1", "title": "Set up CI", "description": "" }
      ]
    }
  ]
}
```

## Endpoints

### Health

```
GET /api/health
→ 200 { "status": "ok", "service": "orbit-board" }
```

### Boards

```
GET /api/boards
→ 200 [ Board, ... ]

GET /api/boards/:boardId
→ 200 Board
→ 404 { "error": "Board not found" }

POST /api/boards
body: { "title": "My Board" }
→ 201 Board
```

### Cards

```
POST /api/boards/:boardId/columns/:columnId/cards
body: { "title": "New card", "description": "optional" }
→ 201 Card

PUT /api/boards/:boardId/columns/:columnId/cards/:cardId
body: { "title": "Updated", "description": "..." }
→ 200 Card
> ⚠️ NOTE: card editing is currently read-only in the UI (TODO).

DELETE /api/boards/:boardId/columns/:columnId/cards/:cardId
→ 200 { "ok": true }
→ 404 { "error": "Card not found" }
```

## Errors

Errors are returned as JSON with an `error` field and an appropriate status code:

```json
{ "error": "Board not found" }
```

The server also has a global error handler that returns `500` with a message for
unexpected failures.
