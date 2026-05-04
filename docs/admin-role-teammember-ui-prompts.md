# Admin Portal UI Prompts: Add Role + Team Member Role Dropdown

Use the following two prompts in sequence.

---

## Prompt 1: Add Role Button + Beautiful Add Role UI

Build a polished **Role Management** experience in the Admin Portal.

### Goal
- Admin must create roles first.
- Roles contain: `name`, `description`, `permissions[]`, `status`.
- UI should feel premium, clean, and modern (GreenPro theme), with excellent usability.

### Placement
- On Team Members page header (top-right), add two buttons:
  - `Add Role` (secondary/outline)
  - `Add Member` (primary green)
- Clicking `Add Role` opens a modal/drawer (responsive).

### Add Role UI Requirements
- Modal title: **Create Role**
- Fields:
  - Role Name (required, unique within tenant)
  - Description (optional)
  - Permission Matrix (required)
  - Status toggle (Active by default)
- Permission Matrix UX:
  - Group permissions by menu:
    - Dashboard
    - Categories
    - Manage Sectors
    - Manage Standards
    - Manufacturers
    - Products
    - Payment History
    - Events
    - Inquiries
    - Subscriber List
    - Banners
    - Team Members
    - Profile
  - For each menu, show chips/checkboxes for actions: `view`, `add`, `update`, `delete` (only where applicable)
  - Add “Select All” (global) and “Select Row” (per module)
  - Live selected-permissions count
- Validation:
  - Role Name required
  - At least one permission required
  - Inline errors with clear text
- Actions:
  - `Cancel`
  - `Create Role` (disabled until valid)
- On submit:
  - Call `POST /admin/rbac/roles`
  - Payload:
    - `name`
    - `description`
    - `permissions`
    - `status`
- Success:
  - Toast: “Role created successfully”
  - Refresh role list
  - Close modal
- Error handling:
  - Duplicate role name => inline field error
  - Forbidden/network errors => sticky alert/banner

### Visual Design Notes
- Rounded cards, soft shadow, subtle border, consistent spacing (8px grid)
- Green primary actions, neutral secondary actions
- Clear typography hierarchy: title, section headers, labels, helper text
- Keyboard navigation + focus rings + accessible contrast
- Fully responsive on desktop/tablet/mobile

### Optional Enhancements
- Search/filter inside permission matrix
- Role templates (e.g., Content Manager, Sales Operator, Support Executive)
- Preview panel showing final permission keys before submit

---

## Prompt 2: Add Team Member with Role Dropdown (Role must exist first)

Enhance existing **Add Team Member** UI without breaking existing behavior.

### Critical Non-Breaking Rule
- Keep existing `POST /admin/team-member/create` integration exactly as-is for:
  - `name`, `designation`, `email`, `mobile`, `image`, `facebookUrl`, `twitterUrl`, `linkedinUrl`
- Existing DB behavior and response usage must remain unchanged.
- New role assignment is additive.

### New UX Flow
1. Admin clicks `Add Member`.
2. Existing team-member form opens (same fields as today).
3. Add new section: **Role & Access**
   - Role dropdown (required for portal-access-enabled members)
   - Helper text: “Create a role first using Add Role.”
   - If no roles available:
     - Show empty state in dropdown: “No roles found”
     - Show inline action link/button: `+ Add Role`
4. On role selection:
   - Show read-only permission chips for selected role
   - Show role description

### Data + API Behavior
- Fetch roles for dropdown from:
  - `GET /admin/rbac/roles` (active roles only)
- Submit existing form first:
  - `POST /admin/team-member/create` (unchanged payload)
- After success, assign selected role:
  - `POST /admin/rbac/staff/roles`
  - payload: `vendorUserId`, `roleId`
- If backend returns credentials/temporary password metadata:
  - Show one-time success modal with copy buttons
  - “Credentials are visible only once” note

### Validation Rules
- Keep all current team member validations unchanged.
- Add:
  - Role required when “Portal Access” toggle is ON
  - Role optional when creating non-portal team contact
- Show precise errors:
  - Duplicate email/phone
  - Invalid role
  - Forbidden assignment

### UI Polish
- Use same style language as Add Role modal
- Dropdown with search, clear selected state, and keyboard support
- Permission preview in compact grouped chips
- Success state:
  - “Team member created”
  - “Role assigned”
  - Optional credentials block (if present)

### Edit Team Member (Additive)
- Keep existing edit API unchanged.
- Add role update area:
  - Load current mapping from `GET /admin/rbac/staff/roles`
  - Update via `PATCH /admin/rbac/staff/roles`

