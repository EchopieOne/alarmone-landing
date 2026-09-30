"""Check the static site's SEO metadata, structured data, and local links.

Run from any directory with: python3 scripts/check_seo.py
"""

import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
BASE = "https://alarmone.echopie.com"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class Node:
    def __init__(self, tag, attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def text(self):
        return " ".join("".join(child.text() if isinstance(child, Node) else child for child in self.children).split())

    def find(self, tag):
        result = [self] if self.tag == tag else []
        for child in self.children:
            if isinstance(child, Node):
                result.extend(child.find(tag))
        return result


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node("document")
        self.stack = [self.root]
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_endtag(self, tag):
        assert self.stack[-1].tag == tag, f"Invalid HTML nesting: closing {tag} inside {self.stack[-1].tag}"
        self.stack.pop()

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def resolve(path):
    if path.endswith("/"):
        return ROOT / path.lstrip("/") / "index.html"
    file = ROOT / path.lstrip("/")
    return file if file.suffix else file.with_suffix(".html")


pages = [ROOT / "index.html", *sorted((ROOT / "blog").glob("*.html"))]
docs = {page: Document(page.read_text()).root for page in pages}
sitemap = ET.parse(ROOT / "sitemap.xml")
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
entries = sitemap.findall("s:url", ns)
sitemap_urls = [item.find("s:loc", ns).text for item in entries]
assert len(sitemap_urls) == len(set(sitemap_urls)), "Duplicate sitemap URL"
for url in sitemap_urls:
    assert resolve(urlsplit(url).path).is_file(), f"Sitemap target missing: {url}"

titles, descriptions = set(), set()
links_checked = 0
for page, doc in docs.items():
    name = page.relative_to(ROOT)
    meta_keys = [node.attrs.get("name", node.attrs.get("property")) for node in doc.find("meta") if "name" in node.attrs or "property" in node.attrs]
    assert len(meta_keys) == len(set(meta_keys)), f"{name}: duplicate metadata tags"
    meta = {node.attrs.get("name", node.attrs.get("property")): node.attrs.get("content") for node in doc.find("meta")}
    title = doc.find("title")
    assert len(title) == 1, f"{name}: expected one title"
    title = title[0].text()
    description = meta["description"]
    assert 55 <= len(title) <= 60, f"{name}: title length {len(title)}"
    assert 150 <= len(description) <= 160, f"{name}: description length {len(description)}"
    assert title not in titles and description not in descriptions, f"{name}: duplicate metadata"
    titles.add(title)
    descriptions.add(description)
    assert len(doc.find("h1")) == 1, f"{name}: expected one H1"
    assert meta["og:title"] == meta["twitter:title"] == title, f"{name}: social title mismatch"
    assert meta["og:description"] == meta["twitter:description"] == description, f"{name}: social description mismatch"
    assert meta["robots"] == "index,follow,max-image-preview:large", f"{name}: unexpected robots"
    canonical_nodes = [node for node in doc.find("link") if node.attrs.get("rel") == "canonical"]
    assert len(canonical_nodes) == 1, f"{name}: expected one canonical"
    canonical = canonical_nodes[0].attrs["href"]
    assert canonical in sitemap_urls, f"{name}: canonical missing from sitemap"
    assert resolve(urlsplit(canonical).path) == page, f"{name}: canonical points to another page"
    assert meta["og:url"] == canonical, f"{name}: social URL mismatch"
    ids = [node.attrs["id"] for tag in ["section", "nav", "h1", "h2", "div", "article", "main"] for node in doc.find(tag) if "id" in node.attrs]
    assert len(ids) == len(set(ids)), f"{name}: duplicate anchor IDs"
    for node in doc.find("img"):
        assert node.attrs.get("alt"), f"{name}: missing image alt"
    for tag, attribute in [("a", "href"), ("img", "src"), ("script", "src"), ("link", "href")]:
        for node in doc.find(tag):
            value = node.attrs.get(attribute)
            if not value:
                continue
            parsed = urlsplit(urljoin(canonical, value))
            if parsed.netloc != urlsplit(BASE).netloc:
                continue
            target = resolve(unquote(parsed.path))
            assert target.is_file(), f"{name}: broken local URL {value}"
            links_checked += 1
            if parsed.fragment:
                target_doc = docs[target] if target in docs else Document(target.read_text()).root
                # All current fragment targets are sections or navigation elements.
                target_ids = [n.attrs.get("id") for t in ["section", "nav", "h1", "h2", "div", "article", "main"] for n in target_doc.find(t)]
                assert unquote(parsed.fragment) in target_ids, f"{name}: missing anchor {value}"
    schemas = []
    for node in doc.find("script"):
        if node.attrs.get("type") == "application/ld+json":
            data = json.loads("".join(node.children))
            assert data["@context"] == "https://schema.org"
            schemas.extend(data.get("@graph", [data]))
    faq_schema = [item for item in schemas if item["@type"] == "FAQPage"]
    if faq_schema:
        visible = [(node.find("summary")[0].text(), node.find("p")[0].text()) for node in doc.find("details") if node.attrs.get("class") == "faq"]
        structured = [(q["name"], q["acceptedAnswer"]["text"]) for q in faq_schema[0]["mainEntity"]]
        assert visible == structured, f"{name}: visible FAQ differs from JSON-LD"
    if page.parent.name == "blog" and page.name != "index.html":
        article = next(item for item in schemas if item["@type"] == "BlogPosting")
        assert article["headline"] == doc.find("h1")[0].text(), f"{name}: schema headline mismatch"
        assert article["description"] == description, f"{name}: schema description mismatch"
        assert article["author"]["@type"] == "Organization", f"{name}: editorial team should be an organization"
        assert article["dateModified"][:10] == meta["article:modified_time"][:10], f"{name}: modified date mismatch"
        times = [node.attrs["datetime"] for node in doc.find("time")]
        assert article["datePublished"][:10] in times and article["dateModified"][:10] in times, f"{name}: missing visible dates"
        breadcrumb = next(item for item in schemas if item["@type"] == "BreadcrumbList")
        assert breadcrumb["itemListElement"][-1]["item"] == canonical
        assert resolve(urlsplit(article["image"]).path).is_file(), f"{name}: schema image missing"
        assert faq_schema, f"{name}: FAQ schema missing"
    print(f"OK {name}: title {len(title)}, description {len(description)}")

redirects = {}
for line in (ROOT / "_redirects").read_text().splitlines():
    if line and not line.startswith("#"):
        source, target, status = line.split()
        assert source not in redirects, f"Duplicate redirect {source}"
        assert status == "301", f"Non-permanent redirect {source}"
        assert resolve(target).is_file(), f"Missing redirect target {target}"
        redirects[source] = target
for page in pages:
    if page.parent.name == "blog" and page.name != "index.html":
        url = "/" + str(page.relative_to(ROOT))
        assert redirects.get(url) == url[:-5], f"Missing .html redirect for {url}"
assert not set(redirects.values()) & set(redirects), "Redirect chain detected"
print(f"Passed: {len(pages)} pages, {links_checked} local links/assets, {len(sitemap_urls)} sitemap URLs, {len(redirects)} redirects.")
