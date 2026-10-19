const search = document.querySelector(".guide-search");
if (search) {
  const query = search.querySelector("input");
  const topic = search.querySelector("select");
  const rows = [...document.querySelectorAll(".guide-row")];
  const count = document.querySelector("[data-guide-count]");
  const empty = document.querySelector(".guide-empty");
  const filter = () => {
    const words = query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    for (const row of rows) {
      const text = row.textContent.toLocaleLowerCase();
      const match = (topic.value === "all" || row.dataset.topic === topic.value) && words.every((word) => text.includes(word));
      row.hidden = !match;
      if (match) visible += 1;
    }
    count.textContent = `${visible} ${visible === 1 ? "guide" : "guides"}`;
    empty.hidden = visible > 0;
  };
  search.hidden = false;
  search.addEventListener("input", filter);
  search.addEventListener("change", filter);
  search.addEventListener("submit", (event) => event.preventDefault());
}

const contents = document.querySelector(".toc details");
if (contents) {
  const narrow = matchMedia("(max-width: 799px)");
  const sizeContents = () => { contents.open = !narrow.matches; };
  sizeContents();
  narrow.addEventListener("change", sizeContents);
  const links = [...contents.querySelectorAll('a[href^="#"]')];
  const sections = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter(Boolean);
  let frame = 0;
  const updateContents = () => {
    frame = 0;
    const active = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= 180) || sections[0];
    for (const link of links) {
      if (active && link.hash === `#${active.id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  };
  addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(updateContents);
  }, { passive: true });
  updateContents();
}
