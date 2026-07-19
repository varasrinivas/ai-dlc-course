import { AuthStatus } from '../domain/auth';

/** Every API state renders distinctly; nurse-review work is unmissable. (D-003) */
const LABELS: Record<AuthStatus, string> = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  PENDING_NURSE_REVIEW: 'Needs nurse review',
  APPROVED: 'Approved',
  DENIED: 'Denied',
};

const COLORS: Record<AuthStatus, string> = {
  DRAFT: '#6b7280',
  PENDING: '#b45309',
  PENDING_NURSE_REVIEW: '#7c3aed',
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
