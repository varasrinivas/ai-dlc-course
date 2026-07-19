export enum AuthStatus {
  DRAFT = 'DRAFT',
  /** Waiting on something other than clinical review (eligibility checks, intake). */
  PENDING = 'PENDING',
  /** Below-threshold criteria match: parked for a nurse. What the queue filters on. */
  PENDING_NURSE_REVIEW = 'PENDING_NURSE_REVIEW',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}
