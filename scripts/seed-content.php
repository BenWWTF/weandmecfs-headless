<?php
/**
 * Seed the WE&ME Foundation WordPress install with real content from
 * weandmecfs.org and the campaign media toolkit.
 *
 * Run with:
 *   wp eval-file scripts/seed-content.php           (if wp-cli is installed)
 *   php -d display_errors=1 scripts/seed-content.php --path=wp/  (fallback)
 *
 * Idempotent: re-running updates posts by slug instead of duplicating.
 *
 * @package WeAndMeHeadless
 */

declare(strict_types=1);

defined( 'ABSPATH' ) || exit;

// 1. Stories (the patient stories, with Brent Stirton photos).
$stories = [
	[
		'slug'         => 'mila-hermisson',
		'title'        => 'Mila Hermisson',
		'age'          => 21,
		'location'     => 'Lower Austria',
		'onset_year'   => 2018,
		'short_bio'    => "Almost four years motionless in a dark, silent room. Even a few words from her parents are often too much.",
		'long_story_url' => 'https://www.weandmecfs.org/mila-hermisson/',
		'photographer' => 'Brent Stirton',
		'featured'     => 1,
		'display_order' => 1,
	],
	[
		'slug'         => 'carmen-rinnhofer',
		'title'        => 'Carmen Rinnhofer',
		'age'          => 29,
		'location'     => 'Styria',
		'onset_year'   => 2022,
		'short_bio'    => "She can bear other people's presence for only a few minutes — and still explains ME/CFS online every day.",
		'long_story_url' => 'https://www.weandmecfs.org/carmen-rinnhofer/',
		'photographer' => 'Brent Stirton',
		'featured'     => 1,
		'display_order' => 2,
	],
	[
		'slug'         => 'yvonne-anreitter',
		'title'        => 'Yvonne Anreitter',
		'age'          => 50,
		'location'     => 'Vienna',
		'onset_year'   => 2020,
		'short_bio'    => "She needs help in almost every part of life, yet receives neither care allowance nor a disability pension.",
		'long_story_url' => 'https://www.weandmecfs.org/',
		'photographer' => 'Brent Stirton',
		'featured'     => 1,
		'display_order' => 3,
	],
	[
		'slug'         => 'madeleine-martos',
		'title'        => 'Madeleine Martos',
		'age'          => 36,
		'location'     => 'Lower Austria',
		'onset_year'   => 2017,
		'short_bio'    => '"An invisible illness is easier to deny." Roughly 300 metres is all she manages some mornings.',
		'long_story_url' => 'https://www.weandmecfs.org/',
		'photographer' => 'Brent Stirton',
		'featured'     => 0,
		'display_order' => 4,
	],
	[
		'slug'         => 'petra-schaschl-petersmann',
		'title'        => 'Petra Schaschl-Petersmann',
		'age'          => 55,
		'location'     => 'Vienna',
		'onset_year'   => 1993,
		'short_bio'    => "Twenty years without a diagnosis, rarely taken seriously — an experience she shares with thousands.",
		'long_story_url' => 'https://www.weandmecfs.org/',
		'photographer' => 'Brent Stirton',
		'featured'     => 0,
		'display_order' => 5,
	],
];

foreach ( $stories as $s ) {
	$id = seed_post( 'story', $s['slug'], [
		'post_title'   => $s['title'],
		'post_status'  => 'publish',
		'post_content' => '', // long_story_url is the long form, on the live site
		'post_excerpt' => $s['short_bio'],
	] );
	set_meta( $id, 'story', 'age', $s['age'] );
	set_meta( $id, 'story', 'location', "{$s['age']} · {$s['location']} — ill since {$s['onset_year']}" );
	set_meta( $id, 'story', 'onset_year', $s['onset_year'] );
	set_meta( $id, 'story', 'short_bio', $s['short_bio'] );
	set_meta( $id, 'story', 'long_story_url', $s['long_story_url'] );
	set_meta( $id, 'story', 'photographer', $s['photographer'] );
	set_meta( $id, 'story', 'featured', (string) $s['featured'] );
	set_meta( $id, 'story', 'display_order', (string) $s['display_order'] );
}

