/**
 * Demo data — a static snapshot of what the WordPress REST API would
 * return. Used by the static GitHub Pages build (no live WP available
 * at build time) and as a fallback when the WP fetch fails.
 *
 * Set NEXT_PUBLIC_USE_DEMO_DATA=1 to force demo data even when WP is
 * reachable (useful for the GitHub Pages deploy).
 */

import type { Story, Call, Project, Guardian, TeamMember, WPPost, WPPage } from "./wp";

/* ---------- Stories (Mila, Carmen, Yvonne, Madeleine, Petra) ---------- */

export const DEMO_STORIES: Story[] = [
  {
    id: 1,
    slug: "mila-hermisson",
    title: { rendered: "Mila Hermisson" },
    excerpt: { rendered: "<p>Almost four years motionless in a dark, silent room. Even a few words from her parents are often too much.</p>\n" },
    age: 21,
    location: "21 · Lower Austria — ill since 2018",
    onset_year: 2018,
    short_bio: "Almost four years motionless in a dark, silent room. Even a few words from her parents are often too much.",
    long_story_url: "https://www.weandmecfs.org/mila-hermisson/",
    photographer: "Brent Stirton",
    featured: true,
    display_order: 1,
  },
  {
    id: 2,
    slug: "carmen-rinnhofer",
    title: { rendered: "Carmen Rinnhofer" },
    excerpt: { rendered: "<p>She can bear other people’s presence for only a few minutes — and still explains ME/CFS online every day.</p>\n" },
    age: 29,
    location: "29 · Styria — ill since 2022",
    onset_year: 2022,
    short_bio: "She can bear other people’s presence for only a few minutes — and still explains ME/CFS online every day.",
    long_story_url: "https://www.weandmecfs.org/carmen-rinnhofer/",
    photographer: "Brent Stirton",
    featured: true,
    display_order: 2,
  },
  {
    id: 3,
    slug: "yvonne-anreitter",
    title: { rendered: "Yvonne Anreitter" },
    excerpt: { rendered: "<p>She needs help in almost every part of life, yet receives neither care allowance nor a disability pension.</p>\n" },
    age: 50,
    location: "50 · Vienna — ill since 2020",
    onset_year: 2020,
    short_bio: "She needs help in almost every part of life, yet receives neither care allowance nor a disability pension.",
    long_story_url: "https://www.weandmecfs.org/",
    photographer: "Brent Stirton",
    featured: true,
    display_order: 3,
  },
  {
    id: 4,
    slug: "madeleine-martos",
    title: { rendered: "Madeleine Martos" },
    excerpt: { rendered: "<p>“An invisible illness is easier to deny.” Roughly 300 metres is all she manages some mornings.</p>\n" },
    age: 36,
    location: "36 · Lower Austria — ill since 2017",
    onset_year: 2017,
    short_bio: "“An invisible illness is easier to deny.” Roughly 300 metres is all she manages some mornings.",
    long_story_url: "https://www.weandmecfs.org/",
    photographer: "Brent Stirton",
    featured: false,
    display_order: 4,
  },
  {
    id: 5,
    slug: "petra-schaschl-petersmann",
    title: { rendered: "Petra Schaschl-Petersmann" },
    excerpt: { rendered: "<p>Twenty years without a diagnosis, rarely taken seriously — an experience she shares with thousands.</p>\n" },
    age: 55,
    location: "55 · Vienna — ill since 1993",
    onset_year: 1993,
    short_bio: "Twenty years without a diagnosis, rarely taken seriously — an experience she shares with thousands.",
    long_story_url: "https://www.weandmecfs.org/",
    photographer: "Brent Stirton",
    featured: false,
    display_order: 5,
  },
];

/* ---------- Calls (open calls) ---------- */

