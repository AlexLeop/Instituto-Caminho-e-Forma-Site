// Donor access uses email and document suffix; the email-code policy is in shared/supporterAccess.ts.
export const SUPPORTER_PORTAL_ENABLED = true;

// Enable each institutional seal only after the Institute provides its confirmation.
export const ENABLED_INSTITUTIONAL_SEAL_IDS: readonly string[] = [];

export const isInstitutionalSealEnabled = (id: string) => ENABLED_INSTITUTIONAL_SEAL_IDS.includes(id);

export const INSTITUTIONAL_CERTIFICATIONS_LABEL = [
  isInstitutionalSealEnabled('oscip') ? 'OSCIP' : '',
  isInstitutionalSealEnabled('cebas-social') ? 'CEBAS' : '',
].filter(Boolean).join(' e ');
