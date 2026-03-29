// =============================================================================
// @evalocity/core — types
// Core types for Evalocity: Eval, Suite, RunResult.
//
// These are the runner machinery. The thesis primitives (Time, Causality,
// Information, Context) are expressed in the suite taxonomy — not in these
// types directly. However, the structure reflects the thesis:
//   - RunResult is append-only (Time)
//   - scoreFn is a pure function (no mutation)
//   - results form a causal chain: Eval → RunResult (Causality)
//   - input + modelConfig determines what the model can access (Context)
// =============================================================================

// -----------------------------------------------------------------------------
// ScoreFunction
// A pure function that grades a model's raw output against an expected output.
// Returns a score in [0, 1]. 1.0 = full pass. 0.0 = full fail.
// -----------------------------------------------------------------------------
export type ScoreFunction = (
  rawOutput: string,
  expectedOutput: string,
) => number;

// -----------------------------------------------------------------------------
// Eval
// A single test case. Immutable once defined.
//   id          — unique identifier for this eval
//   input       — the prompt sent to the model
//   expectedOutput — what a correct response looks like (used by scoreFn)
//   scoreFn     — pure function grading rawOutput against expectedOutput
//   primitive   — which thesis primitive this eval targets
// -----------------------------------------------------------------------------
export type EvalPrimitive = "time" | "causality" | "information" | "context";

export type Eval = {
  readonly id: string;
  readonly input: string;
  readonly expectedOutput: string;
  readonly scoreFn: ScoreFunction;
  readonly primitive: EvalPrimitive;
};

// -----------------------------------------------------------------------------
// ModelConfig
// Configuration for the model under evaluation.
// Runner-agnostic — the runner resolves how to call the model.
// -----------------------------------------------------------------------------
export type ModelConfig = {
  readonly provider: string;
  readonly model: string;
  readonly temperature?: number;
  readonly maxTokens?: number;
};

// -----------------------------------------------------------------------------
// Suite
// A named collection of Evals targeting a specific primitive.
// All evals in a suite should share the same primitive.
// -----------------------------------------------------------------------------
export type Suite = {
  readonly name: string;
  readonly primitive: EvalPrimitive;
  readonly modelConfig: ModelConfig;
  readonly evals: ReadonlyArray<Eval>;
};

// -----------------------------------------------------------------------------
// RunResult
// The immutable result of running a single Eval. Append-only — never mutated.
//   evalId      — references the Eval that produced this result
//   score       — 0.0 to 1.0
//   pass        — score >= passThreshold (default 0.8)
//   latencyMs   — wall-clock time for the model call
//   rawOutput   — the model's verbatim response
//   error       — set if the model call failed; score will be 0
// -----------------------------------------------------------------------------
export type RunResult = {
  readonly evalId: string;
  readonly score: number;
  readonly pass: boolean;
  readonly latencyMs: number;
  readonly rawOutput: string;
  readonly error?: string;
};

// -----------------------------------------------------------------------------
// SuiteResult
// The immutable result of running a full Suite. Append-only.
// -----------------------------------------------------------------------------
export type SuiteResult = {
  readonly suiteName: string;
  readonly primitive: EvalPrimitive;
  readonly results: ReadonlyArray<RunResult>;
  readonly passCount: number;
  readonly failCount: number;
  readonly totalScore: number;
  readonly averageScore: number;
  readonly totalLatencyMs: number;
};
