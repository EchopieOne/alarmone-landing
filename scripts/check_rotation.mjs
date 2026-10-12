import assert from "node:assert/strict";
import { previewRotation } from "../rotation-preview.mjs";

const rota = previewRotation("2026-10-12", 4, 4);
assert.equal(rota[0].date, "2026-10-12");
assert.deepEqual(rota.slice(0, 8).map((day) => day.work), [true, true, true, true, false, false, false, false]);
assert.deepEqual(rota[8], { date: "2026-10-20", work: true });
assert.equal(rota.filter((day) => day.work).length, 16);

// Alternate-day alarms must cross week, month, leap-year, and DST boundaries
// without dropping or duplicating calendar dates.
assert.deepEqual(previewRotation("2028-02-28", 1, 1, 3), [
  { date: "2028-02-28", work: true },
  { date: "2028-02-29", work: false },
  { date: "2028-03-01", work: true },
]);
assert.equal(previewRotation("2026-12-31", 1, 1, 3)[2].date, "2027-01-02");
for (const start of ["2026-03-07", "2026-10-31"]) {
  const days = previewRotation(start, 1, 1);
  assert.equal(new Set(days.map((day) => day.date)).size, 30);
  assert.equal(days.filter((day) => day.work).length, 15);
}
for (const start of ["2026-02-29", "2026-02-30", "invalid", "0000-01-01", "9999-12-31"]) {
  assert.throws(() => previewRotation(start, 4, 4), RangeError);
}
for (const work of [0, -1, 1.5, NaN, 61]) assert.throws(() => previewRotation("2026-10-12", work, 4), RangeError);
assert.throws(() => previewRotation("2026-10-12", 4, 0), RangeError);
assert.throws(() => previewRotation("2026-10-12", 4, 4, 0), RangeError);
assert.throws(() => previewRotation("2026-10-12", 4, 4, 91), RangeError);
console.log("Passed: rotation examples, leap year, year change, DST calendar dates, and invalid inputs.");
