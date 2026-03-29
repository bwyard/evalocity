// =============================================================================
// @evalocity/core — runner
// Pure suite runner. Takes a Suite + a model caller, returns a SuiteResult.
// No side effects. The model caller is injected — runner is model-agnostic.
// =============================================================================

import type { Eval, ModelConfig, RunResult, Suite, SuiteResult } from "./types.js";

// -----------------------------------------------------------------------------
// ModelCaller
// Injected function that calls a model and returns its raw output.
// The runner does not know how to call any model directly.
// -----------------------------------------------------------------------------
export type ModelCaller = (
  input: string,
  modelConfig: ModelConfig,
) => Promise<string>;

// -----------------------------------------------------------------------------
// RunConfig
// Optional configuration for a suite run.
// -----------------------------------------------------------------------------
export type RunConfig = {
  readonly passThreshold?: number;
  readonly concurrency?: number;
};

const DEFAULT_PASS_THRESHOLD = 0.8;

// -----------------------------------------------------------------------------
// runEval
// Runs a single Eval against the model. Returns an immutable RunResult.
// Pure function — all state is in the return value.
// -----------------------------------------------------------------------------
const runEval = async (
  evalCase: Eval,
  modelConfig: ModelConfig,
  modelCaller: ModelCaller,
  passThreshold: number,
): Promise<RunResult> => {
  const startTime = Date.now();

  try {
    const rawOutput = await modelCaller(evalCase.input, modelConfig);
    const latencyMs = Date.now() - startTime;
    const score = evalCase.scoreFn(rawOutput, evalCase.expectedOutput);
    const pass = score >= passThreshold;

    return {
      evalId:    evalCase.id,
      score,
      pass,
      latencyMs,
      rawOutput,
    };
  } catch (thrownError) {
    const latencyMs = Date.now() - startTime;
    const errorMessage =
      thrownError instanceof Error ? thrownError.message : String(thrownError);

    return {
      evalId:    evalCase.id,
      score:     0,
      pass:      false,
      latencyMs,
      rawOutput: "",
      error:     errorMessage,
    };
  }
};

// -----------------------------------------------------------------------------
// buildSuiteResult
// Assembles a SuiteResult from a completed set of RunResults. Pure function.
// -----------------------------------------------------------------------------
const buildSuiteResult = (
  suite: Suite,
  results: ReadonlyArray<RunResult>,
): SuiteResult => {
  const passCount      = results.filter((result) => result.pass).length;
  const failCount      = results.length - passCount;
  const totalScore     = results.reduce((sum, result) => sum + result.score, 0);
  const averageScore   = results.length > 0 ? totalScore / results.length : 0;
  const totalLatencyMs = results.reduce((sum, result) => sum + result.latencyMs, 0);

  return {
    suiteName:    suite.name,
    primitive:    suite.primitive,
    results,
    passCount,
    failCount,
    totalScore,
    averageScore,
    totalLatencyMs,
  };
};

// -----------------------------------------------------------------------------
// runSuite
// Runs all evals in a Suite sequentially (concurrency=1 default for w1).
// Returns an immutable SuiteResult. Pure function — no global state.
// -----------------------------------------------------------------------------
export const runSuite = async (
  suite: Suite,
  modelCaller: ModelCaller,
  runConfig: RunConfig = {},
): Promise<SuiteResult> => {
  const passThreshold = runConfig.passThreshold ?? DEFAULT_PASS_THRESHOLD;

  const results: RunResult[] = [];

  for (const evalCase of suite.evals) {
    const result = await runEval(
      evalCase,
      suite.modelConfig,
      modelCaller,
      passThreshold,
    );
    results.push(result);
  }

  return buildSuiteResult(suite, results);
};
