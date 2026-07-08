# Frontend: Vendor registration — Resend OTP

## Backend (implemented)

New public endpoint for the **vendor registration OTP screen** (no auth token required).

### `POST /auth/resend-otp`

**Body (JSON)**

```json
{
  "email": "vendor@example.com"
}
```

**Success — `200`**

```json
{
  "message": "Verification OTP sent to your email."
}
```

**Errors**

| Status | When | Example `message` |
|--------|------|-------------------|
| `400` | Unknown email | `Email not registered` |
| `400` | Already verified | `Email is already verified. Please sign in.` |
| `400` | Email send failed | `Failed to send OTP email. Please try again later.` |
| `429` | Cooldown / too many resends | `Please wait 60 seconds before requesting another OTP.` |

`429` responses may include `retryAfterSeconds` in the JSON body.

### Related endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /auth/register-vendor` | Creates account; sends first OTP email |
| `POST /auth/verify-otp` | `{ email, otp }` — completes registration |
| `POST /auth/resend-otp` | `{ email }` — sends a **new** OTP |

### OTP behaviour

- **Development / staging:** OTP is `123456` (unless server sets `VENDOR_REGISTRATION_OTP_FIXED`).
- **Production:** random 6-digit code emailed to the user.
- Email subject: **GreenPro - Email verification OTP**.

### Rate limits (backend)

- **60 seconds** minimum between resend clicks for the same email.
- **Max 5** resends per email per **15 minutes**.

---

## Frontend implementation

### 1. Wire the “Resend OTP” link

On the OTP verification page, keep the registration email (from route state, query, or session storage after `register-vendor`).

```ts
type ResendOtpResponse = { message: string };

export async function resendRegistrationOtp(email: string): Promise<ResendOtpResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to resend OTP');
  }

  return data;
}
```

### 2. UX requirements

- Show **“Resend OTP”** as a link or button on the verify-email screen.
- **Disable** the control for **60 seconds** after each click (countdown label: “Resend in 0:45”).
- On success: toast **“Verification code sent to your email.”**
- On `429`: show server `message` and use `retryAfterSeconds` for the countdown if present.
- On `400` “already verified”: redirect to **login**.
- Do **not** navigate away on resend; user stays on OTP input.

### 3. Example React handler

```tsx
const [resendSeconds, setResendSeconds] = useState(0);
const email = registrationEmail; // from register step

useEffect(() => {
  if (resendSeconds <= 0) return;
  const t = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
  return () => clearTimeout(t);
}, [resendSeconds]);

async function handleResendOtp() {
  if (resendSeconds > 0 || !email) return;
  try {
    await resendRegistrationOtp(email);
    toast.success('Verification code sent to your email.');
    setResendSeconds(60);
  } catch (err: any) {
    toast.error(err?.message || 'Could not resend OTP');
  }
}

// UI
<button type="button" disabled={resendSeconds > 0} onClick={handleResendOtp}>
  {resendSeconds > 0 ? `Resend in 0:${String(resendSeconds).padStart(2, '0')}` : 'Resend OTP'}
</button>
```

### 4. Verify OTP (unchanged contract)

```ts
await fetch(`${API_BASE_URL}/auth/verify-otp`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, otp: otp.trim() }),
});
```

Success returns `gpInternalId`, `manufacturerInitial`, and `message: "Email verified successfully"`.

### 5. Common mistakes

- Calling resend **without** the same email used at registration → `400 Email not registered`.
- Using `GET` or query params — must be **`POST` + JSON body**.
- No client-side cooldown — users hit `429` repeatedly.
- Hiding the resend link when OTP expires — always show it (with cooldown) until verified.

---

## Test checklist

1. Register vendor → land on OTP page → click **Resend OTP** → success toast + new email.
2. Click resend again within 60s → `429` or disabled button.
3. Enter OTP → `POST /auth/verify-otp` → redirect to login/dashboard.
4. Resend on already-verified email → `400` → redirect to login.
