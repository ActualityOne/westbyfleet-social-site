# West Byfleet Social Club — example site

A rebuilt example of [westbyfleetsocial.com](https://www.westbyfleetsocial.com/), built to fix the two things holding the current site back for search: it's a single sparse page with almost no indexable content, and there's no dedicated content for the events people actually search for (birthday venue, wake venue, wedding reception, etc).

Static HTML/CSS/JS, no build step, no framework. That's deliberate: it keeps load times fast (good for Core Web Vitals and SEO) and means it can be hosted anywhere for nothing.

## What changed vs. the current site

- Leads with **membership and community** (snooker, darts, bingo, quiz, live music), with **venue hire** for birthdays, weddings/engagements, funerals & wakes, and community/corporate events as a clear secondary offer, each with its own page.
- Dedicated landing page per event type, each targeting the specific searches people actually run ("birthday party venue West Byfleet", "wake venue West Byfleet", etc.) instead of one page trying to rank for everything.
- A **Food & Drink** page transcribing the club's real Sunday roast, Saturday lunch, sandwiches and Friday evening menus (with prices) as semantic HTML + `Menu`/`MenuItem` schema, instead of the photo-of-a-poster the club currently relies on. Menus in an image aren't readable by search engines or screen readers.
- Structured data (`LocalBusiness`, `EventVenue`, `FAQPage`, `Event`, `Menu`) on every relevant page, so Google (and AI answer engines like ChatGPT/Perplexity/Claude) can extract facts directly.
- `robots.txt` explicitly welcomes AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended) and an `llms.txt` gives AI assistants a plain-language summary of the site.
- `sitemap.xml`, canonical tags, per-page meta descriptions and Open Graph tags, none of which the current site has.
- A "Useful Local Links" page linking only to non-commercial/official resources (National Rail, Woking Borough Council, Surrey libraries, NHS, Surrey Police).
- A contact form backed entirely by the same Supabase project (no third-party form service or account needed) — submissions land in an `enquiries` table and show up in the admin panel.
- A **Reviews** page with a real (linked, attributed) external rating plus a self-hosted review form — submissions go into a moderation queue and only appear once an admin approves them, so it can't be spammed or gamed.
- An admin-only dashboard (Supabase-backed) so the committee can add/edit diary dates, read enquiries, and approve/reject reviews without touching code. Diary dates and approved reviews show up automatically on the relevant public pages.
- A cookie notice, Privacy Policy and Terms of Service, none of which the current site has.
- Real photography sourced from the club's own public Facebook page (see "Photos" below), rather than the club's real interior sitting entirely undocumented.

## Structure

```
index.html                              Home
membership.html                         Join the club
whats-on.html                           Regular club nights + dynamic upcoming dates
food-and-drink.html                     Sunday roast, Saturday lunch, sandwiches, Friday menu
about.html
gallery.html                            Real photos + remaining placeholders (see "Photos" below)
reviews.html                            External rating link + moderated review submissions
useful-links.html                       Non-commercial local links
contact.html                            Enquiry form (Supabase-backed)
privacy-policy.html
terms-of-service.html
venue-hire/index.html                   Venue hire pillar page
venue-hire/birthday-parties.html
venue-hire/weddings-and-engagements.html
venue-hire/funerals-and-wakes.html
venue-hire/community-and-corporate-events.html
admin/index.html                        Committee-only dashboard: diary, enquiries, review moderation (noindex)
css/style.css
js/main.js, js/events.js, js/supabase-config.js, js/cookie-consent.js
supabase/migrations/0001_events_and_admins.sql
supabase/migrations/0002_enquiries.sql
supabase/migrations/0003_reviews.sql
.github/workflows/supabase-keep-alive.yml
robots.txt, sitemap.xml, llms.txt
```

## Setup status

### 1. Backend (Supabase) — done

A Supabase project ("WestbyfleetSocial" org) is live, with `events`, `admins`, `enquiries` and `reviews` tables and row-level security applied (verified directly against the live database, including the specific gotcha that `insert().select()` requires read access too — the actual form code just does `insert()`). `js/supabase-config.js` already points at it, using the legacy anon JWT key rather than the newer `sb_publishable_...` key, which didn't resolve to the Postgres `anon` role correctly on this project when tested. An admin account (`westbyfleetadmin@craig.it`) exists and is on the `admins` allow-list, so `/admin/` is usable right now for the events diary, enquiries inbox, and review moderation.

**Two remaining manual steps, both dashboard-only settings the Supabase MCP tools can't change:**
1. **Authentication > Sign In / Providers**: turn **off** "Allow new users to sign up". Not done yet — right now anyone could create an account, though they still couldn't write anything without being on the `admins` allow-list, since that's enforced by row-level security independently.
2. **Authentication > Policies (Password)**: turn **on** "leaked password protection" (checks against HaveIBeenPwned) — flagged by Supabase's own security advisor, currently off.

Note: contact-form enquiries and new reviews currently only show up when someone checks `/admin/` — there's no outbound email alert yet. Wiring one up is a small follow-up (a Supabase Edge Function calling an email API like Resend) if you want the committee notified automatically rather than checking the dashboard.

### 2. Keep the database from pausing — done

Supabase free-tier projects pause after 7 days of no activity. `.github/workflows/supabase-keep-alive.yml` pings the database every 3 days to prevent that. The `SUPABASE_URL` and `SUPABASE_ANON_KEY` repository secrets it needs are already set on the GitHub repo.

### 3. Photos

Several real photos were sourced directly from the club's own public Facebook page (`images/main-bar.jpg`, `images/snooker-room.jpg`, `images/garden.jpg`, `images/real-ales.jpg`, `images/club-exterior.jpg`, `images/logo.jpg`) since they're the club's own marketing photos being reused on the club's own new site. Two things worth checking before this goes live publicly:

- **`images/garden.jpg`** shows identifiable members on the patio. Worth a quick check that everyone in it is comfortable with it on the new site, or swap it for a people-free shot.
- **`images/logo.jpg`** is a lower-resolution JPEG grabbed from Facebook. If the club has a vector or higher-res version of the crest, use that instead, especially for the favicon.

Still-needed photos (shown as labelled placeholder boxes, "Photo needed: ..."):

- Function room set for a party / wedding reception / wake / meeting
- Dart boards, live band on stage

### 4. Hosting

This is plain static HTML, deployable anywhere (GitHub Pages, Netlify, Cloudflare Pages, or the club's existing host). Internal links use root-absolute paths (`/membership.html`) so it's built to sit at a domain root — if you deploy to a GitHub Pages *project* page without a custom domain (`username.github.io/repo/`), either add a custom domain (recommended, and needed to eventually replace westbyfleetsocial.com) or the links will need adjusting to relative paths.

## Notes

- Facts used (address, phone, opening hours, menus, current promotions) are sourced from the current live site, the club's own Facebook page, and a newsletter forwarded by the club secretary; verify anything time-sensitive (event dates, prices) before publishing, since these change.
- `venue-hire/` FAQ and page copy is original content written for this rebuild, not copied from the existing site.
- The reviews page links to (and cites the rating from) the club's existing public UseYourLocal listing rather than reproducing individual third-party reviews verbatim, and no reviews have been fabricated for this rebuild — the review list on the page is genuinely empty until real ones are submitted and approved.
- The Privacy Policy and Terms of Service are a genuine starting point for a UK small business/club site but haven't been reviewed by a solicitor — worth a quick check before relying on them, especially the venue hire booking/cancellation terms, which this site intentionally keeps separate from the general website terms.
