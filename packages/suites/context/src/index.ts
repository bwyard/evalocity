// =============================================================================
// @evalocity/suite-context — stub
// Context primitive: advanced context reasoning (multi-turn, conflicting context,
// context window limits, receiver-relative information).
// Thesis claim: K: (receiver, message) → extractable_information.
// context-basic covers the simplest cases. This suite covers advanced scenarios.
// Evals TBD — Weekend 3+.
// =============================================================================

import type { ModelCaller, Suite } from "@evalocity/core";

export const modelCaller: ModelCaller = async (): Promise<string> => {
  throw new Error("modelCaller not configured.");
};

export const suite: Suite = {
  name:        "context",
  primitive:   "context",
  modelConfig: { provider: "stub", model: "stub" },
  evals:       [],
};
