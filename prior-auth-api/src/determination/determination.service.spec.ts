import { DeterminationService } from './determination.service';
import { AuthStatus } from './auth-status.enum';
import { AuthRequest } from '../domain/auth-request.entity';
import { Member } from '../domain/member.entity';
import { CriteriaMatch } from '../domain/clinical-criteria';

describe('DeterminationService', () => {
  const service = new DeterminationService();

  const member = (eligible: boolean): Member => ({ id: 'M-1001', eligible });
  const match = (score: number): CriteriaMatch => ({ criteriaId: 'CC-27447', score });
  const request = (): AuthRequest => ({
    id: 'AR-5001',
    memberId: 'M-1001',
    providerId: 'P-77',
    procedureCode: '27447',
    status: AuthStatus.DRAFT,
  });

  it('auto_approves_above_threshold', () => {
    const d = service.decide(request(), member(true), match(0.91));
    expect(d.status).toBe(AuthStatus.APPROVED);
  });

  // The boundary is asserted so nobody re-litigates it. The rule is >=.
  it('auto_approves_exactly_at_threshold', () => {
    const d = service.decide(request(), member(true), match(0.85));
    expect(d.status).toBe(AuthStatus.APPROVED);
  });

  it('routes_below_threshold_to_pending', () => {
    const d = service.decide(request(), member(true), match(0.84));
    expect(d.status).toBe(AuthStatus.PENDING);
  });

  it('denies_when_member_ineligible_whatever_the_score', () => {
    const d = service.decide(request(), member(false), match(0.99));
    expect(d.status).toBe(AuthStatus.DENIED);
  });
});
