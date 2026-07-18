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

    // Below threshold: a human has to look at it.
    return { ...base, status: AuthStatus.PENDING };
  }
}
