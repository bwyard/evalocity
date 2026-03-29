// =============================================================================
// @evalocity/metrics — public API
// Scoring functions for the 4 thesis primitives.
//
// Each scoreFn is a pure function: (rawOutput, expectedOutput) => number [0,1]
// No side effects. No model calls. Grade only.
// =============================================================================

export { exactMatch, containsAll, containsAny, normalizedMatch } from "./common.js";
