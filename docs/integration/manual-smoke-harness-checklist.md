# EmCanvas manual smoke checklist

Use this checklist after running the seeded scenario and playbook in the real local EmDash host.

| Check                      | Expected outcome                                                                          | Traceability                                                                                            |
| -------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| editor mount               | The real EmCanvas editor page opens for the seeded entry.                                 | `tests/integration/admin-editor-publish-flow.test.tsx`                                                  |
| takeover enabled state     | The entry shows takeover enabled once EmCanvas owns the saved payload.                    | `tests/integration/admin-editor-publish-flow.test.tsx`, `tests/integration/entry-takeover-flow.test.ts` |
| persisted heading mutation | Publishing changes the saved heading from `Welcome` to `Published heading`.               | `tests/integration/admin-editor-publish-flow.test.tsx`                                                  |
| preview URL generation     | Preview resolves through the EmDash preview route with `source=emcanvas`.                 | `tests/integration/preview-and-publish-flow.test.ts`                                                    |
| rendered published markup  | Preview renders EmCanvas markup containing the published heading.                         | `tests/integration/preview-and-publish-flow.test.ts`                                                    |
| reopen coherence           | Re-opening the same entry preserves takeover metadata and the latest saved heading state. | `tests/integration/entry-takeover-flow.test.ts`, `tests/integration/admin-editor-publish-flow.test.tsx` |

## Boundary reminder

- This checklist validates EmCanvas payload persistence, takeover state, preview URL generation, and rendered markup.
- It does not validate final site deployment, cache invalidation, or downstream EmDash publishing pipelines.
