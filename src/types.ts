// ─── Input ────────────────────────────────────────────────────────────────────

export interface Input {
  cities: string[];
  customEndpoints?: CustomEndpoint[];
  issuedAfter?: string;
  issuedBefore?: string;
  permitTypes?: string[];
  minProjectValue?: number;
  maxResultsPerSource?: number;
  requestDelayMs?: number;
}

export interface CustomEndpoint {
  domain: string;
  datasetId: string;
  cityName: string;
  stateCode: string;
  fields: Partial<FieldMapping>;
}

// ─── Field mapping ────────────────────────────────────────────────────────────

export interface FieldMapping {
  permitNumber: string | null;
  permitType: string | null;
  issueDate: string | null;
  projectValue: string | null;
  streetNumber: string | null;
  streetDirection: string | null;
  streetName: string | null;
  borough: string | null;
  contractorName: string | null;
  contractorLicense: string | null;
  contractorLicenseType: string | null;
  contractorNamePart2: string | null;
  status: string | null;
  description: string | null;
  latitude: string | null;
  longitude: string | null;
  locationObject: string | null;
}

// ─── Output ───────────────────────────────────────────────────────────────────

export interface PermitRecord {
  city: string;
  state: string;
  source: string;
  permitNumber: string | null;
  permitType: string | null;
  address: string | null;
  projectValue: number | null;
  contractorName: string | null;
  contractorLicense: string | null;
  contractorLicenseType: string | null;
  issueDate: string | null;
  status: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
}
