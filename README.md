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
- A contact form that routes enquiries (membership or event hire) straight to the club's existing inbox.
- An admin-only events diary (Supabase-backed) so the committee can add/edit dates without touching code, which then show up automatically on the public What's On page.
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
useful-links.html                       Non-commercial local links
contact.html                            Enquiry form
privacy-policy.html
terms-of-service.html
venue-hire/index.html                   Venue hire pillar page
venue-hire/birthday-parties.html
venue-hire/weddings-and-engagements.html
venue-hire/funerals-and-wakes.html
venue-hire/community-and-corporate-events.html
admin/index.html                        Committee-only events diary (noindex)
css/style.css
js/main.js, js/events.js, js/supabase-config.js, js/cookie-consent.js
supabase/migrations/0001_events_and_admins.sql
.github/workflows/supabase-keep-alive.yml
robots.txt, sitemap.xml, llms.txt
```

## Setup still required before this goes fully live

### 1. Contact form (Formspree)

The form in `contact.html` posts to a Formspree endpoint so it needs no backend:

1. Create a free account at [formspree.io](https://formspree.io) and a new form.
2. Set the form's delivery address to `secretary@westbyfleetsocial.com` (the club's existing contact address) — or a dedicated `events@` address if you'd rather split membership and event enquiries later.
3. Copy the form ID and replace `YOUR_FORM_ID` in the `action="https://formspree.io/f/YOUR_FORM_ID"` attribute in `contact.html`.

### 2. Events diary (Supabase) — schema is already live

A Supabase project has been created and the migration in `supabase/migrations/0001_events_and_admins.sql` has already been applied, and `js/supabase-config.js` already points at it. Remaining steps:

1. In the Supabase dashboard, **Authentication > Providers > Email**, create the committee's admin account(s) (or invite them), then under **Authentication > Settings**, turn **off** "Allow new users to sign up" so only pre-created accounts can log in.
2. Add each admin's email to the `admins` table, e.g. `insert into admins (email) values ('secretary@westbyfleetsocial.com');` — run this in the SQL Editor.
3. Visit `/admin/` and sign in. Events added there appear automatically on `/whats-on.html`.

### 3. Keep the database from pausing

Supabase free-tier projects pause after 7 days of no activity. `.github/workflows/supabase-keep-alive.yml` pings the database every 3 days to prevent that. Add two repository secrets (Settings > Secrets and variables > Actions), taken from the Supabase project's Settings > API page:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 4. Photos

Several real photos were sourced directly from the club's own public Facebook page (`images/main-bar.jpg`, `images/snooker-room.jpg`, `images/garden.jpg`, `images/real-ales.jpg`, `images/club-exterior.jpg`, `images/logo.jpg`) since they're the club's own marketing photos being reused on the club's own new site. Two things worth checking before this goes live publicly:

- **`images/garden.jpg`** shows identifiable members on the patio. Worth a quick check that everyone in it is comfortable with it on the new site, or swap it for a people-free shot.
- **`images/logo.jpg`** is a lower-resolution JPEG grabbed from Facebook. If the club has a vector or higher-res version of the crest, use that instead, especially for the favicon.

Still-needed photos (shown as labelled placeholder boxes, "Photo needed: ..."):

- Function room set for a party / wedding reception / wake / meeting
- Dart boards, live band on stage

### 5. Hosting

This is plain static HTML, deployable anywhere (GitHub Pages, Netlify, Cloudflare Pages, or the club's existing host). Internal links use root-absolute paths (`/membership.html`) so it's built to sit at a domain root — if you deploy to a GitHub Pages *project* page without a custom domain (`username.github.io/repo/`), either add a custom domain (recommended, and needed to eventually replace westbyfleetsocial.com) or the links will need adjusting to relative paths.

## Notes

- Facts used (address, phone, opening hours, menus, current promotions) are sourced from the current live site, the club's own Facebook page, and a newsletter forwarded by the club secretary; verify anything time-sensitive (event dates, prices) before publishing, since these change.
- `venue-hire/` FAQ and page copy is original content written for this rebuild, not copied from the existing site.
- The Privacy Policy and Terms of Service are a genuine starting point for a UK small business/club site but haven't been reviewed by a solicitor — worth a quick check before relying on them, especially the venue hire booking/cancellation terms, which this site intentionally keeps separate from the general website terms.
