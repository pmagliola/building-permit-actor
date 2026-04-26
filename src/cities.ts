import type { FieldMapping } from './types.js';

// ─── City config ──────────────────────────────────────────────────────────────

export interface CityConfig {
  name: string;
  state: string;
  domain: string;
  datasetId: string;
  fields: FieldMapping;
  defaultWhere?: string;
}

// ─── Shared city definitions ──────────────────────────────────────────────────

const CHICAGO: CityConfig = {
  name: 'Chicago',
  state: 'IL',
  domain: 'data.cityofchicago.org',
  datasetId: 'ydr8-5enu',
  fields: {
    permitNumber: 'permit_',
    permitType: 'permit_type',
    issueDate: 'issue_date',
    projectValue: 'reported_cost',
    streetNumber: 'street_number',
    streetDirection: 'street_direction',
    streetName: 'street_name',
    borough: null,
    contractorName: 'contact_1_name',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: 'contact_1_type',
    status: null,
    description: 'work_description',
    latitude: 'latitude',
    longitude: 'longitude',
    locationObject: null,
  },
};

// NYC uses DOB NOW: Build - Approved Permits (rbx6-tga4)
// which has proper calendar_date fields and project cost data.
const NEW_YORK_CITY: CityConfig = {
  name: 'New York City',
  state: 'NY',
  domain: 'data.cityofnewyork.us',
  datasetId: 'rbx6-tga4',
  fields: {
    permitNumber: 'work_permit',
    permitType: 'work_type',
    issueDate: 'approved_date',
    projectValue: 'estimated_job_costs',
    streetNumber: 'house_no',
    streetDirection: null,
    streetName: 'street_name',
    borough: 'borough',
    contractorName: 'applicant_first_name',
    contractorNamePart2: 'applicant_last_name',
    contractorLicense: 'applicant_license',
    contractorLicenseType: 'permittee_s_license_type',
    status: 'permit_status',
    description: 'job_description',
    latitude: 'latitude',
    longitude: 'longitude',
    locationObject: null,
  },
};

// SF: no contractor data in this dataset; location is a nested object
const SAN_FRANCISCO: CityConfig = {
  name: 'San Francisco',
  state: 'CA',
  domain: 'data.sfgov.org',
  datasetId: 'i98e-djp9',
  fields: {
    permitNumber: 'permit_number',
    permitType: 'permit_type_definition',
    issueDate: 'issued_date',
    projectValue: 'revised_cost',
    streetNumber: 'street_number',
    streetDirection: null,
    streetName: 'street_name',
    borough: null,
    contractorName: null,
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'status',
    description: 'description',
    latitude: null,
    longitude: null,
    locationObject: 'location',
  },
};

// Note: LA open data permit datasets are typically 12-24 months behind.
// d9aa-v8bm has better field coverage (valuation, work description) than hbkd-qubn.
const LOS_ANGELES: CityConfig = {
  name: 'Los Angeles',
  state: 'CA',
  domain: 'data.lacity.org',
  datasetId: 'd9aa-v8bm',
  fields: {
    permitNumber: 'pcis_permit',
    permitType: 'permit_type',
    issueDate: 'issue_date',
    projectValue: 'valuation',
    streetNumber: 'address_start',
    streetDirection: 'street_direction',
    streetName: 'street_name',
    borough: null,
    contractorName: 'contractors_business_name',
    contractorNamePart2: null,
    contractorLicense: 'license',
    contractorLicenseType: 'license_type',
    status: 'latest_status',
    description: 'work_description',
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

// ─── Registry ─────────────────────────────────────────────────────────────────

const CITY_REGISTRY: Record<string, CityConfig> = {
  chicago: CHICAGO,
  'new york city': NEW_YORK_CITY,
  nyc: NEW_YORK_CITY,
  'san francisco': SAN_FRANCISCO,
  sf: SAN_FRANCISCO,
  'los angeles': LOS_ANGELES,
  la: LOS_ANGELES,
};

export function lookupCity(name: string): CityConfig | null {
  return CITY_REGISTRY[name.toLowerCase().trim()] ?? null;
}

export function listCities(): string[] {
  const seen = new Set<string>();
  return Object.values(CITY_REGISTRY)
    .filter((c) => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    })
    .map((c) => c.name);
}
