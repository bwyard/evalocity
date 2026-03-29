// =============================================================================
// @evalocity/metrics — common scoring functions
// Primitive score functions shared across all suite categories.
// All are pure functions: (rawOutput, expectedOutput) => number in [0, 1].
// =============================================================================

import type { ScoreFunction } from "@evalocity/core";

// -----------------------------------------------------------------------------
// exactMatch
// 1.0 if rawOutput exactly equals expectedOutput (trimmed). 0.0 otherwise.
// Use for deterministic, single-answer evals.
// -----------------------------------------------------------------------------
export const exactMatch: ScoreFunction = (
  rawOutput: string,
  expectedOutput: string,
): number => (rawOutput.trim() === expectedOutput.trim() ? 1.0 : 0.0);

// -----------------------------------------------------------------------------
// normalizedMatch
// 1.0 if rawOutput equals expectedOutput after lowercasing + whitespace collapse.
// Use when case and spacing variation is acceptable.
// -----------------------------------------------------------------------------
const normalize = (text: string): string =>
  text.toLowerCase().replace(/\s+/g, " ").trim();

export const normalizedMatch: ScoreFunction = (
  rawOutput: string,
  expectedOutput: string,
): number => (normalize(rawOutput) === normalize(expectedOutput) ? 1.0 : 0.0);

// -----------------------------------------------------------------------------
// containsAll
// 1.0 if rawOutput contains all substrings in expectedOutput (comma-separated).
// Partial credit: fraction of required substrings present.
// Use for evals where the response must mention multiple required items.
// -----------------------------------------------------------------------------
export const containsAll: ScoreFunction = (
  rawOutput: string,
  expectedOutput: string,
): number => {
  const required = expectedOutput.split(",").map((item) => item.trim());
  const lowerOutput = rawOutput.toLowerCase();
  const matchCount = required.filter((item) =>
    lowerOutput.includes(item.toLowerCase()),
  ).length;
  return required.length > 0 ? matchCount / required.length : 0.0;
};

// -----------------------------------------------------------------------------
// containsAny
// 1.0 if rawOutput contains at least one substring from expectedOutput
// (comma-separated). 0.0 if none match.
// Use for evals where any of several valid answers is acceptable.
// -----------------------------------------------------------------------------
export const containsAny: ScoreFunction = (
  rawOutput: string,
  expectedOutput: string,
): number => {
  const candidates = expectedOutput.split(",").map((item) => item.trim());
  const lowerOutput = rawOutput.toLowerCase();
  const anyMatch = candidates.some((item) =>
    lowerOutput.includes(item.toLowerCase()),
  );
  return anyMatch ? 1.0 : 0.0;
};