export const DEMO_CALLS: Call[] = [
  {
    id: 1,
    slug: "weandme-projects-2026",
    title: { rendered: "WE&ME Projects 2026" },
    content: {
      rendered: "<p>€1,000,000 for ~7 research teams. Stage 1 deadline 25 August 2026. Co-developed with the jury (including the 3 S4ME seats) and administered in cooperation with the WWTF.</p>",
    },
    status: "open",
    amount_total: 1000000,
    deadline: "2026-08-25",
    external_url: "https://www.wwtf.at/",
    featured: true,
    display_order: 1,
  },
  {
    id: 2,
    slug: "weandme-emerging-leader-award-2026",
    title: { rendered: "WE&ME Emerging Leader Award 2026" },
    content: { rendered: "<p>Two €5,000 awards for emerging ME/CFS researchers. Deadline 15 October 2026.</p>" },
    status: "open",
    amount_total: 10000,
    deadline: "2026-10-15",
    external_url: "https://www.wwtf.at/",
    featured: true,
    display_order: 2,
  },
];

/* ---------- Funded projects (the 3 from WhyFund) ---------- */

export const DEMO_PROJECTS: Project[] = [
  {
    id: 1,
    slug: "mecfs-call-2026-consolidation",
    title: { rendered: "ME/CFS Call 2026 – Consolidation" },
    content: { rendered: "<p>Co-financed in equal shares with the WWTF. Invite-only call for collaborative consortia building on the 2024 Vienna projects.</p>" },
    institution: "Vienna (WWTF-coordinated)",
    amount: 2000000,
    year: 2026,
    call_id: 1,
    lead_team_id: 1,
    external_url: "https://www.weandmecfs.org/projects/",
    display_order: 1,
  },
  {
    id: 2,
    slug: "weandme-award-2026-mechanistic-endotypes",
    title: { rendered: "WE&ME Award 2026: Mechanistic endotypes in ME/CFS" },
    content: { rendered: "<p>Matthias Wielscher, Medical University of Vienna, via the FWF's alpha+ Foundation.</p>" },
    institution: "Medical University of Vienna",
    amount: 450000,
    year: 2026,
    call_id: 2,
    lead_team_id: 1,
    external_url: "https://www.weandmecfs.org/weme-award-the-winning-project/",
    display_order: 2,
  },
  {
    id: 3,
    slug: "sequence-me-long-covid",
    title: { rendered: "Sequence ME & Long Covid" },
    content: { rendered: "<p>With Action for ME, University of Edinburgh, Oxford Nanopore, EMBL-EBI.</p>" },
    institution: "University of Edinburgh",
    amount: 174414,
    year: 2025,
    call_id: null,
    lead_team_id: null,
    external_url: "https://www.weandmecfs.org/sequence-me-long-covid/",
    display_order: 3,
  },
];

/* ---------- Team & Advisory Board ----------
 *
 * Mirrors the real `weandme` foundation board (https://www.weandmecfs.org/about/#about-board).
 * Portraits are pulled from the live site during build and stored
 * under /public/people/. role_type values map to the plugin's enum:
 *   board, team, scientific, medical, patient, advisory.
 *
 * On the live WP site the editors maintain these in wp-admin via the
 * `weandmecfs_headless_team` CPT. The /about page renders the groups
 * in the same order the live site uses:
 *   1. Board of Directors
 *   2. Foundation Team
 *   3. Scientific Advisory Board
 *   4. Medical Advisory Board
 *   5. Patient Advisory Board
 *   6. Advisory Board
 */

type DemoTeamMember = TeamMember & { portrait: string };

