# Alarm One homepage sharing cover

Generated with the built-in ImageGen tool from the supplied layout reference and
the existing Alarm One app icon. Exported as `assets/alarm-one-social-cover.png`
at 1200 × 630 pixels. The original app screenshot remains the SoftwareApplication
`screenshot`; the sharing cover is its `image` and the homepage's Open Graph/X image.

The versioned sharing export is `assets/alarm-one-social-cover-v2.jpg`, a 1200 × 630
sRGB JPEG of the same artwork. The homepage and `/share` use this smaller image.
`/share` has its own canonical and Open Graph URL and is excluded from indexing;
its raw HTML serves the sharing metadata, while browser navigation returns to `/`.
This provides a new URL for diagnosing stale social cards. A successful deployment
and image response do not prove that X has refreshed its displayed card.

Both entry points declare `twitter:site="@gareth7ng"`, matching the X account in
Alarm One's Contact Us screen (`alarm/Widgets/ContractUsView.swift` in the app repo).
The X Cards markup reference requires either `twitter:site` or `twitter:site:id`
for website attribution. The image remains explicitly declared in `twitter:image`
and `og:image`; account attribution does not itself select or refresh the image.

Reference: [X Cards Markup Tag Reference, official documentation archived on
2026-01-16](https://web.archive.org/web/20260116124848/https://developer.x.com/en/docs/x-for-websites/cards/overview/markup).

## Generation prompt

Use case: ads-marketing.
Asset type: One production-ready landscape website social-share cover for Alarm One, 1200 × 630 pixels (aspect ratio 1.905:1). Output only the finished flat cover art.
Primary request: Adapt the clean layout of the first reference's website link preview for Alarm One. The first reference is a screenshot of an X post, but ONLY the white landscape preview image within that screenshot is the composition reference; exclude every part of the surrounding X interface, avatar, post, black border, caption overlay, and social controls. The second image is the authentic Alarm One app icon and must preserve its exact cyan-blue rounded-square background, white broken circular clock outline, white hands, and white dot.
Composition: Airy warm-white full-bleed canvas. Left 58%: small bold brand label near upper-left, then a very large heavy modern sans-serif two-line headline, then a quiet spaced small platform label. Right 42%: a large authentic Alarm One app icon, subtly tilted clockwise by about 8 degrees, with a soft blue ambient shadow/glow. Two compact cyan-blue floating rounded pills, one above-left and one below-left of the icon, echo the small floating text labels in the reference. Use ample spacing, strong hierarchy, and professional Apple-inspired typography. Keep all content within a 64px safe margin of all edges and avoid overlap between text and artwork.
Text (verbatim and only these words):
Small brand label: "Alarm One".
Headline line 1, near-black: "iPhone alarms".
Headline line 2, cyan-blue #08B1F4: "for your schedule.".
Small platform label beneath the headline: "MADE FOR IPHONE".
Top floating pill, white text: "Rotating shifts".
Bottom floating pill, white text: "World clock alarms".
Small subdued domain at lower-left: "alarmone.echopie.com".
Constraints: Preserve the actual brand icon faithfully, do not invent another logo, character, cartoon mascot, screenshot, phone, rating, price, endorsement, or extra text. No rounded outer card border, no watermark, no social-network UI. The background fills the rectangle edge to edge. Ensure text is crisply readable at social-preview thumbnail sizes. The finished artwork should resemble the provided reference's left-title/right-icon structure while using Alarm One's own cyan-blue brand.
