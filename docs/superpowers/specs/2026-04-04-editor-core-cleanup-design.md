# EmCanvas Editor Core Cleanup Design

## Summary

The next highest-value cleanup work after runtime/package/rendering improvements is in the editor core. `IMPROVEMENTS.md` identifies three high-priority issues that affect correctness and architecture:

1. duplicate `EditorShell` surfaces
2. prop/style edits bypassing undo history
3. inverted dependency from editor persistence to plugin runtime

This phase addresses those three issues only.

## Goal

Make the editor core more coherent by:

- removing or collapsing duplicate editor shell responsibilities
- routing prop/style edits through command history
- introducing a proper persistence port so editor code stops importing plugin runtime adapters directly

## Non-Goals

- New product features
- EmDash upstream changes
- Broad lint/CI/tooling cleanup from the lower-priority backlog

## Scope

### 1. Remove duplicate editor shell ambiguity

The project currently carries two editor-shell concepts:

- `src/foundation/editor/shell/editor-shell.tsx`
- `src/editor/shell/editor-shell.tsx`

This phase should leave only one authoritative shell story.

### 2. Make prop/style edits undoable

`update-props-command.ts` and `update-styles-command.ts` should become real command-history participants, not side helpers that bypass undo/redo.

### 3. Restore correct dependency direction for persistence

Editor code should depend on an abstract persistence port. Plugin/runtime code should provide the concrete implementation.

## Intended Outcome

After this phase:

- there is one clear editor shell architecture
- property and style edits participate in undo/redo
- editor persistence is injected through a port instead of importing plugin runtime directly
