import type { FieldMapping } from './types.js';
import type { AccelaAgencyConfig } from './accela.js';

// ─── City config ──────────────────────────────────────────────────────────────

export interface CityConfig {
  name: string;
  state: string;
  /** undefined = Socrata (default) */
  platform?: 'arcgis' | 'accela-one';
  /** Socrata: required. ArcGIS: optional (used in logs/error objects only) */
  domain?: string;
  /** Socrata: required. ArcGIS: optional */
  datasetId?: string;
  /** ArcGIS only: full FeatureServer URL including layer index */
  featureServiceUrl?: string;
  /** Accela ONE only: agency code e.g. RENO, SPARKS, WASHOE */
  accelaAgency?: string;
  fields: FieldMapping;
  defaultWhere?: string;
  /** ArcGIS only: set true when issueDate field is a non-date string type (skips DATE filter in WHERE clause) */
  issueDateIsString?: boolean;
}

export function isAccelaConfig(config: CityConfig): config is CityConfig & AccelaAgencyConfig {
  return config.platform === 'accela-one' && !!config.accelaAgency;
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

// Gainesville FL: no project value field; business = contractor company, contractor = individual name
const GAINESVILLE: CityConfig = {
  name: 'Gainesville',
  state: 'FL',
  domain: 'data.cityofgainesville.org',
  datasetId: 'p798-x3nx',
  fields: {
    permitNumber: 'permit',
    permitType: 'type',
    issueDate: 'issue',
    projectValue: null,
    streetNumber: 'address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'business',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: null,
    description: 'subtype',
    latitude: 'latitude',
    longitude: 'longitude',
    locationObject: null,
  },
};

// Note: Dallas open data permit dataset has not been updated since Jan 2024
const DALLAS: CityConfig = {
  name: 'Dallas',
  state: 'TX',
  domain: 'www.dallasopendata.com',
  datasetId: 'e7gq-4sah',
  fields: {
    permitNumber: 'permit_number',
    permitType: 'permit_type',
    issueDate: 'issued_date',
    projectValue: 'value',
    streetNumber: 'street_address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'contractor',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: null,
    description: 'work_description',
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

// ─── ArcGIS cities ────────────────────────────────────────────────────────────

// Sacramento CA: Status_Date is a string field (MM/DD/YYYY) - not a real Date type, so
// issueDateIsString=true skips the DATE filter in WHERE clause. Date still appears in output.
// BldgPermitIssued_Archive covers 9 years of history; CurrentYear is always fresh.
const SACRAMENTO: CityConfig = {
  name: 'Sacramento',
  state: 'CA',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services5.arcgis.com/54falWtcpty3V47Z/arcgis/rest/services/BldgPermitIssued_Archive/FeatureServer/0',
  issueDateIsString: true,
  fields: {
    permitNumber: 'Application',
    permitType: 'Type',
    issueDate: 'Status_Date',
    projectValue: 'Valuation',
    streetNumber: 'Address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'Contractor',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'Current_Status',
    description: 'Work_Desc',
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

// Maricopa County AZ: covers county-wide permits (unincorporated + municipalities using county system).
// No contractor/value fields available.
const MARICOPA_COUNTY: CityConfig = {
  name: 'Maricopa County',
  state: 'AZ',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services.arcgis.com/ykpntM6e3tHvzKRJ/arcgis/rest/services/Building_Permits_(view)/FeatureServer/0',
  fields: {
    permitNumber: 'PermitNumber',
    permitType: 'PermitType',
    issueDate: 'IssuedDate',
    projectValue: null,
    streetNumber: 'FullStreetAddress',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: null,
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'PermitStatus',
    description: 'PermitDescription',
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

// Philadelphia PA: PERMITS FeatureServer. No project value. Coordinates from ArcGIS geometry
// (geocode_x/y are State Plane, not lat/lng). Contractor null on some zoning permit records.
const PHILADELPHIA: CityConfig = {
  name: 'Philadelphia',
  state: 'PA',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/PERMITS/FeatureServer/0',
  fields: {
    permitNumber: 'permitnumber',
    permitType: 'permittype',
    issueDate: 'permitissuedate',
    projectValue: null,
    streetNumber: 'address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'contractorname',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'status',
    description: 'approvedscopeofwork',
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

// Miami FL: City of Miami permits since 2014. TotalCost stored as string with numeric value.
// ScopeofWork = permit category (NEW CONSTRUCTION, ADDITION AND REMODELING, etc.)
const MIAMI: CityConfig = {
  name: 'Miami',
  state: 'FL',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services1.arcgis.com/CvuPhqcTQpZPT9qY/arcgis/rest/services/Building_Permits_Since_2014/FeatureServer/0',
  fields: {
    permitNumber: 'PermitNumber',
    permitType: 'ScopeofWork',
    issueDate: 'IssuedDate',
    projectValue: 'TotalCost',
    streetNumber: 'DeliveryAddress',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'CompanyName',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'BuildingPermitStatusDescription',
    description: 'WorkItems',
    latitude: 'Latitude',
    longitude: 'Longitude',
    locationObject: null,
  },
};

// Greensboro NC: MapServer endpoint, supports /query. No coordinates (geometry not returned).
// PermitNum is Integer type but extractField converts to string.
const GREENSBORO: CityConfig = {
  name: 'Greensboro',
  state: 'NC',
  platform: 'arcgis',
  featureServiceUrl:
    'https://gis.greensboro-nc.gov/arcgis/rest/services/OpenGateCity/OpenData_HRES_DS/MapServer/2',
  fields: {
    permitNumber: 'PermitNum',
    permitType: 'PermitType',
    issueDate: 'IssuedDate',
    projectValue: 'TotalCost',
    streetNumber: 'FullAddress',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'Contractor',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'CurrentStatus',
    description: 'Description',
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

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

// Rolling 3-year period, daily updates from Metro Codes e-permits
// Residential construction permits only; daily updates extracted from Accela
const DENVER: CityConfig = {
  name: 'Denver',
  state: 'CO',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services1.arcgis.com/zdB7qR0BtYrg0Xpl/arcgis/rest/services/ODC_DEV_RESIDENTIALCONSTPERMIT_P/FeatureServer/316',
  fields: {
    permitNumber: 'PERMIT_NUM',
    permitType: 'CLASS',
    issueDate: 'DATE_ISSUED',
    projectValue: 'VALUATION',
    streetNumber: 'ADDRESS',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'CONTRACTOR_NAME',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: null,
    description: null,
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

// Table only (no geometry); File_Date = application filed date; no contractor data
const FORT_WORTH: CityConfig = {
  name: 'Fort Worth',
  state: 'TX',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services5.arcgis.com/3ddLCBXe1bRt7mzj/ArcGIS/rest/services/CFW_Open_Data_Development_Permits_View/FeatureServer/0',
  fields: {
    permitNumber: 'Permit_No',
    permitType: 'Permit_Type',
    issueDate: 'File_Date',
    projectValue: 'JobValue',
    streetNumber: 'Full_Street_Address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: null,
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: null,
    description: null,
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

const NASHVILLE: CityConfig = {
  name: 'Nashville',
  state: 'TN',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services2.arcgis.com/HdTo6HJqh92wn4D8/arcgis/rest/services/Building_Permits_Issued_2/FeatureServer/0',
  fields: {
    permitNumber: 'Permit__',
    permitType: 'Permit_Type_Description',
    issueDate: 'Date_Issued',
    projectValue: 'Const_Cost',
    streetNumber: 'Address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'Contact',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: null,
    description: 'Purpose',
    latitude: 'Lat',
    longitude: 'Lon',
    locationObject: null,
  },
};

// Daily updates, 2000 to present; full BLDS-standard schema
const RALEIGH: CityConfig = {
  name: 'Raleigh',
  state: 'NC',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services.arcgis.com/v400IkDOw1ad7Yad/arcgis/rest/services/Building_Permits/FeatureServer/0',
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
    contractorLicense: 'contractorlicnum',
    contractorLicenseType: null,
    status: null,
    description: 'proposedworkdescription',
    latitude: 'latitude_perm',
    longitude: 'longitude_perm',
    locationObject: null,
  },
};

// Anaheim CA: Accela-based FeatureServer. Full address includes city/state in address field.
// jobvaluation is a String containing numeric value. Contractor sometimes null.
const ANAHEIM: CityConfig = {
  name: 'Anaheim',
  state: 'CA',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services3.arcgis.com/hPs600I3X0RTaaaq/arcgis/rest/services/Accela_Building_Permits/FeatureServer/0',
  fields: {
    permitNumber: 'casenumber',
    permitType: 'typeofwork',
    issueDate: 'permitissued',
    projectValue: 'jobvaluation',
    streetNumber: 'address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'contractorsname',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'casestatus',
    description: 'description',
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

// Columbus OH: MapServer layer 5. APPLICANT_BUS_NAME = contractor company. G3_VALUE_TTL is Double.
// Full address in SITE_ADDRESS. 664k records back to ~2000.
const COLUMBUS: CityConfig = {
  name: 'Columbus',
  state: 'OH',
  platform: 'arcgis',
  featureServiceUrl:
    'https://maps2.columbus.gov/arcgis/rest/services/Schemas/BuildingZoning/MapServer/5',
  fields: {
    permitNumber: 'B1_ALT_ID',
    permitType: 'B1_PER_TYPE',
    issueDate: 'ISSUED_DT',
    projectValue: 'G3_VALUE_TTL',
    streetNumber: 'SITE_ADDRESS',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'APPLICANT_BUS_NAME',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'PERMIT_STATUS',
    description: 'B1_PER_CATEGORY',
    latitude: null,
    longitude: null,
    locationObject: null,
  },
};

// Washington DC: year-specific layers; layer 18 = 2026. PERMIT_APPLICANT = individual filer
// (contractor or owner). No project value field. Daily updates from DC Dept of Buildings.
const WASHINGTON_DC: CityConfig = {
  name: 'Washington DC',
  state: 'DC',
  platform: 'arcgis',
  featureServiceUrl:
    'https://maps2.dcgis.dc.gov/dcgis/rest/services/FEEDS/DCRA/FeatureServer/18',
  fields: {
    permitNumber: 'PERMIT_ID',
    permitType: 'PERMIT_TYPE_NAME',
    issueDate: 'ISSUE_DATE',
    projectValue: null,
    streetNumber: 'FULL_ADDRESS',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'PERMIT_APPLICANT',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'APPLICATION_STATUS_NAME',
    description: 'DESC_OF_WORK',
    latitude: 'LATITUDE',
    longitude: 'LONGITUDE',
    locationObject: null,
  },
};

// Louisville Metro KY: contractor name, project costs, lat/lng all populated
const LOUISVILLE: CityConfig = {
  name: 'Louisville',
  state: 'KY',
  platform: 'arcgis',
  featureServiceUrl:
    'https://services1.arcgis.com/79kfd2K6fskCAkyg/arcgis/rest/services/Louisville_Metro_KY_Active_Permits/FeatureServer/0',
  fields: {
    permitNumber: 'PERMITNUMBER',
    permitType: 'PERMITTYPE',
    issueDate: 'ISSUEDATE',
    projectValue: 'PROJECTCOSTS',
    streetNumber: 'ADDRESS',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'CONTRACTOR',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'STATUS',
    description: null,
    latitude: 'Latitude',
    longitude: 'Longitude',
    locationObject: null,
  },
};

// County-wide data; borough field maps to municipality (Chula Vista, El Cajon, etc.)
const SAN_DIEGO_COUNTY: CityConfig = {
  name: 'San Diego County',
  state: 'CA',
  domain: 'data.sandiegocounty.gov',
  datasetId: 'dyzh-7eat',
  fields: {
    permitNumber: 'record_id',
    permitType: 'record_type',
    issueDate: 'issued_date',
    projectValue: 'valuation',
    streetNumber: 'street_address',
    streetDirection: null,
    streetName: null,
    borough: 'city',
    contractorName: 'contractor_name',
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'record_status',
    description: null,
    latitude: null,
    longitude: null,
    locationObject: 'geocoded_column',
  },
};

// Daily weekday updates; includes all permit types (building, electrical, plumbing, etc.)
const NORFOLK: CityConfig = {
  name: 'Norfolk',
  state: 'VA',
  domain: 'data.norfolk.gov',
  datasetId: 'fahm-yuh4',
  fields: {
    permitNumber: 'permit_number',
    permitType: 'type',
    issueDate: 'issue_date',
    projectValue: 'project_cost',
    streetNumber: 'address',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: null,
    contractorNamePart2: null,
    contractorLicense: null,
    contractorLicenseType: null,
    status: 'status',
    description: null,
    latitude: 'latitude',
    longitude: 'longitude',
    locationObject: null,
  },
};

// 273k records from 2000-present; applicant field is typically the licensed contractor
const BUFFALO: CityConfig = {
  name: 'Buffalo',
  state: 'NY',
  domain: 'data.buffalony.gov',
  datasetId: '9p2d-f3yt',
  fields: {
    permitNumber: 'apno',
    permitType: 'aptype',
    issueDate: 'issued',
    projectValue: 'value',
    streetNumber: 'stname',
    streetDirection: null,
    streetName: null,
    borough: null,
    contractorName: 'applicant',
    contractorNamePart2: null,
    contractorLicense: 'licno',
    contractorLicenseType: 'lictype',
    status: null,
    description: 'descofwork',
    latitude: 'latitude',
    longitude: 'longitude',
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

// ─── Accela ONE — Nevada (ONE Regional Portal) ───────────────────────────────

// All three share the same portal: aca-prod.accela.com/ONE (onenv.us)
// Data includes contractor name, license, phone, job value, and full address.
// Dummy field mapping required by CityConfig; fields are parsed directly from HTML.
const EMPTY_FIELDS: FieldMapping = {
  permitNumber: null,
  permitType: null,
  issueDate: null,
  projectValue: null,
  streetNumber: null,
  streetDirection: null,
  streetName: null,
  borough: null,
  contractorName: null,
  contractorNamePart2: null,
  contractorLicense: null,
  contractorLicenseType: null,
  status: null,
  description: null,
  latitude: null,
  longitude: null,
  locationObject: null,
};

const RENO: CityConfig = {
  name: 'Reno',
  state: 'NV',
  platform: 'accela-one',
  accelaAgency: 'RENO',
  fields: EMPTY_FIELDS,
};

const SPARKS: CityConfig = {
  name: 'Sparks',
  state: 'NV',
  platform: 'accela-one',
  accelaAgency: 'SPARKS',
  fields: EMPTY_FIELDS,
};

// Unincorporated Washoe County (excludes City of Reno and City of Sparks)
const WASHOE_COUNTY: CityConfig = {
  name: 'Washoe County',
  state: 'NV',
  platform: 'accela-one',
  accelaAgency: 'WASHOE',
  fields: EMPTY_FIELDS,
};

const DOUGLAS_COUNTY: CityConfig = {
  name: 'Douglas County',
  state: 'NV',
  platform: 'accela-one',
  accelaAgency: 'DOUGLAS',
  fields: EMPTY_FIELDS,
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
  buffalo: BUFFALO,
  dallas: DALLAS,
  denver: DENVER,
  'fort worth': FORT_WORTH,
  nashville: NASHVILLE,
  norfolk: NORFOLK,
  raleigh: RALEIGH,
  'san diego county': SAN_DIEGO_COUNTY,
  reno: RENO,
  sparks: SPARKS,
  'washoe county': WASHOE_COUNTY,
  washoe: WASHOE_COUNTY,
  'douglas county': DOUGLAS_COUNTY,
  douglas: DOUGLAS_COUNTY,
  'maricopa county': MARICOPA_COUNTY,
  maricopa: MARICOPA_COUNTY,
  phoenix: MARICOPA_COUNTY,
  louisville: LOUISVILLE,
  'louisville ky': LOUISVILLE,
  gainesville: GAINESVILLE,
  sacramento: SACRAMENTO,
  philadelphia: PHILADELPHIA,
  philly: PHILADELPHIA,
  miami: MIAMI,
  greensboro: GREENSBORO,
  anaheim: ANAHEIM,
  columbus: COLUMBUS,
  'columbus oh': COLUMBUS,
  'washington dc': WASHINGTON_DC,
  dc: WASHINGTON_DC,
  washington: WASHINGTON_DC,
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
