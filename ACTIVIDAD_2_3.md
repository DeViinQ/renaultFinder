# Actividad 2 y 3 – Adaptación del diseño y emoción clave

## Persona de referencia
**Nicolás Lock – 17 años**, estudiante de 5° año de la tecnicatura en Programación. Lleva mochila con notebook, cargador, cuadernos y pendrive. Usa el celular a diario, está acostumbrado a apps y formularios. Reporta rápido un objeto perdido, encuentra objetos publicados por otros y recupera su pertenencia sin perder tiempo.

---

## Actividad 2 – Adaptar el diseño y las funciones a la Persona

### Revisión de la interfaz actual (Renault Finder)

**Pantallas principales:**
- Inicio (`index.astro`): hero con buscador, accesos directos a "Perdí un objeto" / "Encontré un objeto", listado de avisos recientes.
- Búsqueda (`busqueda.astro`), Perdidos (`perdidos.astro`), Encontrados (`encontrados.astro`).
- Modales de reporte: `ReportLostModal.astro` / `ReportFoundModal.astro` con formularios React (`ReportLostForm.jsx`, `ReportFoundForm.jsx`).

### ¿Qué partes funcionan bien para nuestra Persona?

1. **Formulario corto y claro**: los formularios de reporte tienen solo 5 campos obligatorios (nombre, categoría, descripción, lugar, fecha) + foto opcional. Esto coincide con la preferencia de Nicolás por formularios cortos.
2. **Filtros por categoría**: el select de categorías (Mochilas y bolsos, Tecnología, Útiles, Ropa, Documentos, Otros) permite filtrar mentalmente y reduce opciones, alineado con su frustración por "demasiadas opciones".
3. **Confirmación de publicación**: al enviar, el botón muestra "Publicando..." y luego se cierra el modal y se recarga la página, dando feedback inmediato (aunque mejorable).
4. **Búsqueda desde el hero**: el input de búsqueda en la página principal permite encontrar rápido un objeto, cumpliendo su objetivo de "encontrar objetos publicados por otros".
5. **Diseño responsive y uso del celular**: la app está pensada para usarse desde el móvil durante el recreo.

### ¿Qué partes no son claras o resultan confusas?

1. **Sin mensaje de éxito explícito**: al publicar un aviso, el modal se cierra y se recarga la página sin un mensaje de confirmación claro. Nicolás valora la confirmación inmediata y esto puede generar incertidumbre.
2. **Sin filtros por lugar/fecha en el listado**: el listado de avisos recientes no permite filtrar por lugar o fecha, lo que frustra a Nicolás ("no poder filtrar por lugar/fecha").
3. **Iconos poco descriptivos**: el icono "⌕" y "♡" en los accesos directos no son autoexplicativos para un usuario rápido.
4. **Texto genérico en botones**: el botón "Enviar →" no especifica qué se está enviando (reporte de objeto perdido/encontrado).
5. **Validación solo al enviar**: no hay validación en tiempo real de los campos; el error aparece recién al presionar "Enviar".

### ¿Qué podríamos simplificar o destacar mejor?

1. **Simplificar el flujo de reporte**: reducir a 3–4 campos visibles y ocultar la foto como opcional con un botón destacado.
2. **Destacar el botón de reporte**: hacerlo más grande y con color llamativo (verde de la marca) para que sea el primer elemento de acción.
3. **Agregar filtros por lugar y fecha** en las páginas de perdidos/encontrados.
4. **Mensajes de éxito breves** tras publicar ("¡Aviso publicado!").

### Dos mejoras concretas de diseño (justificadas con la Persona)

**Mejora 1: Agregar mensaje de éxito tras publicar un aviso**
- **Qué**: mostrar un toast/modal breve "¡Tu aviso se publicó correctamente!" durante 2–3 segundos después de enviar el formulario.
- **Justificación**: Nicolás tiene como frustración "falta de confirmación de publicación" y su necesidad clave es "confirmación inmediata". Un mensaje de éxito refuerza la confianza y reduce la ansiedad de no saber si el reporte se guardó.

**Mejora 2: Agregar filtros por lugar y fecha en el listado de avisos**
- **Qué**: incorporar en las páginas `/perdidos` y `/encontrados` dos controles de filtro (lugar: texto libre o dropdown, fecha: rango) que actualicen el listado.
- **Justificación**: Nicolás se frustra por "no poder filtrar por lugar/fecha" y valora "claridad y orden en la información". Filtrar le permite encontrar rápido su objeto o ayudar a otros sin revisar toda la lista.

---

## Actividad 3 – Impacto emocional de las interacciones

### Emoción clave: **Confianza**

Nicolás debe sentir **confianza** al usar Renault Finder: confianza de que su reporte se guardó, de que la información es clara y de que puede recuperar su objeto.

### Elementos del diseño que contribuyen a generar confianza

1. **Colores suaves y consistentes**: el verde `#80c4a0` transmite calma y seguridad; el fondo claro reduce la sensación de sobrecarga.
2. **Texto claro y sin jerga técnica**: las etiquetas de los campos ("Nombre del objeto", "¿Dónde lo viste por última vez?") usan lenguaje cotidiano, evitando el "lenguaje técnico" que frustra a Nicolás.
3. **Mensajes de confirmación y guía paso a paso**: el botón muestra "Publicando..." durante el envío y el flujo es lineal (campos → enviar → cierre). Agregar un mensaje de éxito refuerza la confianza.
4. **Categorías con iconos/emojis visuales** (mochila, notebook, cuaderno) para que Nicolás identifique rápido su objeto.
5. **Accesos directos claros** con texto descriptivo ("Perdí un objeto", "Encontré un objeto") que guían la acción.

### Simulación visual (mockup textual)

```
┌─────────────────────────────────────┐
│  ✓ ¡Aviso publicado!                │
│  Tu objeto "Mochila verde" fue      │
│  compartido con la comunidad.       │
│                                     │
│  [ Ver mis avisos ]  [ Cerrar ]     │
└─────────────────────────────────────┘
```

Este mockup representa el modal de confirmación que se mostraría tras enviar el formulario, reforzando la emoción de **confianza** en Nicolás.
