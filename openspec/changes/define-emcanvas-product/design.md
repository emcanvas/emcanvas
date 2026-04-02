# Design — Define EmCanvas Product

## Approach

Use a dual-layer documentation model:

1. `spec/` for detailed narrative product and architecture documents.
2. `openspec/` for standardized operational artifacts.

## Main Concepts

- Product definition lives separately from implementation planning.
- EmDash is treated as host platform and integration surface.
- EmCanvas owns the canvas UX, layout model, widget system, and renderer contract.

## Boundaries

- No implementation code is authored in this phase.
- No detailed engineering breakdown is committed beyond future-oriented placeholders.

## Artifact Mapping

- `spec/*.md` → source reference documents
- `spec/adr/*.md` → decision history
- `proposal.md` → intent and scope
- `spec.md` → requirements
- `design.md` → structural approach
- `tasks.md` → deferred next-stage planning entry point
