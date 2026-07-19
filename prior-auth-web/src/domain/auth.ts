/**
 * The API contract, mirrored from prior-auth-api. PENDING_NURSE_REVIEW exists here
 * because the API's bolt shipped it (see prior-auth-api, D-004) — but note that the
 * UI below has NOT caught up: it still renders it like any other pending state.
 * That gap is this repo's hello-world bolt. See README.md.
 */
export type AuthStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'PENDING_NURSE_REVIEW'
  | 'APPROVED'
  | 'DENIED';

/**
 * What a queue row is allowed to know. Deliberately NO member name and NO clinical
 * content — list surfaces show the reference id only. (D-001)
 */
export interface AuthRequestSummary {
  referenceId: string;
  procedureCode: string;
  status: AuthStatus;
  submittedAt: string; // ISO date
}
