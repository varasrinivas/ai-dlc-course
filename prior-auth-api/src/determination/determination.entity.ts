import { AuthStatus } from './auth-status.enum';

/** The outcome of deciding an AuthRequest. */
export interface Determination {
  authRequestId: string;
  status: AuthStatus;
  /** Safe to show a member or provider. Never carries clinical content. */
  referenceId: string;
  matchedCriteriaId: string;
  score: number;
}
