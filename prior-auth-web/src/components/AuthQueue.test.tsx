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

  // The bolt's core criterion: a nurse can tell their work apart at a glance.
  it('nurse_review_badge_is_visibly_distinct', () => {
    render(
      <>
        <StatusBadge status="PENDING" />
        <StatusBadge status="PENDING_NURSE_REVIEW" />
      </>,
    );
    expect(screen.getByText('Needs nurse review')).toBeInTheDocument();
    expect(screen.getAllByText('Pending')).toHaveLength(1);
  });
});

describe('AuthQueue nurse view', () => {
  // (D-003) the default view hides nothing: all rows, nurse rows marked
  it('default_view_shows_all_rows', () => {
    render(<AuthQueue requests={rows} />);
    expect(screen.getByText('PA-AR-9001')).toBeInTheDocument();
    expect(screen.getByText('PA-AR-9002')).toBeInTheDocument();
  });

  it('nurse_review_rows_are_marked', () => {
    render(<AuthQueue requests={rows} />);
    expect(screen.getByText('PA-AR-9001').closest('tr')).toHaveAttribute('data-nurse-review', 'true');
    expect(screen.getByText('PA-AR-9002').closest('tr')).not.toHaveAttribute('data-nurse-review');
  });

  it('filter_shows_only_nurse_review_rows_when_toggled', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    render(<AuthQueue requests={rows} />);
    const toggle = screen.getByRole('button', { name: /nurse review only/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('PA-AR-9001')).toBeInTheDocument();
    expect(screen.queryByText('PA-AR-9002')).not.toBeInTheDocument();
  });
});