// 2. Funding calls.
$projects_call_id = seed_post( 'call', 'weandme-projects-2026', [
	'post_title'   => 'WE&ME Projects 2026',
	'post_content' => "€1,000,000 for ~7 research teams. Stage 1 deadline 25 August 2026. Co-developed with the jury (including the 3 S4ME seats) and administered in cooperation with the WWTF.",
	'post_status'  => 'publish',
] );
set_meta( $projects_call_id, 'call', 'status', 'open' );
set_meta( $projects_call_id, 'call', 'amount_total', 1000000 );
set_meta( $projects_call_id, 'call', 'deadline', '2026-08-25' );
set_meta( $projects_call_id, 'call', 'external_url', 'https://www.wwtf.at/' );
set_meta( $projects_call_id, 'call', 'featured', '1' );
set_meta( $projects_call_id, 'call', 'display_order', '1' );

$ela_call_id = seed_post( 'call', 'weandme-emerging-leader-award-2026', [
	'post_title'   => 'WE&ME Emerging Leader Award 2026',
	'post_content' => "Two €5,000 awards for emerging ME/CFS researchers. Deadline 15 October 2026.",
	'post_status'  => 'publish',
] );
set_meta( $ela_call_id, 'call', 'status', 'open' );
set_meta( $ela_call_id, 'call', 'amount_total', 10000 );
set_meta( $ela_call_id, 'call', 'deadline', '2026-10-15' );
set_meta( $ela_call_id, 'call', 'external_url', 'https://www.wwtf.at/' );
set_meta( $ela_call_id, 'call', 'featured', '1' );
set_meta( $ela_call_id, 'call', 'display_order', '2' );

// 3. Funded projects (the 3 from WhyFund.tsx).
$proj_consolidation = seed_post( 'project', 'mecfs-call-2026-consolidation', [
	'post_title'   => 'ME/CFS Call 2026 – Consolidation',
	'post_content' => "Co-financed in equal shares with the WWTF. Invite-only call for collaborative consortia building on the 2024 Vienna projects.",
	'post_status'  => 'publish',
] );
set_meta( $proj_consolidation, 'project', 'institution', 'Vienna (WWTF-coordinated)' );
set_meta( $proj_consolidation, 'project', 'amount', 2000000 );
set_meta( $proj_consolidation, 'project', 'year', 2026 );
set_meta( $proj_consolidation, 'project', 'call_id', $projects_call_id );
set_meta( $proj_consolidation, 'project', 'external_url', 'https://www.weandmecfs.org/projects/' );
set_meta( $proj_consolidation, 'project', 'display_order', '1' );

$proj_award = seed_post( 'project', 'weandme-award-2026-mechanistic-endotypes', [
	'post_title'   => 'WE&ME Award 2026: Mechanistic endotypes in ME/CFS',
	'post_content' => "Matthias Wielscher, Medical University of Vienna, via the FWF's alpha+ Foundation.",
	'post_status'  => 'publish',
] );
set_meta( $proj_award, 'project', 'institution', 'Medical University of Vienna' );
set_meta( $proj_award, 'project', 'amount', 450000 );
set_meta( $proj_award, 'project', 'year', 2026 );
set_meta( $proj_award, 'project', 'call_id', $ela_call_id );
set_meta( $proj_award, 'project', 'external_url', 'https://www.weandmecfs.org/weme-award-the-winning-project/' );
set_meta( $proj_award, 'project', 'display_order', '2' );

$proj_seqme = seed_post( 'project', 'sequence-me-long-covid', [
	'post_title'   => 'Sequence ME & Long Covid',
	'post_content' => "With Action for ME, University of Edinburgh, Oxford Nanopore, EMBL-EBI.",
	'post_status'  => 'publish',
] );
set_meta( $proj_seqme, 'project', 'institution', 'University of Edinburgh' );
set_meta( $proj_seqme, 'project', 'amount', 174414 );
set_meta( $proj_seqme, 'project', 'year', 2025 );
set_meta( $proj_seqme, 'project', 'external_url', 'https://www.weandmecfs.org/sequence-me-long-covid/' );
set_meta( $proj_seqme, 'project', 'display_order', '3' );

