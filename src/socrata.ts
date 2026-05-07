import { log } from 'apify';
import type { CityConfig } from './cities.js';
import type { PermitRecord } from './types.js';

// ─── Fetch options ────────────────────────────────────────────────────────────

export interface FetchOptions {
  issuedAfter?: string;
  issuedBefore?: string;
  permitTypes?: string[];
  minProjectValue?: number;
  maxResults: number;
  requestDelayMs: number;
}

type RawRecord = Record<string, unknown>;

// ─── Query building ───────────────────────────────────────────────────────────

function buildWhereClause(config: CityConfig, options: FetchOptions): string {
  const clauses: string[] = [];

  const dateField = config.fields.issueDate;
  if (dateField) {
    if (options.issuedAfter) {
      clauses.push(`${dateField} >= '${options.issuedAfter}T00:00:00.000'`);
    }
    if (options.issuedBefore) {
      clauses.push(`${dateField} <= '${options.issuedBefore}T23:59:59.000'`);
    }
  }

  const valueField = config.fields.projectValue;
  if (valueField && options.minProjectValue && options.minProjectValue > 0) {
    clauses.push(`${valueField} >= ${options.minProjectValue}`);
  }

  if (config.defaultWhere) {
    clauses.push(config.defaultWhere);
  }

  return clauses.join(' AND ');
}

// ─── Field extraction ─────────────────────────────────────────────────────────

function extractField(record: RawRecord, fieldName: string | null): string | null {
  if (!fieldName) return null;
  const val = record[fieldName];
  if (val === null || val === undefined || val === '') return null;
  return String(val).trim() || null;
}

function extractLocationFromObject(
  record: RawRecord,
  fieldName: string | null,
): { lat: number | null; lon: number | null } {
  if (!fieldName) return { lat: null, lon: null };
  const obj = record[fieldName];
  if (!obj || typeof obj !== 'object') return { lat: null, lon: null };
  const loc = obj as Record<string, unknown>;

  // GeoJSON Point: { type: "Point", coordinates: [lng, lat] }
  if (loc.type === 'Point' && Array.isArray(loc.coordinates) && loc.coordinates.length >= 2) {
    const lon = parseFloat(String(loc.coordinates[0]));
    const lat = parseFloat(String(loc.coordinates[1]));
    return { lat: isNaN(lat) ? null : lat, lon: isNaN(lon) ? null : lon };
  }

  // Standard Socrata location object: { latitude: "...", longitude: "..." }
  const lat = loc.latitude != null ? parseFloat(String(loc.latitude)) : NaN;
  const lon = loc.longitude != null ? parseFloat(String(loc.longitude)) : NaN;
  return { lat: isNaN(lat) ? null : lat, lon: isNaN(lon) ? null : lon };
}

function buildContractorName(record: RawRecord, fields: CityConfig['fields']): string | null {
  const first = extractField(record, fields.contractorName);
  if (!first) return null;
  const second = extractField(record, fields.contractorNamePart2);
  return second ? `${first} ${second}` : first;
}

function buildAddress(record: RawRecord, config: CityConfig): string | null {
  const { fields } = config;
  const parts: string[] = [];

  const streetNumber = extractField(record, fields.streetNumber);
  if (streetNumber) parts.push(streetNumber);

  const streetDir = extractField(record, fields.streetDirection);
  if (streetDir) parts.push(streetDir);

  const streetName = extractField(record, fields.streetName);
  if (streetName) parts.push(streetName);

  if (parts.length === 0) return null;

  const borough = extractField(record, fields.borough);
  const cityPart = borough ? `${borough}, ${config.name}` : config.name;

  return `${parts.join(' ')}, ${cityPart}, ${config.state}`;
}

// ─── Record normalisation ─────────────────────────────────────────────────────

function normalizeRecord(record: RawRecord, config: CityConfig): PermitRecord {
  const { fields } = config;

  let lat: number | null = null;
  let lon: number | null = null;

  const rawLat = extractField(record, fields.latitude);
  const rawLon = extractField(record, fields.longitude);

  if (rawLat) lat = parseFloat(rawLat);
  if (rawLon) lon = parseFloat(rawLon);

  if (lat !== null && isNaN(lat)) lat = null;
  if (lon !== null && isNaN(lon)) lon = null;

  if (lat === null && fields.locationObject) {
    const fromObj = extractLocationFromObject(record, fields.locationObject);
    lat = fromObj.lat;
    lon = fromObj.lon;
  }

  const rawValue = extractField(record, fields.projectValue);
  const projectValue = rawValue ? parseFloat(rawValue) : null;

  return {
    city: config.name,
    state: config.state,
    source: `${config.domain}/${config.datasetId}`,
    permitNumber: extractField(record, fields.permitNumber),
    permitType: extractField(record, fields.permitType),
    address: buildAddress(record, config),
    projectValue: projectValue !== null && !isNaN(projectValue) ? projectValue : null,
    contractorName: buildContractorName(record, fields),
    contractorLicense: extractField(record, fields.contractorLicense),
    contractorLicenseType: extractField(record, fields.contractorLicenseType),
    issueDate: extractField(record, fields.issueDate),
    status: extractField(record, fields.status),
    description: extractField(record, fields.description),
    latitude: lat,
    longitude: lon,
  };
}

// ─── Main fetch ───────────────────────────────────────────────────────────────

export async function fetchPermits(
  config: CityConfig,
  options: FetchOptions,
): Promise<PermitRecord[]> {
  const results: PermitRecord[] = [];
  const pageSize = 1000;
  let offset = 0;

  const whereClause = buildWhereClause(config, options);
  const baseUrl = `https://${config.domain}/resource/${config.datasetId}.json`;
  const orderField = config.fields.issueDate ?? 'permit_number';

  while (true) {
    // Use encodeURIComponent for values — URLSearchParams encodes spaces as '+'
    // but some Socrata endpoints (e.g. data.sfgov.org) require '%20'.
    const queryParts = [
      `$limit=${pageSize}`,
      `$offset=${offset}`,
      `$order=${encodeURIComponent(`${orderField} DESC`)}`,
    ];

    if (whereClause) {
      queryParts.push(`$where=${encodeURIComponent(whereClause)}`);
    }

    const url = `${baseUrl}?${queryParts.join('&')}`;
    log.debug(`Fetching: ${url}`);

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(30_000),
      });
    } catch (err) {
      throw new Error(`Network error fetching ${url}: ${err}`);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `HTTP ${response.status} ${response.statusText} from ${config.domain}: ${body.slice(0, 200)}`,
      );
    }

    let records: RawRecord[];
    try {
      records = (await response.json()) as RawRecord[];
    } catch {
      throw new Error(`Invalid JSON response from ${config.domain}`);
    }

    if (!Array.isArray(records) || records.length === 0) break;

    const filtered =
      options.permitTypes?.length
        ? records.filter((r) => {
            const type = extractField(r, config.fields.permitType)?.toLowerCase() ?? '';
            return options.permitTypes!.some((pt) => type.includes(pt.toLowerCase()));
          })
        : records;

    for (const record of filtered) {
      results.push(normalizeRecord(record, config));
      if (options.maxResults > 0 && results.length >= options.maxResults) {
        return results;
      }
    }

    log.info(`  ${config.name}: ${results.length} permits so far (page offset ${offset})`);

    if (records.length < pageSize) break;

    offset += pageSize;

    if (options.requestDelayMs > 0) {
      await delay(options.requestDelayMs);
    }
  }

  return results;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
