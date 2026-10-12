const DAY = 86400000;

// UTC is used for calendar arithmetic only, not to convert an alarm time.
export function previewRotation(startDate, workDays, restDays, count = 30) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) throw new RangeError("Choose a valid start date.");
  const start = new Date(`${startDate}T00:00:00Z`);
  if (!Number.isFinite(start.getTime()) || start.toISOString().slice(0, 10) !== startDate || start.getUTCFullYear() < 1) {
    throw new RangeError("Choose a valid start date.");
  }
  if (![workDays, restDays].every((n) => Number.isInteger(n) && n >= 1 && n <= 60)) {
    throw new RangeError("Use whole numbers from 1 to 60 for work and rest days.");
  }
  if (!Number.isInteger(count) || count < 1 || count > 90) throw new RangeError("Choose 1 to 90 preview days.");
  const end = new Date(start.getTime() + (count - 1) * DAY);
  if (end.getUTCFullYear() > 9999) throw new RangeError("Choose an earlier start date.");
  return Array.from({ length: count }, (_, index) => ({
    date: new Date(start.getTime() + index * DAY).toISOString().slice(0, 10),
    work: index % (workDays + restDays) < workDays,
  }));
}

if (typeof document !== "undefined") {
  const form = document.querySelector("[data-rotation-form]");
  if (form) {
    const summary = document.querySelector("[data-rotation-summary]");
    const grid = document.querySelector("[data-rotation-days]");
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", weekday: "short", timeZone: "UTC" });
    const render = () => {
      if (!form.reportValidity()) return;
      try {
        const data = new FormData(form);
        const workDays = Number(data.get("work-days"));
        const restDays = Number(data.get("rest-days"));
        const time = data.get("alarm-time");
        const days = previewRotation(data.get("start-date"), workDays, restDays);
        const items = days.map(({ date, work }) => {
          const item = document.createElement("li");
          item.className = work ? "rotation-day is-work" : "rotation-day";
          const label = document.createElement("time");
          label.dateTime = date;
          label.textContent = formatter.format(new Date(`${date}T00:00:00Z`));
          const status = document.createElement("span");
          status.textContent = work ? `Work · ${time}` : "Rest · no alarm";
          item.append(label, status);
          return item;
        });
        grid.replaceChildren(...items);
        const workCount = days.filter((day) => day.work).length;
        summary.textContent = `${workDays} work / ${restDays} rest, repeating every ${workDays + restDays} calendar days. First 30 days: ${workCount} work days and ${30 - workCount} rest days. Times are local to your schedule.`;
      } catch (error) {
        grid.replaceChildren();
        summary.textContent = error.message;
      }
    };
    form.hidden = false;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      render();
    });
    render();
  }
}
