import { useState } from 'react';
import { AuthRequestSummary } from '../domain/auth';
import { StatusBadge } from './StatusBadge';

/**
 * The work queue. Rows show reference id, procedure code, status — nothing else.
 * List surfaces never carry member identity or clinical content. (D-001)
 *
 * The default view hides nothing: all rows render, nurse-review rows are marked,
 * and the nurse-only filter is one click away. A pre-filtered default would make
 * everything else invisible until someone thought to look. (D-003)
 */
export function AuthQueue({ requests }: { requests: AuthRequestSummary[] }) {
  const [nurseOnly, setNurseOnly] = useState(false);
  const visible = nurseOnly
    ? requests.filter((r) => r.status === 'PENDING_NURSE_REVIEW')
    : requests;

  return (
    <div>
      <button
        aria-pressed={nurseOnly}
        onClick={() => setNurseOnly(!nurseOnly)}
        style={{
          marginBottom: 12,
          padding: '6px 14px',
          borderRadius: 6,
          border: '1px solid #7c3aed',
          background: nurseOnly ? '#7c3aed' : 'transparent',
          color: nurseOnly ? '#fff' : '#7c3aed',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Nurse review only
      </button>
      {visible.length === 0 ? (
        <p>No authorization requests.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Reference</th>
              <th>Procedure</th>
              <th>Submitted</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr
                key={r.referenceId}
                {...(r.status === 'PENDING_NURSE_REVIEW'
                  ? { 'data-nurse-review': 'true', style: { background: '#f5f0ff' } }
                  : {})}
              >
                <td>{r.referenceId}</td>
                <td>{r.procedureCode}</td>
                <td>{r.submittedAt}</td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