// 4. Team & advisory board.
$team = [
	[ 'christoph-strock',  'Christoph Ströck',     'team',   'Co-founder, WE&ME Foundation' ],
	[ 'philipp-strock',    'Philipp Ströck',       'team',   'Co-founder, WE&ME Foundation' ],
	[ 'akiko-iwasaki',     'Akiko Iwasaki',        'advisor', 'Sterling Professor of Immunobiology, Yale School of Medicine · HHMI Investigator' ],
	[ 'benjamin-missbach', 'Benjamin Missbach',    'team',   'Call Manager, WE&ME Foundation (administered by WWTF)' ],
	[ 'therese-aigner',    'Therese Aigner',       'team',   'Communications, WE&ME Foundation' ],
];
foreach ( $team as [ $slug, $name, $role_type, $role ] ) {
	$id = seed_post( 'team', $slug, [
		'post_title'   => $name,
		'post_status'  => 'publish',
		'post_content' => $role,
	] );
	set_meta( $id, 'team', 'role', $role );
	set_meta( $id, 'team', 'role_type', $role_type );
	set_meta( $id, 'team', 'display_order', '0' );
}

// 5. Partners.
$partners = [
	[ 'fwf', 'FWF — Der Wissenschaftsfonds', 'process', 'https://www.fwf.ac.at/en/' ],
	[ 'wwtf', 'WWTF — Vienna Science and Technology Fund', 'process', 'https://wwtf.at/' ],
	[ 's4me', 'Science for ME', 'jury', 'https://www.s4me.info/' ],
];
foreach ( $partners as [ $slug, $name, $type, $url ] ) {
	$id = seed_post( 'partner', $slug, [
		'post_title'  => $name,
		'post_status' => 'publish',
	] );
	set_meta( $id, 'partner', 'partner_type', $type );
	set_meta( $id, 'partner', 'external_url', $url );
	set_meta( $id, 'partner', 'display_order', '0' );
}

// 6. Guardians.
$guardians = [
	[ 'kathrin-fuchs',     'Kathrin Fuchs',     2024, 'I show up where he can\'t — at events, in conversations, online. Keeping this disease visible is the least I can do.' ],
	[ 'julia-wieseltaler', 'Julia Wieseltaler', 2023, 'Every kilometre I run, I run for someone who can\'t leave their bed. It\'s my way of lending her my energy.' ],
	[ 'laura-karasinski',  'Laura Karasinski',  2025, 'I speak up wherever I have a platform, because most patients simply cannot. Helplessness turns into action, month after month.' ],
];
foreach ( $guardians as [ $slug, $name, $since, $quote ] ) {
	$id = seed_post( 'guardian', $slug, [
		'post_title'  => $name,
		'post_status' => 'publish',
	] );
	set_meta( $id, 'guardian', 'quote', $quote );
	set_meta( $id, 'guardian', 'since', $since );
	set_meta( $id, 'guardian', 'display_order', '0' );
}

// 7. About page.
$about_id = seed_post( 'page', 'about', [
	'post_title'   => 'About',
	'post_status'  => 'publish',
	'post_content' => "## Our story\n\nThe Ströck family founded WE&ME in 2020. Two of their three sons, Christoph and Philipp, live with ME/CFS. Having seen how little research and care exist, they fund the foundation's entire operation so that every donation goes to research in full.\n\n## How we work\n\nOur funding calls are run with the FWF and the WWTF. Patients sit on the jury of our largest calls and are involved at every step. Decisions stay independent.\n\n## What we believe\n\nBiomedical research only. No dilution of funds. No overhead. No shortcuts.",
] );

// 8. Site identity (matches weandmecfs.org).
update_option( 'blogname',         'WE&ME Foundation' );
update_option( 'blogdescription',  'A future without ME/CFS.' );
update_option( 'admin_email',      'contact@weandmecfs.org' );

echo "Seed complete.\n";
echo "- " . count( $stories ) . " stories\n";
echo "- 2 calls, 3 projects\n";
echo "- " . count( $team ) . " team members\n";
echo "- " . count( $partners ) . " partners\n";
echo "- " . count( $guardians ) . " guardians\n";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function seed_post( string $type, string $slug, array $args ): int {
	$existing = get_posts( [
		'post_type'      => $type,
		'name'           => $slug,
		'post_status'    => 'any',
		'posts_per_page' => 1,
		'fields'         => 'ids',
	] );
	if ( $existing ) {
		$args['ID'] = (int) $existing[0];
		return (int) wp_update_post( $args, true );
	}
	$args['post_type']  = $type;
	$args['post_name']  = $slug;
	return (int) wp_insert_post( $args, true );
}

function set_meta( int $post_id, string $cpt, string $field, mixed $value ): void {
	$key = "wm_{$cpt}_{$field}";
	update_post_meta( $post_id, $key, (string) $value );
}
