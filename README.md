# US Building Permit Scraper

Pull building permits from US city open data portals. Built for construction lead generation - solar installers, roofing contractors, HVAC companies, and suppliers who need fresh permit data to find projects before competitors do.

## What it returns

Every permit record includes:

| Field | Description |
|-------|-------------|
| `city`, `state` | City and state |
| `permitNumber` | Permit or job number |
| `permitType` | Type of permit (e.g. New Construction, Renovation, Electrical) |
| `address` | Full street address |
| `projectValue` | Reported construction value in USD (where available) |
| `contractorName` | Licensed contractor on the permit |
| `contractorLicense` | Contractor license number |
| `contractorLicenseType` | License type (General Contractor, Electrician, etc.) |
| `issueDate` | Date permit was issued |
| `status` | Permit status (where available) |
| `description` | Work description (where available) |
| `latitude`, `longitude` | Coordinates (where available) |

## Supported cities (28 total)

| City | State | Contractor data | Project value | Data freshness |
|------|-------|----------------|---------------|----------------|
| Chicago | IL | Name + contact type | Yes | Current (daily updates) |
| New York City (or NYC) | NY | License holder name + license no. | Yes | Current (DOB NOW dataset) |
| San Francisco (or SF) | CA | None in this dataset | Yes | Current |
| Los Angeles (or LA) | CA | Business name + license | Yes | Typically 12-24 months behind |
| Seattle | WA | Company name | Yes | Current (daily updates) |
| Austin | TX | Company name + contact name | Yes | Current (daily updates) |
| Cincinnati | OH | Company name | Yes | Current (daily updates) |
| Orlando | FL | Company name | Yes | Current (daily updates) |
| Baton Rouge | LA | Contractor name | Yes | Current |
| New Orleans (or NOLA) | LA | None in this dataset | Yes | Current (2018-present) |
| Minneapolis | MN | Company name | Yes | Current |
| Baltimore | MD | None in this dataset | Yes | Current |
| Tempe | AZ | Company name + license | Yes | Current (weekly updates) |
| Buffalo | NY | Applicant name + license | Yes | Current (2000-present) |
| Dallas | TX | Company name | Yes | Data not updated since Jan 2024 |
| Denver | CO | Company name | Yes | Current (daily updates) - residential permits only |
| Fort Worth | TX | None in this dataset | Yes | Current |
| Nashville | TN | Contact name | Yes | Current (daily updates, rolling 3-year window) |
| Norfolk | VA | None in this dataset | Yes | Current (daily weekday updates) |
| Raleigh | NC | Company name + license | Yes | Current (daily updates, 2000-present) |
| San Diego County | CA | Company name | Yes | Current (county-wide) |
| Reno | NV | None* | None* | Current |
| Sparks | NV | None* | None* | Current |
| Washoe County | NV | None* | None* | Current |
| Maricopa County | AZ | None | None | Current |
| Douglas County (or Douglas) | NV | None* | None* | Current |
| Louisville | KY | Company name | Yes | Current |
| Gainesville | FL | Company name | None | Current (daily updates) |

_* Contractor and project value data exists on detail pages but is blocked from cloud IPs by Cloudflare. Planned for a future update._

**Note on Los Angeles:** The LA open data portal permit datasets are not regularly updated and currently reflect data approximately 12-24 months behind.

**Note on Dallas:** The Dallas open data permit dataset has not been updated since January 2024. Historical data only.

**Note on Maricopa County:** Covers the county system (unincorporated areas and municipalities using the county's permitting system). Also accessible as "Phoenix" or "Maricopa".

More cities added regularly. Supports Socrata, ArcGIS, and Accela ONE open data portals.

## Example inputs

**Get all new construction permits in Chicago issued this year:**
```json
{
  "cities": ["Chicago"],
  "issuedAfter": "2026-01-01",
  "permitTypes": ["new construction"],
  "maxResultsPerSource": 1000
}
```

**Multi-city lead gen sweep:**
```json
{
  "cities": ["Chicago", "Los Angeles", "New York City", "Seattle", "Austin", "Orlando"],
  "issuedAfter": "2026-04-01",
  "maxResultsPerSource": 500
}
```

**High-value projects only (Chicago):**
```json
{
  "cities": ["Chicago"],
  "issuedAfter": "2026-01-01",
  "minProjectValue": 50000
}
```

**Nevada permits (Reno metro + surrounding county):**
```json
{
  "cities": ["Reno", "Sparks", "Washoe County"],
  "issuedAfter": "2026-01-01"
}
```

## Adding your own city

Any city running Socrata open data can be added via `customEndpoints`:

```json
{
  "customEndpoints": [
    {
      "domain": "data.example.gov",
      "datasetId": "your-dataset-id",
      "cityName": "My City",
      "stateCode": "ST",
      "fields": {
        "permitNumber": "application_permit_number",
        "permitType": "permit_type",
        "issueDate": "issue_date",
        "streetNumber": "address",
        "contractorName": "applicant_name"
      }
    }
  ],
  "issuedAfter": "2026-01-01"
}
```

Find your city's dataset by searching `[your city] open data building permits` and looking for a Socrata portal (typically named `data.[city].gov`).

## How permits become leads

A permit issued this week means a project is about to start. The lead window is short - typically 2-6 weeks before contractors are already on site. Run this actor on a weekly or daily schedule to catch permits while they're still warm.

Example workflow:
1. Run weekly on target cities filtered to relevant permit types
2. Export to CSV and import to your CRM
3. Call the contractor (or property owner) within 48 hours of issue date

## Pricing

$1.50 per 1,000 permits. Results from all cities in a single run count toward the same total.

## Data sources

Data is sourced from official government open data portals. Socrata and ArcGIS cities are accessed via REST API. Accela ONE cities (Reno, Sparks, Washoe County, Douglas County) are scraped from the public-facing citizen portal. All datasets are public record.
