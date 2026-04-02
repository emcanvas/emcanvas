# Spec — Define EmCanvas Product

## Requirements

### 1. Product identity
EmCanvas must be defined as a visual page builder for EmDash delivered as an external plugin.

### 2. Integration model
The product must use entry-level takeover rather than content-type takeover.

### 3. Layout persistence
The layout document must be stored in `entry.data` so it benefits from existing revision and preview behavior.

### 4. Editor model
The editor must be defined as a dedicated canvas application rather than an extension of rich text editing.

### 5. Rendering model
The frontend must be defined around server-side rendering with integration into existing EmDash templates.

### 6. MVP boundaries
The MVP must be explicitly bounded to a small base widget set and a closed edit-preview-publish loop.

### 7. Architectural decisions
Core tradeoffs and rejected alternatives must be captured as ADRs.

## Acceptance Signals

- The repository contains a readable product specification set.
- The repository contains ADRs for the major architectural decisions.
- The repository contains standard OpenSpec project/change artifacts.
- Future implementation can start from this contract without redefining product scope.
