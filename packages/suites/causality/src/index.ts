// =============================================================================
// @evalocity/suite-causality — stub
// Causality primitive: cause→effect, append-only, retroactive mutation failure modes.
// Thesis claim: explicit T reveals causal structure as a poset (≺).
// Evals TBD — Weekend 2+.
// =============================================================================

import type { ModelCaller, Suite } from "@evalocity/core";

export const modelCaller: ModelCaller = async (): Promise<string> => {
  throw new Error("modelCaller not configured.");
};

export const suite: Suite = {
  name:        "causality",
  primitive:   "causality",
  modelConfig: { provider: "stub", model: "stub" },
  evals:       [],
};
