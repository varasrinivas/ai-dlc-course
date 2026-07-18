/** The requesting clinician or facility. */
export interface Provider {
  id: string;
  /** National Provider Identifier. */
  npi: string;
  inNetwork: boolean;
}
