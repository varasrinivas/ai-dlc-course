/** A covered individual. Eligibility is evaluated as of the request date. */
export interface Member {
  id: string;
  /**
   * Eligibility as of the request date.
   * An ineligible member is never auto-approved, whatever the criteria score.
   */
  eligible: boolean;
}
