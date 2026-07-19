import { AuthStatus } from '../domain/auth';

/**
 * Note the gap: PENDING_NURSE_REVIEW renders exactly like PENDING — same label,
 * same look. A nurse scanning the queue cannot tell which rows are actually
 * waiting on a nurse. This is deliberate seed state; closing it is the
 * hello-world bolt (see README.md and docs/decisions.md "not yet decided").
 */
const LABELS: Record<AuthStatus, string> = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  PENDING_NURSE_REVIEW: 'Pending',
  APPROVED: 'Approved',
  DENIED: 'Denied',
};

const COLORS: Record<AuthStatus, string> = {
  DRAFT: '#6b7280',
  PENDING: '#b45309',
  PENDING_NURSE_REVIEW: '#b45309',
  APPROVED: '#0d9488',
  DENIED: '#be185d',
};

export function StatusBadge({ status }: { status: AuthStatus }) {
  return (
    <span
      data-testid="status-badge"
      style={{
        color: COLORS[status],
        border: `1px solid ${COLORS[status]}`,
        borderRadius: 6,
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {LABELS[status]}
    </span>
  );
}
