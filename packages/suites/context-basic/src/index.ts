// =============================================================================
// @evalocity/suite-context-basic
// Context primitive — basic context window reasoning.
//
// Thesis claim being tested:
//   Context (K): a receiver function K: (receiver, message) → extractable_information
//   that determines what information is actually accessible.
//
// This suite tests the simplest version: given information explicitly present
// in the context window, does the model use it correctly?
//
// A model that fails these evals cannot claim to understand the Context
// primitive — it cannot reliably use information it has been given.
// =============================================================================

import type { Eval, ModelCaller, Suite } from "@evalocity/core";
import { containsAll, exactMatch, normalizedMatch } from "@evalocity/metrics";

// -----------------------------------------------------------------------------
// Evals
// Each eval targets one aspect of basic context window utilization.
// -----------------------------------------------------------------------------

const recallExplicitFact: Eval = {
  id:             "context-basic-001",
  primitive:      "context",
  input:          "The project codename is Aurora. The launch date is March 15. What is the project codename?",
  expectedOutput: "Aurora",
  scoreFn:        normalizedMatch,
};

const recallMultipleFacts: Eval = {
  id:             "context-basic-002",
  primitive:      "context",
  input:          "User profile: name=Sam, role=admin, region=EU. List the user's name, role, and region.",
  expectedOutput: "Sam, admin, EU",
  scoreFn:        containsAll,
};

const ignoreIrrelevantContext: Eval = {
  id:             "context-basic-003",
  primitive:      "context",
  input: [
    "The sky is blue. The grass is green. The API key is abc-123.",
    "Cats are mammals. The ocean is deep.",
    "What is the API key?",
  ].join(" "),
  expectedOutput: "abc-123",
  scoreFn:        exactMatch,
};

const distinguishContextFromPriorKnowledge: Eval = {
  id:    "context-basic-004",
  primitive: "context",
  input: [
    "For this conversation, assume the capital of France is Lyon.",
    "According to the information provided, what is the capital of France?",
  ].join(" "),
  expectedOutput: "Lyon",
  scoreFn:        normalizedMatch,
};

const absentContextReturnsUncertain: Eval = {
  id:             "context-basic-005",
  primitive:      "context",
  input:          "What is the user's account balance?",
  expectedOutput: "not provided,unknown,don't have,no information",
  scoreFn:        containsAll,
};

// -----------------------------------------------------------------------------
// modelCaller stub
// Replace with a real model caller for live runs.
// HARDWARE BOUNDARY — this is where the model API call happens.
// -----------------------------------------------------------------------------
export const modelCaller: ModelCaller = async (
  _input: string,
  _modelConfig,
): Promise<string> => {
  throw new Error(
    "modelCaller not configured — provide a real ModelCaller to run this suite against a model.",
  );
};

// -----------------------------------------------------------------------------
// suite
// Exported as default for CLI runner: evalocity run packages/suites/context-basic/dist/index.js
// -----------------------------------------------------------------------------
export const suite: Suite = {
  name:        "context-basic",
  primitive:   "context",
  modelConfig: {
    provider:    "stub",
    model:       "stub",
    temperature: 0,
    maxTokens:   256,
  },
  evals: [
    recallExplicitFact,
    recallMultipleFacts,
    ignoreIrrelevantContext,
    distinguishContextFromPriorKnowledge,
    absentContextReturnsUncertain,
  ],
};
