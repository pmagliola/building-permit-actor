import { Actor, log } from 'apify';
import { fetchPermits } from './socrata.js';
import { lookupCity, listCities } from './cities.js';
import type { Input } from './types.js';

await Actor.init();

const input = await Actor.getInput<Input>();

if (!input?.cities?.length && !input?.customEndpoints?.length) {
  throw new Error(
    `No cities provided. Add at least one city name to "cities". Supported: ${listCities().join(', ')}`,
  );
}

const {
  cities = [],
  customEndpoints = [],
  issuedAfter,
  issuedBefore,
  permitTypes,
  minProjectValue,
  maxResultsPerSource = 0,
  requestDelayMs = 300,
} = input;

const dataset = await Actor.openDataset();

// ─── Built-in cities ──────────────────────────────────────────────────────────

for (const cityName of cities) {
  const config = lookupCity(cityName);
  if (!config) {
    log.warning(
      `Unknown city: "${cityName}" — skipping. Supported: ${listCities().join(', ')}`,
    );
    continue;
  }

  log.info(`\n── ${config.name}, ${config.state} (${config.domain}/${config.datasetId})`);

  try {
    const permits = await fetchPermits(config, {
      issuedAfter,
      issuedBefore,
      permitTypes,
      minProjectValue,
      maxResults: maxResultsPerSource,
      requestDelayMs,
    });

    log.info(`${config.name}: ${permits.length} permits fetched`);

    for (const permit of permits) {
      await dataset.pushData(permit);
    }
  } catch (err) {
    log.error(`Failed to fetch ${config.name}: ${err}`);
    await dataset.pushData({
      city: config.name,
      state: config.state,
      source: `${config.domain}/${config.datasetId}`,
      error: String(err),
    });
  }
}

// ─── Custom endpoints ─────────────────────────────────────────────────────────

for (const endpoint of customEndpoints) {
  const config = {
    name: endpoint.cityName,
    state: endpoint.stateCode,
    domain: endpoint.domain,
    datasetId: endpoint.datasetId,
    fields: {
      permitNumber: null,
      permitType: null,
      issueDate: null,
      projectValue: null,
      streetNumber: null,
      streetDirection: null,
      streetName: null,
      borough: null,
      contractorName: null,
      contractorLicense: null,
      contractorNamePart2: null,
      contractorLicenseType: null,
      status: null,
      description: null,
      latitude: null,
      longitude: null,
      locationObject: null,
      ...endpoint.fields,
    },
  };

  log.info(
    `\n── Custom: ${config.name}, ${config.state} (${config.domain}/${config.datasetId})`,
  );

  try {
    const permits = await fetchPermits(config, {
      issuedAfter,
      issuedBefore,
      permitTypes,
      minProjectValue,
      maxResults: maxResultsPerSource,
      requestDelayMs,
    });

    log.info(`${config.name}: ${permits.length} permits fetched`);

    for (const permit of permits) {
      await dataset.pushData(permit);
    }
  } catch (err) {
    log.error(`Failed to fetch ${config.name}: ${err}`);
    await dataset.pushData({
      city: config.name,
      state: config.state,
      source: `${config.domain}/${config.datasetId}`,
      error: String(err),
    });
  }
}

log.info('Done.');
await Actor.exit();
