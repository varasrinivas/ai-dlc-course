export enum AuthStatus {
  DRAFT = 'DRAFT',
  /**
   * Waiting on something. Note this is the ONLY waiting state today, so a request
   * parked for a nurse and a request parked for anything else look identical in the
   * queue. Nurses have complained they cannot tell what is actually theirs.
   */
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
}
