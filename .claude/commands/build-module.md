# /build-module — Build one planned module into the course player

Argument: a module ID (e.g. `M05`). Referred to below as $ARGUMENTS.

## Preconditions

- `plans/$ARGUMENTS.plan.md` exists and the human has reviewed it. If it doesn't exist, stop and
  tell the human to run `/plan-module $ARGUMENTS` first.
- The module is not already present in `course/index.html` (search for `id: "$ARGUMENTS"`).
  If present, stop and ask whether to replace it.

## Steps

1. Read the plan, `CLAUDE.md`, and the module schema in `templates/module.schema.json`.
2. Read M00 in `course/index.html` as the style reference — match its HTML patterns, class
   names, SVG conventions, and lab markup exactly.
3. Compose the module object as a JS snippet:
   - Fields: `id`, `track`, `title`, `minutes`, `audience`, `body` (template literal).
   - Escape backticks and `${` inside the body.
   - The snippet must end with a trailing comma.
4. Inject via a Python script immediately before `/* {{MODULE_INJECTION_POINT}} */` — never
   rewrite the file wholesale, never edit by hand.
5. Gate: extract the `<script>` body to a temp `.js` file and run `node --check` on it. If it
   fails, fix and re-run until clean.
6. Report: module injected, gate passed, and remind the human to run `/build-lab $ARGUMENTS`.

## Rules

- Follow the plan. If you must deviate, state each deviation and why in the report.
- One SVG visual minimum. All colors via CSS variables. `viewBox` set, no fixed width/height.
- Lab section markup must use the `.lab`, `.path`, and `.engine-tabs` components exactly as M00 does.
- Never touch other modules' objects or the render engine while injecting.
