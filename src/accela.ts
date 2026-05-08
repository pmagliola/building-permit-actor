import { log } from 'apify';
import type { PermitRecord } from './types.js';
import type { FetchOptions } from './socrata.js';

// ─── Types ────────────────────────────────────────────────────────────────────

type Cookies = Record<string, string>;

interface FormState {
  viewState: string;
  viewStateGen: string;
}

interface ListPermit {
  permitNumber: string;
  permitType: string;
  address: string;
  status: string;
  agency: string;
  description: string;
  updatedDate: string;
  detailPath: string;
}

interface DetailInfo {
  contractorName: string | null;
  contractorLicense: string | null;
  contractorPhone: string | null;
  projectValue: number | null;
}

interface PageResult {
  permits: ListPermit[];
  pageTargets: Map<number, string>;
  total: number;
}

export interface AccelaAgencyConfig {
  name: string;
  state: string;
  platform: 'accela-one';
  accelaAgency: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = 'https://aca-prod.accela.com/ONE';
const SEARCH_URL = `${BASE_URL}/Cap/CapHome.aspx?module=Building&TabName=Home`;
const RECORD_TYPE = 'Building/Building Multiple Application/NA/NA';

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function parseCookies(headers: Headers): Cookies {
  const cookies: Cookies = {};
  // Collect all Set-Cookie headers (headers.getSetCookie() requires Node 18+)
  headers.forEach((val, key) => {
    if (key.toLowerCase() !== 'set-cookie') return;
    const eqIdx = val.indexOf('=');
    const semiIdx = val.indexOf(';');
    if (eqIdx < 0) return;
    const name = val.slice(0, eqIdx).trim();
    const value = val.slice(eqIdx + 1, semiIdx > 0 ? semiIdx : undefined).trim();
    if (name) cookies[name] = value;
  });
  return cookies;
}

function mergeCookies(base: Cookies, incoming: Cookies): Cookies {
  return { ...base, ...incoming };
}

function cookieHeader(cookies: Cookies): string {
  return Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

// ─── HTML helpers ─────────────────────────────────────────────────────────────

function extractFormState(html: string): FormState {
  const viewState = (html.match(/id="__VIEWSTATE"\s+value="([^"]+)"/) ?? [])[1] ?? '';
  const viewStateGen =
    (html.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/) ?? [])[1] ?? '';
  return { viewState, viewStateGen };
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Results page parser ──────────────────────────────────────────────────────

/** Extract a single text value from a named element.
 *  Handles elements with extra attributes: id="...field..." CSS="..." > value </span>
 */
function extractRowField(row: string, fieldSuffix: string): string {
  // id="...fieldSuffix..." (any attrs) > text
  const re = new RegExp(`id="[^"]*${fieldSuffix}[^"]*"[^>]*>([^<]+)`);
  return (row.match(re) ?? [])[1]?.trim() ?? '';
}

function parseResultsPage(html: string): PageResult {
  const permits: ListPermit[] = [];

  const rowRegex = /<tr class="ACA_TabRow_(?:Odd|Even)[^"]*">(.*?)<\/tr>/gs;
  let m: RegExpExecArray | null;
  while ((m = rowRegex.exec(html)) !== null) {
    const row = m[1];

    // Some permit types use lblPermitNumber, others use lblPermitNumber1
    const permitNumber =
      extractRowField(row, 'lblPermitNumber1') || extractRowField(row, 'lblPermitNumber');
    if (!permitNumber) continue;

    const rawDetailPath =
      (row.match(/href="(\/ONE\/Cap\/CapDetail\.aspx\?[^"]+)"/) ?? [])[1] ?? null;
    const detailPath = rawDetailPath ? rawDetailPath.replace(/&amp;/g, '&') : null;

    permits.push({
      permitNumber,
      permitType: extractRowField(row, 'lblType'),
      address: extractRowField(row, 'lblAddress'),
      status: extractRowField(row, 'lblStatus'),
      agency: extractRowField(row, 'lblAgencyCode'),
      description: extractRowField(row, 'lblDescription').replace(/\s+/g, ' '),
      updatedDate: extractRowField(row, 'lblUpdatedTime'),
      detailPath: detailPath ?? '',
    });
  }

  // Total: "1-10 of 847"
  const countMatch = html.match(/\d+-\d+ of (\d+)/);
  const total = countMatch ? parseInt(countMatch[1], 10) : permits.length;

  // Pagination targets: page links use HTML-encoded quotes &#39; in href
  // Pattern: __doPostBack(&#39;ctl00$...&#39;,&#39;&#39;)">PAGE_NUM
  const pageTargets = new Map<number, string>();
  const pageRegex =
    /javascript:__doPostBack\(&#39;(ctl00\$PlaceHolderMain\$dgvPermitList\$[^&]+)&#39;,&#39;&#39;\)">(\d+)<\/a>/g;
  let pm: RegExpExecArray | null;
  while ((pm = pageRegex.exec(html)) !== null) {
    pageTargets.set(parseInt(pm[2], 10), pm[1].replace(/\$/g, '$'));
  }

  return { permits, pageTargets, total };
}

// ─── Detail page parser ───────────────────────────────────────────────────────

function parseDetailPage(html: string): DetailInfo {
  let contractorName: string | null = null;
  let contractorLicense: string | null = null;
  let contractorPhone: string | null = null;
  let projectValue: number | null = null;

  const lcIdx = html.indexOf('Licensed Contractor:');
  if (lcIdx >= 0) {
    const raw = html.slice(lcIdx, lcIdx + 600);
    const text = stripTags(raw);

    // Company name: everything between "Licensed Contractor:" and the address (starts with number + space + alpha)
    const nameM = text.match(/Licensed Contractor:\s+(.+?)\s+\d+\s+\w/);
    if (nameM) contractorName = nameM[1].trim() || null;

    // Phone: "(NNN)NNN-NNNN" or "NNN-NNN-NNNN"
    const phoneM = text.match(/Phone:\s*([\d()\s\-+.]+?)(?:\s+Contractor|\s*$)/i);
    if (phoneM) {
      const cleaned = phoneM[1].replace(/\s+/g, '').trim();
      if (cleaned.length >= 7) contractorPhone = cleaned;
    }

    // License: "Contractor XXXXXXX" where XXXXXXX is not the word "Name"
    const licM = text.match(/\bContractor\s+([A-Z0-9]+)\b/);
    if (licM && licM[1] !== 'Name') contractorLicense = licM[1] || null;
  }

  // Job value: "Job Value($):$3,230.00"
  const jobM = html.match(/Job Value\(\$\):\s*\$?([\d,]+(?:\.\d{1,2})?)/);
  if (jobM) {
    const num = parseFloat(jobM[1].replace(/,/g, ''));
    if (!isNaN(num)) projectValue = num;
  }

  return { contractorName, contractorLicense, contractorPhone, projectValue };
}

// ─── HTTP fetch wrapper ───────────────────────────────────────────────────────

async function fetchHtml(
  url: string,
  opts: {
    method?: 'GET' | 'POST';
    body?: URLSearchParams;
    cookies: Cookies;
    referer?: string;
  },
): Promise<{ html: string; cookies: Cookies }> {
  const resp = await fetch(url, {
    method: opts.method ?? 'GET',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      Cookie: cookieHeader(opts.cookies),
      ...(opts.referer ? { Referer: opts.referer } : {}),
      ...(opts.body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: opts.body?.toString(),
    redirect: 'follow',
    signal: AbortSignal.timeout(30_000),
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} from ${url}`);
  }

  const html = await resp.text();
  return { html, cookies: mergeCookies(opts.cookies, parseCookies(resp.headers)) };
}

// ─── Form body builder ────────────────────────────────────────────────────────

function buildFormBody(
  formState: FormState,
  agency: string,
  options: FetchOptions,
  eventTarget: string,
  extra?: Record<string, string>,
): URLSearchParams {
  const p = new URLSearchParams();
  p.set('__EVENTTARGET', eventTarget);
  p.set('__EVENTARGUMENT', '');
  p.set('__LASTFOCUS', '');
  p.set('__VIEWSTATE', formState.viewState);
  p.set('__VIEWSTATEGENERATOR', formState.viewStateGen);
  p.set('__VIEWSTATEENCRYPTED', '');
  p.set('ctl00$PlaceHolderMain$ddlGSAgency', agency);
  p.set('ctl00$PlaceHolderMain$ddlGSRecordType', RECORD_TYPE);
  p.set('Submit', 'Submit');

  if (options.issuedAfter) {
    const [y, mo, d] = options.issuedAfter.split('-');
    p.set('ctl00$PlaceHolderMain$txtGSStartDate', `${mo}/${d}/${y}`);
  }
  if (options.issuedBefore) {
    const [y, mo, d] = options.issuedBefore.split('-');
    p.set('ctl00$PlaceHolderMain$txtGSEndDate', `${mo}/${d}/${y}`);
  }

  if (extra) {
    for (const [k, v] of Object.entries(extra)) p.set(k, v);
  }

  return p;
}

// Agency code → city name for the ONE Nevada portal
const AGENCY_CITY: Record<string, string> = {
  RENO: 'Reno',
  SPARKS: 'Sparks',
  WASHOE: 'Washoe County',
  DOUGLAS: 'Douglas County',
};

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Fetch permits from the Accela ONE Nevada regional portal.
 *
 * The portal serves permits for RENO, SPARKS, WASHOE, and DOUGLAS agencies but
 * the agency dropdown doesn't filter results server-side — all agencies come back
 * regardless of the dropdown value. We therefore search once (using the agency
 * value from config for the form, which initialises the session) and split
 * results by the actual `lblAgencyCode` field in each row.
 *
 * The caller should pass a config with the "primary" agency it wants; that
 * agency's results are returned. If you want all Nevada agencies in one run,
 * pass multiple city configs — each will trigger a separate session but only
 * keep its own records.
 */
export async function fetchPermitsAccelaOne(
  config: AccelaAgencyConfig,
  options: FetchOptions,
): Promise<PermitRecord[]> {
  const results: PermitRecord[] = [];
  let cookies: Cookies = {};

  // 1. GET search page
  log.info(`  Accela ONE: initialising session for ${config.name} (${config.accelaAgency})`);
  const step1 = await fetchHtml(SEARCH_URL, { cookies });
  cookies = step1.cookies;
  let formState = extractFormState(step1.html);

  // 2. POST agency selection (required to initialise the form state)
  const agencyBody = buildFormBody(
    formState,
    config.accelaAgency,
    options,
    'ctl00$PlaceHolderMain$ddlGSAgency',
  );
  const step2 = await fetchHtml(SEARCH_URL, {
    method: 'POST',
    body: agencyBody,
    cookies,
    referer: SEARCH_URL,
  });
  cookies = step2.cookies;
  formState = extractFormState(step2.html);

  // 3. POST search
  const searchBody = buildFormBody(formState, config.accelaAgency, options, '', {
    'ctl00$PlaceHolderMain$btnNewSearch': 'Search',
  });
  let { html, cookies: c3 } = await fetchHtml(SEARCH_URL, {
    method: 'POST',
    body: searchBody,
    cookies,
    referer: SEARCH_URL,
  });
  cookies = c3;

  // 4. Page loop — keep going until we hit maxResults or run out of pages
  let pageNum = 1;

  while (true) {
    const { permits, pageTargets, total } = parseResultsPage(html);
    log.info(`  ${config.name}: page ${pageNum}, ${permits.length} on page (${total} total)`);

    if (permits.length === 0) break;

    for (const permit of permits) {
      // Filter to only this agency's permits
      if (permit.agency && permit.agency !== config.accelaAgency) continue;

      // Permit type filter
      if (options.permitTypes?.length) {
        const typeLower = permit.permitType.toLowerCase();
        if (!options.permitTypes.some((pt) => typeLower.includes(pt.toLowerCase()))) continue;
      }

      if (options.requestDelayMs > 0) {
        await delay(options.requestDelayMs / 5);
      }

      results.push({
        city: config.name,
        state: config.state,
        source: `aca-prod.accela.com/ONE (${config.accelaAgency})`,
        permitNumber: permit.permitNumber,
        permitType: permit.permitType || null,
        address: permit.address || null,
        projectValue: null,
        contractorName: null,
        contractorLicense: null,
        contractorLicenseType: null,
        issueDate: permit.updatedDate || null,
        status: permit.status || null,
        description: permit.description
          ? permit.description.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
          : null,
        latitude: null,
        longitude: null,
      });

      if (options.maxResults > 0 && results.length >= options.maxResults) {
        return results;
      }
    }

    // Paginate
    const nextTarget = pageTargets.get(pageNum + 1);
    if (!nextTarget) break;

    const pageFormState = extractFormState(html);
    const nextBody = buildFormBody(pageFormState, config.accelaAgency, options, nextTarget);
    const nextResp = await fetchHtml(SEARCH_URL, {
      method: 'POST',
      body: nextBody,
      cookies,
      referer: SEARCH_URL,
    });
    cookies = nextResp.cookies;
    html = nextResp.html;
    pageNum++;
  }

  return results;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
