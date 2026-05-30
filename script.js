const yearNode = document.querySelector("[data-year]");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

document.querySelectorAll("[data-local-time]").forEach((node) => {
  const zone = node.getAttribute("data-local-time");
  if (!zone) return;

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: zone,
  });

  node.textContent = formatter.format(new Date());
});
