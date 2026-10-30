import { test } from 'node:test';
import assert from 'node:assert/strict';

import { formatOffset } from '../src/core.js';

test('positive whole-hour offset', () => {
  assert.equal(formatOffset(480), '+08:00');
});

test('negative whole-hour offset', () => {
  assert.equal(formatOffset(-300), '-05:00');
});

test('positive offset with minutes', () => {
  assert.equal(formatOffset(330), '+05:30');
});

test('negative offset with minutes', () => {
  assert.equal(formatOffset(-210), '-03:30');
});

test('zero offset is plus-zero, not Z', () => {
  assert.equal(formatOffset(0), '+00:00');
});

test('single-digit hours and minutes are zero-padded', () => {
  assert.equal(formatOffset(65), '+01:05');
  assert.equal(formatOffset(-65), '-01:05');
});

test('exceeds real-world range still formats (formatter, not validator)', () => {
  assert.equal(formatOffset(900), '+15:00');
  assert.equal(formatOffset(-900), '-15:00');
});

test('large positive offset', () => {
  assert.equal(formatOffset(1439), '+23:59');
});

test('large negative offset', () => {
  assert.equal(formatOffset(-1439), '-23:59');
});

test('rejects non-integer input', () => {
  assert.throws(() => formatOffset(90.5), TypeError);
});

test('rejects non-number input', () => {
  assert.throws(() => formatOffset('480'), TypeError);
  assert.throws(() => formatOffset(null), TypeError);
  assert.throws(() => formatOffset(undefined), TypeError);
});

test('rejects unsafe integer', () => {
  assert.throws(() => formatOffset(Number.MAX_SAFE_INTEGER + 1), TypeError);
});
