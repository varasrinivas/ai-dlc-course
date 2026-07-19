import { render, screen } from '@testing-library/react';
import { AuthQueue } from './AuthQueue';
import { StatusBadge } from './StatusBadge';
import { AuthRequestSummary } from '../domain/auth';

const rows: AuthRequestSummary[] = [
  { referenceId: 'PA-AR-9001', procedureCode: '27447', status: 'PENDING_NURSE_REVIEW', submittedAt: '2026-07-18' },
  { referenceId: 'PA-AR-9002', procedureCode: '70551', status: 'APPROVED', submittedAt: '2026-07-18' },
];

describe('AuthQueue', () => {
  it('lists_rows_by_reference_id', () => {
    render(<AuthQueue requests={rows} />);
    expect(screen.getByText('PA-AR-9001')).toBeInTheDocument();
    expect(screen.getByText('PA-AR-9002')).toBeInTheDocument();
  });

  // D-001: list surfaces carry reference ids only. Even if a payload smuggles
  // identity fields in, nothing in the row model can render them.
  it('never_renders_member_identity_on_list_surfaces', () => {
    const smuggled = rows.map(r => ({ ...r, memberName: 'Rosa Alvarez' })) as AuthRequestSummary[];
    render(<AuthQueue requests={smuggled} />);
    expect(screen.queryByText(/Rosa Alvarez/)).not.toBeInTheDocument();
  });

  it('shows_empty_state_when_no_requests', () => {
    render(<AuthQueue requests={[]} />);
    expect(screen.getByText('No authorization requests.')).toBeInTheDocument();
  });
});

describe('StatusBadge', () => {
  it('labels_terminal_statuses', () => {
    render(
      <>
        <StatusBadge status="APPROVED" />
        <StatusBadge status="DENIED" />
      </>,
    );
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Denied')).toBeInTheDocument();
  });

  // The seeded gap, asserted on purpose: today a nurse cannot tell nurse-review
  // work from generic pending. The hello-world bolt flips this test.
  it('renders_nurse_review_identically_to_pending_TODAY', () => {
    render(
      <>
        <StatusBadge status="PENDING" />
        <StatusBadge status="PENDING_NURSE_REVIEW" />
      </>,
    );
    const badges = screen.getAllByText('Pending');
    expect(badges).toHaveLength(2);
  });
});
