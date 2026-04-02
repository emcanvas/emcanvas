# EmCanvas OpenSpec Design

## Summary

EmCanvas will define its product and architecture before implementation using a dual-layer documentation strategy:

- `spec/` as the human-readable source of truth for product, architecture, data model, UX flows, MVP scope, roadmap, and ADRs.
- `openspec/` as the operational OpenSpec structure prepared for future build phases.

The initial OpenSpec change is `define-emcanvas-product` and covers only formal product definition, not technical bootstrap or implementation tasks.

## Goals

- Formalize EmCanvas as a visual page builder for EmDash before any code is written.
- Capture already-validated integration constraints from EmDash.
- Preserve architectural decisions in ADRs.
- Prepare a standard OpenSpec layout so future implementation planning can continue without reinterpretation.

## Non-Goals

- Building the plugin scaffold.
- Creating a running editor shell.
- Wiring real APIs or routes.
- Defining detailed implementation tickets.

## Documentation Structure

```text
emcanvas/
├── spec/
│   ├── README.md
│   ├── 01-product-definition.md
│   ├── 02-architecture-overview.md
│   ├── 03-data-model.md
│   ├── 04-entry-takeover-flow.md
│   ├── 05-visual-canvas-system.md
│   ├── 06-component-system.md
│   ├── 07-frontend-renderer.md
│   ├── 08-emdash-integration-layer.md
│   ├── 09-mvp-scope.md
│   ├── 10-phase-roadmap.md
│   └── adr/
└── openspec/
    ├── README.md
    ├── project.md
    └── changes/define-emcanvas-product/
        ├── proposal.md
        ├── spec.md
        ├── design.md
        └── tasks.md
```

## Layer Responsibilities

### `spec/`

- Narrative and reference documentation.
- Self-contained documents, easy to review and link.
- Includes detailed ADRs with rejected alternatives.

### `openspec/`

- Standardized project/change structure.
- Summarizes the approved product definition in operational form.
- Leaves the project ready for later planning and implementation phases.

## Initial OpenSpec Change

### Name

`define-emcanvas-product`

### Scope

- Product definition
- Architecture overview
- Data model
- Entry takeover flow
- Visual canvas system
- Component system
- Frontend rendering approach
- EmDash integration layer
- MVP scope
- Implementation roadmap

### Explicit Exclusions

- Source code
- Bootstrap setup
- CI/testing setup
- Detailed implementation subtasks

## Editorial Rules

- No upstream changes to EmDash.
- Use only verified public integration points.
- Store layout state in `entry.data`.
- Treat EmCanvas as an external plugin, not a fork or first-party extension.
- Keep renderer SSR-friendly and frontend runtime-light.

## Outcome

After this phase, the repo should be ready for a later implementation-planning phase with the product contract already formalized.
