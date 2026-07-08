# Frontend: Passport field optional on certified product upload

## Backend (done)

Passport is **optional** when saving a certified product passport.

- **Endpoint:** `PATCH /api/admin/products/certified/:productId/passport`
- **Body:** `{ "passport": "..." }` — `passport` may be omitted, empty string, or whitespace-only
- Empty/omitted content saves as an empty `productPassport` in the database
- Max **5000 characters excluding whitespace** still applies when content is provided (enforce in UI)

### Example — save without passport

```json
PATCH /api/admin/products/certified/507f1f77bcf86cd799439011/passport
{ "passport": "" }
```

Response `200` with `passport: ""` and `nonWhitespaceLength: 0`.

---

## Frontend changes

### 1. Remove required validation

In the **Passport Upload** modal:

- Remove the red asterisk from the **Passport** label
- Remove client-side rule **"Passport is required"**
- Allow **Save Passport** when the editor is empty

### 2. Submit

```ts
await api.patch(`/api/admin/products/certified/${productId}/passport`, {
  passport: editorHtml.trim(), // may be ''
});
```

### 3. Character limit (unchanged)

Keep the `0 / 5000 (excluding spaces)` counter and block submit only when content exceeds 5000 non-whitespace characters.

---

## Test checklist

1. Open Passport Upload — no required asterisk; empty editor can be saved
2. Save with content — succeeds; content appears on reload
3. Save with empty content — succeeds; clears passport
4. Network tab — PATCH returns 200, not 400, for empty `passport`
