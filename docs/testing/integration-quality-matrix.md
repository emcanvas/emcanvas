# Integration quality matrix

| Layer | Command | Gate |
| --- | --- | --- |
| Accessibility | `pnpm vitest run tests/accessibility/canvas-editor.a11y.test.tsx` | Named landmarks, publish controls, live status announcements |
| Performance | `pnpm vitest run tests/performance/layout-payload.test.ts` | Serialized payload stays within the MVP byte budget |
| Host contracts | `pnpm vitest run tests/integration/emdash-contracts.test.ts` | Inconsistent takeover state is normalized before EmDash hooks consume it |
| Core integration | `pnpm vitest run tests/integration/entry-takeover-flow.test.ts tests/integration/preview-and-publish-flow.test.ts tests/integration/admin-editor-publish-flow.test.tsx` | Edit, takeover, preview, publish flows remain intact |

Use focused subsets locally. No build step is required for this matrix.
