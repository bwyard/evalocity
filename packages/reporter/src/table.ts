// =============================================================================
// @evalocity/reporter — table
// Human-readable stdout table output for SuiteResult.
// Pure functions — no side effects beyond the returned string.
// =============================================================================

import type { RunResult, SuiteResult } from "@evalocity/core";

const PASS_SYMBOL = "PASS";
const FAIL_SYMBOL = "FAIL";
const COL_WIDTHS  = { evalId: 36, status: 6, score: 7, latency: 10, error: 40 };

const padRight = (text: string, width: number): string =>
  text.length >= width ? text.slice(0, width) : text + " ".repeat(width - text.length);

const padLeft = (text: string, width: number): string =>
  text.length >= width ? text.slice(0, width) : " ".repeat(width - text.length) + text;

const formatRow = (result: RunResult): string => {
  const status  = padRight(result.pass ? PASS_SYMBOL : FAIL_SYMBOL, COL_WIDTHS.status);
  const score   = padLeft((result.score * 100).toFixed(1) + "%", COL_WIDTHS.score);
  const latency = padLeft(result.latencyMs + "ms", COL_WIDTHS.latency);
  const evalId  = padRight(result.evalId, COL_WIDTHS.evalId);
  const error   = result.error ? padRight("ERR: " + result.error, COL_WIDTHS.error) : "";

  return `  ${evalId}  ${status}  ${score}  ${latency}  ${error}`.trimEnd();
};

const formatDivider = (): string =>
  "  " + "-".repeat(
    COL_WIDTHS.evalId + COL_WIDTHS.status + COL_WIDTHS.score + COL_WIDTHS.latency + 6,
  );

const formatHeader = (): string => {
  const evalId  = padRight("EVAL ID", COL_WIDTHS.evalId);
  const status  = padRight("STATUS", COL_WIDTHS.status);
  const score   = padLeft("SCORE", COL_WIDTHS.score);
  const latency = padLeft("LATENCY", COL_WIDTHS.latency);
  return `  ${evalId}  ${status}  ${score}  ${latency}`;
};

// -----------------------------------------------------------------------------
// formatSuiteTable
// Returns a human-readable table string for a SuiteResult.
// Does not write to stdout — caller decides where to send it.
// -----------------------------------------------------------------------------
export const formatSuiteTable = (suiteResult: SuiteResult): string => {
  const lines: string[] = [
    "",
    `Suite: ${suiteResult.suiteName}  [primitive: ${suiteResult.primitive}]`,
    formatDivider(),
    formatHeader(),
    formatDivider(),
    ...suiteResult.results.map(formatRow),
    formatDivider(),
    `  ${suiteResult.passCount}/${suiteResult.results.length} passed` +
      `  avg score: ${(suiteResult.averageScore * 100).toFixed(1)}%` +
      `  total latency: ${suiteResult.totalLatencyMs}ms`,
    "",
  ];

  return lines.join("\n");
};
