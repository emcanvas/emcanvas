# EmCanvas Public API Barrels Design

## Summary

`IMPROVEMENTS.md` marks the lack of per-layer `index.ts` barrels as a structural weakness. Consumers and tests still import many internal file paths directly, which makes future reorganization noisy and brittle.

This phase introduces explicit barrel files for the main layers and migrates a focused set of consumers to use those public APIs.

## Goal

Create stable public entry surfaces for the major internal layers:

- foundation
- editor
- renderer
- admin

## Non-Goals

- repo-wide codemod of every import
- major directory moves
- feature work

## Design Principles

1. **Barrels expose only intended public API**
2. **No giant dump barrels**
3. **Migrate a focused slice first**
4. **Keep path aliases and barrels complementary**

## Intended Outcome

After this phase:

- each major layer has an `index.ts`
- selected imports use those barrels instead of deep internals
- future reorgs have fewer import blast radiuses
