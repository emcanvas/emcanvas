# Error handling

EmCanvas keeps host-facing error handling narrow and predictable:

- `saveCanvasData()` throws `Invalid canvas payload` when the document contract or `_emcanvas` metadata contract is broken.
- `CanvasEditorPage` maps load and publish failures through `mapPluginApiError()` and announces the result through the live publish status.
- Invalid takeover state is normalized to disabled instead of partially enabled. This avoids a host state where rendering is off but the editor still reports takeover as active.
- Release validation should cover both error surfaces: rejected payload writes and user-visible publish/load messaging.
