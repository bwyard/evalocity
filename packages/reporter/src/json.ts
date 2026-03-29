// =============================================================================
// @evalocity/reporter — json
// JSON serialization for SuiteResult. Pure function — no side effects.
// =============================================================================

import type { SuiteResult } from "@evalocity/core";

// -----------------------------------------------------------------------------
// formatSuiteJson
// Returns a JSON string for a SuiteResult. Pretty-printed.
// Does not write to disk — caller decides where to send it.
// -----------------------------------------------------------------------------
export const formatSuiteJson = (suiteResult: SuiteResult): string =>
  JSON.stringify(suiteResult, null, 2);
