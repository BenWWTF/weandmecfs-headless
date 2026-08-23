# Editor guide — what changed in the new site

The site is now **headless WordPress**: you still log in to
`wp-admin` to write and publish, but the public-facing pages
are served by a separate Next.js frontend that reads WordPress
as a content database. This guide covers what you actually do
day-to-day.

## Where to find what

- **WordPress admin** — `https://www.weandmecfs.org/wp-admin`
- **The new public site** — `https://www.weandmecfs.org/`
- **Frontend revalidation** — `wp-admin` → Settings → WE&ME Headless

The new public site looks just like the old one in most places
(we kept the brand colours, type, layout). Under the hood it's
a different system, but you don't have to touch it.

## The new content types

You now have a custom menu in the left sidebar with seven
content types, all under the **WE&ME** heading:

| Menu item       | What it's for                                              |
|-----------------|------------------------------------------------------------|
| Calls           | Funding calls (Projects 2026, Emerging Leader Award, etc.) |
| Funded Projects | Each awarded research project, with institution and amount |
| Stories         | Patient stories (Mila, Carmen, etc.)                       |
| Team & Board    | Team members, advisory board, jury members                 |
| Partners        | FWF, WWTF, Science for ME and other orgs                   |
| Events          | Galas, conferences, etc.                                   |
| Guardians       | Recurring donor spotlights (Guardians4ME)                 |

Plus the standard **Posts** and **Pages** for the blog and
content pages.

## Editing a patient story

1. wp-admin → **Stories** → click the patient's name.
2. The right column has the regular Title and editor; below the
   editor is a **Patient Story details** box with the fields
   you need:
   - **Age** (number)
   - **Location** (free text — the "21 · Lower Austria" line)
   - **Onset year**
   - **Short bio** (one-sentence card blurb)
   - **Long story URL** (link to the long form on weandmecfs.org)
   - **Photographer** (Brent Stirton, etc.)
   - **Featured** (checkbox — should this show in the top 3 on
     the homepage rail?)
   - **Display order** (lower numbers come first; 1, 2, 3…)
3. Set the **Featured Image** in the right sidebar (the Brent
   Stirton photo).
4. Click **Update** (or **Publish** if it's new).

Within about 1-2 seconds, the homepage stories rail updates. The
**Step by step** walker and the **Latest** posts list stay
where they are.

## Adding a funding call

1. wp-admin → **Calls** → **Add New**.
2. Title: e.g. "WE&ME Projects 2026".
3. Body: long description, eligibility, timeline.
4. **Funding Call details** box:
   - **Status** — open / upcoming / closed
   - **Amount total** — the funding pool in EUR
   - **Deadline** — Stage 1 deadline
   - **External url** — the WWTF submission page
   - **Featured** — yes if this is the homepage banner
   - **Display order**
5. Set the **Featured Image** (the call's hero artwork).
6. **Publish**.

If **Featured** is checked, the lime-green "Open call" card
replaces the "Shop coming soon" card on the homepage. If you
uncheck it, the shop card returns. There's always exactly one
card in that slot.

## Editing the homepage Researcher quote

1. wp-admin → **Team & Board**.
2. Find the team member (likely under "Scientific Advisory
   Board"). Open it.
3. The standard editor contains their bio. Use the **first
   paragraph** as the homepage quote.
4. Set **Role type** to `advisor`.
5. Set **Display order** — the lowest-numbered advisor shows
   on the homepage.
6. **X handle** — their X/Twitter handle without the @.
7. Set the **Featured Image** to the portrait.
8. **Update**.

The homepage's "From the lab" section shows the lowest-ordered
advisor. To rotate, just change the display order numbers.

## "The site doesn't show my new post"

Three things to check, in order:

1. **Is the post published?** (not Draft or Pending Review).
2. **Is the post type right?** Stories go in **Stories**, news
   in **Posts**, etc.
3. **Wait 2-3 seconds.** The frontend re-fetches on every save.
   If you still don't see it, go to **Settings → WE&ME Headless**
   and click "Revalidate /". That fires a hard refresh.

## Common mistakes

- **Setting a call to status=open but forgetting Featured.** The
  open-call card only appears when the call is both open *and*
  featured. Leave Featured unchecked if the call shouldn't
  appear on the homepage.
- **Editing the WordPress page called "About" but the public
  /about page doesn't change.** The /about page is rendered by
  Next.js from the WP page with slug `about`. Make sure the
  slug in the URL slug box (right sidebar) is `about`, not
  something else.
- **Photo not showing.** Set the Featured Image — not the
  "Insert from URL" in the editor body. The homepage rail uses
  the Featured Image for the card.
- **The "Why fund WE&ME?" section's count-up shows the wrong
  number.** It sums the `amount` field of every published
  project. Edit the project in **Funded Projects** to change
  the number.

## How do I see the changes without going to the live site?

The new site has a **/v2** prefix in the cutover stage. The
URL `https://www.weandmecfs.org/v2/` shows the new frontend
while the old one stays on the root. After the cutover is
signed off, the v2 flag goes away and the new site is the
only site.
