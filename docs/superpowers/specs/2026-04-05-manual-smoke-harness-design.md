# EmCanvas Manual Smoke Harness Design

## Summary

This phase defines a real-host manual smoke harness for EmCanvas inside EmDash, not a standalone demo app. The harness is a reproducible validation flow built from the same editor, takeover, preview, and publish seams already covered by integration tests and release docs.

## Goal

Document one seeded host scenario, one operator playbook, one smoke checklist, and the explicit boundary between EmCanvas publish behavior and final EmDash site publishing.

## Non-Goals

- building a separate demo harness outside EmDash
- changing editor, renderer, or host runtime behavior
- replacing automated integration coverage
- documenting generic CMS publishing flows owned by EmDash

## Technical Approach

The phase stays documentation-first. It reuses the current integration narrative already encoded in `admin-editor-publish-flow`, `entry-takeover-flow`, `preview-and-publish-flow`, and the existing EmDash validation/release checklists. The manual harness will describe how to seed a deterministic entry payload, exercise the real plugin editor in EmDash, publish canvas changes, open preview, and verify persisted takeover state without implying that EmCanvas itself publishes the final website.

## Architecture Decisions

| Decision                  | Choice                                                                      | Alternatives considered                 | Rationale                                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Host validation surface   | Real EmDash host loop                                                       | Standalone demo harness; fake shell app | The approved direction is host-accurate validation, and current plugin/runtime contracts already target EmDash integration points.              |
| Seed data source          | Reuse fixture document shape and known editor scenario                      | Invent a new ad hoc scenario            | `createFixtureDocument()` plus heading mutation already represent the smallest end-to-end publish path with stable assertions.                  |
| Publish semantics wording | Define Publish as persisting `canvasLayout` + `_emcanvas` takeover metadata | Describe it as site deployment          | Source code and release docs show EmCanvas only writes entry payload state; final public publishing remains host-owned behavior.                |
| Checklist scope           | Manual smoke only                                                           | Full QA matrix duplication              | The repo already has automated coverage and release checklists; this phase should provide an operator runbook, not another test suite taxonomy. |

## Data Flow

```text
Seed entry data
  -> EmDash entry opens EmCanvas editor
  -> editor loads canvasLayout + _emcanvas
  -> operator edits heading text
  -> Publish persists canvasLayout + takeover metadata
  -> preview link opens EmDash preview route
  -> EmDash host renders published EmCanvas markup when takeover is valid
```

## File Changes

| File                                                               | Action | Description                                                              |
| ------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------ |
| `docs/superpowers/specs/2026-04-05-manual-smoke-harness-design.md` | Create | Approved phase design and scope boundaries for the manual smoke harness. |

## Interfaces / Contracts

- Seeded scenario contract: one entry with a known slug/title and a minimal heading document derived from `tests/fixtures/document-factory.ts`.
- Operator contract: the playbook must walk through enable/open editor, edit heading text, publish, preview, and re-open verification in the real EmDash host.
- Smoke contract: every step maps back to existing integration expectations — editor mount, takeover enabled state, saved payload mutation, preview URL generation, rendered markup, and reopen coherence.
- Boundary contract: “Publish” in EmCanvas means saving structured entry payload (`canvasLayout`, `_emcanvas`). It does **not** mean final site deployment, cache invalidation, or any downstream host publishing pipeline.

## Testing Strategy

| Layer            | What to Test                                | Approach                                                                                   |
| ---------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Source alignment | Manual harness matches implemented behavior | Cross-reference existing integration tests and validation docs while writing the playbook. |
| Manual smoke     | Real host operator loop                     | Execute the documented seeded scenario in local EmDash once the phase is implemented.      |
| Regression guard | Boundary wording stays explicit             | Keep publish/takeover language aligned with release checklist and integration docs.        |

## Migration / Rollout

No migration required. This phase adds a bounded manual-validation document set for local host checks.

## Open Questions

- [ ] Should the future playbook live under `docs/integration/` beside existing EmDash validation docs, or under a dedicated smoke-harness doc path?
- [ ] Should the seeded scenario be purely manual JSON seeding, or should it later include a reusable helper script as long as it still targets the real EmDash host?
