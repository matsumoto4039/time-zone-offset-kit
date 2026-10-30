# time-zone-offset-kit

Formats a signed UTC offset in minutes into ISO 8601 extended format (`+08:00`, `-05:30`). Zero dependencies, ESM only.

```js
import { formatOffset } from 'time-zone-offset-kit';

formatOffset(480);   // "+08:00"
formatOffset(-330);  // "-05:30"
formatOffset(0);     // "+00:00"
```

The package exports a single function, `formatOffset`, which takes an integer number of minutes and returns a string. Positive means east of UTC, negative means west.

## Why this exists

Working with time-zone offsets usually means calling `getTimezoneOffset()` and then hand-rolling a string with `Math.abs`, padding, and a sign check. That code is small but easy to get wrong — sign confusion and missing zero-padding are the two recurring bugs. This library does that one conversion and nothing else.

The trade-off: it is a pure formatter, not a validator. It will happily render `+15:00` or `+23:59`, which are outside the real-world range of ±14:00. If you need range validation, check before calling.

## The awkward edge

A zero offset is returned as `+00:00`, not `Z`. Both are valid ISO 8601, but mixing them breaks string comparisons. If you need `Z`, replace it yourself after formatting.

Non-integer inputs (e.g. `90.5`) throw a `TypeError`. ISO 8601 offsets have no sub-minute component.
