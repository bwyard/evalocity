#!/usr/bin/env node
// =============================================================================
// @evalocity/cli — bin entrypoint
// evalocity run <suite-file>
//
// Usage:
//   evalocity run packages/suites/context-basic/src/index.ts
//
// The suite file must export a default Suite and a default ModelCaller.
// =============================================================================

import { runSuite } from "@evalocity/core";
import type { ModelCaller, Suite } from "@evalocity/core";
import { formatSuiteJson, formatSuiteTable } from "@evalocity/reporter";
import { resolve } from "path";
import { pathToFileURL } from "url";

const printUsage = (): void => {
  process.stdout.write(
    [
      "",
      "  evalocity run <suite-file> [--json]",
      "",
      "  suite-file   Path to a .js suite file exporting { suite, modelCaller }",
      "  --json       Output JSON instead of table",
      "",
    ].join("\n"),
  );
};

const main = async (): Promise<void> => {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command !== "run" || args.length < 2) {
    printUsage();
    process.exit(1);
  }

  const suiteFilePath = args[1];
  const outputJson    = args.includes("--json");

  if (!suiteFilePath) {
    printUsage();
    process.exit(1);
  }

  const absolutePath = pathToFileURL(resolve(suiteFilePath)).href;

  const suiteModule = (await import(absolutePath)) as {
    suite: Suite;
    modelCaller: ModelCaller;
  };

  if (!suiteModule.suite || !suiteModule.modelCaller) {
    process.stderr.write(
      `Error: suite file must export { suite, modelCaller }\n`,
    );
    process.exit(1);
  }

  const suiteResult = await runSuite(suiteModule.suite, suiteModule.modelCaller);

  if (outputJson) {
    process.stdout.write(formatSuiteJson(suiteResult) + "\n");
  } else {
    process.stdout.write(formatSuiteTable(suiteResult));
  }

  const exitCode = suiteResult.failCount > 0 ? 1 : 0;
  process.exit(exitCode);
};

main().catch((error: unknown) => {
  process.stderr.write(
    `Unexpected error: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
