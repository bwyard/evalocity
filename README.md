# Evalocity

> Evalocity is a TypeScript LLM evaluation framework organized around 4 theoretical primitives:
> Time, Causality, Information, and Context.
>
> Other eval frameworks measure output quality — how accurate, faithful, or safe a model's
> response is. Evalocity measures comprehension — whether a model correctly reasons about the
> fundamental structures that underlie intelligence itself.
>
> Suites are organized by primitive, not by task. A `suites/causality/` suite does not test
> whether the model is good at coding — it tests whether the model understands that causes
> precede effects and that facts accumulate forward in time.
>
> Apache 2.0. TypeScript-first. Code, not config.

---

## The 4 Primitives

Evalocity's suite taxonomy is derived from the Temporal Assembly thesis — a foundational theory
of computation claiming that Time, Causality, Information, and Context are the minimal sufficient
basis for describing intelligence.

| Primitive | Claim | What Evalocity tests |
|---|---|---|
| **Time** | Intelligence requires ordering events before/after | Does the model correctly sequence events and reason about temporal gaps? |
| **Causality** | Intelligence requires tracing cause → effect | Does the model understand that effects cannot precede causes, and that records are append-only? |
| **Information** | Intelligence requires distinguishing known from unknown | Does the model reason correctly about what it knows vs. what it infers vs. what it cannot know? |
| **Context** | Intelligence requires knowing what is currently accessible | Does the model correctly use context window content and know when context is absent? |

A model can pass every promptfoo eval and still fail an Evalocity suite if it reasons incorrectly
about temporal ordering. Evalocity is measuring something the other tools don't measure.

---

## Packages

| Package | Purpose |
|---|---|
| `@evalocity/core` | `Eval`, `Suite`, `RunResult` types + pure suite runner |
| `@evalocity/metrics` | Scoring functions: `exactMatch`, `normalizedMatch`, `containsAll`, `containsAny` |
| `@evalocity/cli` | CLI runner: `evalocity run <suite-file>` |
| `@evalocity/reporter` | Output: JSON + human-readable stdout table |

## Suites

| Suite | Primitive | Status |
|---|---|---|
| `@evalocity/suite-context-basic` | Context | ✅ w1 — 5 evals |
| `@evalocity/suite-time` | Time | 🔵 stub — Weekend 2 |
| `@evalocity/suite-causality` | Causality | 🔵 stub — Weekend 2 |
| `@evalocity/suite-information` | Information | 🔵 stub — Weekend 3 |
| `@evalocity/suite-context` | Context (advanced) | 🔵 stub — Weekend 3 |

---

## Usage

```bash
pnpm install
pnpm build

# Run the context-basic suite (requires a real modelCaller — see suite file)
node packages/cli/dist/bin.js run packages/suites/context-basic/dist/index.js

# JSON output
node packages/cli/dist/bin.js run packages/suites/context-basic/dist/index.js --json
```

---

## Architecture

Evalocity has two layers:

**Layer 1 — The runner** (`@evalocity/core`): `Eval/Suite/RunResult` types structured as
temporal architecture. `RunResult` is append-only. `scoreFn` is a pure function. Results form
a causal chain: Eval → RunResult.

**Layer 2 — The suite taxonomy**: directly tests model comprehension of the 4 primitives.
This is what makes Evalocity a thesis artifact, not just a utility tool.

---

## Thesis Connection

Evalocity is part of the Temporal Assembly ecosystem alongside Prime (Rust math core),
Score (audio framework), Form (SDF graphics), and Stage (game runtime). Each tool proves
the thesis in a different domain. Evalocity proves it at the model layer:

> If the thesis correctly describes what intelligence requires, then capable models should
> demonstrate comprehension of exactly these 4 primitives — and that comprehension should
> be measurable.

Evalocity makes the thesis **falsifiable at the model layer**.

---

## License

Apache 2.0 — see [LICENSE](LICENSE).

Author: Bree Yard
