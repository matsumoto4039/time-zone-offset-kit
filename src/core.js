/**
 * Formats a UTC offset given as a total number of minutes into ISO 8601
 * extended format (e.g. "+08:00", "-05:30").
 *
 * Interpretation decisions (stated plainly):
 *
 * 1. The input is a signed integer count of minutes east of UTC. Positive
 *    means east (ahead of UTC), negative means west (behind UTC). This
 *    matches the sign convention used by `Date.prototype.getTimezoneOffset`,
 *    which returns minutes *behind* UTC as a positive number — callers must
 *    negate that value before passing it here. We document this rather than
 *    silently flipping the sign, because silent sign flips are the kind of
 *    bug that ships to production unnoticed.
 *
 * 2. The offset 0 is rendered as "+00:00", not "Z". The ISO 8601 standard
 *    permits either, but mixing the two in a single codebase leads to
 *    inconsistent string comparisons downstream. Always emitting the
 *    signed form keeps output predictable.
 *
 * 3. Inputs whose hours or minutes exceed the normal ±14:00 real-world
 *    range are still formatted. This library is a formatter, not a
 *    validator — rejecting 15:00 would surprise callers who legitimately
 *    construct synthetic offsets for testing or historical zones. The
 *    only hard constraint is that minutes must be an integer; non-integer
 *    values are rejected because ISO 8601 has no sub-minute offsets.
 *
 * @param {number} totalMinutes - Signed offset in minutes from UTC.
 * @returns {string} Offset in ISO 8601 extended format.
 * @throws {TypeError} If totalMinutes is not a safe integer.
 */
export function formatOffset(totalMinutes) {
  if (typeof totalMinutes !== 'number' || !Number.isSafeInteger(totalMinutes)) {
    throw new TypeError(
      'totalMinutes must be a safe integer; received ' + String(totalMinutes)
    );
  }

  const sign = totalMinutes < 0 ? '-' : '+';
  // Use absolute value so the hours/minutes split is independent of sign.
  const abs = Math.abs(totalMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;

  // Zero-pad both fields to two digits. String concatenation is used
  // instead of padStart to avoid any polyfill concerns in older runtimes
  // (harmless here, but consistent with the zero-dependency ethos).
  const hh = hours < 10 ? '0' + hours : String(hours);
  const mm = minutes < 10 ? '0' + minutes : String(minutes);

  return sign + hh + ':' + mm;
}
