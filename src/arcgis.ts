import { log } from 'apify';
import type { CityConfig } from './cities.js';
import type { PermitRecord } from './types.js';
import type { FetchOptions } from './socrata.js';

// ─── Types ────────────────────────────────────────────────────────────────────

type RawAttributes = Record<string, unknown>;

interface ArcGisFeature {
  attributes: RawAttributes;
  geometry?: { x: number; y: number } | null;
}

interface ArcGisResponse {
  features?: ArcGisFeature[];
  exceededTransferLimit?: boolean;
  error?: { code: number; message: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractField(attrs: RawAttributes, fieldName: string | null): string | null {
  if (!fieldName) return null;
  const val = attrs[fieldName];
  if (val === null || val === undefined || val === '') return null;
  return String(val).trim() || null;
}

function epochMsToIso(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  const ms = typeof val === 'number' ? val : parseFloat(String(val));
  if (isNaN(ms) || ms <= 0) return null;
  return new Date(ms).toISOString().split('T')[0]; // YYYY-MM-DD
}

function buildWhereClause(config: CityConfig, options: FetchOptions): string {
  const clauses: string[] = ['1=1'];

  const dateField = config.fields.issueDate;
  if (dateField) {
    // ArcGIS esriFieldTypeDate requires SQL date literals, not epoch ms
    if (options.issuedAfter) {
      clauses.push(`${dateField} >= DATE '${options.issuedAfter}'`);
    }
    if (options.issuedBefore) {
      clauses.push(`${dateField} <= DATE '${options.issuedBefore}'`);
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

// ─── Record normalisation ─────────────────────────────────────────────────────

function normalizeRecord(feature: ArcGisFeature, config: CityConfig): PermitRecord {
  const { attributes, geometry } = feature;
  const { fields } = config;

  // Address
  const addressParts: string[] = [];
  const streetNum = extractField(attributes, fields.streetNumber);
  if (streetNum) addressParts.push(streetNum);
  const streetDir = extractField(attributes, fields.streetDirection);
  if (streetDir) addressParts.push(streetDir);
  const streetName = extractField(attributes, fields.streetName);
  if (streetName) addressParts.push(streetName);

  let address: string | null = null;
  if (addressParts.length > 0) {
    const borough = extractField(attributes, fields.borough);
    const cityPart = borough ? `${borough}, ${config.name}` : config.name;
    address = `${addressParts.join(' ')}, ${cityPart}, ${config.state}`;
  }

  // Coordinates: prefer mapped fields, fall back to ArcGIS geometry
  let lat: number | null = null;
  let lon: number | null = null;

  const rawLat = extractField(attributes, fields.latitude);
  const rawLon = extractField(attributes, fields.longitude);
  if (rawLat) lat = parseFloat(rawLat);
  if (rawLon) lon = parseFloat(rawLon);

  if ((lat === null || isNaN(lat)) && geometry != null) {
    lon = geometry.x;
    lat = geometry.y;
  }

  if (lat !== null && isNaN(lat)) lat = null;
  if (lon !== null && isNaN(lon)) lon = null;

  // Issue date: ArcGIS typically stores as epoch ms; fall back to string field
  let issueDate: string | null = null;
  if (fields.issueDate) {
    const raw = attributes[fields.issueDate];
    if (typeof raw === 'number') {
      issueDate = epochMsToIso(raw);
    } else if (raw != null && raw !== '') {
      issueDate = String(raw).trim() || null;
    }
  }

  // Project value
  const rawValue = extractField(attributes, fields.projectValue);
  const projectValue = rawValue ? parseFloat(rawValue) : null;

  // Contractor
  const contractorFirst = extractField(attributes, fields.contractorName);
  const contractorSecond = extractField(attributes, fields.contractorNamePart2);
  const contractorName = contractorFirst
    ? contractorSecond
      ? `${contractorFirst} ${contractorSecond}`
      : contractorFirst
    : null;

  const source = config.featureServiceUrl ?? `${config.domain}/${config.datasetId}`;

  return {
    city: config.name,
    state: config.state,
    source,
    permitNumber: extractField(attributes, fields.permitNumber),
    permitType: extractField(attributes, fields.permitType),
    address,
    projectValue: projectValue !== null && !isNaN(projectValue) ? projectValue : null,
    contractorName,
    contractorLicense: extractField(attributes, fields.contractorLicense),
    contractorLicenseType: extractField(attributes, fields.contractorLicenseType),
    issueDate,
    status: extractField(attributes, fields.status),
    description: extractField(attributes, fields.description),
    latitude: lat,
    longitude: lon,
  };
}

// ─── Main fetch ───────────────────────────────────────────────────────────────

export async function fetchPermitsArcGis(
  config: CityConfig,
  options: FetchOptions,
): Promise<PermitRecord[]> {
  const results: PermitRecord[] = [];
  const pageSize = 1000;
  let offset = 0;

  const serviceUrl = config.featureServiceUrl!;
  const whereClause = buildWhereClause(config, options);
  const orderField = config.fields.issueDate ?? 'OBJECTID';

  while (true) {
    const params = new URLSearchParams({
      where: whereClause,
      outFields: '*',
      resultRecordCount: String(pageSize),
      resultOffset: String(offset),
      orderByFields: `${orderField} DESC`,
      outSR: '4326',
      f: 'json',
    });

    const url = `${serviceUrl}/query?${params.toString()}`;
    log.debug(`Fetching: ${url}`);

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(30_000),
      });
    } catch (err) {
      throw new Error(`Network error fetching ${serviceUrl}: ${err}`);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `HTTP ${response.status} ${response.statusText} from ${serviceUrl}: ${body.slice(0, 200)}`,
      );
    }

    let data: ArcGisResponse;
    try {
      data = (await response.json()) as ArcGisResponse;
    } catch {
      throw new Error(`Invalid JSON response from ${serviceUrl}`);
    }

    if (data.error) {
      throw new Error(`ArcGIS error from ${serviceUrl}: ${data.error.message}`);
    }

    const features = data.features ?? [];
    if (features.length === 0) break;

    const filtered =
      options.permitTypes?.length
        ? features.filter((f) => {
            const type =
              extractField(f.attributes, config.fields.permitType)?.toLowerCase() ?? '';
            return options.permitTypes!.some((pt) => type.includes(pt.toLowerCase()));
          })
        : features;

    for (const feature of filtered) {
      results.push(normalizeRecord(feature, config));
      if (options.maxResults > 0 && results.length >= options.maxResults) {
        return results;
      }
    }

    log.info(`  ${config.name}: ${results.length} permits so far (page offset ${offset})`);

    if (!data.exceededTransferLimit || features.length < pageSize) break;

    offset += pageSize;

    if (options.requestDelayMs > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, options.requestDelayMs));
    }
  }

  return results;
}
