import { AuthStatus } from '../determination/auth-status.enum';

/** A provider's request for prior authorization of a procedure. */
export interface AuthRequest {
  id: string;
  memberId: string;
  providerId: string;
  /** CPT/HCPCS code, e.g. '27447' (total knee arthroplasty). */
  procedureCode: string;
  status: AuthStatus;
}
