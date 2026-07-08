# Frontend: Remove postal code from site visit form

## Backend (done)

Site visit **does not use postal code**. The API:

- Does **not** require `postalCode` on create or update
- **Ignores** `postalCode` / `postal_code` if sent (legacy clients)
- Does **not** return `postalCode` in list/detail responses
- Stores an empty string in DB for new rows (internal only)

### Endpoints

| Action | Method | Path |
|--------|--------|------|
| Plant dropdown | `GET` | `/api/admin/urn-site-visits/plant-options?urnNo=…` |
| Create | `POST` | `/api/admin/urn-site-visits` |
| Update | `PATCH` | `/api/admin/urn-site-visits/:id` |
| List | `GET` | `/api/admin/urn-site-visits?urnNo=…` |

### Create body (required fields)

```json
{
  "urnNo": "URN-20260514165917",
  "name": "Unit-1",
  "addressLine1": "Kadiri",
  "addressLine2": "",
  "city": "Kadiri",
  "state": "Andhra Pradesh",
  "country": "India"
}
```

Optional: `auditType`, `auditConductedOn`, `conductedBy`.

**Do not send** `postalCode` or `postal_code`.

---

## Frontend changes

### 1. Remove the field from the modal

In **Add site location** / **Edit site location**:

- Delete the **Postal code** input and its label
- Remove `postalCode` from form state, validation schema, and submit payload
- Remove any `required` rule for postal code

### 2. Prefill from plant options (unchanged)

When the user picks a plant from the dropdown, prefill from `GET plant-options`:

- `addressLine1` ← `plantLocation`
- `city` ← `city`
- `state` ← `stateName`
- `country` ← `countryName`

There is **no** postal code on plant options — do not show an empty postal field.

### 3. Submit example

```ts
await api.post('/api/admin/urn-site-visits', {
  urnNo,
  name: selectedPlant.plantName,
  addressLine1,
  addressLine2: addressLine2 || '',
  city,
  state,
  country,
});
```

### 4. Validation

Required on save:

- Plant name (`name`)
- Address line 1 (`addressLine1`)
- City (`city`)
- State (`state`)
- Country (`country`)

Address line 2 remains optional.

---

## Test checklist

1. Open Add site location — no postal code field visible
2. Select plant — address/city/state/country prefilled; save succeeds
3. Edit existing site visit — no postal code field; update succeeds
4. Network tab — POST/PATCH body has no `postalCode`
