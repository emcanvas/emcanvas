# EmCanvas manual smoke seeded scenario

## Scenario contract

Use exactly one deterministic entry for this harness:

- `slug`: `home`
- `title`: `Homepage`
- initial heading text: `Welcome`
- published heading mutation: `Published heading`

If the entry differs from this contract, the run is outside the bounded harness.

Use `scripts/smoke-seed-local-host.mjs` to send this payload through your caller-supplied seed endpoint. The script requires `EMDASH_SEED_ENDPOINT` and `EMDASH_SEED_TOKEN`.

## Fixture source

Derive the entry document from the same minimal fixture shape used in tests:

- `createFixtureDocument()` provides the minimal document shell.
- `createFixtureHeadingNode()` provides the heading node with `Welcome` as the default text.

### Reference shape

```ts
const document = createFixtureDocument()

document.root.children = [createFixtureHeadingNode('Welcome')]
```

### Seed payload reference

```json
{
  "slug": "home",
  "title": "Homepage",
  "canvasLayout": {
    "version": "<current canvas document version>",
    "root": {
      "id": "root",
      "type": "section",
      "props": {},
      "styles": { "desktop": {} },
      "children": [
        {
          "id": "heading-1",
          "type": "heading",
          "props": {
            "text": "Welcome",
            "level": 2
          },
          "styles": { "desktop": {} },
          "children": []
        }
      ]
    },
    "settings": {}
  }
}
```

## Saved-state signals to verify

After editing and Publish, the same seeded entry should show these signals:

- takeover enabled
- payload persisted with the latest `canvasLayout`
- preview URL available
- rendered heading updated to `Published heading`
- reopen state coherent

## Scope guardrails

- Do not introduce extra widgets, extra entries, or alternate slugs.
- Do not treat generic EmDash publishing steps as part of this scenario.
- Keep the scenario aligned with `tests/integration/admin-editor-publish-flow.test.tsx`, `tests/integration/entry-takeover-flow.test.ts`, and `tests/integration/preview-and-publish-flow.test.ts`.
