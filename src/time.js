// Pure timestamp helpers — no vscode dependency, unit-testable.

function build(kind, date) {
  return {
    kind,
    iso: date.toISOString(),
    unix: Math.floor(date.getTime() / 1000),
    unixMs: date.getTime(),
    human: date.toUTCString(),
  };
}

/** All representations of a given moment (defaults to `date`). */
function nowFormats(date = new Date()) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new RangeError("stamp: invalid date");
  }
  return build("now", date);
}

/**
 * Detect what a selected string is (10-digit unix seconds, 13-digit unix millis,
 * or an ISO/parseable date) and return every representation. null if unparseable.
 */
function detectAndConvert(input) {
  const s = String(input).trim();
  if (/^\d{10}$/.test(s)) return build("unix-seconds", new Date(Number(s) * 1000));
  if (/^\d{13}$/.test(s)) return build("unix-millis", new Date(Number(s)));
  // Date.parse is lenient (e.g. "5" or "Jan 5" parse as year 2001): require a 4-digit year
  // and refuse bare numbers, which are not Unix lengths we recognise.
  if (/^[+-]?\d+(\.\d+)?$/.test(s) || !/\d{4}/.test(s)) return null;
  const t = Date.parse(s);
  if (!Number.isNaN(t)) return build("iso", new Date(t));
  return null;
}

module.exports = { nowFormats, detectAndConvert };
