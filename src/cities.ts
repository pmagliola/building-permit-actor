import type { FieldMapping } from './types.js';

// ─── City config ──────────────────────────────────────────────────────────────

export interface CityConfig {
  name: string;
  state: string;
  /** undefined = Socrata (default) */
  platform?: 'arcgis';
  /** Socrata: required. ArcGIS: optional (used in logs/error objects only) */
  domain?: string;
  /** Socrata: required. ArcGIS: optional */
  datasetId?: string;
  /** ArcGIS only: full FeatureServer URL including layer index */
  featureServiceUrl?: string;
  fields: FieldMapping;
  defaultWhere?: string;
}

// ─── Shared city definitions ──────────────────────────────────────────────────

const SEATTLE: CityConfig = {
  name: 'Seattle',
  state: 'WA',
  domain: 'cos-data.seattle.gov',
  datasetId: '76t5-zqzr',
  fields: {
    permitNumber: 'permitnum',
    permitType: 'permittypemapped',
    issueDate: 'issueddate',
    projectValue: 'estprojectcost',
    streetNumber: 'originaladdress1',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'contractorcompanyname',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'statuscurrent',
    description: 'description',
    latitude: 'latitude',
    longitude: 'longitude',
    locationObject: null,
  },
};

const AUSTIN: CityConfig = {
  name: 'Austin',
  state: 'TX',
  domain: 'data.austintexas.gov',
  datasetId: '3syk-w9eu',
  fields: {
    permitNumber: 'permit_number',
    permitType: 'permit_type_desc',
    issueDate: 'issue_date',
    projectValue: 'total_job_valuation',
    streetNumber: 'original_address1',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'contractor_company_name',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'status_current',
    description: 'description',
    latitude: 'latitude',
    longitude: 'longitude',
    locationObject: null,
  },
};

const CINCINNATI: CityConfig = {
  name: 'Cincinnati',
  state: 'OH',
  domain: 'data.cincinnati-oh.gov',
  datasetId: 'uhjb-xac9',
  fields: {
    permitNumber: 'permitnum',
    permitType: 'permittypemapped',
    issueDate: 'issueddate',
    projectValue: 'estprojectcostdec',
    streetNumber: 'originaladdress1',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'companyname',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'statuscurrent',
    description: 'description',
    latitude: 'latitude',
    longitude: 'longitude',
    locationObject: null,
  },
};

const ORLANDO: CityConfig = {
  name: 'Orlando',
  state: 'FL',
  domain: 'data.cityoforlando.net',
  datasetId: 'ryhf-m453',
  fields: {
    permitNumber: 'permit_number',
    permitType: 'worktype',
    issueDate: 'issue_permit_date',
    projectValue: 'estimated_cost',
    streetNumber: 'permit_address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'contractor_name',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'application_status',
    description: 'project_name',
    latitude: null,
    longitude: null,
    locationObject: 'location',
  },
};

const BATON_ROUGE: CityConfig = {
  name: 'Baton Rouge',
  state: 'LA',
  domain: 'data.brla.gov',
  datasetId: '7fq7-8j7r',
  fields: {
    permitNumber: 'permitnumber',
    permitType: 'permittype',
    issueDate: 'issueddate',
    projectValue: 'projectvalue',
    streetNumber: 'streetaddress',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'contractorname',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: null,
    description: 'projectdescription',
    latitude: 'lat',
    longitude: 'long',
    locationObject: null,
  },
};

// Note: no contractor data in this dataset; coordinates extracted from GeoJSON the_geom
const NEW_ORLEANS: CityConfig = {
  name: 'New Orleans',
  state: 'LA',
  domain: 'data.nola.gov',
  datasetId: 'nbcf-m6c2',
  fields: {
    permitNumber: 'numstring',
    permitType: 'permittype',
    issueDate: 'issuedate',
    projectValue: 'constructionval',
    streetNumber: 'address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: null,
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: null,
    description: 'descr',
    latitude: null,
    longitude: null,
    locationObject: 'the_geom',
  },
};

// ─── ArcGIS cities ────────────────────────────────────────────────────────────

const MINNEAPOLIS: CityConfig = {
  name: 'Minneapolis',
  state: 'MN',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services.arcgis.com/afSMGVsC7QlRK1kZ/arcgis/rest/services/CCS_Permits/FeatureServer/0',
  fields: {
    permitNumber: 'permitNumber',
    permitType: 'permitType',
    issueDate: 'issueDate',
    projectValue: 'value',
    streetNumber: 'Display',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'applicantName',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'status',
    description: 'comments',
    latitude: 'Latitude',
    longitude: 'Longitude',
    locationObject: null,
  },
};

// No contractor data in this dataset; coordinates extracted from geometry
const BALTIMORE: CityConfig = {
  name: 'Baltimore',
  state: 'MD',
  platform: 'arcgis',
  featureServiceUrl:
    'https://egisdata.baltimorecity.gov/egis/rest/services/Housing/DHCD_Open_Baltimore_Datasets/FeatureServer/3',
  fields: {
    permitNumber: 'CaseNumber',
    permitType: 'ExistingUse',
    issueDate: 'IssuedDate',
    projectValue: 'Cost',
    streetNumber: 'Address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: null,
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: null,
    description: 'Description',
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

const TEMPE: CityConfig = {
  name: 'Tempe',
  state: 'AZ',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services.arcgis.com/lQySeXwbBg53XWDi/arcgis/rest/services/building_permits/FeatureServer/0',
  fields: {
    permitNumber: 'PermitNum',
    permitType: 'PermitType',
    issueDate: 'IssuedDateDtm',
    projectValue: 'EstProjectCost',
    streetNumber: 'OriginalAddress1',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'ContractorCompanyName',
    contractorNamePart2: null,
    contractorLicense: 'ContractorLicNum',
    contractorLicenseType: null,
    status: 'StatusCurrent',
    description: 'Description',
    latitude: 'Latitude',
    longitude: 'Longitude',
    locationObject: null,
  },
};

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
  seattle: SEATTLE,
  austin: AUSTIN,
  cincinnati: CINCINNATI,
  orlando: ORLANDO,
  'baton rouge': BATON_ROUGE,
  'new orleans': NEW_ORLEANS,
  nola: NEW_ORLEANS,
  minneapolis: MINNEAPOLIS,
  baltimore: BALTIMORE,
  tempe: TEMPE,
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
