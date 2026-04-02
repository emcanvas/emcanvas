# 04 — Entry Takeover Flow

## Objetivo

Permitir que una entry de EmDash cambie de edición estándar a edición visual con EmCanvas sin alterar el modelo editorial global del CMS.

## Flujo principal

1. El usuario entra a editar una entry en EmDash.
2. Ve un botón **Edit with EmCanvas** inyectado por el plugin.
3. Hace click y es redirigido a `/plugins/emcanvas/editor/{collection}/{entryId}`.
4. El editor carga el estado actual de `entry.data.canvasLayout`.
5. El usuario edita visualmente.
6. El sistema autosavea el layout JSON actualizado.
7. Preview usa el sistema existente de preview tokens de EmDash.
8. Publish usa el flujo normal de EmDash.

## Opt-in / opt-out

- Opt-in: activar `_emcanvas.enabled = true`.
- Opt-out: botón **Switch to Standard Editor** que limpia o desactiva `_emcanvas.enabled`.

## State machine simplificada

```text
Standard Entry Editor
  → Enable EmCanvas
  → Redirect to Canvas Editor
  → Edit / Autosave / Preview
  → Publish through normal EmDash flow
  → Optional switch back to Standard Editor
```

## Requisitos UX

- El takeover debe ser explícito, no implícito.
- La reversión al editor estándar debe estar disponible.
- La entry no pierde compatibilidad con el flujo normal de publicación.

## Riesgos a controlar

- Estados híbridos inconsistentes entre contenido estándar y canvas.
- Confusión del usuario sobre cuál editor está activo.
- Guardados parciales que dejen metadata sin sincronía con layout.
