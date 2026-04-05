# EmCanvas Package Surface Consistency Design

## Summary

After multiple runtime, tooling, and renderer phases, the package surface still has a few structural inconsistencies from `IMPROVEMENTS.md`:

- `private` + publish-style metadata need a coherent stance
- `sandbox-entry.ts` may still be a weak passthrough surface
- basic package scripts are not fully honest about supported day-to-day maintenance workflows

This phase is not about changing product behavior. It is about making the package and its public surfaces internally coherent.

## Goal

Establish a coherent package contract by:

- aligning `package.json` metadata and scripts
- clarifying the sandbox entry contract
- removing low-grade ambiguity in how the repo is packaged and maintained

## Non-Goals

- publishing to npm
- changing runtime/plugin behavior beyond clarifying surfaces
- feature work

## Intended Outcome

After this phase:

- package metadata no longer contradicts itself
- `sandbox-entry.ts` has a justified contract or is reduced appropriately
- baseline maintenance scripts are honest and tested
