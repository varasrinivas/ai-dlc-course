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

  it('routes_below_threshold_to_nurse_review', () => {
    const d = service.decide(request(), member(true), match(0.84));
    expect(d.status).toBe(AuthStatus.PENDING_NURSE_REVIEW);
  });

  it('denies_when_member_ineligible_whatever_the_score', () => {
    const d = service.decide(request(), member(false), match(0.99));
    expect(d.status).toBe(AuthStatus.DENIED);
  });
});

describe('DeterminationService.rescore', () => {
  const service = new DeterminationService();

  const approved = (): ReturnType<DeterminationService['decide']> => ({
    authRequestId: 'AR-5001',
    status: AuthStatus.APPROVED,
    referenceId: 'PA-AR-5001',
    matchedCriteriaId: 'CC-27447',
    score: 0.91,
  });

  // (D-004) an existing determination is final; a re-score never withdraws it
  it('keeps_determination_final_on_rescore', () => {
    const out = service.rescore(approved(), { criteriaId: 'CC-27447', score: 0.62 });
    expect(out.determination.status).toBe(AuthStatus.APPROVED);
    expect(out.determination.score).toBe(0.91);
  });

  it('opens_new_request_when_approved_rescores_below_threshold', () => {
    const out = service.rescore(approved(), { criteriaId: 'CC-27447', score: 0.62 });
    expect(out.openNewRequest).toBe(true);
  });

  it('no_new_request_when_rescore_stays_at_or_above_threshold', () => {
    const out = service.rescore(approved(), { criteriaId: 'CC-27447', score: 0.88 });
    expect(out.openNewRequest).toBe(false);
  });
});
