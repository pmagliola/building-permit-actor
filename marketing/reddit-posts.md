# Reddit Posts — US Building Permit Scraper

Post from Pablo's personal Reddit account. One post per subreddit. Space them out — don't post all on the same day.

---

## r/solar

**Title:** I pulled 6 months of new construction permits across 10 cities to see where solar demand is actually moving — here's what the data shows

**Body:**
Been playing around with building permit data as a way to get ahead of the solar lead gen curve. Thought I'd share what I found since most of what's discussed here is on the marketing/ads side.

The idea: new construction permits are issued 4-8 weeks before a project breaks ground. If you know a 3,000 sq ft home is being permitted in your territory right now, you can reach the builder or owner before anyone's even on site.

I pulled ~180,000 permits from 10 cities (Chicago, Austin, Seattle, Nashville, Orlando, Raleigh, Denver, Columbus, Miami, Minneapolis) filtered to residential new construction, Jan–May 2026.

A few things that stood out:
- **Austin** is issuing new residential permits at nearly twice the rate of Chicago despite having half the population — most are in the outer suburbs (78660, 78653 zip codes)
- **Nashville** data updates daily and includes contractor contact name — most cities only give you company name
- **Denver** only publishes residential permits (commercial excluded from their open dataset), which is actually more useful for solar prospecting
- **Miami** has the longest permit-to-approval lag — median 6 weeks from application to issue vs 2-3 weeks in most other cities

Happy to share more cuts of the data if useful. We built a tool that pulls this automatically across 36 cities if anyone wants to play with it — link in profile.

---

## r/Roofing

**Title:** Building permits as a lead gen source — anyone doing this? Here's what I found running the numbers

**Body:**
Roofing company owner/operator here (or adjacent — I build data tools for the trades). Wanted to share something that's been working for prospecting that I don't see discussed much.

Most roofing lead gen focuses on storm tracking, HomeAdvisor/Angi, door knocking after hail. Building permits are a less crowded channel and the lead quality is different — you know *exactly* what work is happening, where, and who the GC is.

Permit types useful for roofing:
- **New construction** — builder relationship opportunity, repetitive volume if you land the account
- **Renovation/addition** — often triggers a full re-roof when structural work is involved
- **Re-roof permits specifically** — some cities issue these as a separate category (Chicago, Raleigh, Nashville)

The catch is pulling the data. Most city open data portals have permit data but it's buried and inconsistent. I've been running this across 36 cities via the open data APIs.

One thing I didn't expect: **contractor name is on the permit in most cities**. So for new construction you can see who the GC is and call them directly rather than chasing the homeowner. Way better close rate.

Anyone else doing permit-based prospecting? Curious what your outreach sequence looks like once you have the data.

---

## r/realestateinvesting

**Title:** Using building permit data to spot development patterns before they show up in the MLS — what I've learned

**Body:**
Something I've been experimenting with that might be useful for the investors here: tracking building permit data as a leading indicator for neighbourhood movement.

The logic: permits are issued 2-6 months before a project shows up in any other public record. New construction permits cluster before price appreciation. Renovation permit density is a proxy for gentrification pressure. Commercial permit activity near residential areas predicts retail development.

I've been pulling permit data from 36 US cities via the open data APIs (Socrata, ArcGIS, Accela) and noticed a few patterns:

**What permit data can tell you that MLS can't:**
- Pre-construction activity in a zip code before comps exist
- Permit value (project cost) as a rough renovation spend signal
- Which contractors are the most active in a neighbourhood — useful for knowing who to call for rehab referrals
- Density of renovation permits as a neighbourhood trajectory signal

**What it can't tell you:**
- Whether permits get pulled (abandoned projects still show up)
- Zoning changes (separate data source)
- Commercial lease activity

The data is all public record — most of it's on city open data portals. The painful part is the inconsistency across cities (different field names, different update schedules, different data quality). Chicago updates daily, LA is 12-24 months behind.

Happy to dig into any specific market if there's interest.

---

## r/hvacr (or post to r/HVAC)

**Title:** New construction permit data for HVAC lead gen — the channel nobody in HVAC is using yet

**Body:**
HVAC contractor/industry adjacent here. Something I stumbled on that I think is underused in the trades: new construction building permits as a prospecting source.

The timing window is key. A permit gets issued, then there's typically a 3-6 week window before a mechanical sub is locked in. If you're calling builders in that window with a specific pitch ("we saw you pulled a permit at 123 Main St, we do commercial and residential mechanicals in the area") you're not cold — you're relevant.

Most HVAC marketing is reactive: respond to calls, show up on Google Maps, hope for referrals. Permit-based prospecting is proactive and low-competition because pulling the data is painful enough that most smaller shops don't bother.

What I've found works:
1. Filter to new construction + renovation above a certain project value (usually $100k+ indicates HVAC scope)
2. Get the contractor name from the permit (available in most cities)
3. Cross-reference GC name on LinkedIn or Google to find the right contact
4. Reach out with a specific reference to the project

Cities where the contractor data is most useful for this: Chicago, Austin, Seattle, Raleigh, Nashville, Columbus — all have company name + sometimes a contact name on the permit.

Anyone doing something similar? What's your outreach sequence look like?
