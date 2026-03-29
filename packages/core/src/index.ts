// =============================================================================
// @evalocity/core — public API
// =============================================================================

export type {
  Eval,
  EvalPrimitive,
  ModelConfig,
  RunResult,
  ScoreFunction,
  Suite,
  SuiteResult,
} from "./types.js";

export type { ModelCaller, RunConfig } from "./runner.js";

export { runSuite } from "./runner.js";
