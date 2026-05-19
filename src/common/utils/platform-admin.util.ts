/** Platform admin accounts (`users.type === 'admin'`) have unrestricted portal access. */
export function isPlatformAdminUser(user?: {
  role?: string;
  type?: string;
} | null): boolean {
  if (!user) return false;
  const role = String(user.role ?? user.type ?? '')
    .trim()
    .toLowerCase();
  return role === 'admin';
}
