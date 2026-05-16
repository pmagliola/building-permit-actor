# Zapier & Make Integration Guide — US Building Permit Scraper

## The use case

The actor runs on a schedule (daily or weekly), pulls fresh permits, and automatically pushes them into the user's system — Google Sheets, HubSpot, Pipedrive, or whatever CRM they use. No manual exports, no copy-paste.

This is the workflow non-technical buyers need. They can't run an Apify actor themselves, but they can set up a Zapier integration in 10 minutes.

---

## Option A: Zapier

### How it works

Apify has a native Zapier integration. The recommended pattern:

1. **Set up a scheduled Task in Apify** (not a raw actor run) with pre-configured inputs (cities, date filters, etc.)
2. **Zapier trigger:** "Apify — Actor Task Run Finished" — fires whenever the scheduled task completes
3. **Zapier action:** "Apify — Get Dataset Items" — fetches the results from that run
4. **Zapier action:** Push each item to destination (Google Sheets row, HubSpot contact, Pipedrive deal, etc.)

### Step-by-step

**Step 1: Create a Task in Apify**
- Go to your actor on Apify → click "Create task"
- Configure your inputs: cities, issuedAfter (use relative dates if possible), permit types, minProjectValue
- Set a schedule: daily or weekly
- Note the Task ID (you'll need it for Zapier)

**Step 2: Connect Apify to Zapier**
- In Zapier, create a new Zap
- Trigger app: Apify
- Trigger event: "Actor Task Run Finished"
- Connect your Apify account (uses API token from Apify console → Settings → Integrations)
- Select your Task ID

**Step 3: Get the results**
- Add an action: Apify → "Get Dataset Items"
- Map the Dataset ID from the trigger step → the run's dataset ID
- This returns all items from that run

**Step 4: Push to destination**
- Add an action for your CRM/spreadsheet:
  - **Google Sheets:** "Create Spreadsheet Row" — map permit fields to columns
  - **HubSpot:** "Create/Update Contact" — map address as company, contractorName as contact name
  - **Pipedrive:** "Create Deal" — map address as deal title, projectValue as deal value
  - **Airtable:** "Create Record" — map all fields

**Note on Zapier limits:** Zapier processes items one at a time. For large runs (1,000+ permits), use the "Looping by Zapier" step or consider Make instead (handles arrays natively).

### Zapier template to publish

Create a shareable Zap template at zapier.com/app/zaps → share template link. Template name:

> "Automatically add new building permits to Google Sheets"

Pre-configure:
- Trigger: Apify Actor Task Run Finished
- Action 1: Apify Get Dataset Items
- Action 2: Google Sheets Create Spreadsheet Row (with field mapping)

Share the template link in the actor README and in outreach.

---

## Option B: Make (formerly Integromat)

Make handles arrays better than Zapier, making it more suitable for large permit pulls.

### How it works

1. **Schedule module** — triggers at set interval (daily, weekly)
2. **Apify: Run an Actor** (synchronous, works for runs under 5 min)
3. **Apify: List Dataset Items** — get the output
4. **Iterator** — loop through each permit
5. **Destination module** — push each permit to Google Sheets / HubSpot / etc.

### Step-by-step

**Step 1: Create a scenario in Make**
- Add a Schedule trigger (daily or weekly)
- Add Apify module: "Run an Actor"
  - Actor: `handstands.io/us-building-permit-scraper`
  - Input: paste your JSON config (cities, dates, etc.)
  - Wait for finish: Yes

**Step 2: Get results**
- Add Apify module: "List Dataset Items"
- Dataset ID: map from previous step's output

**Step 3: Iterate and push**
- Add Iterator module (splits array into individual items)
- Add destination: Google Sheets "Add a Row", HubSpot "Create Contact", etc.
- Map fields: address, permitType, projectValue, contractorName, issueDate, city, state

### Make vs Zapier for this use case

| | Zapier | Make |
|---|---|---|
| Handles large arrays | Needs Looping add-on | Native |
| Ease of setup | Easier | Slightly more complex |
| Pricing | Starts free, tasks limited | Starts free, operations limited |
| Best for | Simple Google Sheets push | Complex multi-step workflows |

---

## Recommended Google Sheets output schema

Suggest this column structure to users:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| City | State | Address | Permit Type | Project Value | Contractor Name | Contractor License | Issue Date | Status |

This makes it easy to filter, sort, and import into any CRM.

---

## Publishing instructions

To publish as an official Zapier template:
1. Build the Zap in your account
2. Go to zapier.com/app/developer → Templates → Create Template
3. Fill in name, description, category (Productivity + Data)
4. Submit for review (typically 2-3 business days)

Once approved, the template appears in Zapier's template library and on the Apify app page in Zapier — free organic discovery.

To share on Make:
1. Build the scenario
2. Click Share → Create a template
3. Submit to Make template gallery

---

## What to add to the actor README

Add a section:

```
## Integrations

Connect permit data to your CRM automatically with Zapier or Make:

- **[Zapier template: Building permits → Google Sheets](#)** — New permits added to a spreadsheet automatically after each run
- **[Zapier template: Building permits → HubSpot](#)** — New permits created as HubSpot contacts/companies
- **[Make template](#)** — Full workflow with iterator for large permit pulls

No code required. Connect in 10 minutes.
```
