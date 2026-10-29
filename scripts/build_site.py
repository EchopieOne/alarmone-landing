"""Regenerate the homepage guide links and sitemap.xml from the posts in blog/.

Run from any directory with:  python3 scripts/build_site.py
Verify without writing:       python3 scripts/build_site.py --check

- Every blog/*.html post (except index.html) is linked from the homepage, newest first
  (by datePublished), between the `guides:start` / `guides:end` markers in index.html.
- sitemap.xml lists the canonical URL of every page. <lastmod> is the page's own declared
  last-updated date (article:modified_time, else a JSON-LD dateModified on the node for
  the canonical URL); pages without one fall back to the date of the last git commit
  that touched the file. No dates are invented.
"""

import json
import re
import subprocess
import sys
from html import escape, unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://alarmone.echopie.com"
# Non-post pages, in sitemap order, with their existing priorities.
PAGES_BEFORE_POSTS = [("index.html", 1.0), ("blog/index.html", 0.7)]
PAGES_AFTER_POSTS = [("support.html", 0.6), ("privacy.html", 0.5), ("about.html", 0.5)]
POST_PRIORITY = 0.8
START = re.compile(r"(<!-- guides:start[^>]*-->\n)(.*?)([ \t]*<!-- guides:end -->)", re.S)


def page_info(path):
    source = path.read_text()
    canonical = re.search(r'<link rel="canonical" href="([^"]+)"', source).group(1)
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", source, re.S)
    nodes = []
    for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', source, re.S):
        data = json.loads(block)
        stack = [data]
        while stack:
            item = stack.pop()
            if isinstance(item, dict):
                nodes.append(item)
                stack.extend(item.values())
            elif isinstance(item, list):
                stack.extend(item)
    own = [n for n in nodes if canonical in (n.get("url"), str(n.get("@id", "")).split("#")[0], (n.get("mainEntityOfPage") or {}).get("@id") if isinstance(n.get("mainEntityOfPage"), dict) else n.get("mainEntityOfPage"))]
    posting = next((n for n in nodes if n.get("@type") == "BlogPosting" and n in own), None) or next((n for n in nodes if n.get("@type") == "BlogPosting"), None) if path.parent.name == "blog" and path.name != "index.html" else None
    meta_modified = re.search(r'<meta property="article:modified_time" content="([^"]+)"', source)
    declared = meta_modified.group(1)[:10] if meta_modified else next((str(n["dateModified"])[:10] for n in ([posting] if posting else []) + own if n.get("dateModified")), None)
    if declared:
        lastmod, source_kind = declared, "declared"
    else:
        lastmod = subprocess.run(["git", "log", "-1", "--format=%cs", "--", str(path.relative_to(ROOT))], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
        assert lastmod, f"No declared date and no git history for {path}"
        source_kind = "git"
    return {
        "path": path,
        "canonical": canonical,
        "title": " ".join(unescape(re.sub(r"<[^>]+>", "", h1.group(1))).split()) if h1 else "",
        "published": str((posting or {}).get("datePublished", ""))[:10],
        "lastmod": lastmod,
        "lastmod_source": source_kind,
    }


def build():
    posts = [page_info(p) for p in sorted((ROOT / "blog").glob("*.html")) if p.name != "index.html"]
    posts.sort(key=lambda p: (p["published"], p["canonical"]), reverse=True)
    for post in posts:
        assert post["title"] and post["published"], f"Post missing H1 or datePublished: {post['path']}"

    links = "".join(f'          <a href="blog/{p["canonical"].rsplit("/", 1)[-1]}">{escape(p["title"], quote=False)}</a>\n' for p in posts)
    home_path = ROOT / "index.html"
    home = home_path.read_text()
    assert START.search(home), "index.html is missing the guides:start/guides:end markers"
    home = START.sub(lambda m: m.group(1) + links + m.group(3), home, count=1)

    entries = [(page_info(ROOT / f), pr) for f, pr in PAGES_BEFORE_POSTS] + [(p, POST_PRIORITY) for p in posts] + [(page_info(ROOT / f), pr) for f, pr in PAGES_AFTER_POSTS]
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for info, priority in entries:
        sitemap += f"  <url>\n    <loc>{info['canonical']}</loc>\n    <lastmod>{info['lastmod']}</lastmod>\n    <priority>{priority:.1f}</priority>\n  </url>\n"
    sitemap += "</urlset>\n"
    return home, sitemap, posts, entries


def main():
    home, sitemap, posts, entries = build()
    if "--check" in sys.argv:
        current_home = (ROOT / "index.html").read_text()
        assert current_home == home, "index.html guide links are stale: run python3 scripts/build_site.py"
        current = dict(re.findall(r"<loc>([^<]+)</loc>\s*<lastmod>([^<]+)</lastmod>", (ROOT / "sitemap.xml").read_text()))
        expected = {info["canonical"]: info for info, _ in entries}
        assert set(current) == set(expected), "sitemap.xml URLs are stale: run python3 scripts/build_site.py"
        for url, info in expected.items():
            # Git-derived dates change with every commit, so only declared dates must match exactly.
            if info["lastmod_source"] == "declared":
                assert current[url] == info["lastmod"], f"sitemap.xml lastmod stale for {url}"
        print(f"OK: homepage links {len(posts)}/{len(posts)} posts; sitemap has {len(current)} URLs.")
        return
    (ROOT / "index.html").write_text(home)
    (ROOT / "sitemap.xml").write_text(sitemap)
    for info, _ in entries:
        print(f"{info['lastmod']} ({info['lastmod_source']}) {info['canonical']}")
    print(f"Wrote index.html ({len(posts)} guide links) and sitemap.xml ({len(entries)} URLs).")


if __name__ == "__main__":
    main()
