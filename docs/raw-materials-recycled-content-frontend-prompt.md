# Frontend Implementation Prompt: Raw Materials Recycled Content API

Use this prompt in your frontend AI/code assistant to implement the API integration.

## Prompt

Implement frontend integration for the following APIs in the Raw Materials step:

1. `POST /raw-materials-recycled-content`
2. `GET /raw-materials-recycled-content/{urn_no}`

### Requirements

- Use authenticated requests (Bearer token).
- Use the exact request body shape below for POST.
- Render and reload `units[]` rows for one URN.
- `yeardata3` is computed by backend; display it as received.
- Handle loading, validation errors, and API errors.

### Exact POST Request Body (use this shape exactly)

```json
{
  "urnNo": "URN-XXXX",
  "vendorId": "66f1....",
  "units": [
    {
      "unitName": "Test Unit 1",
      "year": 2024,
      "unit1": 1,
      "yeardata1": 10,
      "unit2": 1,
      "yeardata2": 5
    },
    {
      "unitName": "Test Unit 2",
      "year": 2025,
      "unit1": 1,
      "yeardata1": 23,
      "unit2": 1,
      "yeardata2": 10
    }
  ]
}
```

### Expected POST Response

```json
{
  "success": true,
  "data": {
    "urnNo": "URN-XXXX",
    "vendorId": "66f1....",
    "units": [
      {
        "rawMaterialsRecycledContentId": 101,
        "unitName": "Test Unit 1",
        "year": 2024,
        "unit1": 1,
        "yeardata1": 10,
        "unit2": 1,
        "yeardata2": 5,
        "yeardata3": 50
      },
      {
        "rawMaterialsRecycledContentId": 102,
        "unitName": "Test Unit 2",
        "year": 2025,
        "unit1": 1,
        "yeardata1": 23,
        "unit2": 1,
        "yeardata2": 10,
        "yeardata3": 43.48
      }
    ]
  }
}
```

### GET API

- Endpoint: `GET /raw-materials-recycled-content/{urn_no}`
- Example: `GET /raw-materials-recycled-content/URN-XXXX`

### Expected GET Response

```json
{
  "success": true,
  "data": {
    "urnNo": "URN-XXXX",
    "vendorId": "66f1....",
    "units": [
      {
        "rawMaterialsRecycledContentId": 101,
        "unitName": "Test Unit 1",
        "year": 2024,
        "unit1": 1,
        "yeardata1": 10,
        "unit2": 1,
        "yeardata2": 5,
        "yeardata3": 50
      }
    ]
  }
}
```

### UI/State Behavior

- Build a dynamic rows table/form for `units`.
- Allow add/remove row.
- On save: call POST with all current rows.
- On page load (or URN change): call GET and prefill rows.
- Show `yeardata3` as read-only field from API response.
- If no units returned, initialize one empty row.

### Validation to enforce in UI before POST

- `urnNo` required.
- Per row: `unitName`, `year`, `unit1`, `yeardata1`, `unit2`, `yeardata2` required.
- `yeardata1` must be greater than 0.
- Numeric fields must be valid numbers.

