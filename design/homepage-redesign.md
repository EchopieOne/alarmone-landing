# Alarm One website redesign

Completed locally on 2026-10-19. Includes the homepage, blog directory, and all nine articles. Other public pages receive the real app icon and official download artwork. No commit, push, or production deployment is implied by this local result.

## Direction and concept

Applied Leonxlnx/taste-skill, installed as `design-taste-frontend`. The installed global package was compared against a fresh download of `skills/taste-skill` from the requested repository and matched exactly. It is available on subsequent turns.

Direction: **Colour chapters**, seed **1103026599**. No redraws. On this page, Alarm One's repeating work and rest days become a sequence of full-colour calendar chapters. White, brand blue, pale blue, and deep navy give the sections distinct roles. Libre Franklin is self-hosted, with its SIL Open Font License in `assets/fonts/OFL.txt`.

The homepage's live element is a 30-day shift preview using the existing tested rotation function. The blog directory adds search and topic filtering; article contents become a sticky desktop navigation and a native disclosure on smaller screens. Reduced motion and no-JavaScript fallbacks retain readable content and working download links.

## Real assets and download controls

- The app icon is the actual App Store artwork for app **6748434148**, fetched from the [Apple lookup API](https://itunes.apple.com/lookup?id=6748434148&country=us) on 2026-10-19 and saved as `assets/alarm-one-app-icon.jpg`.
- Download actions use the [unmodified Apple badge SVG](https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg), following the [App Store marketing guidelines](https://developer.apple.com/app-store/marketing/guidelines/). Its native proportions, black artwork, and border are preserved. It remains static on hover and press and is excluded from scripted entrances. Existing App Store attribution parameters remain attached.
- Homepage imagery uses the existing Rotation editor, Weekly city alarm editor, World Clock, and pinned widget screenshots. These are genuine interface assets; none was generated or redrawn.
- Blog illustrations are the project's existing hand-drawn explanatory raster artwork. They are illustrations, not photographs. Related-guide thumbnails use the corresponding article's existing source image.
- No stock photographs, found archive images, generated product screens, or video were added. No third-party photo credits are required. There are no placeholder testimonials, ratings, or customer statistics.
- Calendar dates and times are explicitly a website preview. They do not create a saved alarm. The original rotating-shift article retains its explanation that the available app screenshot shows 4-on-3-off while the tutorial walks through 4-on-4-off.

## Content and implementation

The nine articles retain all **210 body paragraphs**, checked against the starting Git revision. FAQ answers, source links, article dates, publisher identity, and public routes remain intact. Visible headings were shortened for small screens, with article schema headlines updated to match. Existing SEO titles and descriptions remain unchanged.

The homepage uses `home.css` and `home.js`. Blog pages share the same foundation and add `blog.css` and `blog.js`. The site remains static HTML with its existing bundled GSAP; no framework or package dependency was added. Shared legacy styling changes are limited to icon presentation and the official badge.

## Verification

| Check | Result |
| --- | --- |
| Homepage browser interactions | 18 passed |
| All 10 blog pages at 320, 390, 768, and 1440px; search, filters, contents, preview, no-script fallback | 108 passed |
| SEO, schema/visible FAQ parity, local destinations, sitemap, redirects | 12 pages, 524 local links/assets, 14 sitemap URLs, 17 redirects passed |
| Existing rotation tests | Passed leap years, year changes, DST calendar arithmetic, and invalid inputs |
| JavaScript syntax and Git whitespace | Passed |
| Source lint | 0 failures |

The source lint warnings are intentional: `padStart` formats an ISO date, and “unlock” in two retained article steps means unlocking the iPhone, rather than promotional wording.

The taste inspector was run at **1440, 768, and 390px**. Before/after results:

| Page | Before failures | After failures | Remaining warnings |
| --- | --- | --- | --- |
| Homepage | 10 | 0 | No external photographs or footage |
| Blog directory | 7 | 0 | No footage |
| Shift-work article template | 9 | 0 | No footage |

The remaining image warnings are deliberate: real app interfaces and existing teaching illustrations provide the evidence here. No authentic product footage exists in this site's assets; unrelated video would interrupt the tutorial. Screenshots and detailed reports live in the ignored `.taste-skill/` working directory. The browser watchdog timeouts were extended for a heavily loaded Mac; measurement rules were unchanged.

After the last mobile navigation adjustment, all three layouts were re-inspected at 390px with **0 failures and 0 warnings**. Their final images and reports are in `home-mobile-final/`, `blog-mobile-final/`, and `article-mobile-final/` under `.taste-skill/`.

## Final visual critique

ROUND 3

Seen in one second: the blue alarm product and its actual screens; a large, legible guide directory; a readable article with visible contents.

Idea (one sentence): Alarm One's work and rest cycle becomes a sequence of distinct colour chapters, with the visitor's own schedule as the proof.

Live thing: the homepage rotation preview; directory search and topic filtering; article contents and the existing shift tutorial's date preview.

Layout words by section: hero=two fields / rotation=operable split / cities=portrait / features=poster list / widget=product split / FAQ=bands / close=statement / directory=editorial rows / article=contents and reading column.

Scores: design 7.7 · usability 8.3 · creativity 7.0 · content 8.5 → overall 7.8. These are a self-assessment using the skill rubric, not an external award or benchmark.

Caps applied: creativity stays at 7.0 because the visual language is an interpretation of a known editorial approach. No unresolved inspector failures.

Top three problems addressed:

1. The original mobile homepage hid product imagery below a long introduction. The new first screen introduces the product screens directly and uses a shorter supporting sentence.
2. Article headings wrapped into three lines at small sizes. Titles and section names were shortened while retaining the actual article content and schema agreement.
3. Wide comparison tables required sideways reading. On phones, each original table row now stacks its values with the corresponding column labels. Desktop keeps the table.

Remaining limitation: the site has genuine still product screenshots and existing diagrams, rather than a filmed product demonstration. No sample content needs replacement before publication.

## Local preview

- Homepage: <http://127.0.0.1:8765/>
- Blog: <http://127.0.0.1:8765/blog/>
- Article: <http://127.0.0.1:8765/blog/shift-work-alarm-iphone>

The local preview server supports the site's extensionless routes. Its process is left running for review.
