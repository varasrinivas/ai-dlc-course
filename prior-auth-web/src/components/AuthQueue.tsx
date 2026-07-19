import { AuthRequestSummary } from '../domain/auth';
import { StatusBadge } from './StatusBadge';

/**
 * The work queue. Rows show reference id, procedure code, status — nothing else.
 * List surfaces never carry member identity or clinical content. (D-001)
 */
export function AuthQueue({ requests }: { requests: AuthRequestSummary[] }) {
  if (requests.length === 0) {
    return <p>No authorization requests.</p>;
  }
  return (
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
        {requests.map((r) => (
          <tr key={r.referenceId}>
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
  );
}
