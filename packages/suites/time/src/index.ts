// =============================================================================
// @evalocity/suite-time — stub
// Time primitive: temporal ordering, gap reasoning, sequence.
// Thesis claim: immutability forces T to be explicit in the data model.
// Evals TBD — Weekend 2+.
// =============================================================================

import type { ModelCaller, Suite } from "@evalocity/core";

export const modelCaller: ModelCaller = async (): Promise<string> => {
  throw new Error("modelCaller not configured.");
};

export const suite: Suite = {
  name:        "time",
  primitive:   "time",
  modelConfig: { provider: "stub", model: "stub" },
  evals:       [],
};
