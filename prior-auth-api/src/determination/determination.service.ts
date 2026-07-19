import { AuthRequest } from '../domain/auth-request.entity';
import { Member } from '../domain/member.entity';
import { AUTO_APPROVE_THRESHOLD, CriteriaMatch } from '../domain/clinical-criteria';
import { AuthStatus } from './auth-status.enum';
import { Determination } from './determination.entity';

/**
 * Decides an AuthRequest against a criteria match.
 *
 * The rules here are clinical policy. They are recorded in docs/decisions.md with the
 * reasoning and the person who decided. Do not change them from a prompt.
 */
export class DeterminationService {
  decide(request: AuthRequest, member: Member, match: CriteriaMatch): Determination {
    const base = {
      authRequestId: request.id,
      referenceId: `PA-${request.id}`,
      matchedCriteriaId: match.criteriaId,
      score: match.score,
    };

    // Eligibility outranks the score. An ineligible member is never auto-approved. (D-002)
    if (!member.eligible) {
      return { ...base, status: AuthStatus.DENIED };
    }

    // The rule is >= : exactly 0.85 auto-approves. (D-001)
    if (match.score >= AUTO_APPROVE_THRESHOLD) {
      return { ...base, status: AuthStatus.APPROVED };
    }

    // Below threshold: a nurse has to look at it.
    return { ...base, status: AuthStatus.PENDING_NURSE_REVIEW };
  }

  /**
   * Re-evaluates an existing determination against a new criteria match.
   *
   * A determination that exists is FINAL: a below-threshold re-score never withdraws
   * an approval — it signals the caller to open a NEW AuthRequest so the new evidence
   * gets fresh review without taking back a promise already made to a member. (D-004)
   */
  rescore(existing: Determination, match: CriteriaMatch): RescoreOutcome {
    return {
      determination: existing,
      openNewRequest:
        existing.status === AuthStatus.APPROVED && match.score < AUTO_APPROVE_THRESHOLD,
    };
  }
}

/** The result of a re-score. The determination is always the existing one. (D-004) */
export interface RescoreOutcome {
  determination: Determination;
  openNewRequest: boolean;
}
