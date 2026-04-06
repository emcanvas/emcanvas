# EmCanvas Docker Local Host Smoke Design

## Summary

This phase adds a reproducible local-host smoke environment around the existing manual harness, not a new product surface. The goal is to bootstrap a local EmDash host through Docker, seed one deterministic `home` / `Homepage` entry, keep `pnpm smoke` as the repo-local preflight, and state clearly which steps still depend on host assets outside this repository.

## Goal

Define a bounded Docker-based smoke workflow that:

- starts a local EmDash host without modifying upstream EmDash
- seeds the known `home` / `Homepage` scenario from the existing fixture shape
- reuses `pnpm smoke` plus the canonical harness docs as the verification entrypoint
- documents explicit automation boundaries for anything this repo cannot own alone

## Non-Goals

- changing editor, renderer, plugin, or host runtime behavior
- replacing `pnpm smoke` with browser automation or a full E2E suite
- automating generic EmDash publishing, auth, or deployment flows
- vendoring or patching upstream EmDash into this repository

## Technical Approach

The Docker layer should be a thin bootstrap wrapper around the current manual smoke contract. `pnpm smoke` remains the first step and still verifies the bounded documentation preflight. The new environment then starts a local EmDash host container configured to consume the local EmCanvas package, runs one deterministic seed operation using the same document shape as `createFixtureDocument()` plus `createFixtureHeadingNode('Welcome')`, and hands off to the operator playbook for the real-host edit/publish/preview/reopen pass.

## Architecture Decisions

| Decision               | Choice                                                                       | Alternatives considered                              | Rationale                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Host bootstrap surface | Dockerized local EmDash wrapper owned by this repo                           | Bare manual host setup; standalone demo app          | The approved direction is reproducible local-host smoke while preserving the real EmDash integration loop. |
| Seed contract          | Reuse the existing `home` / `Homepage` scenario and fixture-derived document | Add multiple entries or richer fixtures              | One deterministic entry keeps smoke assertions stable and aligned with current docs/tests.                 |
| Smoke entrypoint       | Keep `pnpm smoke` as preflight; Docker flow layers on top                    | Replace `pnpm smoke`; hide docs behind a new command | Current repo guidance already treats `pnpm smoke` as bounded preflight and canonical doc index.            |
| Automation boundary    | Explicitly require external host/image inputs when needed                    | Pretend full repo-only automation is possible        | EmDash application assets, runtime config, and host credentials are not fully owned by this repository.    |

## Data Flow

```text
pnpm smoke
  -> verify canonical manual harness docs
  -> start Dockerized local EmDash host
  -> host loads local EmCanvas package
  -> seed entry: slug=home, title=Homepage, heading=Welcome
  -> operator edits heading to Published heading
  -> Publish persists canvasLayout + _emcanvas
  -> preview route renders published EmCanvas markup
  -> re-open confirms saved takeover state
```

## File Changes

| File                                                                  | Action | Description                                                                             |
| --------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------- |
| `docs/superpowers/specs/2026-04-05-docker-local-host-smoke-design.md` | Create | Approved design for the Docker bootstrap phase.                                         |
| `docs/integration/emdash-local-validation.md`                         | Modify | Future update to link the Docker bootstrap flow beside `pnpm smoke`.                    |
| `docs/integration/manual-smoke-harness-*.md`                          | Modify | Future narrowing so the manual playbook references the Docker-backed bootstrap path.    |
| `docker/` or compose/bootstrap assets                                 | Create | Future bounded local-host bootstrap definitions owned by EmCanvas, not EmDash upstream. |
| `scripts/` seed/bootstrap helpers                                     | Create | Future deterministic seed helpers that encode the known scenario only.                  |

## Interfaces / Contracts

- **Bootstrap contract**: a Docker entrypoint starts a local EmDash host that consumes the local EmCanvas package without modifying upstream host code.
- **Seed contract**: the seeded entry must remain `slug: home`, `title: Homepage`, initial heading `Welcome`, published heading `Published heading`, derived from `tests/fixtures/document-factory.ts`.
- **Usage contract**: operators run `pnpm smoke` first, then the Docker bootstrap, then the existing real-host playbook/checklist.
- **Boundary contract**: this repo can automate EmCanvas-owned bootstrap assets and deterministic seed data, but cannot fully own external EmDash application source, container image provenance, admin credentials, or host-specific runtime secrets unless those are supplied from outside the repo.

## Testing Strategy

| Layer             | What to Test                                                  | Approach                                                                         |
| ----------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Contract          | Docker smoke docs stay bounded to one host scenario           | Add/update docs/command contract tests alongside existing `pnpm smoke` coverage. |
| Seed determinism  | Bootstrap always creates the same `home` / `Homepage` payload | Test the future seed helper against fixture-derived document output.             |
| Manual host smoke | Real edit/publish/preview/reopen loop                         | Execute the existing checklist against the Dockerized host environment.          |

## Migration / Rollout

No migration required. Rollout is additive: first document the Docker bootstrap contract, then implement the bootstrap assets, then update local-validation guidance once the bounded flow exists.

## Open Questions

- [ ] Should the future Docker flow depend on a caller-provided EmDash image/tag, or on a sibling local EmDash checkout mounted at runtime?
- [ ] Can entry seeding be performed through stable host APIs alone, or will the phase need a documented one-time manual admin/auth step before the smoke pass?