export const DEMO_TEAM: DemoTeamMember[] = [
  // ── Board of Directors ────────────────────────────────────────────
  {
    id: 1,
    slug: "gabriele-stroeck",
    title: { rendered: "Gabriele Ströck" },
    content: { rendered: "Director, WE&ME Foundation" },
    role: "Director",
    role_type: "board",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/gabriele-stroeck.jpg",
    display_order: 1,
  },
  {
    id: 2,
    slug: "gerhard-stroeck",
    title: { rendered: "Gerhard Ströck" },
    content: { rendered: "Director, WE&ME Foundation" },
    role: "Director",
    role_type: "board",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/gerhard-stroeck.png",
    display_order: 2,
  },

  // ── Foundation Team ───────────────────────────────────────────────
  {
    id: 10,
    slug: "philipp-stroeck",
    title: { rendered: "Philipp Ströck" },
    content: { rendered: "Co-founder, WE&ME Foundation" },
    role: "Co-founder",
    role_type: "team",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/philipp-stroeck.jpg",
    display_order: 3,
  },
  {
    id: 11,
    slug: "michael-stroeck",
    title: { rendered: "Michael Ströck" },
    content: { rendered: "Co-founder, WE&ME Foundation" },
    role: "Co-founder",
    role_type: "team",
    x_handle: "mstroeck",
    linkedin_url: "https://www.linkedin.com/in/mstroeck/",
    portrait: "/people/michael-stroeck.jpg",
    display_order: 4,
  },
  {
    id: 12,
    slug: "ulla-epler",
    title: { rendered: "Ulla Epler" },
    content: { rendered: "Fundraising & Partnership, WE&ME Foundation" },
    role: "Fundraising & Partnership",
    role_type: "team",
    x_handle: "UEpler4498",
    linkedin_url: "https://www.linkedin.com/in/ullaepler/",
    portrait: "/people/ulla-epler.jpg",
    display_order: 5,
  },
  {
    id: 13,
    slug: "sandra-karacsony",
    title: { rendered: "Sandra Karacsony" },
    content: { rendered: "Social Media & Project Management, WE&ME Foundation" },
    role: "Social Media & Project Management",
    role_type: "team",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/sandra-karacsony.jpg",
    display_order: 6,
  },
  {
    id: 14,
    slug: "stephanie-duerrstein",
    title: { rendered: "Stephanie Dürrstein" },
    content: { rendered: "Administration, WE&ME Foundation" },
    role: "Administration",
    role_type: "team",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/stephanie-duerrstein.jpg",
    display_order: 7,
  },
  {
    id: 15,
    slug: "caroline-stroeck",
    title: { rendered: "Caroline Ströck" },
    content: { rendered: "Operations Manager, WE&ME Foundation" },
    role: "Operations Manager",
    role_type: "team",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/caroline-stroeck.jpg",
    display_order: 8,
  },
  {
    id: 16,
    slug: "joachim-hermisson",
    title: { rendered: "Joachim Hermisson" },
    content: { rendered: "Scientific Coordination, WE&ME Foundation" },
    role: "Scientific Coordination",
    role_type: "team",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/joachim-hermisson.jpg",
    display_order: 9,
  },

  // ── Scientific Advisory Board ─────────────────────────────────────
  {
    id: 20,
    slug: "maureen-hanson",
    title: { rendered: "Prof. Maureen Hanson" },
    content: { rendered: "Professor of Molecular Biology and Genetics, Cornell University" },
    role: "Professor of Molecular Biology and Genetics",
    role_type: "scientific",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/maureen-hanson.jpg",
    display_order: 10,
  },
  {
    id: 21,
    slug: "ronald-w-davis",
    title: { rendered: "Ronald W. Davis" },
    content: { rendered: "Professor of Biochemistry and Genetics, Stanford University" },
    role: "Professor of Biochemistry and Genetics",
    role_type: "scientific",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/ronald-davis.png",
    display_order: 11,
  },
  {
    id: 22,
    slug: "david-putrino",
    title: { rendered: "Prof. David Putrino" },
    content: { rendered: "Professor in the Department of Rehabilitation and Human Performance, Icahn School of Medicine at Mount Sinai" },
    role: "Professor in the Department of Rehabilitation and Human Performance",
    role_type: "scientific",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/david-putrino.png",
    display_order: 12,
  },

  // ── Medical Advisory Board ────────────────────────────────────────
  {
    id: 30,
    slug: "oskar-smrzka",
    title: { rendered: "Dr. Oskar Smrzka" },
    content: { rendered: "Managing Director / CSO, Ablevia Biotech GmbH" },
    role: "Managing Director / CSO, Ablevia Biotech GmbH",
    role_type: "medical",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/oskar-smrzka.jpg",
    display_order: 13,
  },
  {
    id: 31,
    slug: "eva-untersmayr-elsenhuber",
    title: { rendered: "Prof. DDr. Eva Untersmayr-Elsenhuber" },
    content: { rendered: "Specialist in clinical immunology" },
    role: "Specialist in clinical immunology",
    role_type: "medical",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/eva-untersmayr.jpg",
    display_order: 14,
  },
  {
    id: 32,
    slug: "michael-stingl",
    title: { rendered: "Dr. Michael Stingl" },
    content: { rendered: "Specialist in neurology" },
    role: "Specialist in neurology",
    role_type: "medical",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/michael-stingl.jpg",
    display_order: 15,
  },
  {
    id: 33,
    slug: "martin-komenda-lett",
    title: { rendered: "Dr. Martin Komenda-Lett" },
    content: { rendered: "Specialist in neurology" },
    role: "Specialist in neurology",
    role_type: "medical",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/martin-komenda-lett.jpg",
    display_order: 16,
  },
  {
    id: 34,
    slug: "corinna-geiger",
    title: { rendered: "Dr. Corinna Geiger" },
    content: { rendered: "Specialist in internal medicine, specializing in gastroenterology, hepatology and nutritional medicine" },
    role: "Specialist in internal medicine, specializing in gastroenterology, hepatology and nutritional medicine",
    role_type: "medical",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/corinna-geiger.jpg",
    display_order: 17,
  },
  {
    id: 35,
    slug: "felda-salas",
    title: { rendered: "Felda Salas BSN, RN" },
    content: { rendered: "Specialist for ME/CFS care" },
    role: "Specialist for ME/CFS care",
    role_type: "medical",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/felda-salas.jpg",
    display_order: 18,
  },
  {
    id: 36,
    slug: "rudolf-stroeck",
    title: { rendered: "Dr. Rudolf Ströck" },
    content: { rendered: "General practitioner" },
    role: "General practitioner",
    role_type: "medical",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/rudolf-stroeck.jpg",
    display_order: 19,
  },
  {
    id: 37,
    slug: "christian-sebesta",
    title: { rendered: "Prim. Prof. Dr. Christian Sebesta" },
    content: { rendered: "Specialist in Internal Medicine, Gastroenterology, Hepatology, Hematology and Oncology" },
    role: "Specialist in Internal Medicine, Gastroenterology, Hepatology, Hematology and Oncology",
    role_type: "medical",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/christian-sebesta.jpg",
    display_order: 20,
  },

  // ── Patient Advisory Board ────────────────────────────────────────
  {
    id: 40,
    slug: "susan-kandarian",
    title: { rendered: "Susan Kandarian, PhD" },
    content: { rendered: "Professor of Health Sciences" },
    role: "Professor of Health Sciences",
    role_type: "patient",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/susan-kandarian.jpg",
    display_order: 21,
  },
  {
    id: 41,
    slug: "dianna-cowern",
    title: { rendered: "Dianna Cowern" },
    content: { rendered: "Science communicator “Physics Girl”" },
    role: "Science communicator “Physics Girl”",
    role_type: "patient",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/dianna-cowern.jpg",
    display_order: 22,
  },
  {
    id: 42,
    slug: "daniel-loy",
    title: { rendered: "Mag. Daniel Loy" },
    content: { rendered: "Patient advisory board member" },
    role: "Patient advisory board member",
    role_type: "patient",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/daniel-loy.jpg",
    display_order: 23,
  },
  {
    id: 43,
    slug: "petra-schaschl-petersmann",
    title: { rendered: "Mag. Petra Schaschl-Petersmann" },
    content: { rendered: "Patient advisory board member" },
    role: "Patient advisory board member",
    role_type: "patient",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/petra-schaschl.jpg",
    display_order: 24,
  },

  // ── Advisory Board ────────────────────────────────────────────────
  {
    id: 50,
    slug: "rudolf-anschober",
    title: { rendered: "Rudolf Anschober" },
    content: { rendered: "Consulting on health and social policy issues" },
    role: "Consulting on health and social policy issues",
    role_type: "advisory",
    x_handle: null,
    linkedin_url: null,
    portrait: "/people/rudolf-anschober.jpg",
    display_order: 25,
  },
];

