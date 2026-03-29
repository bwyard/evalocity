// =============================================================================
// @evalocity/suite-information — stub
// Information primitive: known vs unknown, precision, uncertainty.
// Thesis claim: Shannon + receiver-relative extension. The same bit string
// carries different information depending on the receiver.
// Evals TBD — Weekend 2+.
// =============================================================================

import type { ModelCaller, Suite } from "@evalocity/core";

export const modelCaller: ModelCaller = async (): Promise<string> => {
  throw new Error("modelCaller not configured.");
};

export const suite: Suite = {
  name:        "information",
  primitive:   "information",
  modelConfig: { provider: "stub", model: "stub" },
  evals:       [],
};
