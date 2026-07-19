import { AuthRequestSummary } from '../domain/auth';

/** Static sample rows until the queue is wired to GET /auth-requests. */
export const SAMPLE_QUEUE: AuthRequestSummary[] = [
  { referenceId: 'PA-AR-5001', procedureCode: '27447', status: 'PENDING_NURSE_REVIEW', submittedAt: '2026-07-17' },
  { referenceId: 'PA-AR-5002', procedureCode: '70551', status: 'PENDING', submittedAt: '2026-07-17' },
  { referenceId: 'PA-AR-5003', procedureCode: '27447', status: 'APPROVED', submittedAt: '2026-07-18' },
  { referenceId: 'PA-AR-5004', procedureCode: '93000', status: 'PENDING_NURSE_REVIEW', submittedAt: '2026-07-18' },
  { referenceId: 'PA-AR-5005', procedureCode: '70551', status: 'DENIED', submittedAt: '2026-07-18' },
];
