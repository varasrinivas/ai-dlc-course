/**
 * A criteria match at or above this score auto-approves.
 * The rule is >= : a score of exactly 0.85 auto-approves.
 *
 * This is a clinical policy value, not a tuning knob. See docs/decisions.md (D-001).
 */
export const AUTO_APPROVE_THRESHOLD = 0.85;

/** A published clinical rule set for a procedure. */
export interface ClinicalCriteria {
  id: string;
  procedureCode: string;
  description: string;
}

/** The result of scoring an AuthRequest against ClinicalCriteria. Score is 0..1. */
export interface CriteriaMatch {
  criteriaId: string;
  score: number;
}
