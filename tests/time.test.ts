import { test, expect } from "bun:test";
import { nowFormats, detectAndConvert } from "../src/time.js";

test("nowFormats returns consistent representations", () => {
  const d = new Date("2026-07-15T12:00:00.000Z");
  const f = nowFormats(d);
  expect(f.iso).toBe("2026-07-15T12:00:00.000Z");
  expect(f.unix).toBe(1784116800);
  expect(f.unixMs).toBe(1784116800000);
});

test("detectAndConvert: 10-digit unix seconds", () => {
  const c = detectAndConvert("1784116800");
  expect(c.kind).toBe("unix-seconds");
  expect(c.iso).toBe("2026-07-15T12:00:00.000Z");
});

test("detectAndConvert: 13-digit unix millis", () => {
  const c = detectAndConvert("1784116800000");
  expect(c.kind).toBe("unix-millis");
  expect(c.unix).toBe(1784116800);
});

test("detectAndConvert: ISO string", () => {
  const c = detectAndConvert("2026-07-15T12:00:00Z");
  expect(c.kind).toBe("iso");
  expect(c.unix).toBe(1784116800);
});

test("detectAndConvert trims whitespace", () => {
  expect(detectAndConvert("  1784116800  ").unix).toBe(1784116800);
});

test("detectAndConvert returns null for junk", () => {
  expect(detectAndConvert("not a date")).toBeNull();
  expect(detectAndConvert("")).toBeNull();
});

test("nowFormats defaults to the current time and rejects invalid dates", () => {
  expect(nowFormats().unixMs).toBeGreaterThan(0);
  expect(() => nowFormats(new Date("nope"))).toThrow(RangeError);
});

test("detectAndConvert rejects short numbers and year-less text", () => {
  expect(detectAndConvert("5")).toBeNull();
  expect(detectAndConvert("123456")).toBeNull();
  expect(detectAndConvert("Jan 5")).toBeNull();
  expect(detectAndConvert("2026-07-15")?.kind).toBe("iso");
});