/* ---------- Guardians (recurring donor spotlights) ---------- */

export const DEMO_GUARDIANS: Guardian[] = [
  {
    id: 1,
    slug: "kathrin-fuchs",
    title: { rendered: "Kathrin Fuchs" },
    quote: "I show up where he can’t — at events, in conversations, online. Keeping this disease visible is the least I can do.",
    since: 2024,
    external_url: null,
    display_order: 1,
  },
  {
    id: 2,
    slug: "julia-wieseltaler",
    title: { rendered: "Julia Wieseltaler" },
    quote: "Every kilometre I run, I run for someone who can’t leave their bed. It’s my way of lending her my energy.",
    since: 2023,
    external_url: null,
    display_order: 2,
  },
  {
    id: 3,
    slug: "laura-karasinski",
    title: { rendered: "Laura Karasinski" },
    quote: "I speak up wherever I have a platform, because most patients simply cannot. Helplessness turns into action, month after month.",
    since: 2025,
    external_url: null,
    display_order: 3,
  },
];

/* ---------- Posts (latest news, mirrors WP defaults) ---------- */

export const DEMO_POSTS: WPPost[] = [
  {
    id: 1,
    slug: "inside-the-search-for-a-biomarker",
    title: { rendered: "Inside the search for a biomarker" },
    excerpt: { rendered: "<p>Teams in Vienna, Stanford, Berlin and Melbourne pooled their data for the first time — and the first honest picture of where the science stands.</p>\n" },
    date: "2026-07-20T10:00:00",
  },
  {
    id: 2,
    slug: "weandme-award-2026",
    title: { rendered: "WE&ME Award 2026 honors leading ME/CFS researchers" },
    excerpt: { rendered: "<p>Matthias Wielscher receives the 2026 award for his work on mechanistic endotypes in ME/CFS.</p>\n" },
    date: "2026-06-10T10:00:00",
  },
  {
    id: 3,
    slug: "charity-gala-kittsee",
    title: { rendered: "Charity Gala for ME/CFS at Kittsee Castle" },
    excerpt: { rendered: "<p>Save the date: 14 September 2026, Kittsee Castle, Burgenland.</p>\n" },
    date: "2026-05-15T10:00:00",
  },
];

/* ---------- About page content ---------- */

export const DEMO_ABOUT_PAGE: WPPage = {
  id: 999,
  slug: "about",
  title: { rendered: "About the WE&ME Foundation" },
  content: {
    rendered: [
      "<h2>Our story</h2>",
      "<p>The WE&amp;ME Foundation was founded in 2020 by the Ströck family. Two of their three sons, Christoph and Philipp, live with ME/CFS. The family personally covers every operating cost so that 100% of donations fund research in full.</p>",
      "<h2>How we work</h2>",
      "<p>Our funding calls are run with the FWF and the WWTF. Patients sit on the jury of our largest calls and are involved at every step. Decisions stay independent.</p>",
      "<h2>What we believe</h2>",
      "<p>Biomedical research only. No dilution of funds. No overhead. No shortcuts.</p>",
    ].join("\n"),
  },
  excerpt: { rendered: "" },
};

/* ---------- Convenience flag ---------- */

export const USE_DEMO_DATA =
  process.env.NEXT_PUBLIC_USE_DEMO_DATA === "1" ||
  process.env.NODE_ENV === "production" && !process.env.WP_BASE_URL;
